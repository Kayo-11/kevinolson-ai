# Branching Workflow

Use this lightweight flow to ship safely without adding long-lived `dev` branch overhead.

## Branch model

- `main`: production branch only.
- `feat/*`, `fix/*`, `chore/*`: short-lived branches for active work.
- No long-lived `dev` branch for now.

## Standard flow

1. Start a branch:
   ```bash
   git checkout -b feat/your-change
   ```
2. Build and test locally:
   ```bash
   npm run lint
   npm run dev
   ```
3. Push + deploy preview + smoke test:
   ```bash
   npm run preview
   ```
4. Open PR and review preview URL.
5. Merge to `main`.
6. Run production release:
   ```bash
   npm run release -- "chore: release <what changed>"
   ```

## Notes

- `npm run preview` requires:
  - authenticated `gh` + `vercel`
  - clean working tree
  - non-`main` branch
- Preview smoke checks allow `401` responses in case Vercel preview protection is enabled.
- Production release validates canonical domain (`https://kevinolson.ai`) as the pass/fail target.
