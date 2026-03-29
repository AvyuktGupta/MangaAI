# Deployment notes

## Build output

This is a **Create React App** project. Production assets are produced with:

```bash
npm install
npm run build
```

The `build/` folder is static HTML/JS/CSS and can be served by any static host (Vercel, Netlify, S3 + CloudFront, nginx, etc.).

## Environment variables

Copy `.env.example` if present, or create `.env.local` (never commit secrets).

Common variables (names may vary by fork):

| Variable | Purpose |
|----------|---------|
| `REACT_APP_OLLAMA_URL` | Ollama base URL in production (no trailing slash). |
| `REACT_APP_USE_ENV_API_KEY` | Enables client-side usage-limit logic when set to `true`. |
| `REACT_APP_BETA_VERSION` | When `true`, may enforce beta limits (e.g. single page). |

CRA only exposes variables prefixed with `REACT_APP_`.

## Vercel (example)

1. Connect the Git repository.
2. Framework: **Create React App**.
3. Build command: `npm run build`.
4. Output directory: `build`.
5. Add environment variables in the project settings.

## Local preview of production build

```bash
npx serve -s build
```

## Ollama / CORS

If the browser talks to Ollama on another origin, ensure Ollama (or a reverse proxy) allows your site origin, or run the app from the same host as Ollama for simple setups.
