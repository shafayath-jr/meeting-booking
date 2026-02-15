# Local Development Setup Guide

Quick guide to set up and run the Meeting Room Booking System locally.

## Prerequisites

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **Supabase Account** (free tier at [supabase.com](https://supabase.com))

## Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd PEN-MEETING-ROOM-BOOKING
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Required: Get these from Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-public-key-here

# Optional: Teams Calendar Sync
TEAMS_DAEMON_URL=https://your-teams-daemon-url.com
TEAMS_DAEMON_SECRET=your-teams-daemon-secret-here
```

## Running the App

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
├── app/                    # Pages and routes (Next.js App Router)
│   ├── (main)/            # Main pages with navbar
│   │   ├── page.tsx       # Building/room selection
│   │   └── rooms/[id]/    # Room detail & booking
│   └── layout.tsx         # Root layout
├── actions/               # Server actions (data fetching)
├── components/            # Shared React components
│   ├── providers/         # Context providers
│   └── ui/               # Reusable UI components
├── hooks/                # Custom hooks (real-time, mobile, etc.)
├── lib/                  # Utils and configuration
│   └── supabase/         # Supabase client
└── types/               # TypeScript definitions
```

## Teams Calendar Sync (Optional)

The Teams sync feature pushes bookings to Microsoft Teams calendars via a separate Teams Daemon service.

**Setup:**

1. Deploy/access your Teams Daemon service
2. Add `TEAMS_DAEMON_URL` and `TEAMS_DAEMON_SECRET` to `.env.local`

See [plans/reverse-sync-supabase-to-teams.md](../plans/reverse-sync-supabase-to-teams.md) for details.

## Troubleshooting

### Port already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Supabase connection issues

- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_KEY`
- Use the **anon/public** key (not service role key)
- Check project is active in Supabase dashboard

### Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Real-time updates not working

1. Enable replication in Supabase: **Database → Replication → bookings table**
2. Check RLS policies allow SELECT on bookings
3. Check browser console for WebSocket errors

## Key Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5, React 19.2
- **Database**: Supabase (PostgreSQL + real-time)
- **Styling**: Tailwind CSS 4
- **UI**: Radix UI primitives
- **Forms**: React Hook Form + Zod
- **Date**: date-fns

## Additional Resources

- **Project Overview**: [CLAUDE.md](../CLAUDE.md)
- **Architecture**: [.claude/docs/architectural_patterns.md](../.claude/docs/architectural_patterns.md)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)

---
