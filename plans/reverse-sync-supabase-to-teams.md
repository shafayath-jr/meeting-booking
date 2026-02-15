# Reverse Calendar Sync: Supabase → Microsoft Teams

## Context

The teams-daemon currently implements **one-way sync** from Microsoft Teams calendars to Supabase:
- Webhook subscriptions receive calendar change notifications from Microsoft Graph
- Events are fetched and upserted to the `bookings` table with `calendar_event_id` as the unique key
- Room matching via fuzzy string matching on location names

**The Problem:** When users create bookings through the web app (which writes directly to Supabase), those events don't appear in Microsoft Teams calendars. This breaks the unified calendar experience.

**The Solution:** Add reverse synchronization so bookings created/updated/deleted in the web app are reflected in the organizer's Microsoft Teams calendar.

**User Requirements:**
- Create events in the **organizer's calendar** (using the `email` field from booking)
- Trigger sync via **HTTP endpoint** called by the web app after booking operations
- Sync all operations: **INSERT, UPDATE, DELETE**
- Track sync state using the existing **calendar_event_id** field

---

## Implementation Approach

### Architecture: HTTP Endpoint + Server Action Pattern

**Flow:**
1. Web app creates/updates/deletes booking in Supabase (existing behavior)
2. Web app calls daemon endpoint: `POST /api/sync-to-teams`
3. Daemon validates request, acquires Graph API token
4. Daemon creates/updates/deletes event in organizer's Teams calendar via Graph API
5. Daemon returns success + `calendar_event_id` (or error)
6. Web app updates booking record with returned `calendar_event_id`

**Benefits:**
- Web app has full control over sync timing
- Synchronous feedback for error handling
- No polling or websocket overhead
- Aligns with existing Server Action pattern in web app

---

## Critical Files to Modify/Create

### In teams-daemon:

**1. `bin/webhook.js`** (modify)
- Add new route: `POST /api/sync-to-teams`
- Handle create, update, delete operations based on request payload
- Return `calendar_event_id` for tracking

**2. `bin/teams-sync.js`** (create new)
- `createTeamsEvent(booking)` - POST to Graph API `/users/{email}/events`
- `updateTeamsEvent(booking)` - PATCH to Graph API `/users/{email}/events/{eventId}`
- `deleteTeamsEvent(booking)` - DELETE from Graph API
- Transform Supabase booking format → Microsoft Graph event format
- Error handling with retries

**3. `bin/transform.js`** (create new)
- `supabaseToGraphEvent(booking)` - Map booking fields to Graph event schema
- `graphEventToSupabase(event)` - Reverse mapping (already partially in supabase.js)
- Handle timezone conversions, guest list parsing, duration calculations

### In web app (PEN-MEETING-ROOM-BOOKING):

**4. `actions/teams-sync.ts`** (create new)
- Server action to call daemon endpoint
- `syncBookingToTeams(booking, operation)` where operation = 'create' | 'update' | 'delete'
- Error handling and retry logic

**5. `actions/meeting.ts`** (modify)
- Update `bookMeeting()` to call `syncBookingToTeams()` after successful insert
- Add `updateMeeting()` function (currently missing) that syncs to Teams
- Update `deleteMeeting()` to call `syncBookingToTeams(booking, 'delete')`

**6. `.env.local`** (modify)
- Add `TEAMS_DAEMON_URL=http://localhost:3000` (or production URL)
- Add `TEAMS_DAEMON_SECRET` for request authentication

---

## Data Transformation Details

### Supabase Booking → Microsoft Graph Event

**Supabase `bookings` table:**
```typescript
{
  id: string
  title: string
  start_time: string  // ISO datetime
  end_time: string    // ISO datetime
  booked_by: string
  email: string       // Organizer email - THIS is the calendar owner
  guests: string      // JSON array of guest objects
  room_id: string
  calendar_event_id: string | null  // Teams event ID for tracking
}
```

**Microsoft Graph Event Schema:**
```typescript
{
  subject: booking.title,
  start: {
    dateTime: booking.start_time,
    timeZone: "UTC"  // Or extract from ISO string
  },
  end: {
    dateTime: booking.end_time,
    timeZone: "UTC"
  },
  organizer: {
    emailAddress: {
      address: booking.email,
      name: booking.booked_by
    }
  },
  attendees: JSON.parse(booking.guests || '[]').map(guest => ({
    emailAddress: {
      address: guest.email || guest,
      name: guest.name || guest.email
    },
    type: "required"
  })),
  location: {
    displayName: roomName  // Lookup from room_id
  },
  isReminderOn: true,
  reminderMinutesBeforeStart: 15
}
```

