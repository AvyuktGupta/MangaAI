// src/services/PromptService.ts - 8
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, CharacterSettings } from '../types';

export interface Project {
  panels: Panel[];
  characters: Character[];
  speechBubbles: SpeechBubble[];
  backgrounds: BackgroundElement[];
  effects: EffectElement[];
  characterSettings?: Record<string, CharacterSettings>;
}

export interface CharacterPrompt {
  id: string;
  name: string;
  role: string;
  basePrompt: string;
  scenePrompt: string;
  fullPrompt: string;
  qualityScore: number; // 🆕 
}

export interface ScenePrompt {
  panelId: number;
  sceneType: string;
  backgroundPrompt?: string;
  effectsPrompt?: string;
  compositionPrompt?: string;
  panelCharacters: CharacterPrompt[];
}

export interface PromptOutput {
  characters: CharacterPrompt[];
  scenes: ScenePrompt[];
  storyFlow: string;
  technicalNotes: string;
  overallQuality: number; // 🆕 
}

class PromptService {
  /**
   * 🆕 8
   */
  private isValidValue(value: any): boolean {
    if (!value) return false;
    if (typeof value !== 'string') return false;
    
    const trimmed = value.trim();
    if (!trimmed) return false;
    
    // 🔧 Exclude unselected keywords altogether
    const unselectedKeywords = [
      'not selected', 'please select', 'unset', 'unselected',
      'none', 'null', 'undefined',
      'default', 'normal', 'front', 'basic', 'standard', 'regular',
      '\u672a\u9078\u629e',
      '\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044',
      '\u672a\u8a2d\u5b9a',
    ];
    
    return !unselectedKeywords.includes(trimmed.toLowerCase());
  }

  /**
   * 🆕 8Get category-aware dictionary data
   */
  private getDictionary(): any {
    if (typeof window !== 'undefined' && window.DEFAULT_SFW_DICT) {
      return window.DEFAULT_SFW_DICT.SFW;
    }
    
    // 🆕 8Category-aware fallback dictionary
    return {
      expressions: [
        { tag: "neutral_expression", label: "Neutral expression" },
        { tag: "smiling", label: "Smiling" },
        { tag: "happy", label: "Happy" },
        { tag: "sad", label: "Sad" },
        { tag: "angry", label: "Angry" },
        { tag: "surprised", label: "Surprised" },
        { tag: "embarrassed", label: "Embarrassed" },
        { tag: "serious", label: "Serious" },
        { tag: "worried", label: "Worried" },
        { tag: "confused", label: "Confused" }
      ],
      pose_manga: [
        { tag: "standing", label: "Standing" },
        { tag: "sitting", label: "Sitting" },
        { tag: "walking", label: "Walking" },
        { tag: "running", label: "Running" },
        { tag: "arms_crossed", label: "Arms crossed" },
        { tag: "hands_on_hips", label: "Hands on hips" },
        { tag: "pointing", label: "Pointing" },
        { tag: "waving", label: "Waving" },
        { tag: "leaning", label: "Leaning" },
        { tag: "kneeling", label: "Kneeling" }
      ],
      gaze: [
        { tag: "at_viewer", label: "Looking at viewer" },
        { tag: "to_side", label: "Looking to the side" },
        { tag: "away", label: "Looking away" },
        { tag: "down", label: "Looking down" },
        { tag: "up", label: "Looking up" },
        { tag: "looking_back", label: "Looking back" },
        { tag: "sideways_glance", label: "Sideways glance" },
        { tag: "distant_gaze", label: "Distant gaze" }
      ],
      eye_state: [
        { tag: "eyes_open", label: "Eyes open" },
        { tag: "eyes_closed", label: "Eyes closed" },
        { tag: "wink_left", label: "Wink left" },
        { tag: "wink_right", label: "Wink right" },
        { tag: "half_closed_eyes", label: "Half-lidded eyes" },
        { tag: "wide_eyes", label: "Wide eyes" },
        { tag: "sleepy_eyes", label: "Sleepy eyes" },
        { tag: "sparkling_eyes", label: "Sparkling eyes" }
      ],
      mouth_state: [
        { tag: "mouth_closed", label: "Mouth closed" },
        { tag: "open_mouth", label: "Open mouth" },
        { tag: "slight_smile", label: "Slight smile" },
        { tag: "grin", label: "Grin" },
        { tag: "frown", label: "Frown" },
        { tag: "pouting", label: "Pouting" },
        { tag: "lips_pursed", label: "Pursed lips" },
        { tag: "tongue_out", label: "Tongue out" }
      ],
      hand_gesture: [
        { tag: "peace_sign", label: "Peace sign" },
        { tag: "pointing", label: "Pointing" },
        { tag: "waving", label: "Waving" },
        { tag: "thumbs_up", label: "Thumbs up" },
        { tag: "clenched_fist", label: "Clenched fist" },
        { tag: "open_palm", label: "Open palm" },
        { tag: "covering_mouth", label: "Covering mouth" },
        { tag: "hands_clasped", label: "Hands clasped" }
      ],
      emotion_primary: [
        { tag: "joy", label: "Joy" },
        { tag: "anger", label: "Anger" },
        { tag: "sadness", label: "Sadness" },
        { tag: "fear", label: "Fear" },
        { tag: "surprise", label: "Surprise" },
        { tag: "disgust", label: "Disgust" },
        { tag: "contempt", label: "Contempt" },
        { tag: "love", label: "Love" },
        { tag: "anticipation", label: "Anticipation" },
        { tag: "trust", label: "Trust" }
      ],
      physical_state: [
        { tag: "healthy", label: "Healthy" },
        { tag: "tired", label: "Tired" },
        { tag: "sick", label: "Unwell" },
        { tag: "energetic", label: "Energetic" },
        { tag: "exhausted", label: "Exhausted" },
        { tag: "sleepy", label: "Sleepy" },
        { tag: "dizzy", label: "Dizzy" },
        { tag: "injured", label: "Injured" },
        { tag: "sweating", label: "Sweating" },
        { tag: "trembling", label: "Trembling" }
      ],
      composition: [
        { tag: "close-up", label: "Face close-up" },
        { tag: "upper_body", label: "Upper body" },
        { tag: "full_body", label: "Full body" }
      ]
    };
  }

