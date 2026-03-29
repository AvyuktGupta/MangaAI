// src/services/OllamaService.ts — local Ollama (text: Llama, image: Flux)

import { Panel, SpeechBubble } from '../types';
import { usageLimitService } from './UsageLimitService';

export interface StoryToComicRequest {
  story: string;
  panelCount: number;
  tone?: string;
  characters?: Array<{ id: string; name: string; prompt?: string }>;
  generationMode?: 'page' | 'panel';
  existingPanels?: PanelContent[];
  targetPanelId?: number;
}

export interface PanelContent {
  panelId: number;
  note: string;
  dialogue: string;
  bubbleType?: string;
  actionPrompt: string;
  actionPromptJa?: string;
  characterId?: string;
}

export interface StoryToComicResponse {
  panels: PanelContent[];
  success: boolean;
  error?: string;
}

const DEFAULT_CHAT_MODEL = 'llama3.2:1b';
const DEFAULT_IMAGE_MODEL = 'flux2-klein:4b';

const BUBBLE_TO_UI: Record<string, string> = {
  normal: 'normal',
  shout: 'shout',
  whisper: 'whisper',
  thought: 'thought',
  '\u666e\u901a': 'normal',
  '\u53eb\u3073': 'shout',
  '\u5c0f\u58f0': 'whisper',
  '\u5fc3\u306e\u58f0': 'thought',
};

class OllamaService {
  /**
   * Base URL (no trailing slash).
   * Dev: empty uses CRA proxy to 11434.
   */
  public resolveBaseUrl(): string {
    const fromEnv = process.env.REACT_APP_OLLAMA_URL?.trim();
    if (fromEnv) {
      return fromEnv.replace(/\/$/, '');
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ollama_base_url')?.trim();
      if (saved) {
        return saved.replace(/\/$/, '');
      }
    }
    if (process.env.NODE_ENV === 'development') {
      return '';
    }
    return 'http://127.0.0.1:11434';
  }

  public setBaseUrl(url: string): void {
    const v = url.trim().replace(/\/$/, '');
    if (typeof window !== 'undefined') {
      if (v) {
        localStorage.setItem('ollama_base_url', v);
      } else {
        localStorage.removeItem('ollama_base_url');
      }
    }
  }

  public getBaseUrl(): string {
    return this.resolveBaseUrl();
  }

