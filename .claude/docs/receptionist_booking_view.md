# Receptionist Booking View

## Context

Today, the booking flow requires the user to first pick a building on `/` (home), navigate into a specific room at `/rooms/[id]`, open a modal, and book. This is fine for end users but slow for a receptionist who books on behalf of others all day, often for a future date.

We want a single-page receptionist view at `/receptionist` where building → room → booking happens side-by-side in three columns, with a date picker so bookings can be made for any day. The page must match the existing dark emerald + glass-morphism look. The current page (`app/(main)/receptionist/page.tsx`) is an empty stub.

## Decisions (confirmed)

- **Layout:** three columns side-by-side — Building list (left) | Room list (middle) | Date + Time/Duration/Form (right).
- **Date scope:** Date picker for today and any future date.
- **Access:** Direct URL only. No navbar link, no role/auth gating in this phase.
- **Realtime:** No subscription. Refetch meetings when the room or date selection changes.
- **Conventions:** Reuse existing server actions, types, and UI primitives. Match existing emerald gradient styling. Build phases below mirror the user's "in phases" request.

## Reused building blocks

| Purpose | Location |
|---|---|
| List all buildings | `getAllBuildings()` — `actions/building.ts:5` |
| List rooms in a building | `getRoomsByBuilding(buildingId)` — `actions/room.ts:16` |
| Fetch meetings for a room on a given date | `getMeetingsByRoom(roomId, date?)` — `actions/meeting.ts:21` (already accepts a date string) |
| Create booking + Teams sync | `bookMeeting(event)` — `actions/meeting.ts:88` |
| Available duration calc | `calculateAvailableDurations()` — `lib/duration-helper.ts` |
| 30-min slot list | `getTimeSlotsForTimezone()` — `lib/utils.ts` |
| Zod schema for meeting form | `app/(main)/rooms/[id]/components/booking-section/meeting-details-form/form-schema.ts` |
| Email/user combobox | existing `searchUsers` action used by `MeetingDetailsForm` |
| UI primitives | `components/ui/{button,card,calendar,popover,input,combobox,sonner}.tsx` |
| Types | `types/{building,room,meeting,event}.ts` |

> Note: `TimeSlots`, `DurationSlots`, `BookingModal`, and `BookingProvider` under `app/(main)/rooms/[id]/components/booking-section/` are tightly coupled to "today" + a single roomId + a modal. We will **not** modify them. Instead we build a small, parallel set of components under `app/(main)/receptionist/components/` that read from a new `ReceptionistBookingContext`, but reuse the shared form, schema, helpers, and styling tokens.

## Files to create

```
app/(main)/receptionist/
├── page.tsx                                     # Server component: fetch buildings, render shell
└── components/
    ├── receptionist-booking-context.tsx         # Client context: building/room/date/time/duration state
    ├── receptionist-view.tsx                    # Client: three-column layout
    ├── building-column.tsx                      # Scrollable building list
    ├── room-column.tsx                          # Scrollable room list for selected building
    ├── booking-column.tsx                       # Date picker + slots + duration + form + submit
    ├── date-picker.tsx                          # Popover wrapping ui/calendar
    ├── slot-grid.tsx                            # Date-aware version of TimeSlots
    └── duration-grid.tsx                        # Date-aware version of DurationSlots
```

`receptionist-view.tsx` wraps everything in `ReceptionistBookingProvider` and renders the three columns inside a styled card consistent with `PlaceCycle`'s emerald gradient frame.

## Implementation phases

### Phase 1 — Layout shell + building & room selection
- Convert `app/(main)/receptionist/page.tsx` to an async server component that calls `getAllBuildings()` and renders `<ReceptionistView buildings={buildings} />`.
- Build `ReceptionistBookingProvider` holding: `selectedBuildingId`, `selectedRoomId`, `selectedDate` (default = today), `selectedTime`, `selectedDuration`, `meetings`, `isSubmitting`. Provide setters; clearing building clears room/time/duration; clearing room clears time/duration.
- `BuildingColumn`: vertical list of selectable buildings styled like compact `PlaceCycle` rows (emerald-accented when active). Selecting a building calls `getRoomsByBuilding` from the parent and updates context.
- `RoomColumn`: renders `Room[]` passed via props (fetched in `ReceptionistView` via an effect tied to `selectedBuildingId`). Empty/placeholder states match the "No rooms available" panel in `rooms-section.tsx:107-128`.
- `BookingColumn` shows a friendly placeholder until a room is selected.
- **Verification:** `npm run dev`, open `/receptionist`, confirm buildings render, selecting a building loads rooms, selecting a room highlights the right column.

### Phase 2 — Date picker + time slots + duration
- `DatePicker`: `Popover` + `Calendar` (`components/ui/calendar.tsx`), restricted to `>= today`. On change, update context.
- Effect in `ReceptionistView` / context: whenever `selectedRoomId` or `selectedDate` changes, call `getMeetingsByRoom(roomId, date.toISOString())` and store result.
- `SlotGrid`: mirrors `time-slots.tsx:9-57` but reads `selectedDate` from context. The "filter past slots" rule applies only when `isSameDay(selectedDate, today)`; for future dates all slots are candidates.
- `DurationGrid`: mirrors `duration-slots.tsx`, using `calculateAvailableDurations` based on the next meeting after the selected slot on the selected date.
- **Verification:** With a known room, switching date refetches meetings, and slots/durations behave correctly for both today and a future date.

### Phase 3 — Booking form + submission
- Reuse `MeetingDetailsForm` if extractable, otherwise create a thin `ReceptionistMeetingForm` reusing the same Zod schema and `searchUsers` combobox. The form must produce the same `Event` shape consumed by `bookMeeting`.
- Submit handler builds an `Event` with `room_id`, `building_id`, `date` = selectedDate, `start_time` and `end_time` computed via `date-fns.parse` + `addMinutes(selectedDuration)`, `guests` JSON-stringified (matches `actions/meeting.ts:88-134`).
- On success: toast via `sonner`, reset selectedTime/duration/form, refetch meetings for the same room+date so the just-taken slot disappears.
- On error: surface `error` from `bookMeeting` as a destructive toast.
- **Verification:** Book a slot for today and for a future date; confirm row appears in Supabase `bookings`, Teams sync runs (or warns), and the slot becomes unavailable in the grid without a full page refresh.

## Styling notes

- Outer page: same dark backdrop and orb-drift decorative layer used in `place-cycle.tsx:42-56`.
- Column cards: `rounded-2xl border border-emerald-900/60 bg-linear-to-br from-[#0C170F] to-[#18502E]` to match.
- Active list item: emerald accent border + `bg-emerald-500/10` (consistent with the location badge in `place-cycle.tsx:80`).
- Buttons: `variant="transparent"` with `border-secondary` when selected, identical to `time-slots.tsx:46-50`.

## Out of scope (this iteration)

- Authentication / receptionist role check.
- Navbar entry point.
- Realtime updates.
- Editing or canceling existing bookings from this view.
