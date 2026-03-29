# Comic Layout Maker — user guide

## What this app is for

Plan comic **panels**, place **speech bubbles**, **characters**, **backgrounds**, and **effect lines** on a page. Optionally use **Ollama** (local) to turn a short story into panel notes, dialogue, and prompts. Export **images** and **prompt text** for your favorite image generator.

## Main workflow

1. **Pick a page layout** (panel template) for the canvas.
2. **Add panels** and resize or split them as needed.
3. **Add characters** from presets or your registered cast; set pose/expression options where available.
4. **Add bubbles** (normal, shout, whisper, thought) and type dialogue; vertical text is supported.
5. **Backgrounds & effects**: apply presets per panel or adjust manually.
6. **Story → comic** (if configured): open the story modal, choose tone, generate a preview, then apply to the page or a single panel.
7. **Export** via the export panel (PNG/PDF/etc. depending on your build).

## Ollama (optional)

- Install [Ollama](https://ollama.com/) and pull models you want (e.g. a small Llama for text and a Flux-family model for previews if supported).
- In the app, open **Ollama settings** and set the base URL (empty in development may use the dev-server proxy).
- Text generation uses your **chat** model; image preview uses your **image** model (see labels in the settings modal).

## Character registration

- Register **Hero / Heroine / Rival / Friend** (or your own names) with **base prompts** describing appearance for image models.
- Panel prompts can reference **selected character** and **action** text for clearer exports.

## Snapping & view

- **Snap** settings (grid size, strength) live in the snap panel.
- **Dark / light** theme follows the app toggle.

## Saving projects

- **Save / load** stores your layout in the browser (and any cloud path your fork implements).
- **Beta builds** may limit page count; see in-app messaging.

## Export

- Use the **export** UI to render the layout and download prompt bundles.
- For external generators, the goal is a clear **English prompt** per panel plus layout reference.

## Tips

- Keep panel **notes** short and concrete (who, action, mood) for better AI outputs.
- After moving lots of elements, use **undo/redo** if available in your build.

## Need help?

- See `README.md` and `DEPLOYMENT.md` for setup and hosting.
- File issues against your repository with steps to reproduce.