**Key Mapping Notes:**
- `booking.email` → Graph API endpoint: `/users/${booking.email}/events`
- Need to query `rooms` table to get room name for location field
- Parse `guests` JSON string to attendees array
- `calendar_event_id` stores the Graph event ID for updates/deletes

---

## API Endpoint Specification

### Daemon Endpoint: `POST /api/sync-to-teams`

**Request Body:**
```json
{
  "operation": "create" | "update" | "delete",
  "booking": {
    "id": "uuid",
    "title": "Meeting Title",
    "start_time": "2026-02-20T14:00:00Z",
    "end_time": "2026-02-20T14:30:00Z",
    "email": "organizer@company.com",
    "booked_by": "John Doe",
    "guests": "[{\"email\":\"guest@company.com\",\"name\":\"Jane\"}]",
    "room_id": "room-uuid",
    "calendar_event_id": "AAMkAG..."  // null for create, required for update/delete
  },
  "secret": "shared-secret-for-auth"
}
```

**Response (Success):**
```json
{
  "success": true,
  "calendar_event_id": "AAMkAGVmMDEyMTM4LTk...",
  "operation": "create"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "User mailbox not found: organizer@company.com",
  "operation": "create"
}
```

---

## Implementation Steps

### Phase 1: Daemon Endpoint (teams-daemon)

1. **Create `bin/transform.js`:**
   - Implement `supabaseToGraphEvent(booking, roomsCache)`
   - Handle timezone conversions (ISO to Graph dateTime format)
   - Parse guests JSON string to attendees array
   - Lookup room name from `roomsCache` by `room_id`

2. **Create `bin/teams-sync.js`:**
   - `createTeamsEvent(booking)`:
     - Get auth token via `auth.getToken()`
     - Transform booking with `supabaseToGraphEvent()`
     - POST to `${GRAPH_ENDPOINT}v1.0/users/${booking.email}/events`
     - Return Graph event ID
   - `updateTeamsEvent(booking)`:
     - Require `booking.calendar_event_id`
     - PATCH to `${GRAPH_ENDPOINT}v1.0/users/${booking.email}/events/${booking.calendar_event_id}`
   - `deleteTeamsEvent(booking)`:
     - DELETE from Graph API using `calendar_event_id`
   - Error handling: catch 404 (user/event not found), 401 (auth), 403 (permissions)

3. **Modify `bin/webhook.js`:**
   - Add new route handler for `POST /api/sync-to-teams`
   - Validate request secret: `req.body.secret === process.env.SYNC_SECRET`
   - Call appropriate function from `teams-sync.js` based on `operation`
   - Return JSON response with `calendar_event_id` or error

4. **Update `bin/supabase.js`:**
   - Export `roomsCache` or create `getRoomById(roomId)` helper
   - Needed for room name lookup in event transformation

5. **Update `.env`:**
   - Add `SYNC_SECRET=generate-random-secret` for request authentication

### Phase 2: Web App Integration (PEN-MEETING-ROOM-BOOKING)

6. **Create `actions/teams-sync.ts`:**
   ```typescript
   "use server";

   import { Meeting } from "@/types/meeting";

   export const syncBookingToTeams = async (
     booking: Meeting,
     operation: "create" | "update" | "delete"
   ) => {
     try {
       const response = await fetch(
         `${process.env.TEAMS_DAEMON_URL}/api/sync-to-teams`,
         {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             operation,
             booking,
             secret: process.env.TEAMS_DAEMON_SECRET,
           }),
         }
       );

       const data = await response.json();
       if (!data.success) {
         return { error: data.error };
       }

       return { data: data.calendar_event_id, error: null };
     } catch (error) {
       return { error: error.message };
     }
   };
   ```

7. **Modify `actions/meeting.ts`:**
   - Update `bookMeeting()`:
     ```typescript
     export const bookMeeting = async (event: Event) => {
       const supabase = await createClient();
       const { data, error } = await supabase
         .from("bookings")
         .insert([event])
         .select()
         .single();

       if (error) return { error: error.message };

       // Sync to Teams
       const { data: calendarEventId, error: syncError } =
         await syncBookingToTeams(data, "create");

       if (!syncError && calendarEventId) {
         // Update booking with calendar_event_id
         await supabase
           .from("bookings")
           .update({ calendar_event_id: calendarEventId })
           .eq("id", data.id);
       }

       revalidatePath(`/rooms/${event.room_id}`);
       return { error: syncError, data };
     };
     ```

   - Create `updateMeeting()` (currently missing):
     ```typescript
     export const updateMeeting = async (
       meetingId: string,
       updates: Partial<Event>
     ) => {
       const supabase = await createClient();

       // Update in Supabase
       const { data, error } = await supabase
         .from("bookings")
         .update(updates)
         .eq("id", meetingId)
         .select()
         .single();

       if (error) return { error: error.message };

       // Sync to Teams if calendar_event_id exists
       if (data.calendar_event_id) {
         await syncBookingToTeams(data, "update");
       }

       revalidatePath("/");
       return { data };
     };
     ```

   - Update `deleteMeeting()`:
     ```typescript
     export const deleteMeeting = async (meetingId: string) => {
       const supabase = await createClient();

       // Fetch booking first to get calendar_event_id
       const { data: booking } = await supabase
         .from("bookings")
         .select()
         .eq("id", meetingId)
         .single();

       // Delete from Supabase
       const { error } = await supabase
         .from("bookings")
         .delete()
         .eq("id", meetingId);

       if (error) return { error: error.message };

       // Sync deletion to Teams if calendar_event_id exists
       if (booking?.calendar_event_id) {
         await syncBookingToTeams(booking, "delete");
       }

       revalidatePath("/");
       return { error: null };
     };
     ```