  /**
   * 🔧 8: Retrieve English tags from the dictionary (if not selected,null
   */
  private getEnglishTag(category: string, key: string): string | null {
    if (!this.isValidValue(key)) {
      return null;
    }
    
    const dict = this.getDictionary();
    const categoryData = dict[category] || [];
    
    const found = categoryData.find((item: any) => 
      item.tag === key || item.label === key
    );
    
    return found ? found.tag : null;
  }

  /** Label from embedded dictionary (English in this build). */
  private getDictLabel(category: string, key: string): string {
    if (!this.isValidValue(key)) {
      return '';
    }
    
    const dict = this.getDictionary();
    const categoryData = dict[category] || [];
    
    const found = categoryData.find((item: any) => item.tag === key);
    return found ? found.label : key;
  }

  /**
   * 🆕 8
   */
  private calculateCharacterQualityScore(character: Character): number {
    const settings = [
      character.expression,
      character.action,
      character.facing,
      (character as any).eyeState,
      (character as any).mouthState,
      (character as any).handGesture,
      (character as any).emotion_primary,
      (character as any).physical_state
    ];
    
    const validSettings = settings.filter(s => this.isValidValue(s)).length;
    return Math.round((validSettings / 8) * 100);
  }

  /**
   * AI
   */
  public generatePrompts(project: Project, characterAssignments?: Map<number, Character[]>): PromptOutput {
    console.log('📊 PromptService (8):', {
      panels: project.panels?.length || 0,
      characters: project.characters?.length || 0,
      characterSettings: project.characterSettings,
      characterSettingsKeys: Object.keys(project.characterSettings || {}),
      hasCharacterAssignments: !!characterAssignments
    });

    // 🔍 Learn more about character settings generated by integration templates
    project.characters.forEach((char, index) => {
      console.log(`🔍 ${index + 1}:`, {
        id: char.id,
        name: char.name,
        panelId: char.panelId,
        expression: char.expression,
        action: char.action,
        facing: char.facing,
        eyeState: (char as any).eyeState,
        mouthState: (char as any).mouthState,
        handGesture: (char as any).handGesture,
        emotion_primary: (char as any).emotion_primary,
        physical_state: (char as any).physical_state,
        // 🔍 
        allProperties: Object.keys(char),
        rawCharacter: char
      });
    });

    const characters = this.extractCharacterPrompts(project);
    const scenes = this.extractScenePrompts(project, characters, characterAssignments);
    const storyFlow = this.generateStoryFlow(project);
    const technicalNotes = this.generateTechnicalNotes();

    // 🆕 
    const overallQuality = characters.length > 0 ? 
      Math.round(characters.reduce((sum, char) => sum + char.qualityScore, 0) / characters.length) : 0;

    return {
      characters,
      scenes,
      storyFlow,
      technicalNotes,
      overallQuality
    };
  }