  public getChatModel(): string {
    const env = process.env.REACT_APP_OLLAMA_CHAT_MODEL?.trim();
    if (env) {
      return env;
    }
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('ollama_chat_model')?.trim();
      if (s) {
        return s;
      }
    }
    return DEFAULT_CHAT_MODEL;
  }

  public setChatModel(model: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ollama_chat_model', model.trim());
    }
  }

  public getImageModel(): string {
    const env = process.env.REACT_APP_OLLAMA_IMAGE_MODEL?.trim();
    if (env) {
      return env;
    }
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('ollama_image_model')?.trim();
      if (s) {
        return s;
      }
    }
    return DEFAULT_IMAGE_MODEL;
  }

  public setImageModel(model: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ollama_image_model', model.trim());
    }
  }

  /** Compatibility: treat as always available for local Ollama */
  public hasApiKey(): boolean {
    return true;
  }

  public async chatJson(messages: Array<{ role: string; content: string }>): Promise<string> {
    const base = this.resolveBaseUrl();
    const url = `${base}/api/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.getChatModel(),
        messages,
        stream: false,
        format: 'json',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = res.statusText;
      try {
        const j = JSON.parse(errText);
        msg = j.error || j.message || msg;
      } catch {
        if (errText) {
          msg = errText.slice(0, 200);
        }
      }
      throw new Error(`Ollama: ${msg}`);
    }

    const data = await res.json();
    const content = data.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('Ollama returned an empty response');
    }
    return content;
  }

  public async chatText(messages: Array<{ role: string; content: string }>): Promise<string> {
    const base = this.resolveBaseUrl();
    const url = `${base}/api/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.getChatModel(),
        messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = res.statusText;
      try {
        const j = JSON.parse(errText);
        msg = j.error || j.message || msg;
      } catch {
        if (errText) {
          msg = errText.slice(0, 200);
        }
      }
      throw new Error(`Ollama: ${msg}`);
    }

    const data = await res.json();
    const content = data.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      throw new Error('Ollama returned an empty response');
    }
    return content;
  }

  public async generatePanelContent(request: StoryToComicRequest): Promise<StoryToComicResponse> {
    const limitCheck = await usageLimitService.canUseAI();
    if (!limitCheck.allowed) {
      return {
        panels: [],
        success: false,
        error: limitCheck.reason || 'Usage limit reached',
      };
    }

    try {
      let characterInfo = '';
      if (request.characters && request.characters.length > 0) {
        characterInfo = '\n\nCast:\n';
        request.characters.forEach(char => {
          characterInfo += `- ${char.name} (ID: ${char.id})\n`;
        });
      }

      const systemPrompt = `You are an assistant for comic layout (storyboard / “name”) production.
Split the user's story summary into the requested number of panels. For each panel output a short note, dialogue, bubble type, and prompts.
${characterInfo}
Output JSON only:
{
  "panels": [
    {
      "panelId": 1,
      "note": "Hero worried",
      "dialogue": "I can't draw...",
      "bubbleType": "normal",
      "actionPrompt": "worried expression, looking down",
      "actionPromptJa": "Worried look, glancing down",
      "characterId": "character_1"
    }
  ]
}

Rules:
1. Use ONLY what the user provided — do not invent objects, places, or details not implied by the input.
2. panel count must match exactly.
3. note: very short (character + beat, ~15 characters max in English or the user's language).
4. dialogue: natural line (~15 characters or short phrase).
5. bubbleType must be one of: "normal", "shout", "whisper", "thought".
6. actionPrompt: English, only the pose/expression implied by the input.
7. actionPromptJa: same meaning as actionPrompt, plain English (legacy field name).
8. characterId: use a registered cast ID when applicable.
9. Match the requested tone (e.g. comedy vs serious).

Do NOT add props, creatures, or locations that are not in the user's summary.`;

      const userPrompt = `Story summary: ${request.story}
Panel count: ${request.panelCount}
Tone: ${request.tone || 'Comedy'}

Generate ${request.panelCount} panels as JSON.`;

      const content = await this.chatJson([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      let parsedContent: { panels?: PanelContent[] };
      try {
        parsedContent = JSON.parse(content);
      } catch {
        const m = content.match(/\{[\s\S]*\}/);
        if (!m) {
          throw new Error('Failed to parse JSON from model');
        }
        parsedContent = JSON.parse(m[0]);
      }

      await usageLimitService.recordUsage();

      return {
        panels: parsedContent.panels || [],
        success: true,
      };
    } catch (error) {
      console.error('Ollama chat error:', error);
      return {
        panels: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  public applyPanelContent(
    panels: Panel[],
    speechBubbles: SpeechBubble[],
    generatedContent: PanelContent[],
    characterSettings?: Record<string, any>
  ): { updatedPanels: Panel[]; newBubbles: SpeechBubble[] } {
    const updatedPanels = panels.map(panel => {
      const content = generatedContent.find(c => c.panelId === panel.id);
      if (content) {
        const update: any = {
          ...panel,
          note: content.note,
          actionPrompt: content.actionPrompt,
          actionPromptJa: content.actionPromptJa,
        };

        if (content.characterId) {
          update.selectedCharacterId = content.characterId;
          if (characterSettings?.[content.characterId]?.appearance?.basePrompt) {
            update.characterPrompt = characterSettings[content.characterId].appearance.basePrompt;
          }
        }

        return update;
      }
      return panel;
    });

    const newBubbles: SpeechBubble[] = [];

    generatedContent.forEach(content => {
      const panel = panels.find(p => p.id === content.panelId);
      if (panel && content.dialogue) {
        const t = content.bubbleType || 'normal';
        const tl = typeof t === 'string' ? t.toLowerCase() : t;
        const newBubble: SpeechBubble = {
          id: `bubble_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          panelId: panel.id,
          type: BUBBLE_TO_UI[t as string] || BUBBLE_TO_UI[tl as string] || 'normal',
          text: content.dialogue,
          x: 0.5,
          y: 0.3,
          scale: 1.0,
          width: 0.7,
          height: 0.25,
          vertical: true,
          isGlobalPosition: false,
        };

        newBubbles.push(newBubble);
      }
    });

    return {
      updatedPanels,
      newBubbles: [...speechBubbles, ...newBubbles],
    };
  }

  public async generateSinglePanel(
    story: string,
    targetPanelId: number,
    existingPanels: PanelContent[],
    tone?: string,
    characters?: Array<{ id: string; name: string; prompt?: string }>
  ): Promise<PanelContent | null> {
    const limitCheck = await usageLimitService.canUseAI();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason || 'Usage limit reached');
    }

    const characterInfo = characters
      ? characters.map(char => `- ${char.name} (ID: ${char.id}): ${char.prompt || '(no base prompt)'}`).join('\n')
      : '';

    const existingContext =
      existingPanels.length > 0
        ? `\n\nExisting panels:\n${existingPanels.map(panel => `Panel ${panel.panelId}: ${panel.note} - ${panel.dialogue}`).join('\n')}`
        : '';

    const systemPrompt = `You are a comic layout expert. Reply with ONLY the requested JSON object.`;

    const userPrompt = `From the story below, generate content for ONE panel.

Story:
${story}

Tone:
${tone || 'Comedy'}

Cast:
${characterInfo || '(none)'}

Target: panel ${targetPanelId}.${existingContext}

Return JSON only:
{
  "panelId": ${targetPanelId},
  "note": "short beat (~15 chars)",
  "dialogue": "line of dialogue",
  "bubbleType": "normal",
  "actionPrompt": "English pose/expression, minimal",
  "actionPromptJa": "same meaning in plain English",
  "characterId": "character_1"
}

Rules:
1. Do not add details absent from the story.
2. bubbleType: "normal" | "shout" | "whisper" | "thought"
3. Keep actionPrompt in English only.`;


    const content = await this.chatJson([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object in model response');
    }

    const panelData = JSON.parse(jsonMatch[0]);

    await usageLimitService.recordUsage();

    return panelData as PanelContent;
  }

  public async generateActionPrompt(description: string): Promise<{ prompt: string; promptJa: string }> {
    const limitCheck = await usageLimitService.canUseAI();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason || 'Usage limit reached');
    }

    const systemPrompt = `You convert a short action / pose description into a concise English image-generation prompt.

Rules:
1. Translate or compress ONLY what the user wrote — do not add background, lighting, or new objects.
2. Keep it short and clear.
3. Return JSON:
{
  "prompt": "english tags, simple",
  "promptJa": "plain English rephrase of the same idea"
}`;

    const userPrompt = `Description:\n\n${description}`;

    const content = await this.chatText([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object in model response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result as { prompt: string; promptJa: string };
  }

  /**
   * Image models via /api/generate; response image is base64.
   */
  public async generatePanelImageBlob(
    prompt: string,
    opts?: { width?: number; height?: number }
  ): Promise<Blob> {
    const limitCheck = await usageLimitService.canUseAI();
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.reason || 'Usage limit reached');
    }

    const base = this.resolveBaseUrl();
    const url = `${base}/api/generate`;
    const width = opts?.width ?? 768;
    const height = opts?.height ?? 768;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.getImageModel(),
        prompt,
        stream: false,
        width,
        height,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = res.statusText;
      try {
        const j = JSON.parse(errText);
        msg = j.error || j.message || msg;
      } catch {
        if (errText) {
          msg = errText.slice(0, 200);
        }
      }
      throw new Error(`Ollama image: ${msg}`);
    }

    const data = await res.json();
    const b64 = data.image as string | undefined;
    if (!b64 || typeof b64 !== 'string') {
      throw new Error(
        'No image data returned. Check that an image model (e.g. flux2-klein:4b) is pulled in Ollama.'
      );
    }

    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    await usageLimitService.recordUsage();

    return new Blob([bytes], { type: 'image/png' });
  }

  public async ping(): Promise<boolean> {
    try {
      const base = this.resolveBaseUrl();
      const res = await fetch(`${base}/api/tags`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const ollamaService = new OllamaService();
