# Architectural Patterns & Conventions

This document outlines the key architectural patterns, design decisions, and conventions used throughout the Meeting Room Booking System codebase.

## Server Actions Pattern

**Pattern**: All data fetching and mutations use Next.js Server Actions with the `"use server"` directive.

**Location**: [actions/](../../actions/) directory

**Key Characteristics**:
- Functions marked with `"use server"` at the top of file
- Return consistent `{ error?, data }` shape for type safety
- Use `revalidatePath()` after mutations to update cached data
- Always use server-side Supabase client

**Example Reference**: [actions/meeting.ts:1-95](../../actions/meeting.ts#L1-L95)

```typescript
// Pattern structure
"use server";

export const actionName = async (params) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("table").select();

  return {
    error: error?.message,
    data: data as Type,
  };
};
```

**Benefits**:
- Type-safe data fetching without API routes
- Automatic serialization
- Server-side security (credentials never exposed)
- Built-in error handling

## Supabase Client/Server Split

**Pattern**: Separate client factory functions for browser and server contexts.

**Location**:
- Server: [lib/supabase/server.ts](../../lib/supabase/server.ts)
- Client: [lib/supabase/client.ts](../../lib/supabase/client.ts)

**Key Characteristics**:
- Server client handles cookies for SSR/Server Actions
- Client-side client for real-time subscriptions
- Never mix client types (server code uses server client, browser uses client)

**Usage**:
- **Server Actions/Components**: Import from `lib/supabase/server.ts`
- **Client Components/Hooks**: Import from `lib/supabase/client.ts`

**Example Reference**: [lib/supabase/server.ts:4-29](../../lib/supabase/server.ts#L4-L29)

## Form Handling Pattern

**Pattern**: React Hook Form + Zod validation with controlled components

**Location**: Form components in `app/(main)/rooms/[id]/components/`

**Key Characteristics**:
- Zod schemas in separate `form-schema.ts` files
- Controller components for form fields
- Type inference from Zod schema
- Integration with Radix UI form components
- Real-time validation

**Example Reference**: [app/(main)/rooms/[id]/components/book-meeting-form/index.tsx:118-125](../../app/(main)/rooms/[id]/components/book-meeting-form/index.tsx#L118-L125)

```typescript
// Pattern structure
const formSchema = z.object({
  field: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  defaultValues,
  resolver: zodResolver(formSchema),
});
```

## Real-time Subscriptions Pattern

**Pattern**: Custom React hooks wrapping Supabase real-time subscriptions

**Location**: [hooks/use-realtime-meetings.ts](../../hooks/use-realtime-meetings.ts)

**Key Characteristics**:
- Encapsulate subscription logic in reusable hooks
- Automatic cleanup on unmount
- Support for room-specific or global subscriptions
- Event-specific callbacks (onInsert, onUpdate, onDelete)
- Channel management with refs

**Example Reference**: [hooks/use-realtime-meetings.ts:25-140](../../hooks/use-realtime-meetings.ts#L25-L140)

**Usage Pattern**:
```typescript
useRealtimeMeetings({
  roomId,
  onAnyChange: () => {
    triggerRefresh(); // Update UI state
  },
});
```

## Context Provider Pattern

**Pattern**: React Context for cross-component state management

**Location**: [components/providers/](../../components/providers/)

**Key Providers**:
- **ThemeProvider**: Dark/light mode management ([components/providers/theme-provider.tsx](../../components/providers/theme-provider.tsx))
- **MeetingsProvider**: Real-time meeting refresh coordination ([components/providers/meetings-provider.tsx](../../components/providers/meetings-provider.tsx))

**Key Characteristics**:
- Custom hooks for type-safe context access
- Error on hook usage outside provider
- Centralized in `components/providers/index.tsx`
- All providers wrapped in root layout

**Example Reference**: [components/providers/meetings-provider.tsx:24-55](../../components/providers/meetings-provider.tsx#L24-L55)

```typescript
// Pattern structure
const Context = createContext<Type | null>(null);

export function Provider({ children }) {
  const [state, setState] = useState();
  return <Context.Provider value={{ state }}>{children}</Context.Provider>;
}

export function useContextHook() {
  const context = useContext(Context);
  if (!context) throw new Error("Must use within Provider");
  return context;
}
```

## UI Component Pattern (CVA)

**Pattern**: Class Variance Authority for type-safe variant styling

**Location**: [components/ui/](../../components/ui/)

**Key Characteristics**:
- Radix UI primitives as base
- CVA for variant definitions
- Type-safe props via VariantProps
- Tailwind classes composed with `cn()` utility
- Consistent API across all UI components

**Example Reference**: [components/ui/button.tsx:7-62](../../components/ui/button.tsx#L7-L62)

```typescript
// Pattern structure
const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { default: "...", destructive: "..." },
      size: { default: "...", sm: "..." },
    },
    defaultVariants: { variant: "default" },
  }
);

function Component({ variant, size, className, ...props }:
  ComponentProps<"element"> & VariantProps<typeof componentVariants>) {
  return <element className={cn(componentVariants({ variant, size }), className)} {...props} />;
}
```

## Type-Safe API Response Pattern

**Pattern**: Consistent return shape for all server actions

**Structure**:
```typescript
{
  error?: string;        // Error message if operation failed
  data?: Type;          // Typed data if operation succeeded
}
```

**Key Characteristics**:
- Always return object with error and data properties
- Error as optional string (undefined = success)
- Data typed to match expected shape
- Enables consistent error handling in UI

**Example Reference**: [actions/room.ts:6-18](../../actions/room.ts#L6-L18)

**Usage Pattern**:
```typescript
const { error, data } = await serverAction(params);
if (error) {
  toast.error(error);
  return;
}
// Use data safely (type-checked)
```

## Route Groups Pattern

**Pattern**: Next.js route groups for layout organization

**Location**: [app/(main)/](../../app/(main)/)

**Key Characteristics**:
- Parentheses in folder names don't affect URL
- Shared layouts within route groups
- Main content in `(main)` group (includes navbar)
- Enables different layouts for different sections

**Structure**:
- `app/(main)/` - Pages with navigation
- `app/layout.tsx` - Root layout (providers, fonts)
- `app/(main)/page.tsx` - Home page route: `/`

## Time Slot & Conflict Detection

**Pattern**: Client-side availability calculation with real-time updates

**Location**: [app/(main)/rooms/[id]/components/book-meeting-form/index.tsx:150-182](../../app/(main)/rooms/[id]/components/book-meeting-form/index.tsx#L150-L182)

**Key Characteristics**:
- Filter time slots based on existing meetings
- Use `date-fns` for interval overlap detection
- Update when date, duration, or meetings change
- Prevent booking conflicts before submission

**Algorithm**:
1. Fetch all meetings for selected date
2. For each time slot, create interval with selected duration
3. Check if interval overlaps with any existing meeting
4. Filter out conflicting slots

## Naming Conventions

### Files
- **Components**: PascalCase for files, kebab-case for folders (`book-meeting-form/index.tsx`)
- **Server Actions**: kebab-case (`meeting.ts`, `room.ts`)
- **Types**: Singular, PascalCase (`meeting.ts`, `room.ts`)
- **Hooks**: kebab-case with `use-` prefix (`use-realtime-meetings.ts`)

### Code
- **Components**: PascalCase (`BookMeetingForm`)
- **Functions**: camelCase (`getMeetingsByRoom`)
- **Types/Interfaces**: PascalCase (`Meeting`, `Room`)
- **Constants**: UPPER_SNAKE_CASE (`TIME_SLOTS`)

### Imports
- Use path alias `@/` for all imports from root
- Import types with explicit type keyword when needed
- Group imports: external → internal → types

## Data Fetching Strategy

### Server Components (Default)
- Fetch data directly in component using Server Actions
- Pass data as props to Client Components
- Use async/await in component function

**Example**: [app/(main)/page.tsx:12-20](../../app/(main)/page.tsx#L12-L20)

### Client Components
- Fetch in `useEffect` hooks
- Store in local state
- Re-fetch on dependency changes (date, filters)
- Subscribe to real-time updates via hooks

**Example**: [app/(main)/rooms/[id]/components/book-meeting-form/index.tsx:136-148](../../app/(main)/rooms/[id]/components/book-meeting-form/index.tsx#L136-L148)

## Error Handling

**Pattern**: Multi-layer error handling strategy

1. **Server Actions**: Return error string in response
2. **UI Layer**: Check error, show toast notification
3. **Form Validation**: Zod schema errors shown inline
4. **Network/Runtime**: Try-catch with generic error message

**Example**: [app/(main)/rooms/[id]/components/book-meeting-form/index.tsx:184-232](../../app/(main)/rooms/[id]/components/book-meeting-form/index.tsx#L184-L232)

## State Refresh Pattern

**Pattern**: Refresh key pattern for coordinated updates

**How it works**:
1. Context provides `refreshKey` number and `triggerRefresh()` function
2. Components add `refreshKey` to useEffect dependencies
3. Calling `triggerRefresh()` increments key, triggering all dependent effects
4. Real-time subscriptions call `triggerRefresh()` on changes

**Example Reference**: [components/providers/meetings-provider.tsx:27-31](../../components/providers/meetings-provider.tsx#L27-L31)

**Benefits**:
- Coordinated updates across multiple components
- Works with real-time and manual refresh
- No prop drilling needed
- Type-safe via context hook
