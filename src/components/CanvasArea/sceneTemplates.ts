// src/components/CanvasArea/sceneTemplates.ts - Unified Factory Edition (Super Simplified)

import { Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement } from "../../types";
import { 
  scenePresets, 
  createUnifiedScene,
  addElementIds,
  characterPresets,
  bubblePresets,
  backgroundPresets,
  effectPresets,
  tonePresets,
  type UnifiedSceneConfig
} from "../../utils/elementFactory";
import { backgroundTemplates } from "./backgroundTemplates";

export interface EnhancedSceneTemplate {
  name: string;
  description: string;
  category: 'emotion' | 'action' | 'daily' | 'special';
  characters: Omit<Character, "id" | "panelId">[];
  speechBubbles: Omit<SpeechBubble, "id" | "panelId">[];
  background?: Omit<BackgroundElement, "id" | "panelId">; // Singular (for integrated templates)
  backgrounds?: Omit<BackgroundElement, "id" | "panelId">[]; // 
  effects?: Omit<EffectElement, "id" | "panelId">[];
  tones?: Omit<ToneElement, "id" | "panelId">[];
}

// ==========================================
// 🎯 Unified Factory Edition Scene Template
// ==========================================

// 🔧 Scene generation using a unified factory (ultra-simple version)
const createFactoryScene = (
  name: string,
  description: string,
  category: EnhancedSceneTemplate['category'],
  config: UnifiedSceneConfig
): EnhancedSceneTemplate => {
  const scene = createUnifiedScene(config);
  
  return {
    name,
    description,
    category,
    characters: scene.characters,
    speechBubbles: scene.speechBubbles,
    backgrounds: scene.backgrounds,
    effects: scene.effects,
    tones: scene.tones,
  };
};