8. **Update `.env.local`:**
   ```
   TEAMS_DAEMON_URL=http://localhost:3000
   TEAMS_DAEMON_SECRET=same-secret-as-daemon
   ```

---

## Error Handling Strategy

### Daemon Side:
- **404 User Not Found**: Return error, web app shows toast warning
- **401/403 Auth Issues**: Log error, return generic "sync failed" message
- **Network Errors**: Implement retry with exponential backoff (3 attempts)
- **Invalid Payload**: Validate required fields, return 400 with details

### Web App Side:
- **Sync Failure**: Booking still succeeds in Supabase, show warning toast
- **Partial Sync**: If create succeeds but calendar_event_id update fails, log warning
- **Timeout**: Set 10-second timeout on daemon request to avoid blocking UI

### Bidirectional Conflict Handling:
- **Scenario**: Event created in web app, synced to Teams, then user modifies in Teams
- **Current Behavior**: Teams → Supabase webhook will upsert based on `calendar_event_id`
- **Result**: Last write wins (Teams changes overwrite web app changes)
- **Future Enhancement**: Add `last_modified_at` timestamp for conflict detection

---

## Verification Plan

### Manual Testing:

1. **Create Flow:**
   - Start daemon: `node bin/index.js --op startDaemon`
   - Create booking in web app
   - Verify event appears in organizer's Teams calendar
   - Verify `calendar_event_id` populated in Supabase

2. **Update Flow:**
   - Modify booking time/title in web app
   - Verify Teams event updates
   - Check both calendars match

3. **Delete Flow:**
   - Delete booking in web app
   - Verify Teams event deleted
   - Confirm Supabase record removed

4. **Error Scenarios:**
   - Create booking with invalid email → Should fail gracefully
   - Daemon offline → Web app should show warning but booking succeeds
   - Update booking without `calendar_event_id` → Should skip Teams sync

### Automated Testing:

5. **Unit Tests** (optional but recommended):
   - Test `supabaseToGraphEvent()` transformation
   - Mock Graph API responses
   - Validate error handling paths

---

## Configuration Summary

### Daemon `.env`:
```bash
# Existing
TENANT_ID=...
CLIENT_ID=...
CLIENT_SECRET=...
GRAPH_ENDPOINT=https://graph.microsoft.com/
NOTIFICATION_URL=...
WEBHOOK_CLIENT_STATE=...
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...

# New for reverse sync
SYNC_SECRET=generate-with-openssl-rand-hex-32
```

### Web App `.env.local`:
```bash
# Existing Supabase config
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_KEY=...

# New for Teams sync
TEAMS_DAEMON_URL=http://localhost:3000  # Or production ngrok/domain
TEAMS_DAEMON_SECRET=same-as-daemon-SYNC_SECRET
```

---

## Notes & Considerations

1. **Rooms as Resources:**
   - Current implementation uses `location.displayName` (text field)
   - For proper room booking in Teams, consider adding room mailbox as attendee
   - Requires rooms configured as resources in Azure AD

2. **Timezone Handling:**
   - Supabase stores ISO strings (UTC)
   - Graph API accepts `dateTime` + `timeZone` object
   - Current approach: extract timezone from ISO string or default to UTC

3. **Guest Email Validation:**
   - Web app stores guests as JSON string
   - No validation that guests are valid tenant users
   - Graph API will accept external emails for attendees

4. **Duplicate Prevention:**
   - Existing `calendar_event_id` field prevents duplicates
   - If web app calls sync endpoint twice, second call will be an update (not create)

5. **Performance:**
   - Synchronous API call adds ~500-1000ms to booking creation
   - Consider making it asynchronous (fire-and-forget) for better UX
   - Could use background job queue for reliability

6. **Security:**
   - Shared secret authentication is simple but consider JWT tokens for production
   - Validate that daemon only accepts requests from trusted web app IP
   - Rotate secrets periodically