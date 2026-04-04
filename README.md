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

## Tech Stack

- [Next.js](https://nextjs.org) 16
- [Supabase](https://supabase.com) (database)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Bun](https://bun.sh) (runtime & package manager)

## License

MIT