  private extractCharacterPrompts(project: Project): CharacterPrompt[] {
    // 🔧 : The characters generated by the integration template are also processed separately
    console.log('🎭 Character for Prompt Generation (8):', project.characters.length, '');
    console.log('🔍 extractCharacterPrompts:', {
      charactersCount: project.characters.length,
      characters: project.characters.map(c => ({ id: c.id, name: c.name, panelId: c.panelId }))
    });
    
    // 🔍 
    project.characters.forEach((char, index) => {
      console.log(`🔍 ${index + 1}:`, {
        id: char.id,
        characterId: char.characterId,
        name: char.name,
        panelId: char.panelId,
        expression: char.expression,
        action: char.action,
        facing: char.facing
      });
    });

    return project.characters.map(char => {
      const characterType = char.type || char.characterId || char.id;
      const settingsData = project.characterSettings?.[characterType] as any;
      
      console.log('🔍 :', {
        characterType,
        settingsData,
        hasAppearance: !!settingsData?.appearance,
        hasBasePrompt: !!settingsData?.appearance?.basePrompt
      });

      let basePrompt = '';
      if (settingsData?.appearance?.basePrompt) {
        basePrompt = settingsData.appearance.basePrompt;
        console.log('✅ basePrompt:', basePrompt.substring(0, 50));
      } else {
        console.log('❌ basePrompt: ');
      }

      const settings = {
        id: char.characterId || char.id,
        name: char.name || 'Character',
        role: settingsData?.role || 'Hero',
        gender: 'female' as const,
        basePrompt
      };

      const scenePrompt = this.generateScenePrompt(char);
      const fullPrompt = this.generateFullPrompt(settings.basePrompt, char);
      const qualityScore = this.calculateCharacterQualityScore(char); // 🆕 

      console.log(`👤  "${settings.name}"  (: ${qualityScore}%):`, {
        basePrompt: settings.basePrompt.substring(0, 30) + (settings.basePrompt.length > 30 ? '...' : ''),
        scenePrompt: scenePrompt,
        fullPrompt: fullPrompt.substring(0, 50) + (fullPrompt.length > 50 ? '...' : ''),
        qualityScore: qualityScore
      });

      return {
        id: char.id,
        name: settings.name,
        role: settings.role,
        basePrompt: settings.basePrompt,
        scenePrompt: scenePrompt,
        fullPrompt: fullPrompt,
        qualityScore: qualityScore // 🆕 
      };
    });
  }

