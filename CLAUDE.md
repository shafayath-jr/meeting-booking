# Meeting Room Booking System

## Project Overview

A Next.js-based meeting room booking system for Planet Education Networks. Users can browse buildings, view available rooms, book meetings with calendar integration, and receive real-time updates on room availability.

## Tech Stack

### Core

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19.2
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Styling**: Tailwind CSS 4

### Key Libraries

- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Styling Utilities**: class-variance-authority, clsx, tailwind-merge
- **Icons**: lucide-react
- **Notifications**: sonner (toast)
- **Theme**: next-themes

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main route group (with navbar)
│   │   ├── page.tsx       # Building/room selection
│   │   ├── rooms/[id]/    # Room detail & booking
│   │   └── components/    # Page-specific components
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles
├── actions/               # Server actions for data fetching
├── components/            # Shared React components
│   ├── providers/         # Context providers
│   └── ui/               # Reusable UI components (Radix-based)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & configuration
│   ├── supabase/         # Supabase client factory functions
│   ├── constants.ts      # App-wide constants
│   └── utils.ts          # Helper functions
└── types/               # TypeScript type definitions
```

## Essential Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Production
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint
```

## Environment Setup

Required environment variables (see [.env.example:1-75](.env.example#L1-L75)):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_KEY` - Supabase anonymous key
- Azure AD credentials (for calendar sync, optional)

## Key Features

1. **Building & Room Selection** - Browse buildings and view available rooms
2. **Meeting Booking** - Book meetings with form validation and conflict detection
3. **Real-time Updates** - Automatic UI updates via Supabase subscriptions
4. **Calendar View** - Day and month views with time slot visualization
5. **Guest Management** - Add multiple guests to meetings
6. **Responsive Design** - Works on desktop and mobile devices

## Data Flow

**Server-side data fetching** → Server Actions ([actions/](actions/))
**Client-side updates** → Real-time hooks ([hooks/use-realtime-meetings.ts](hooks/use-realtime-meetings.ts))
**Form submissions** → Server Actions with revalidation
**State management** → React Context (providers) + URL params

## Database Schema

Main tables (via Supabase):

- `buildings` - Building/location information
- `rooms` - Meeting rooms with capacity and amenities
- `bookings` - Meeting bookings with time slots
- `domains` - Email domains for user validation

## Component Patterns

- **Server Components** - Default for pages, fetch data via Server Actions
- **Client Components** - Forms, modals, real-time features (marked with "use client")
- **UI Components** - Radix UI primitives with CVA for variants
- **Form Components** - React Hook Form with Zod schemas

## Important Conventions

- **Path Aliases**: Use `@/` for imports from root (see [tsconfig.json:21-23](tsconfig.json#L21-L23))
- **Server Actions**: Marked with `"use server"` directive ([actions/room.ts:1](actions/room.ts#L1))
- **Type Safety**: All API responses typed with error/data pattern
- **Real-time**: Use `useRealtimeMeetings` hook for live updates
- **Styling**: Use `cn()` utility for conditional classes ([lib/utils.ts:5-7](lib/utils.ts#L5-L7))

## Additional Documentation

For implementation details and patterns, see:

- [Architectural Patterns](.claude/docs/architectural_patterns.md) - Design patterns and conventions used throughout the codebase