// ==========================================
// 🎭 Emotion Category Scene (Unified Factory Edition)
// ==========================================
export const createEmotionScenes = (): Record<string, EnhancedSceneTemplate> => {
  return {
    // 😊 
    happy_basic: createFactoryScene(
      "😊 ",
      "Expression of the basic joy of the character",
      'emotion',
      {
        characters: [{ preset: 'happy' }],
        bubbles: [{ preset: 'normal', text: '' }],
        background: { preset: 'excitement' },
        effects: [{ preset: 'flash' }]
      }
    ),


    // 😢   
    sad_basic: createFactoryScene(
      "😢 ",
      "Character's Sad Emotional Expressions",
      'emotion',
      {
        characters: [{ preset: 'sad' }],
        bubbles: [{ preset: 'thought', text: '...' }],
        background: { preset: 'cloudy' }
      }
    ),


    // 😡 
    angry_basic: createFactoryScene(
      "😡 ",
      "Emotional expression of the character's anger",
      'emotion',
      {
        characters: [{ preset: 'angry' }],
        bubbles: [{ preset: 'shout', text: '' }],
        background: { preset: 'tension' },
        effects: [{ preset: 'explosion' }]
      }
    ),

    // 😲 
    surprise_basic: createFactoryScene(
      "😲 ", 
      "",
      'emotion',
      {
        characters: [{ 
          preset: 'surprised',
          overrides: { viewType: 'face', scale: 2.8 }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { x: 0.1, y: 0.05, width: 100, height: 80 }
        }],
        effects: [{ preset: 'focus' }]
      }
    ),

    // 😰 
    worried_basic: createFactoryScene(
      "😰 ",
      "The character's anxious expression", 
      'emotion',
      {
        characters: [{ preset: 'worried' }],
        bubbles: [{ 
          preset: 'thought', 
          text: '...',
          overrides: { width: 85, height: 65 }
        }],
        background: { preset: 'anxiety' }
      }
    ),

    // 😍 
    love_basic: createFactoryScene(
      "😍 ",
      "",
      'emotion',
      {
        characters: [{ 
          preset: 'happy',
          overrides: { expression: 'love_expression', eyeState: 'heart_eyes' }
        }],
        bubbles: [{ 
          preset: 'thought', 
          text: '...',
          overrides: { width: 80, height: 60 }
        }],
        background: { preset: 'happy' },
        effects: [{ preset: 'flash' }]
      }
    ),

    // 😤 
    frustrated_basic: createFactoryScene(
      "😤 ",
      "Character's expressions of frustration",
      'emotion',
      {
        characters: [{ 
          preset: 'angry',
          overrides: { expression: 'frustrated', action: 'arms_crossed' }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { width: 90, height: 70 }
        }],
        background: { preset: 'angry' }
      }
    ),

    // 😅 
    embarrassed_basic: createFactoryScene(
      "😅 ",
      "Character's shining expression",
      'emotion',
      {
        characters: [{ 
          preset: 'happy',
          overrides: { expression: 'embarrassed_face', facing: 'away' }
        }],
        bubbles: [{ 
          preset: 'thought', 
          text: '...',
          overrides: { width: 85, height: 65 }
        }],
        background: { preset: 'happy' }
      }
    ),

    // 😭 
    crying_basic: createFactoryScene(
      "😭 ",
      "Character's Intense Sadness Expression",
      'emotion',
      {
        characters: [{ 
          preset: 'sad',
          overrides: { expression: 'crying', eyeState: 'teary_eyes' }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { width: 100, height: 80 }
        }],
        background: { preset: 'sad' },
        effects: [{ preset: 'flash' }]
      }
    ),

    // 🤩 
    excited_basic: createFactoryScene(
      "🤩 ",
      "",
      'emotion',
      {
        characters: [{ 
          preset: 'happy',
          overrides: { expression: 'excited', action: 'jumping' }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { width: 95, height: 75 }
        }],
        background: { preset: 'happy' },
        effects: [{ preset: 'flash' }]
      }
    ),

    // 😵 
    confused_basic: createFactoryScene(
      "😵 ",
      "Character's puzzling expressions",
      'emotion',
      {
        characters: [{ 
          preset: 'surprised',
          overrides: { expression: 'confused', facing: 'to_side' }
        }],
        bubbles: [{ 
          preset: 'thought', 
          text: '',
          overrides: { width: 80, height: 60 }
        }],
        background: { preset: 'neutral' },
        effects: [{ preset: 'focus' }]
      }
    ),

    // 😌 
    relieved_basic: createFactoryScene(
      "😌 ",
      "Relieved expression of the character",
      'emotion',
      {
        characters: [{ 
          preset: 'happy',
          overrides: { expression: 'relieved', action: 'sitting' }
        }],
        bubbles: [{ 
          preset: 'normal', 
          text: '...',
          overrides: { width: 85, height: 65 }
        }],
        background: { preset: 'happy' }
      }
    ),

    // 😨 
    scared_basic: createFactoryScene(
      "😨 ",
      "Character's Frightening Expressions",
      'emotion',
      {
        characters: [{ 
          preset: 'surprised',
          overrides: { expression: 'scared', action: 'cowering' }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { width: 90, height: 70 }
        }],
        background: { preset: 'angry' },
        effects: [{ preset: 'explosion' }]
      }
    ),

    // 😏 
    confident_basic: createFactoryScene(
      "😏 ",
      "Character Confident Expressions",
      'emotion',
      {
        characters: [{ 
          preset: 'happy',
          overrides: { expression: 'confident', action: 'hands_on_hips' }
        }],
        bubbles: [{ 
          preset: 'normal', 
          text: '',
          overrides: { width: 80, height: 60 }
        }],
        background: { preset: 'happy' }
      }
    )
  };
};

