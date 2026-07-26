# Our Bucket List

A shared, installable PWA for a small group to add, browse, and check off bucket-list items
together in real time — organized by category, with a "Memories" tab for things you've actually
done.

## Tech stack

- **Frontend:** React + Vite, installable as a PWA (`vite-plugin-pwa`)
- **Backend/data:** [Supabase](https://supabase.com) (Postgres + real-time subscriptions)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel or Netlify (static frontend that talks directly to Supabase)

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Once it's provisioned, open the **SQL Editor** and run the contents of
   [`supabase/schema.sql`](supabase/schema.sql). This creates the `categories`, `items`, and
   `item_interest` tables, seeds five starter categories, sets up the `status` check constraint,
   enables Row Level Security with permissive policies, and turns on Realtime for `items` and
   `item_interest`.
3. In **Project Settings → API**, copy your **Project URL** and **anon public key** — you'll need
   both in the next step.

> **Security note:** v1 has no user accounts, so the RLS policies in `schema.sql` are
> intentionally open (anyone with the anon key can read/write). That's fine for a small trusted
> group using their own Supabase project, but tighten these policies before exposing the app
> publicly.

## 2. Configure environment variables

Copy the example file and fill in your project details:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`.env` is gitignored — never commit real credentials.

## 3. Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the printed local URL. On a phone, you can "Add to Home Screen" from the browser share menu
once the app is deployed and served over HTTPS to install it as a PWA.

## 4. Deploy

Deploy the static frontend to **Vercel** or **Netlify**:

- Build command: `npm run build`
- Output directory: `dist`
- Add the same two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the
  hosting platform's project settings.

Because there's no backend server, the client talks directly to Supabase using the anon key —
that's expected for this setup.

## 5. Keep the free-tier Supabase project awake

Supabase free-tier projects pause automatically after 7 days of no activity. This repo includes
[`.github/workflows/keep-alive.yml`](.github/workflows/keep-alive.yml), a scheduled GitHub Action
that runs every 3 days and makes a trivial read request against the `categories` table.

To enable it:

1. In your GitHub repo, go to **Settings → Secrets and variables → Actions**.
2. Add two repository secrets:
   - `SUPABASE_URL` — your project URL
   - `SUPABASE_ANON_KEY` — your anon public key
3. The workflow will run automatically on schedule. You can also trigger it manually from the
   **Actions** tab (`workflow_dispatch`).

## Data model

Three tables, all defined in [`supabase/schema.sql`](supabase/schema.sql):

- **categories** — `id`, `name` (unique), `created_at`
- **items** — `id`, `title`, `description`, `link`, `category_id`, `added_by`, `status`
  (`someday` / `this_year` / `booked` / `done`), `memory_note`, `photo_link`, `created_at`
- **item_interest** — `id`, `item_id`, `name`, `created_at` — one row per person per item
  (unique on `item_id, name`), so "I'm keen" reactions can be toggled per person without auth

## Features (v1)

- Add items with title, category (existing or new), optional note/link/added-by
- Active list grouped by category, with status badges, search, and filters/sort by status,
  category, interest count, and date added
- Status workflow: `someday → this_year → booked → done`, editable per item
- Marking an item `done` moves it to the **Memories** tab and prompts for an optional memory note
  and external photo/album link
- "I'm keen" reactions per person, with count and initials shown on each card
- Real-time updates across everyone's devices via Supabase subscriptions
- Simple name entry (stored in `localStorage`) — no accounts, trusted small-group use

## Out of scope for v1

- User accounts / authentication
- In-app photo upload or storage (use an external shared album link instead)
- Comments or likes beyond the "I'm keen" reaction
- Notifications
