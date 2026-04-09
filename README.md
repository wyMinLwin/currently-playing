# Currently Playing

Show what you're listening to on Spotify — as an embeddable SVG card for your GitHub README.

## Setup

### 1. Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set the redirect URI to your ngrok or Vercel URL + `/api/spotify/callback`
4. Copy the **Client ID** and **Client Secret**

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`src/supabase/seed.sql`](src/supabase/seed.sql)
3. Copy your **Project URL** and **Service Role Key** from Settings > API

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=https://your-ngrok-url.ngrok-free.dev/api/spotify/callback
NEXT_PUBLIC_BASE_URL=https://your-ngrok-url.ngrok-free.dev
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

> **Local development:** Spotify OAuth requires a publicly accessible callback URL. Use [ngrok](https://ngrok.com) to expose your local server:
>
> ```bash
> ngrok http 3000
> ```
>
> Then use the ngrok URL for `SPOTIFY_REDIRECT_URI` and `NEXT_PUBLIC_BASE_URL`.
>
> **Production:** Replace with your Vercel deployment URL (e.g. `https://your-app.vercel.app`).

### 4. Install & Run

```bash
bun install
bun dev
```

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import the project on Vercel
3. Add the environment variables — replace the ngrok URLs with your Vercel domain:
   ```
   SPOTIFY_REDIRECT_URI=https://your-app.vercel.app/api/spotify/callback
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```
4. Update the redirect URI in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) to match

## Usage

1. Visit `/connect` on your deployed app
2. Click **Connect Spotify** and authorize
3. After connecting, you'll be redirected to your dashboard with an embeddable markdown snippet
4. Copy the snippet and paste it into your GitHub README

### Embed

Add this to your README (replace `YOUR_PUBLIC_ID` with the ID from your dashboard):

```markdown
![Currently Playing](https://your-app.vercel.app/api/spotify/currently-playing/YOUR_PUBLIC_ID)
```

The card updates automatically — it shows what you're currently listening to on Spotify with a 15-second cache.

Example:  
![Currently Playing](https://wyml-currently-playing.vercel.app/api/spotify/currently-playing/33dP82pPZ87A)


## Database Keep-Alive (Cron Ping)

Supabase free-tier databases auto-pause after 7 days of inactivity. To prevent this, a daily cron job pings the database.

### How it works

- A `ping` table stores a single row with a `pinged_at` timestamp
- Vercel Cron calls `GET /api/cron/ping` on a schedule (daily by default)
- The endpoint upserts the ping row, keeping the database active
- The endpoint is protected by `CRON_SECRET` so only Vercel can call it

### Setup

1. Generate a secret:
   ```bash
   openssl rand -hex 32
   ```
2. Add `CRON_SECRET` to your Vercel environment variables with the generated value
3. Create the `ping` table by running this in Supabase SQL Editor:
   ```sql
   create table ping (
     id integer primary key default 1,
     pinged_at timestamptz not null default now(),
     constraint single_row check (id = 1)
   );
   insert into ping (id, pinged_at) values (1, now());
   ```
4. After deploying, verify the cron job appears in Vercel dashboard under **Cron Jobs**

### Changing the schedule

Edit the `schedule` in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/ping",
      "schedule": "0 0 * * *"
    }
  ]
}
```

| Schedule | Meaning |
|---|---|
| `0 0 * * *` | Every day at midnight UTC (default) |
| `0 */12 * * *` | Every 12 hours |
| `0 0 */3 * *` | Every 3 days |

## Tech Stack

- [Next.js](https://nextjs.org) 16
- [Supabase](https://supabase.com) (database)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Bun](https://bun.sh) (runtime & package manager)

## License

MIT
