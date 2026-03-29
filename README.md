# Comic Layout Maker (beta)

A browser app for laying out comic panels (name/namu), speech bubbles, characters, and backgrounds. Use story-to-comic helpers and Ollama (optional) to draft prompts and preview images, then export layouts and prompts for your image pipeline.

## Beta notes

- **Usage caps** (when enabled via env): daily and total limits for AI-related actions may apply.
- **No cloud API required for core editing**; optional Ollama runs locally.

## Features

### AI-assisted workflow

- **Page / batch ideas**: Generate panel-related text from a story outline (when wired in the UI).
- **Single panel**: Generate content for one panel at a time.
- **Prompt export**: English prompts suitable for common image models.

### Layout tools

- **Panel templates**: One to many panel layouts.
- **Speech bubbles**: Vertical / horizontal text, adjustable size.
- **Characters**: Slots and settings for cast prompts.
- **Export**: Raster images plus prompt text bundles.

### Image pipeline

1. Build your layout in the app.
2. Export `prompts.txt` (or equivalent) from the export panel.
3. Run your preferred image generator.
4. Composite results in your usual tool.

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md). Typical path: static build from `npm run build`, hosted on any static host (e.g. Vercel with Create React App preset).

Example env vars (adjust names to match your fork):

```
REACT_APP_USE_ENV_API_KEY=true
REACT_APP_APP_NAME=Comic Layout Maker
```

## Local development

```bash
npm install
npm start
```

Open `http://localhost:3000`.

```bash
npm run build
```

## Docs

- [USER_GUIDE.md](./USER_GUIDE.md) – user-facing guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) – hosting
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) – project notes

## Security

- Prefer env vars for any API keys; do not commit `.env`.
- Optional usage limits may use browser storage / fingerprinting—see code in `UsageLimitService`.

## License

Beta / see repository owner for terms.

## Thanks

- React
- Ollama (optional local LLM / image models)
- Hosting providers you choose for deployment
