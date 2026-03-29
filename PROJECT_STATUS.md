# Project status (summary)

## Product

Browser-based **comic layout / name** tool: panels, bubbles, characters, backgrounds, effect lines, optional **Ollama** integration for story-to-layout assistance, and export of layout + prompts.

## Technical stack

- React 18 + TypeScript
- Canvas-based editors
- Local persistence / project save services in-repo
- Optional local **Ollama** for LLM + image preview models

## Docs

- `README.md` — overview & quick start
- `USER_GUIDE.md` — user-facing workflow
- `DEPLOYMENT.md` — hosting & env

## Contributing / maintenance

- Run `npm run build` before releases.
- Keep dictionary data (`public/dict`) and prompts consistent with exported tag names.