  /**
   * 🔧 8: Generate scene prompts from advanced settings
   */
  private generateScenePrompt(character: Character): string {
    const validTags: string[] = [];

    console.log('🎭 8Character Data for Category Prompt Generation:', {
      id: character.id,
      name: character.name,
      viewType: (character as any).viewType,
      expression: character.expression,
      action: character.action,
      facing: character.facing,
      eyeState: (character as any).eyeState,
      mouthState: (character as any).mouthState,
      handGesture: (character as any).handGesture,
      emotion_primary: (character as any).emotion_primary,
      physical_state: (character as any).physical_state
    });

    // 🔧 1. - 
    const viewType = (character as any).viewType;
    if (this.isValidValue(viewType)) {
      const viewTypeMapping: Record<string, string> = {
        'face': 'close-up',
        'close_up_face': 'extreme_close-up',
        'upper_body': 'upper_body',
        'chest_up': 'chest_up',
        'three_quarters': 'three_quarters',
        'full_body': 'full_body'
      };
      const compositionTag = viewTypeMapping[viewType];
      if (compositionTag) {
        validTags.push(compositionTag);
        console.log('📐 :', compositionTag);
      }
    } else {
      console.log('📐 : ');
    }

    // 🔧 2.  - 
    if (this.isValidValue(character.expression)) {
      const expressionTag = this.getEnglishTag('expressions', character.expression);
      if (expressionTag) {
        validTags.push(expressionTag);
        console.log('😊 :', expressionTag);
      } else {
        console.log('😊 :', character.expression);
      }
    } else {
      console.log('😊 : ');
    }

    // 🔧 3.  - 
    if (this.isValidValue(character.action)) {
      const actionTag = this.getEnglishTag('pose_manga', character.action);
      if (actionTag) {
        validTags.push(actionTag);
        console.log('🤸 :', actionTag);
      } else {
        console.log('🤸 :', character.action);
      }
    } else {
      console.log('🤸 : ');
    }

    // 🔧 4.  - 
    if (this.isValidValue(character.facing)) {
      const facingTag = this.getEnglishTag('gaze', character.facing);
      if (facingTag) {
        validTags.push(facingTag);
        console.log('🔄 :', facingTag);
      } else {
        console.log('🔄 :', character.facing);
      }
    } else {
      console.log('🔄 : ');
    }

    // 🔧 5.  - 
    const eyeState = (character as any).eyeState;
    if (this.isValidValue(eyeState)) {
      const eyeTag = this.getEnglishTag('eye_state', eyeState);
      if (eyeTag) {
        validTags.push(eyeTag);
        console.log('👀 :', eyeTag);
      } else {
        console.log('👀 :', eyeState);
      }
    } else {
      console.log('👀 : ');
    }

    // 🆕 6.  - 
    const mouthState = (character as any).mouthState;
    if (this.isValidValue(mouthState)) {
      const mouthTag = this.getEnglishTag('mouth_state', mouthState);
      if (mouthTag) {
        validTags.push(mouthTag);
        console.log('👄 :', mouthTag);
      } else {
        console.log('👄 :', mouthState);
      }
    } else {
      console.log('👄 : ');
    }

    // 🆕 7.  - 
    const handGesture = (character as any).handGesture;
    if (this.isValidValue(handGesture)) {
      const handTag = this.getEnglishTag('hand_gesture', handGesture);
      if (handTag) {
        validTags.push(handTag);
        console.log('✋ :', handTag);
      } else {
        console.log('✋ :', handGesture);
      }
    } else {
      console.log('✋ : ');
    }

    // 🆕 8.  - 
    const emotionPrimary = (character as any).emotion_primary;
    if (this.isValidValue(emotionPrimary)) {
      const emotionTag = this.getEnglishTag('emotion_primary', emotionPrimary);
      if (emotionTag) {
        validTags.push(emotionTag);
        console.log('💗 :', emotionTag);
      } else {
        console.log('💗 :', emotionPrimary);
      }
    } else {
      console.log('💗 : ');
    }

    // 🆕 9.  - 
    const physicalState = (character as any).physical_state;
    if (this.isValidValue(physicalState)) {
      const physicalTag = this.getEnglishTag('physical_state', physicalState);
      if (physicalTag) {
        validTags.push(physicalTag);
        console.log('🏃 :', physicalTag);
      } else {
        console.log('🏃 :', physicalState);
      }
    } else {
      console.log('🏃 : ');
    }

    const result = validTags.join(', ');
    console.log(`🎯 8 (${validTags.length}):`, result || '()');
    
    return result;
  }