// ==========================================
// ⚡ Scenes in Action Categories (Unified Factory Edition)
// ==========================================
export const createActionScenes = (): Record<string, EnhancedSceneTemplate> => {
  return {
    // 🏃 
    running_basic: createFactoryScene(
      "🏃 ",
      "Scene with character in a hurry",
      'action',
      {
        characters: [{ preset: 'running' }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { x: 0.1, y: 0.1, width: 85, height: 60 }
        }],
        background: { preset: 'city' },
        effects: [{ preset: 'speed_horizontal' }]
      }
    ),

    // 👉 
    pointing_basic: createFactoryScene(
      "👉 ",
      "Scene of pointing and discovering something",
      'action',
      {
        characters: [{ 
          preset: 'pointing',
          overrides: { x: 0.4, y: 0.6 }
        }],
        bubbles: [{ 
          preset: 'normal', 
          text: '',
          overrides: { x: 0.1, y: 0.15, width: 75, height: 55 }
        }],
        background: { preset: 'excitement' },
        effects: [{ preset: 'focus' }]
      }
    ),

    // 💥 
    impact_basic: createFactoryScene(
      "💥 ",
      "",
      'action',
      {
        characters: [{ 
          preset: 'surprised',
          overrides: { y: 0.7, scale: 2.1, viewType: 'upper_body' }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { x: 0.15, y: 0.1, width: 80, height: 65 }
        }],
        background: { preset: 'explosion' },
        effects: [{ preset: 'explosion' }]
      }
    ),

    // 🤝 
    dialogue_basic: createFactoryScene(
      "🤝 ",
      "Conversation scene between two characters",
      'action',
      {
        characters: [
          { preset: 'dialogue_left' },
          { preset: 'dialogue_right' }
        ],
        bubbles: [
          { preset: 'left', text: '' },
          { preset: 'right', text: '' }
        ],
        background: { preset: 'neutral' }
      }
    )
  };
};

// ==========================================
// 🏠 Scenes in Daily Categories (Unified Factory Edition)
// ==========================================
export const createDailyScenes = (): Record<string, EnhancedSceneTemplate> => {
  return {
    // 🍽️ 
    eating_basic: createFactoryScene(
      "🍽️ ",
      "",
      'daily',
      {
        characters: [{ preset: 'eating' }],
        bubbles: [{ 
          preset: 'normal', 
          text: '♪',
          overrides: { x: 0.15, y: 0.15 }
        }],
        background: { preset: 'home' }
      }
    ),

    // 📱 
    phone_basic: createFactoryScene(
      "📱 ",
      "",
      'daily',
      {
        characters: [{ preset: 'phone' }],
        bubbles: [{ 
          preset: 'normal', 
          text: '',
          overrides: { x: 0.65, y: 0.2, width: 70, height: 50 }
        }],
        background: { preset: 'neutral' }
      }
    ),

    // 🚶 
    walking_basic: createFactoryScene(
      "🚶 ",
      "Scenes of walking and moving",
      'daily',
      {
        characters: [{ preset: 'walking' }],
        bubbles: [{ 
          preset: 'thought', 
          text: '...',
          overrides: { width: 60, height: 45 }
        }],
        background: { preset: 'city' }
      }
    ),

    // 💭 
    thinking_basic: createFactoryScene(
      "💭 ",
      "",
      'daily',
      {
        characters: [{ preset: 'thoughtful' }],
        bubbles: [{ preset: 'thought', text: '...' }],
        background: { preset: 'neutral' }
      }
    )
  };
};

// ==========================================
// ✨ Special Category Scenes (Unified Factory Edition)
// ==========================================
export const createSpecialScenes = (): Record<string, EnhancedSceneTemplate> => {
  return {
    // ✨ 
    determination_basic: createFactoryScene(
      "✨ ",
      "Moments of determination and motivation",
      'special',
      {
        characters: [{ preset: 'determined' }],
        bubbles: [{ 
          preset: 'thought', 
          text: '',
          overrides: { width: 60, height: 50 }
        }],
        background: { preset: 'determination' },
        effects: [{ preset: 'focus' }]
      }
    ),

    // 🌟 
    idea_basic: createFactoryScene(
      "🌟 ",
      "A scene that inspires or discovers something",
      'special',
      {
        characters: [{ 
          preset: 'pointing',
          overrides: { 
            expression: 'surprised',
            facing: 'up',
            scale: 2.2
          }
        }],
        bubbles: [{ 
          preset: 'normal', 
          text: '',
          overrides: { x: 0.15, y: 0.1, width: 70, height: 55 }
        }],
        background: { preset: 'flash' },
        effects: [{ preset: 'flash' }]
      }
    ),

    // 😴 
    tired_basic: createFactoryScene(
      "😴 ",
      "Situations where you are tired or sleepy",
      'special',
      {
        characters: [{ 
          preset: 'sad', // 
          overrides: { action: 'sitting', y: 0.65 }
        }],
        bubbles: [{ 
          preset: 'thought', 
          text: '...',
          overrides: { width: 65, height: 50 }
        }],
        background: { preset: 'night' }
      }
    ),

    // 💪 
    effort_basic: createFactoryScene(
      "💪 ",
      "Scenes of hard work and effort",
      'special',
      {
        characters: [{ 
          preset: 'determined',
          overrides: { scale: 2.3 }
        }],
        bubbles: [{ 
          preset: 'shout', 
          text: '',
          overrides: { x: 0.15, y: 0.1, width: 80, height: 60 }
        }],
        background: { preset: 'tension' }
      }
    )
  };
};

