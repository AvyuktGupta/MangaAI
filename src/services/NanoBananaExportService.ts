// src/services/NanoBananaExportService.ts
// NanoBanana

import { 
  Panel, 
  Character, 
  SpeechBubble, 
  CharacterSettings,
  PaperSize,
  NanoBananaExportOptions,
  NanoBananaExportProgress,
  NanoBananaExportResult,
  NanoBananaExportMetadata,
  NanoBananaExportPackage,
  CharacterNameMapping,
  LayoutImageOptions,
  DEFAULT_LAYOUT_IMAGE_OPTIONS,
  DEFAULT_NANOBANANA_EXPORT_OPTIONS,
  PAPER_SIZES
} from '../types';

const JSZip = require('jszip');

export class NanoBananaExportService {
  private static instance: NanoBananaExportService;

  public static getInstance(): NanoBananaExportService {
    if (!NanoBananaExportService.instance) {
      NanoBananaExportService.instance = new NanoBananaExportService();
    }
    return NanoBananaExportService.instance;
  }

  /**
   * 🍌 NanoBanana
   */
  async exportForNanoBanana(
    panels: Panel[],
    characters: Character[],
    bubbles: SpeechBubble[],
    paperSize: PaperSize,
    characterSettings?: Record<string, CharacterSettings>,
    characterNames?: Record<string, string>,
    options: NanoBananaExportOptions = DEFAULT_NANOBANANA_EXPORT_OPTIONS,
    onProgress?: (progress: NanoBananaExportProgress) => void
  ): Promise<NanoBananaExportResult> {
    try {
      const zip = new JSZip();
      const startTime = Date.now();

      // 
      const updateProgress = (step: NanoBananaExportProgress['step'], progress: number, message: string, currentFile?: string) => {
        if (onProgress) {
          onProgress({ step, progress, message, currentFile });
        }
      };

      updateProgress('initialize', 0, 'NanoBanana...');

      // 1. 
      updateProgress('generate_layout', 10, '...', 'layout.png');
      const layoutImage = await this.generateLayoutImage(panels, paperSize, DEFAULT_LAYOUT_IMAGE_OPTIONS);
      zip.file('layout.png', layoutImage);

      // 2. Prompt generation
      updateProgress('generate_prompt', 30, 'AI...', 'prompt.txt');
      const promptText = this.generatePromptText(panels, characters, bubbles, options.promptLanguage || 'english');
      zip.file('prompt.txt', promptText);

      // 3. 
      if (options.includeCharacterMapping !== false) {
        updateProgress('create_mapping', 50, 'Creating character name correspondence table...', 'character_mapping.txt');
      const characterMapping = this.generateCharacterMapping(characters, characterNames);
        zip.file('character_mapping.txt', characterMapping);
      }

      // 4. 
      if (options.includeInstructions !== false) {
        updateProgress('create_instructions', 70, '...', 'instructions.txt');
        const instructions = this.generateInstructions(options.promptLanguage || 'english');
        zip.file('instructions.txt', instructions);
      }

      // 5. 
      updateProgress('package_files', 90, '...', 'metadata.json');
      const metadata = this.generateMetadata(panels, characters, bubbles, paperSize, startTime);
      zip.file('metadata.json', JSON.stringify(metadata, null, 2));

      // 6. ZIP
      updateProgress('package_files', 95, 'ZIP...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      updateProgress('complete', 100, '');

      return {
        success: true,
        zipBlob,
        filename: `nanobanana_export_${new Date().toISOString().slice(0, 10)}.zip`,
        size: zipBlob.size,
        metadata
      };

    } catch (error) {
      console.error('NanoBanana export error:', error);
      return {
        success: false,
        filename: '',
        size: 0,
        metadata: {} as NanoBananaExportMetadata,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🎨 
   */
  private async generateLayoutImage(
    panels: Panel[], 
    paperSize: PaperSize, 
    options: LayoutImageOptions
  ): Promise<Blob> {
    // : CanvasGenerate layout images using
    // Here we generate a simple text-based image
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // 
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    panels.forEach((panel, index) => {
      const x = panel.x * canvas.width;
      const y = panel.y * canvas.height;
      const w = panel.width * canvas.width;
      const h = panel.height * canvas.height;

      ctx.strokeRect(x, y, w, h);

      if (options.showPanelNumbers) {
        ctx.fillStyle = options.fontColor;
        ctx.font = `${options.fontSize}px Arial`;
        ctx.fillText(`${index + 1}`, x + 10, y + options.fontSize + 5);
      }
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, 'image/png', options.quality);
    });
  }

  /**
   * 📝 
   */
  private generatePromptText(
    panels: Panel[],
    characters: Character[],
    bubbles: SpeechBubble[],
    language: 'english' | 'japanese' | 'both'
  ): string {
    const isEnglish = language === 'english' || language === 'both';
    const isJapanese = language === 'japanese' || language === 'both';

    let prompt = '';

    if (isEnglish) {
      prompt += this.generateEnglishPrompt(panels, characters, bubbles);
    }

    if (isJapanese && isEnglish) {
      prompt += '\n\n' + '='.repeat(50) + '\n\n';
    }

    if (isJapanese) {
      prompt += this.generateJapanesePrompt(panels, characters, bubbles);
    }

    return prompt;
  }

  /**
   * 🇺🇸 Prompt generation
   */
  private generateEnglishPrompt(panels: Panel[], characters: Character[], bubbles: SpeechBubble[]): string {
    let prompt = '=== AI Manga Generation Prompt ===\n\n';
    
    prompt += 'Layout: ' + panels.length + ' panels\n';
    prompt += 'Characters: ' + characters.length + '\n';
    prompt += 'Dialogue bubbles: ' + bubbles.length + '\n\n';

    // PanelSeparate prompts (character + motion separation system)
    prompt += '=== Panel Prompts ===\n';
    panels.forEach((panel, index) => {
      prompt += `Panel ${index + 1}:\n`;
      if (panel.note) {
        prompt += `  Note: ${panel.note}\n`;
      }
      
      // 
      const parts: string[] = [];
      if (panel.characterPrompt) parts.push(panel.characterPrompt.trim());
      if (panel.actionPrompt) parts.push(panel.actionPrompt.trim());
      
      if (parts.length > 0) {
        prompt += `  Combined Prompt: ${parts.join(', ')}\n`;
        if (panel.characterPrompt) prompt += `    - Character: ${panel.characterPrompt}\n`;
        if (panel.actionPrompt) prompt += `    - Action: ${panel.actionPrompt}\n`;
      } else if (panel.prompt) {
        // 
        prompt += `  Prompt: ${panel.prompt}\n`;
      } else {
        prompt += `  Size: ${Math.round(panel.width * 100)}% x ${Math.round(panel.height * 100)}%\n`;
      }
      prompt += '\n';
    });

    // Character details (only if there is a character)
    if (characters.length > 0) {
      prompt += '=== Character Details ===\n';
      characters.forEach((char, index) => {
        prompt += `Character ${index + 1}: ${char.name}\n`;
        prompt += `  - View: ${char.viewType}\n`;
        prompt += `  - Expression: ${char.expression || 'neutral'}\n`;
        prompt += `  - Action: ${char.action || 'standing'}\n`;
        if (char.facing) prompt += `  - Facing: ${char.facing}\n`;
        if ((char as any).eyeState) prompt += `  - Eye State: ${(char as any).eyeState}\n`;
        if ((char as any).mouthState) prompt += `  - Mouth State: ${(char as any).mouthState}\n`;
        if ((char as any).handGesture) prompt += `  - Hand Gesture: ${(char as any).handGesture}\n`;
        if ((char as any).emotion_primary) prompt += `  - Emotion: ${(char as any).emotion_primary}\n`;
        if ((char as any).physical_state) prompt += `  - Physical State: ${(char as any).physical_state}\n`;
        prompt += '\n';
      });
    }

    prompt += '\n=== Style Instructions ===\n';
    prompt += 'Create a high-quality manga/comic with:\n';
    prompt += '- Clean line art\n';
    prompt += '- Proper character consistency\n';
    prompt += '- Dynamic panel composition\n';
    prompt += '- Clear dialogue placement\n';
    prompt += '- Professional manga styling\n';

    return prompt;
  }

  /**
   * 🇯🇵 Prompt generation
   */
  private generateJapanesePrompt(panels: Panel[], characters: Character[], bubbles: SpeechBubble[]): string {
    let prompt = '=== AI ===\n\n';
    
    prompt += ': ' + panels.length + '\n';
    prompt += ': ' + characters.length + '\n';
    prompt += ': ' + bubbles.length + '\n\n';

    // Prompts by frame (character + motion separation system)
    prompt += '===  ===\n';
    panels.forEach((panel, index) => {
      prompt += `${index + 1}:\n`;
      if (panel.note) {
        prompt += `  : ${panel.note}\n`;
      }
      
      // 
      const parts: string[] = [];
      if (panel.characterPrompt) parts.push(panel.characterPrompt.trim());
      if (panel.actionPrompt) parts.push(panel.actionPrompt.trim());
      
      if (parts.length > 0) {
        prompt += `  : ${parts.join(', ')}\n`;
        if (panel.characterPrompt) prompt += `    - : ${panel.characterPrompt}\n`;
        if (panel.actionPrompt) prompt += `    - : ${panel.actionPrompt}\n`;
      } else if (panel.prompt) {
        // 
        prompt += `  : ${panel.prompt}\n`;
      } else {
        prompt += `  : ${Math.round(panel.width * 100)}% x ${Math.round(panel.height * 100)}%\n`;
      }
      prompt += '\n';
    });

    // Character details (only if there is a character)
    if (characters.length > 0) {
      prompt += '===  ===\n';
      characters.forEach((char, index) => {
        prompt += `${index + 1}: ${char.name}\n`;
        prompt += `  - : ${char.viewType}\n`;
        prompt += `  - : ${char.expression || ''}\n`;
        prompt += `  - : ${char.action || ''}\n`;
        if (char.facing) prompt += `  - : ${char.facing}\n`;
        if ((char as any).eyeState) prompt += `  - : ${(char as any).eyeState}\n`;
        if ((char as any).mouthState) prompt += `  - : ${(char as any).mouthState}\n`;
        if ((char as any).handGesture) prompt += `  - : ${(char as any).handGesture}\n`;
        if ((char as any).emotion_primary) prompt += `  - : ${(char as any).emotion_primary}\n`;
        if ((char as any).physical_state) prompt += `  - : ${(char as any).physical_state}\n`;
        prompt += '\n';
      });
    }

    prompt += '\n===  ===\n';
    prompt += 'Create high-quality cartoons:\n';
    prompt += '- \n';
    prompt += '- \n';
    prompt += '- \n';
    prompt += '- \n';
    prompt += '- Professional cartoon style\n';

    return prompt;
  }

  /**
   * 👥 
   */
  private generateCharacterMapping(
    characters: Character[],
    characterNames?: Record<string, string>
  ): string {
    let mapping = '=== Character Name Mapping ===\n\n';
    
    characters.forEach((char, index) => {
      const displayName = characterNames?.[char.id] || char.name;
      mapping += `${index + 1}. ${displayName}\n`;
      mapping += `   Original ID: ${char.id}\n`;
      mapping += `   Character ID: ${char.characterId}\n`;
      mapping += `   View Type: ${char.viewType}\n`;
      mapping += `   Expression: ${char.expression || 'neutral'}\n`;
      mapping += `   Action: ${char.action || 'standing'}\n`;
      if (char.facing) mapping += `   Facing: ${char.facing}\n`;
      if ((char as any).eyeState) mapping += `   Eye State: ${(char as any).eyeState}\n`;
      if ((char as any).mouthState) mapping += `   Mouth State: ${(char as any).mouthState}\n`;
      if ((char as any).handGesture) mapping += `   Hand Gesture: ${(char as any).handGesture}\n`;
      if ((char as any).emotion_primary) mapping += `   Emotion: ${(char as any).emotion_primary}\n`;
      if ((char as any).physical_state) mapping += `   Physical State: ${(char as any).physical_state}\n`;
      mapping += '\n';
    });

    mapping += '=== Usage Instructions ===\n';
    mapping += 'Use these character names consistently throughout the manga generation.\n';
    mapping += 'Each character should maintain visual consistency across all panels.\n';

    return mapping;
  }

  /**
   * 📖 
   */
  private generateInstructions(language: 'english' | 'japanese' | 'both'): string {
    if (language === 'japanese') {
      return this.generateJapaneseInstructions();
    } else if (language === 'both') {
      return this.generateEnglishInstructions() + '\n\n' + '='.repeat(50) + '\n\n' + this.generateJapaneseInstructions();
    } else {
      return this.generateEnglishInstructions();
    }
  }

  /**
   * 🇺🇸 
   */
  private generateEnglishInstructions(): string {
    return `=== NanoBanana Usage Guide ===

This package contains everything you need to generate a manga using Google AI Studio's NanoBanana.

Files included:
- layout.png: Visual layout of panels
- prompt.txt: Detailed generation prompt
- character_mapping.txt: Character reference guide
- metadata.json: Project information

How to use:
1. Open Google AI Studio
2. Select NanoBanana model
3. Upload layout.png as reference image
4. Copy and paste prompt.txt content
5. Generate your manga!

Tips for best results:
- Use the character mapping to maintain consistency
- Adjust prompts based on your specific needs
- Experiment with different styles and settings
- Save your favorite results for future reference

Generated by Name Tool v1.2.0
For support, visit: https://github.com/your-repo/name-tool-react
`;
  }

  /**
   * 🇯🇵 
   */
  private generateJapaneseInstructions(): string {
    return `=== NanoBanana ===

Google AI StudioNanoBananaContains everything you need to use to generate comics.


- layout.png: 
- prompt.txt: 
- character_mapping.txt: 
- metadata.json: 


1. Google AI Studio
2. NanoBanana
3. layout.pngUpload as reference image
4. prompt.txt
5. 

Tips to get the best results:
- Use character support charts to ensure character consistency
- Adjust prompts based on specific needs
- Try different styles and settings
- Save your favorite results for future reference

Name Tool v1.2.0
: https://github.com/your-repo/name-tool-react
`;
  }

  /**
   * 📊 
   */
  private generateMetadata(
    panels: Panel[],
    characters: Character[],
    bubbles: SpeechBubble[],
    paperSize: PaperSize,
    startTime: number
  ): NanoBananaExportMetadata {
    return {
      exportedAt: new Date().toISOString(),
      toolVersion: '1.2.0',
      pageCount: 1, // 1
      panelCount: panels.length,
      characterCount: characters.length,
      paperSize: `${paperSize.name} (${paperSize.width}x${paperSize.height})`,
      totalElements: panels.length + characters.length + bubbles.length
    };
  }

}

// Export Singleton Instance
export const nanoBananaExportService = NanoBananaExportService.getInstance();