  /**
   * 🔧 : 8
   */
  private generateFullPrompt(basePrompt: string, character: Character): string {
    const scenePrompt = this.generateScenePrompt(character);
    
    const validParts: string[] = [];
    
    // 🆕 basePrompt
    if (this.isValidValue(basePrompt)) {
      validParts.push(basePrompt.trim());
    }
    
    // 🆕 scenePrompt
    if (this.isValidValue(scenePrompt)) {
      validParts.push(scenePrompt.trim());
    }

    const result = validParts.join(', ');
    console.log(`🔗  (${validParts.length}):`, result || '()');
    
    return result;
  }

  // 🔧 : extractScenePromptscharacterAssignments
  private extractScenePrompts(project: Project, allCharacters: CharacterPrompt[], characterAssignments?: Map<number, Character[]>): ScenePrompt[] {
    return project.panels.map(panel => {
      let panelCharacters: CharacterPrompt[] = [];
      
      if (characterAssignments) {
        // 🔧 
        const assignedCharacters = characterAssignments.get(panel.id) || [];
        panelCharacters = allCharacters.filter(char => 
          assignedCharacters.some(assigned => assigned.id === char.id)
        );
        
        console.log(`📐 Panel ${panel.id}:  ${panelCharacters.length}`);
      } else {
        // 🔧 : panelId
        const panelCharacterIds = project.characters
          .filter(char => char.panelId === panel.id)
          .map(char => char.id);
        
        panelCharacters = allCharacters.filter(char => 
          panelCharacterIds.includes(char.id)
        );
        
        console.log(`📐 Panel ${panel.id}: panelId ${panelCharacters.length}`);
      }

      return {
        panelId: panel.id,
        sceneType: this.analyzeSceneType(panel, project),
        backgroundPrompt: this.generateBackgroundPrompt(panel, project),
        effectsPrompt: this.generateEffectsPrompt(panel, project),
        compositionPrompt: this.generateCompositionPrompt(panel, project),
        panelCharacters
      };
    });
  }

  private generateBackgroundPrompt(panel: Panel, project: Project): string | undefined {
    const backgrounds = project.backgrounds.filter(bg => bg.panelId === panel.id);
    if (backgrounds.length === 0) return undefined;
    return backgrounds[0].type;
  }

  private generateEffectsPrompt(panel: Panel, project: Project): string | undefined {
    const effects = project.effects.filter(effect => effect.panelId === panel.id);
    if (effects.length === 0) return undefined;
    
    return effects.map(effect => {
      const mapping: Record<string, string> = {
        'speed': 'speed lines',
        'focus': 'focus lines',
        'explosion': 'explosion effect',
        'flash': 'flash effect'
      };
      return mapping[effect.type] || effect.type;
    }).join(', ');
  }

  private generateCompositionPrompt(panel: Panel, project: Project): string | undefined {
    const characterCount = project.characters.filter(char => char.panelId === panel.id).length;
    
    if (characterCount === 1) return 'single character';
    if (characterCount === 2) return 'two characters';
    if (characterCount > 2) return 'group shot';
    return undefined;
  }

  private analyzeSceneType(panel: Panel, project: Project): string {
    const characterCount = project.characters.filter(char => char.panelId === panel.id).length;
    const bubbleCount = project.speechBubbles.filter(bubble => bubble.panelId === panel.id).length;
    const hasEffects = project.effects.filter(effect => effect.panelId === panel.id).length > 0;

    if (hasEffects) return 'action';
    if (characterCount > 1) return 'dialogue';
    if (bubbleCount > 0) return 'speech';
    return 'scene';
  }

  private generateStoryFlow(project: Project): string {
    const panelCount = project.panels.length;
    const totalDialogue = project.speechBubbles.length;
    const characterCount = new Set(project.characters.map(c => c.characterId)).size;
    
    return `${panelCount} panels, ${characterCount} characters, ${totalDialogue} dialogue bubbles`;
  }

  private generateTechnicalNotes(): string {
    return [
      "Generated by Comic Layout Maker v1.2.0 — 8 category character detail",
      "🆕 8-category character detail system with quality scoring",
      "Character-based prompt system with advanced settings",
      "✅ Unselected values completely excluded",
      "🔧 Clean prompt generation without default values",
      "Recommended: High quality anime/manga style",
      "Use negative prompts for optimal results"
    ].join('\n');
  }

