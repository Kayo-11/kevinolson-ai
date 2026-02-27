# Release Checklist

Run this checklist before `npm run release -- "<commit message>"`.

## Required CLIs

- `git` installed and repository clean enough to commit.
- `gh` installed and authenticated (`gh auth status`).
- `vercel` installed and authenticated (`vercel whoami`).
- `curl` installed for smoke tests.

## Required Auth

- GitHub CLI auth is active for your account.
- Vercel CLI auth is active for the target Vercel account/team.
- Current project is linked to the intended Vercel project (`vercel link` if needed).

## Required Environment Variables

Local (`.env.local`):

- `ANTHROPIC_API_KEY`

Vercel project env vars:

- `ANTHROPIC_API_KEY`

Optional but recommended:

- `ANTHROPIC_MODEL`
- `CHAT_RATE_LIMIT_MAX_REQUESTS`
- `CHAT_RATE_LIMIT_WINDOW_MS`

## What the one-command release does

1. Verifies tool availability and auth (`gh`, `vercel`).
2. Verifies required local and Vercel env vars.
3. Commits all local changes with your message.
4. Pushes `HEAD` to `origin`.
5. Deploys production via `vercel deploy --prod --yes`.
6. Smoke-tests canonical production domain (`https://kevinolson.ai` by default):
   - `GET /` returns `200`
   - `GET /api/chat` returns `405` (route exists and method guard is active)
7. Performs a non-blocking health check on `https://www.kevinolson.ai` and prints a warning if DNS/TLS is not ready.

You can override defaults when needed:

- `CANONICAL_DOMAIN=example.com npm run release -- "chore: release"`
- `WWW_DOMAIN=www.example.com npm run release -- "chore: release"`

## Usage

```bash
npm run release -- "chore: release chatbot updates"
```