// ==========================================
// 🔧 Integration and management functions (unified factory version)
// ==========================================

// Get all scene templates (unified factory version)
export const getAllSceneTemplates = (): Record<string, EnhancedSceneTemplate> => {
  const emotionScenes = createEmotionScenes();
  const actionScenes = createActionScenes();
  const dailyScenes = createDailyScenes();
  const specialScenes = createSpecialScenes();
  
  return {
    // Unified Factory Edition Template
    ...emotionScenes,
    ...actionScenes,
    ...dailyScenes,
    ...specialScenes,
  };
};

// Acquisition by Category (Unified Factory Edition)
export const getTemplatesByCategory = (category: EnhancedSceneTemplate['category']): Record<string, EnhancedSceneTemplate> => {
  const allTemplates = getAllSceneTemplates();
  const filtered: Record<string, EnhancedSceneTemplate> = {};
  
  Object.entries(allTemplates).forEach(([key, template]) => {
    if (template.category === category) {
      filtered[key] = template;
    }
  });
  
  return filtered;
};

// Function to get the background template name (use the actual name of the background template)
const getBackgroundTemplateName = (preset: string): string => {
  // Get real name from background template
  const backgroundTemplate = backgroundTemplates.find(template => template.id === preset);
  if (backgroundTemplate) {
    return backgroundTemplate.name;
  }
  
  // : 
  return preset;
};