  /**
   * 🆕 Simplified prompt output (separate format per panel)
   */
  public formatPromptOutput(promptData: PromptOutput, panels?: Panel[], pageInfo?: { pageIndex: number; pageTitle: string }, characterSettings?: Record<string, any>): string {
    let output = "=== AI image generation prompts ===\n\n";
    
    if (pageInfo) {
      output += `📄 Page ${pageInfo.pageIndex + 1}: ${pageInfo.pageTitle}\n`;
      output += `${'='.repeat(60)}\n\n`;
    }

    promptData.scenes.forEach((scene, index) => {
      const panelLabel = pageInfo 
        ? `[Page ${pageInfo.pageIndex + 1} - Panel ${index + 1}]`
        : `[Panel ${index + 1}]`;
      output += `${panelLabel}\n`;
      
      // Panel
      if (panels && panels[index]?.note) {
        output += `📌 Note: ${panels[index].note}\n`;
      }
      
      // 🆕 : 
      const panel = panels?.[index];
      if (panel) {
        const parts: string[] = [];
        
        // panel.characterPrompt or characterSettings
        let charPrompt = panel.characterPrompt;
        if (!charPrompt && panel.selectedCharacterId && characterSettings?.[panel.selectedCharacterId]?.appearance?.basePrompt) {
          charPrompt = characterSettings[panel.selectedCharacterId].appearance.basePrompt;
        }
        
        if (charPrompt) {
          parts.push(charPrompt.trim());
        }
        
        // 
        if (panel.actionPrompt) {
          parts.push(panel.actionPrompt.trim());
        }
        
        // 
        if (parts.length > 0) {
          const combinedPrompt = parts.join(', ');
          output += `Prompt: ${combinedPrompt}\n`;
        } else if (panel.prompt) {
          output += `Prompt: ${panel.prompt}\n`;
        }
      }
      
      const panelCharacters = scene.panelCharacters;

      // 
      if (panelCharacters.length > 0) {
        panelCharacters.forEach(char => {
          if (this.isValidValue(char.fullPrompt)) {
            output += `Character: masterpiece, best quality, ${char.fullPrompt}, single character, anime style\n`;
          } else if (this.isValidValue(char.scenePrompt)) {
            output += `Character: masterpiece, best quality, ${char.scenePrompt}, single character, anime style\n`;
          }

          if (this.isValidValue(char.scenePrompt)) {
            const tagSummary = this.buildCharacterJapaneseDescription(char.scenePrompt);
            if (tagSummary) {
              output += `[Readable tags]\n${tagSummary}\n`;
            }
          }
        });
      }

      // 
      if (scene.backgroundPrompt && this.isValidValue(scene.backgroundPrompt)) {
        const bgMapping: Record<string, string> = {
          'gradient': 'gradient background',
          'solid': 'simple background',
          'pattern': 'pattern background',
          'texture': 'texture background'
        };
        const bgPrompt = bgMapping[scene.backgroundPrompt] || scene.backgroundPrompt;
        output += `Background: ${bgPrompt}\n`;
      } else {
        output += `Background: simple background, no humans\n`;
      }

      if (scene.effectsPrompt && this.isValidValue(scene.effectsPrompt)) {
        output += `Effect lines: ${scene.effectsPrompt}\n`;
      }

      output += '\n';
    });

    // Negative Prompt
    const negativePrompt = this.buildNegativePrompt();
    output += `[Negative prompt]\n${negativePrompt}\n`;

    return output;
  }

