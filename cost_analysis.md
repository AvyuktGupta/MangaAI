# Cost analysis (reference)

## Local Ollama

When using **Ollama** on your own machine, marginal cost is mainly **electricity** and **hardware**; there is no per-token bill from the app itself.

## Third-party hosted APIs

If you add cloud LLM or image APIs later, pricing depends on the provider (per 1K tokens, per image, etc.). Track:

- Average prompt size per panel
- Number of panels per session
- Image resolution and model tier

## This repository

Core layout features run **in the browser**; costs scale with whatever backends you choose to plug in, not with a fixed vendor bundled in this repo.