// 🔧 Unified Factory Edition Scene Template Application Function (Coordinate Transformation Revision)
export const applyEnhancedSceneTemplate = (
  templateKey: string,
  panels: any[],
  existingCharacters: any[],
  existingSpeechBubbles: any[],
  existingBackgrounds: any[],
  existingEffects: any[],
  existingTones: any[],
  selectedPanel?: any,
  selectedCharacter?: any
): {
  characters: any[];
  speechBubbles: any[];
  backgrounds: any[];
  effects: any[];
  tones: any[];
} => {
  const template = getAllSceneTemplates()[templateKey];
  if (!template || panels.length === 0) {
    console.error(`❌ : ${templateKey}`);
    return {
      characters: existingCharacters,
      speechBubbles: existingSpeechBubbles,
      backgrounds: existingBackgrounds,
      effects: existingEffects,
      tones: existingTones,
    };
  }

  const targetPanel = selectedPanel || panels[0];
  console.log(`🎭 Unified Factory Edition Template Apply: ${template.name} → ${targetPanel.id}`);
  console.log(`🎨 :`, template.background);
  console.log(`🎨 s:`, template.backgrounds);

  // 
  const filteredCharacters = existingCharacters.filter(char => char.panelId !== targetPanel.id);
  const filteredBubbles = existingSpeechBubbles.filter(bubble => bubble.panelId !== targetPanel.id);
  const filteredBackgrounds = existingBackgrounds.filter(bg => bg.panelId !== targetPanel.id);
  const filteredEffects = existingEffects.filter(effect => effect.panelId !== targetPanel.id);
  const filteredTones = existingTones.filter(tone => tone.panelId !== targetPanel.id);

  // 🔧 →
  const newCharacters = template.characters.map((char, index) => {
    const uniqueId = `char_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    // 🔧 →
    const absoluteX = targetPanel.x + (char.x * targetPanel.width);
    const absoluteY = targetPanel.y + (char.y * targetPanel.height);
    
    // 🔧 Use selected character information
    const characterName = selectedCharacter ? selectedCharacter.name : (char.name || '');
    const characterId = selectedCharacter ? selectedCharacter.characterId : char.characterId;
    
    console.log(`👤 : ${characterName}`);
    console.log(`   : (${char.x}, ${char.y}) → : (${absoluteX.toFixed(1)}, ${absoluteY.toFixed(1)})`);
    console.log(`   : ${selectedCharacter ? selectedCharacter.name : ''}`);
    
    // 🔍 Learn more about character settings
    console.log(`🔍 :`, {
      name: characterName,
      characterId: characterId,
      expression: char.expression,
      action: char.action,
      facing: char.facing,
      eyeState: char.eyeState,
      mouthState: char.mouthState,
      handGesture: char.handGesture,
      allProperties: Object.keys(char)
    });
    
    // 🔍 Confirm details of the selected character
    console.log(`🔍 :`, {
      selectedCharacterName: selectedCharacter ? selectedCharacter.name : 'null',
      selectedCharacterId: selectedCharacter ? selectedCharacter.characterId : 'null',
      selectedCharacterExpression: selectedCharacter ? selectedCharacter.expression : 'null',
      selectedCharacterAction: selectedCharacter ? selectedCharacter.action : 'null'
    });
    
    // 🔧 Apply template advanced settings while retaining basic information for selected characters
    const finalCharacter = {
      ...char, // Advanced template settings (facial expressions, behaviors, etc.)
      id: uniqueId,
      name: characterName, // The name of the selected character
      characterId: characterId, // ID
      type: selectedCharacter ? selectedCharacter.type : char.type, // 🔧 type
      panelId: targetPanel.id,
      x: absoluteX,
      y: absoluteY,
      isGlobalPosition: true, // 
      // 🔧 Keep basic settings for selected characters
      ...(selectedCharacter && {
        viewType: selectedCharacter.viewType,
        scale: selectedCharacter.scale,
        // Exclude items overridden by template advanced settings
      })
    };
    
    
    return finalCharacter;
  });

  // 🔧 →
  const newSpeechBubbles = template.speechBubbles.map((bubble, index) => {
    const uniqueId = `bubble_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    // 🔧 →
    const absoluteX = targetPanel.x + (bubble.x * targetPanel.width);
    const absoluteY = targetPanel.y + (bubble.y * targetPanel.height);
    
    console.log(`💬 : "${bubble.text}"`);
    console.log(`   : (${bubble.x}, ${bubble.y}) → : (${absoluteX.toFixed(1)}, ${absoluteY.toFixed(1)})`);
    
    return {
      ...bubble,
      id: uniqueId,
      panelId: targetPanel.id,
      x: absoluteX,
      y: absoluteY,
      isGlobalPosition: true, // 
    };
  });

  // 🔧 
  //  background
  const backgroundData = template.background || template.backgrounds?.[0];
  const newBackgrounds = backgroundData ? [backgroundData].map((bg, index) => {
    const uniqueId = `bg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    console.log(`🎨 : ${bg.type || 'preset'}`);
    console.log(`   : ${bg.preset || ''}`);
    console.log(`   : (${bg.x || 0}, ${bg.y || 0}, ${bg.width || 1}, ${bg.height || 1})`);
    
    // Set background template name (for user-friendly display)
    const templateName = bg.preset ? getBackgroundTemplateName(bg.preset) : null;
    
    return {
      ...bg,
      id: uniqueId,
      panelId: targetPanel.id,
      name: templateName, // name
      templateName: templateName, // 
      // Background remains in relative coordinates (entire panel)
    };
  }) : [];

  // 🔧 Effect line generation (relative coordinates)
  const newEffects = (template.effects || []).map((effect, index) => {
    const uniqueId = `effect_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    console.log(`⚡ : ${effect.type}`);
    
    return {
      ...effect,
      id: uniqueId,
      panelId: targetPanel.id,
      selected: false,
      isGlobalPosition: false, // 
    };
  });

  // 🔧 Tone generation (relative coordinates)
  const newTones = (template.tones || []).map((tone, index) => {
    const uniqueId = `tone_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    console.log(`🎯 : ${tone.pattern}`);
    
    return {
      ...tone,
      id: uniqueId,
      panelId: targetPanel.id,
      selected: false,
      isGlobalPosition: false, // 
      visible: true,
    };
  });

  console.log(`✅ Element generation completed with Unified Factory Edition:`);
  console.log(`   : ${newCharacters.length}`);
  console.log(`   : ${newSpeechBubbles.length}`);
  console.log(`   : ${newBackgrounds.length}`);
  console.log(`   : ${newEffects.length}`);
  console.log(`   : ${newTones.length}`);
  
  if (newBackgrounds.length > 0) {
    console.log(`🎨 :`, newBackgrounds[0]);
  } else {
    console.log(`⚠️ `);
  }

  return {
    characters: [...filteredCharacters, ...newCharacters],
    speechBubbles: [...filteredBubbles, ...newSpeechBubbles],
    backgrounds: [...filteredBackgrounds, ...newBackgrounds],
    effects: [...filteredEffects, ...newEffects],
    tones: [...filteredTones, ...newTones],
  };
};

// ==========================================
// Existing functions for backwards compatibility (modified)
// ==========================================

export interface SceneTemplate {
  characters: Omit<Character, "id" | "panelId">[];
  speechBubbles: Omit<SpeechBubble, "id" | "panelId">[];
}

// 🔧 For backwards compatibility (changed to unified factory base)
export const sceneTemplates: Record<string, SceneTemplate> = {
  daily: {
    characters: [characterPresets.happy({
      characterId: "character_1",
      type: "character_1",
      name: "",
      x: 0.25,
      y: 0.6,
      scale: 2.0,
      viewType: "upper_body",
    })],
    speechBubbles: [bubblePresets.normal("", {
      x: 0.167,
      y: 0.167,
      width: 80,
      height: 60
    })]
  },
  
  action: {
    characters: [characterPresets.running({
      characterId: "character_1",
      type: "character_1",
      name: "",
      x: 0.333,
      y: 0.667,
      scale: 2.3,
      viewType: "full_body",
    })],
    speechBubbles: [bubblePresets.shout("", {
      x: 0.167,
      y: 0.167,
      width: 70,
      height: 60
    })]
  },
  
  emotional: {
    characters: [characterPresets.worried({
      characterId: "character_1",
      type: "character_1",
      name: "",
      x: 0.45,
      y: 0.6,
      scale: 2.2,
      viewType: "upper_body",
    })],
    speechBubbles: [bubblePresets.thought("...", {
      x: 0.667,
      y: 0.267,
      width: 90,
      height: 70
    })]
  },
  
  surprise: {
    characters: [characterPresets.surprised({
      characterId: "character_1",
      type: "character_1",
      name: "",
      x: 0.5,
      y: 0.6,
      scale: 2.5,
      viewType: "face",
    })],
    speechBubbles: [bubblePresets.shout("", {
      x: 0.25,
      y: 0.167,
      scale: 1.2,
      width: 80,
      height: 70
    })]
  },
};

export const applySceneTemplate = (
  sceneType: string,
  panels: any[],
  existingCharacters: Character[],
  existingSpeechBubbles: SpeechBubble[],
  selectedPanel?: any
): { characters: Character[], speechBubbles: SpeechBubble[] } => {
  const template = sceneTemplates[sceneType];
  if (!template || panels.length === 0) {
    return { characters: existingCharacters, speechBubbles: existingSpeechBubbles };
  }

  const targetPanel = selectedPanel || panels[0];
  console.log(`🎭 : ${sceneType} → ${targetPanel.id}`);

  // 🔧 →
  const newCharacters = template.characters.map((char, index) => {
    const uniqueId = `char_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    // 🔧 →
    const absoluteX = targetPanel.x + (char.x * targetPanel.width);
    const absoluteY = targetPanel.y + (char.y * targetPanel.height);
    
    return {
      ...char,
      id: uniqueId,
      panelId: targetPanel.id,
      x: absoluteX,
      y: absoluteY,
      isGlobalPosition: true,
    };
  });

  const newSpeechBubbles = template.speechBubbles.map((bubble, index) => {
    const uniqueId = `bubble_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`;
    
    // 🔧 →
    const absoluteX = targetPanel.x + (bubble.x * targetPanel.width);
    const absoluteY = targetPanel.y + (bubble.y * targetPanel.height);
    
    return {
      ...bubble,
      id: uniqueId,
      panelId: targetPanel.id,
      x: absoluteX,
      y: absoluteY,
      isGlobalPosition: true,
    };
  });

  return {
    characters: [...existingCharacters, ...newCharacters],
    speechBubbles: [...existingSpeechBubbles, ...newSpeechBubbles],
  };
};