  /** Readable English labels for scene tags (export / notes). */
  private buildCharacterJapaneseDescription(scenePrompt: string): string {
    const characterTags = [
      'close-up', 'upper_body', 'full_body',
      'neutral_expression', 'smiling', 'sad', 'angry_look', 'surprised', 'worried_face',
      'love_expression', 'frustrated', 'embarrassed_face', 'crying', 'excited', 
      'confused', 'relieved', 'scared', 'confident', 'thoughtful', 'determined',
      'standing', 'sitting', 'arms_crossed', 'running', 'pointing', 'walking', 
      'jumping', 'cowering', 'hands_on_hips',
      'at_viewer', 'away', 'to_side', 'down',
      'eyes_open', 'eyes_closed', 'sparkling_eyes', 'half_closed_eyes', 'wide_eyes',
      'heart_eyes', 'teary_eyes',
      'mouth_closed', 'slight_smile', 'open_mouth', 'covering_mouth', 'frown',
      'waving', 'clenched_fist', 'peace_sign', 'pointing', 'hands_clasped', 'thumbs_up',
      'open_palm',
      'joy', 'anger', 'sadness', 'surprise',
      'healthy', 'tired'
    ];
    
    const parts = scenePrompt.split(', ').filter(part => {
      const trimmed = part.trim();
      return this.isValidValue(trimmed) && characterTags.includes(trimmed);
    });
    
    const labelParts = parts.map(part => {
      part = part.trim();
      const translations: Record<string, string> = {
        'close-up': 'Face close-up',
        'upper_body': 'Upper body',
        'full_body': 'Full body',
        'neutral_expression': 'Neutral expression',
        'smiling': 'Smiling',
        'sad': 'Sad',
        'angry_look': 'Angry look',
        'surprised': 'Surprised',
        'worried_face': 'Worried',
        'love_expression': 'Loving look',
        'frustrated': 'Frustrated',
        'embarrassed_face': 'Embarrassed',
        'crying': 'Crying',
        'excited': 'Excited',
        'confused': 'Confused',
        'relieved': 'Relieved',
        'scared': 'Scared',
        'confident': 'Confident',
        'thoughtful': 'Thoughtful',
        'determined': 'Determined',
        'standing': 'Standing',
        'sitting': 'Sitting',
        'arms_crossed': 'Arms crossed',
        'running': 'Running',
        'pointing': 'Pointing',
        'walking': 'Walking',
        'jumping': 'Jumping',
        'cowering': 'Cowering',
        'hands_on_hips': 'Hands on hips',
        'at_viewer': 'Looking at viewer',
        'away': 'Looking away',
        'to_side': 'Looking to the side',
        'down': 'Looking down',
        'eyes_open': 'Eyes open',
        'eyes_closed': 'Eyes closed',
        'sparkling_eyes': 'Sparkling eyes',
        'half_closed_eyes': 'Half-lidded eyes',
        'wide_eyes': 'Wide eyes',
        'heart_eyes': 'Heart eyes',
        'teary_eyes': 'Teary eyes',
        'mouth_closed': 'Mouth closed',
        'slight_smile': 'Slight smile',
        'open_mouth': 'Open mouth',
        'covering_mouth': 'Covering mouth',
        'frown': 'Frown',
        'waving': 'Waving',
        'clenched_fist': 'Clenched fist',
        'peace_sign': 'Peace sign',
        'hands_clasped': 'Hands clasped',
        'thumbs_up': 'Thumbs up',
        'open_palm': 'Open palm',
        'joy': 'Joy',
        'anger': 'Anger',
        'sadness': 'Sadness',
        'surprise': 'Surprise',
        'healthy': 'Healthy',
        'tired': 'Tired'
      };

      return translations[part] || part;
    }).filter(j => this.isValidValue(j));

    return labelParts.join(', ');
  }

  private buildJapaneseDescription(characters: CharacterPrompt[], scene: ScenePrompt): string {
    const parts = [];

    characters.forEach((char) => {
      const descriptions = [];

      descriptions.push(`${char.name} (${char.role}) [quality: ${char.qualityScore}%]`);

      if (this.isValidValue(char.basePrompt)) {
        const shortBase = char.basePrompt.length > 20 ?
          char.basePrompt.substring(0, 20) + '...' :
          char.basePrompt;
        descriptions.push(`base: ${shortBase}`);
      }

      if (this.isValidValue(char.scenePrompt)) {
        const sceneLabels = char.scenePrompt.split(', ')
          .filter(part => this.isValidValue(part))
          .map(part => {
            part = part.trim();
            let label = this.getDictLabel('expressions', part);
            if (label === part) label = this.getDictLabel('pose_manga', part);
            if (label === part) label = this.getDictLabel('gaze', part);
            if (label === part) label = this.getDictLabel('eye_state', part);
            if (label === part) label = this.getDictLabel('mouth_state', part);
            if (label === part) label = this.getDictLabel('hand_gesture', part);
            if (label === part) label = this.getDictLabel('emotion_primary', part);
            if (label === part) label = this.getDictLabel('physical_state', part);
            if (label === part) label = this.getDictLabel('composition', part);

            if (label === part) {
              const specialTranslations: Record<string, string> = {
                'close-up': 'Face close-up',
                'upper_body': 'Upper body',
                'full_body': 'Full body',
                'at_viewer': 'Looking at viewer',
                'away': 'Looking away',
                'to_side': 'Looking to the side',
                'down': 'Looking down',
                'neutral_expression': 'Neutral expression',
                'smiling': 'Smiling',
                'standing': 'Standing',
                'sitting': 'Sitting',
                'eyes_open': 'Eyes open',
                'mouth_closed': 'Mouth closed',
                'single character': 'Single character',
                'two characters': 'Two characters',
                'group shot': 'Group shot',
                'joy': 'Joy',
                'anger': 'Anger',
                'sadness': 'Sadness',
                'healthy': 'Healthy',
                'tired': 'Tired',
                'peace_sign': 'Peace sign',
                'pointing': 'Pointing',
                'slight_smile': 'Slight smile',
                'open_mouth': 'Open mouth'
              };
              label = specialTranslations[part] || part;
            }

            return label;
          })
          .filter(j => this.isValidValue(j))
          .join(', ');

        if (sceneLabels) {
          descriptions.push(`detail: ${sceneLabels}`);
        }
      }

      const charDescription = descriptions.length > 1 ?
        `${char.name}: ${descriptions.slice(1).join(' | ')}` :
        `${char.name}: base settings only`;

      parts.push(charDescription);
    });

    const sceneDetails = [];
    if (scene.backgroundPrompt && this.isValidValue(scene.backgroundPrompt)) {
      sceneDetails.push(`background: ${scene.backgroundPrompt}`);
    }

    if (scene.effectsPrompt && this.isValidValue(scene.effectsPrompt)) {
      sceneDetails.push(`effects: ${scene.effectsPrompt}`);
    }

    if (scene.compositionPrompt && this.isValidValue(scene.compositionPrompt)) {
      let compositionLabel = this.getDictLabel('composition', scene.compositionPrompt);

      if (compositionLabel === scene.compositionPrompt) {
        const compositionTranslations: Record<string, string> = {
          'single character': 'Single character',
          'two characters': 'Two characters',
          'group shot': 'Group shot'
        };
        compositionLabel = compositionTranslations[scene.compositionPrompt] || scene.compositionPrompt;
      }

      sceneDetails.push(`composition: ${compositionLabel}`);
    }

    if (sceneDetails.length > 0) {
      parts.push(`scene: ${sceneDetails.join(', ')}`);
    }

    parts.push('Style: high-quality anime/manga illustration (8 detail categories)');

    return parts.join('\n');
  }

  private buildNegativePrompt(): string {
    const negativeItems = [
      'lowres', 'bad anatomy', 'bad hands', 'text', 'error',
      'worst quality', 'low quality', 'blurry', 'bad face',
      'extra fingers', 'watermark', 'signature',
      'deformed', 'mutated', 'disfigured', 'bad proportions'
    ];

    return negativeItems.join(', ');
  }

  /**
   * Canvas8
   */
  public async exportPromptWithCapture(
    project: Project, 
    canvasElement: HTMLCanvasElement
  ): Promise<{ imageBlob: Blob; promptText: string }> {
    const promptData = this.generatePrompts(project);
    const promptText = this.formatPromptOutput(promptData);

    return new Promise((resolve) => {
      canvasElement.toBlob((blob) => {
        if (blob) {
          resolve({
            imageBlob: blob,
            promptText
          });
        }
      }, 'image/png');
    });
  }
}

export const promptService = new PromptService();