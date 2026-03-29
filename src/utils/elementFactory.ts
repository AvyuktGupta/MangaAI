// src/utils/elementFactory.ts - Fully Integrated Element Factory System v2.0

import { 
  Character, 
  SpeechBubble, 
  BackgroundElement, 
  EffectElement, 
  ToneElement 
} from '../types';

// ==========================================
// 🎭 Character factory (full dictionary)
// ==========================================

export const createCharacter = (config: {
  // 
  characterId?: string;
  name?: string;
  type?: string;
  
  // 
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  
  // 
  viewType?: "face" | "upper_body" | "full_body" | "close_up_face" | "chest_up" | "three_quarters";
  
  // 🔧 Dictionary-compatible settings (exclude prompts with empty text when not selected)
  expression?: string;    // expressions 
  action?: string;       // pose_manga   
  facing?: string;       // gaze 
  eyeState?: string;     // 
  mouthState?: string;   // 
  handGesture?: string;  // 
  
  // 🆕 
  isGlobalPosition?: boolean;
}): Omit<Character, 'id' | 'panelId'> => ({
  characterId: config.characterId ?? "character_1",
  type: config.type ?? "character_1",
  name: config.name ?? "",
  x: config.x ?? 0.5,
  y: config.y ?? 0.6,
  scale: config.scale ?? 2.0,
  rotation: config.rotation ?? 0,
  isGlobalPosition: config.isGlobalPosition ?? true,
  viewType: config.viewType ?? "upper_body",
  // 🔧 Dictionary-compatible settings (empty characters are excluded at prompt output)
  expression: config.expression ?? "",
  action: config.action ?? "", 
  facing: config.facing ?? "",
  eyeState: config.eyeState ?? "",
  mouthState: config.mouthState ?? "",
  handGesture: config.handGesture ?? "",
});

// 🎭 Character presets (optimized by emotion and behavior)
export const characterPresets = {
  // ==========================================
  // Emotional Expression Preset (Gender Equality)
  // ==========================================
  happy: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) => 
    createCharacter({
      expression: "smiling",
      action: "standing", 
      facing: "at_viewer",
      viewType: "upper_body",
      scale: 2.0, // 
      name: "",
      // 
      eyeState: "sparkling_eyes",
      mouthState: "slight_smile",
      handGesture: "waving",
      ...overrides
    }),

    
  sad: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "sad",
      action: "sitting",
      facing: "down", 
      viewType: "upper_body",
      scale: 2.0, // 
      y: 0.65, // 
      name: "",
      // 
      eyeState: "eyes_closed",
      mouthState: "frown",
      handGesture: "covering_mouth",
      ...overrides
    }),

    
  angry: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "angry_look",
      action: "arms_crossed",
      facing: "at_viewer",
      viewType: "upper_body", 
      scale: 2.0, // 
      name: "",
      // 
      eyeState: "half_closed_eyes",
      mouthState: "frown",
      handGesture: "clenched_fist",
      ...overrides
    }),
    
  surprised: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "surprised",
      action: "standing",
      facing: "at_viewer",
      viewType: "face",
      scale: 2.0, // 
      name: "",
      // 
      eyeState: "wide_eyes",
      mouthState: "open_mouth",
      handGesture: "covering_mouth",
      ...overrides
    }),
    
  worried: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "worried_face",
      action: "standing", 
      facing: "away",
      viewType: "upper_body",
      scale: 2.0, // 
      name: "",
      // 
      eyeState: "half_closed_eyes",
      mouthState: "frown",
      handGesture: "hands_clasped",
      ...overrides
    }),
    
  determined: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "determined",
      action: "arms_crossed",
      facing: "at_viewer",
      viewType: "upper_body",
      scale: 2.0, // 
      name: "",
      // 
      eyeState: "eyes_open",
      mouthState: "mouth_closed",
      handGesture: "thumbs_up",
      ...overrides
    }),
    
  thoughtful: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "thoughtful",
      action: "standing",
      facing: "away",
      viewType: "upper_body", 
      scale: 2.0, // 
      name: "",
      // 
      eyeState: "half_closed_eyes",
      mouthState: "mouth_closed",
      handGesture: "open_palm",
      ...overrides
    }),
    
  // ==========================================
  // 
  // ==========================================
  running: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "neutral_expression",
      action: "running",
      facing: "to_side",
      viewType: "full_body",
      scale: 2.0, // 
      x: 0.4, // 
      y: 0.7,
      name: "",
      ...overrides
    }),
    
  pointing: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "surprised", 
      action: "pointing",
      facing: "to_side",
      viewType: "upper_body",
      scale: 2.0, // 
      name: "",
      ...overrides
    }),
    
  walking: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "neutral_expression",
      action: "walking",
      facing: "to_side", 
      viewType: "full_body",
      scale: 2.0, // 
      x: 0.4,
      y: 0.7,
      name: "",
      ...overrides
    }),
    
  // ==========================================
  // 
  // ==========================================
  eating: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "smiling",
      action: "sitting",
      facing: "down",
      viewType: "upper_body",
      scale: 2.0, // 
      y: 0.65,
      name: "",
      ...overrides
    }),
    
  phone: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "neutral_expression",
      action: "standing",
      facing: "to_side",
      viewType: "upper_body",
      scale: 2.0, // 
      name: "",
      ...overrides
    }),
    
  // ==========================================
  // 2
  // ==========================================
  dialogue_left: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "smiling",
      action: "standing",
      facing: "to_side",
      viewType: "upper_body",
      scale: 2.0, // 
      x: 0.3,
      y: 0.6,
      name: "",
      ...overrides
    }),
    
  dialogue_right: (overrides?: Partial<Parameters<typeof createCharacter>[0]>) =>
    createCharacter({
      expression: "smiling",
      action: "standing",
      facing: "to_side",
      viewType: "upper_body",
      scale: 2.0, // 
      x: 0.7,
      y: 0.6,
      name: "",
      ...overrides
    }),
};

// ==========================================
// 💬 Callout Factory (Editorial Compatibility Unified Edition)
// ==========================================

export const createSpeechBubble = (config: {
  // 
  type?: string;
  text?: string;
  
  // 🔧 
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  scale?: number;
  
  // 
  vertical?: boolean;
  
  // 🆕 Coordinate system unification (full compatibility with manual creation)
  isGlobalPosition?: boolean;
}): Omit<SpeechBubble, 'id' | 'panelId'> => ({
  type: config.type ?? "",
  text: config.text ?? "",
  x: config.x ?? 0.15,
  y: config.y ?? 0.15,
  width: config.width ?? 160, // 80 → 160 
  height: config.height ?? 120, // 60 → 120 
  scale: config.scale ?? 1.0,
  vertical: config.vertical ?? true,
  // 🔧 : 
  isGlobalPosition: config.isGlobalPosition ?? true,
});

// 💬 Callout preset (optimized full version by type)
export const bubblePresets = {
  normal: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      width: 160, // 80 → 160 
      height: 120, // 60 → 120 
      vertical: true,
      ...overrides
    }),
    
  shout: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      // 🔧  + 
      width: 200, // 100 → 200 
      height: 160, // 80 → 160 
      scale: 1.1,
      vertical: false, // 
      ...overrides
    }),
    
  thought: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "", 
      text,
      // 🔧  + 
      width: 180, // 90 → 180 
      height: 140, // 70 → 140 
      x: 0.65,      // 
      y: 0.15,
      vertical: true, // 
      ...overrides
    }),
    
  whisper: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      // 🔧 
      width: 140, // 70 → 140 
      height: 100, // 50 → 100 
      scale: 0.9,
      vertical: true,
      ...overrides
    }),
    
  // 🆕 
  dialog: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      width: 170, // 85 → 170 
      height: 130, // 65 → 130 
      vertical: true,
      ...overrides
    }),
    
  narration: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      // 🔧  + 
      width: 240, // 120 → 240 
      height: 80, // 40 → 80 
      vertical: false, // 
      x: 0.1,
      y: 0.05,
      ...overrides
    }),
    
  // 🆕 
  left: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      x: 0.05,
      y: 0.15,
      width: 140, // 70 → 140 
      height: 100, // 50 → 100 
      ...overrides
    }),
    
  right: (text: string, overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>) =>
    createSpeechBubble({
      type: "",
      text,
      x: 0.75,
      y: 0.15,
      width: 140, // 70 → 140 
      height: 100, // 50 → 100 
      ...overrides
    }),
};

// ==========================================
// 🎨 
// ==========================================

export const createBackground = (config: {
  type: 'solid' | 'gradient' | 'pattern';
  //  0-1
  x?: number;
  y?: number; 
  width?: number;
  height?: number;
  opacity?: number;
  zIndex?: number;
  
  // 
  solidColor?: string;
  
  // 
  gradientType?: 'linear' | 'radial';
  gradientColors?: string[];
  gradientDirection?: number;
  
  // 
  patternType?: 'dots' | 'lines' | 'grid';
  patternColor?: string;
  patternSize?: number;
  patternSpacing?: number;
}): Omit<BackgroundElement, 'id' | 'panelId'> => {
  
  const baseElement = {
    type: config.type,
    x: config.x ?? 0,
    y: config.y ?? 0,
    width: config.width ?? 1,
    height: config.height ?? 1,
    rotation: 0,
    zIndex: config.zIndex ?? -10,
    opacity: config.opacity ?? 1,
  };

  switch (config.type) {
    case 'solid':
      return {
        ...baseElement,
        solidColor: config.solidColor ?? '#CCCCCC'
      };
      
    case 'gradient':
      return {
        ...baseElement,
        gradientType: config.gradientType ?? 'linear',
        gradientColors: config.gradientColors ?? ['#FFFFFF', '#CCCCCC'],
        gradientDirection: config.gradientDirection ?? 90
      };
      
    case 'pattern':
      return {
        ...baseElement,
        patternType: config.patternType ?? 'dots',
        patternColor: config.patternColor ?? '#000000',
        patternSize: config.patternSize ?? 5,
        patternSpacing: config.patternSpacing ?? 10
      };
      
    default:
      return baseElement;
  }
};

// 🎨 Background Presets by Emotion/Scene
export const backgroundPresets = {
  // 
  happy: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#FFD700', '#FFF8DC'],
    opacity: 0.3
  }),
  
  sad: () => createBackground({
    type: 'solid',
    solidColor: '#E6F3FF',
    opacity: 0.4
  }),
  
  angry: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFE4E1', '#FFCCCB'],
    gradientDirection: 180,
    opacity: 0.4
  }),
  
  worried: () => createBackground({
    type: 'solid',
    solidColor: '#F0F8FF',
    opacity: 0.3
  }),
  
  // 
  speed: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#F0FFFF', '#E0FFFF'],
    gradientDirection: 90,
    opacity: 0.2
  }),
  
  impact: () => createBackground({
    type: 'gradient',
    gradientType: 'radial', 
    gradientColors: ['#FFFFFF', '#F0F0F0'],
    opacity: 0.5
  }),
  
  // 
  neutral: () => createBackground({
    type: 'solid',
    solidColor: '#FAFAFA',
    opacity: 0.3
  }),
  
  calm: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFFFFF', '#F8F8FF'],
    gradientDirection: 180,
    opacity: 0.3
  }),
  
  // 
  determination: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFFACD', '#FFD700'],
    gradientDirection: 180,
    opacity: 0.3
  }),
  
  idea: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFF8DC', '#FFFACD'],
    gradientDirection: 180,
    opacity: 0.4
  }),
  
  tired: () => createBackground({
    type: 'solid',
    solidColor: '#E6E6FA',
    opacity: 0.4
  }),
  
  effort: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFE4B5', '#FFD700'],
    gradientDirection: 180,
    opacity: 0.3
  }),
  
  // ==========================================
  // 🏠 Location/environment background (for comic names)
  // ==========================================
  
  // 
  home: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFF8DC', '#F5F5DC'],
    gradientDirection: 135,
    opacity: 0.4
  }),
  
  school: () => createBackground({
    type: 'solid',
    solidColor: '#F0F8FF',
    opacity: 0.3
  }),
  
  office: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#F8F8FF', '#E6E6FA'],
    gradientDirection: 90,
    opacity: 0.4
  }),
  
  hospital: () => createBackground({
    type: 'solid',
    solidColor: '#F0FFFF',
    opacity: 0.5
  }),
  
  // 
  park: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#90EE90', '#98FB98'],
    opacity: 0.3
  }),
  
  city: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#D3D3D3', '#A9A9A9'],
    gradientDirection: 45,
    opacity: 0.4
  }),
  
  beach: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#87CEEB', '#B0E0E6'],
    gradientDirection: 180,
    opacity: 0.3
  }),
  
  mountain: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#D2B48C', '#DEB887'],
    gradientDirection: 90,
    opacity: 0.4
  }),
  
  // ==========================================
  // ⏰ Time zone/weather background (for comic names)
  // ==========================================
  
  morning: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFE4B5', '#FFF8DC'],
    gradientDirection: 45,
    opacity: 0.4
  }),
  
  afternoon: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#FFD700', '#FFA500'],
    opacity: 0.3
  }),
  
  evening: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FF6347', '#FF4500'],
    gradientDirection: 180,
    opacity: 0.4
  }),
  
  night: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#191970', '#000080'],
    gradientDirection: 90,
    opacity: 0.6
  }),
  
  rainy: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#B0C4DE', '#87CEEB'],
    gradientDirection: 135,
    opacity: 0.5
  }),
  
  cloudy: () => createBackground({
    type: 'solid',
    solidColor: '#D3D3D3',
    opacity: 0.4
  }),
  
  snowy: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#F0F8FF', '#E6E6FA'],
    gradientDirection: 45,
    opacity: 0.5
  }),
  
  // ==========================================
  // 💫 Emotional/mood-based background (for comic names)
  // ==========================================
  
  tension: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFB6C1', '#FF69B4'],
    gradientDirection: 45,
    opacity: 0.4
  }),
  
  anxiety: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#DDA0DD', '#DA70D6'],
    opacity: 0.5
  }),
  
  excitement: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#FFD700', '#FFA500'],
    gradientDirection: 90,
    opacity: 0.4
  }),
  
  romantic: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#FFB6C1', '#FFC0CB'],
    opacity: 0.3
  }),
  
  nostalgic: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#F5DEB3', '#DEB887'],
    gradientDirection: 135,
    opacity: 0.4
  }),
  
  // ==========================================
  // ✨ Special Effects Background (for Comic Names)
  // ==========================================
  
  flash: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#FFFFFF', '#FFFF00'],
    opacity: 0.7
  }),
  
  explosion: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#FF4500', '#FF6347'],
    opacity: 0.6
  }),
  
  magic: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#9370DB', '#8A2BE2'],
    gradientDirection: 45,
    opacity: 0.5
  }),
  
  memory: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#D3D3D3', '#A9A9A9'],
    gradientDirection: 90,
    opacity: 0.6
  }),
  
  dream: () => createBackground({
    type: 'gradient',
    gradientType: 'radial',
    gradientColors: ['#E6E6FA', '#DDA0DD'],
    opacity: 0.5
  }),
  
  // ==========================================
  // 🚗 Transportation background (for comic names)
  // ==========================================
  
  train: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#F5F5F5', '#DCDCDC'],
    gradientDirection: 0,
    opacity: 0.4
  }),
  
  car: () => createBackground({
    type: 'gradient',
    gradientType: 'linear',
    gradientColors: ['#E0E0E0', '#C0C0C0'],
    gradientDirection: 90,
    opacity: 0.3
  }),
  
  bus: () => createBackground({
    type: 'solid',
    solidColor: '#F8F8FF',
    opacity: 0.4
  })
};

// ==========================================
// ⚡ 
// ==========================================

export const createEffect = (config: {
  // 
  type?: 'speed' | 'focus' | 'explosion' | 'flash';
  
  //  0-1
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  
  // 
  direction?: 'horizontal' | 'vertical' | 'radial' | 'custom';
  intensity?: number;    // 0.1-1.0
  density?: number;      // 0.1-1.0
  length?: number;       // 
  angle?: number;        // 
  color?: string;
  opacity?: number;
  blur?: number;
  zIndex?: number;
}): Omit<EffectElement, 'id' | 'panelId'> => ({
  type: config.type ?? 'speed',
  x: config.x ?? 0,
  y: config.y ?? 0,
  width: config.width ?? 1,
  height: config.height ?? 1,
  direction: config.direction ?? 'horizontal',
  intensity: config.intensity ?? 0.6,
  density: config.density ?? 0.7,
  length: config.length ?? 30,
  angle: config.angle ?? 0,
  color: config.color ?? "#333333",
  opacity: config.opacity ?? 0.6,
  blur: config.blur ?? 0,
  selected: false,
  zIndex: config.zIndex ?? 100,
  isGlobalPosition: false,
});

// ⚡ Effect line preset (optimized by scene)
export const effectPresets = {
  speed_horizontal: (overrides?: Partial<Parameters<typeof createEffect>[0]>) =>
    createEffect({
      type: 'speed',
      direction: 'horizontal',
      intensity: 0.8,
      density: 0.7,
      ...overrides
    }),
    
  speed_diagonal: (overrides?: Partial<Parameters<typeof createEffect>[0]>) =>
    createEffect({
      type: 'speed',
      direction: 'custom',
      angle: 45,
      intensity: 0.7,
      density: 0.5,
      ...overrides
    }),
    
  focus: (overrides?: Partial<Parameters<typeof createEffect>[0]>) =>
    createEffect({
      type: 'focus',
      direction: 'radial',
      intensity: 0.6,
      density: 0.5,
      ...overrides
    }),
    
  explosion: (overrides?: Partial<Parameters<typeof createEffect>[0]>) =>
    createEffect({
      type: 'explosion',
      direction: 'radial',
      intensity: 0.9,
      density: 0.8,
      ...overrides
    }),
    
  flash: (overrides?: Partial<Parameters<typeof createEffect>[0]>) =>
    createEffect({
      type: 'flash',
      direction: 'radial',
      intensity: 0.7,
      density: 0.6,
      ...overrides
    }),
};

// ==========================================
// 🎯 
// ==========================================

export const createTone = (config: {
  // 
  type?: 'halftone' | 'gradient' | 'crosshatch' | 'dots' | 'lines' | 'noise';
  pattern?: 'dots_60' | 'dots_85' | 'dots_100' | 'dots_120' | 'dots_150' | 'lines_horizontal' | 'lines_vertical' | 'lines_diagonal' | 'lines_cross' | 'gradient_linear' | 'gradient_radial' | 'gradient_diamond' | 'noise_fine' | 'noise_coarse' | 'noise_grain' | 'speed_lines' | 'focus_lines' | 'explosion';
  
  //  0-1
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  
  // 
  density?: number;      // 0-1
  opacity?: number;      // 0-1
  rotation?: number;     // 0-360
  scale?: number;        // 0.1-3.0
  
  // 
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  contrast?: number;     // 0-2
  brightness?: number;   // -1 to 1
  invert?: boolean;
  
  // 
  maskEnabled?: boolean;
  maskShape?: 'rectangle' | 'ellipse' | 'custom';
  maskFeather?: number;  // 0-20
  
  // 
  zIndex?: number;
  visible?: boolean;
}): Omit<ToneElement, 'id' | 'panelId'> => ({
  type: config.type ?? 'halftone',
  pattern: config.pattern ?? 'dots_60',
  x: config.x ?? 0,
  y: config.y ?? 0,
  width: config.width ?? 1,
  height: config.height ?? 1,
  density: config.density ?? 0.5,
  opacity: config.opacity ?? 0.7,
  rotation: config.rotation ?? 0,
  scale: config.scale ?? 1.0,
  blendMode: config.blendMode ?? 'multiply',
  contrast: config.contrast ?? 1.0,
  brightness: config.brightness ?? 0,
  invert: config.invert ?? false,
  maskEnabled: config.maskEnabled ?? false,
  maskShape: config.maskShape ?? 'rectangle',
  maskFeather: config.maskFeather ?? 0,
  selected: false,
  zIndex: config.zIndex ?? 0,
  isGlobalPosition: false,
  visible: config.visible ?? true,
  // 🆕 
  color: '#000000',
  intensity: 0.5,
  angle: 0,
  direction: 'vertical'
});

// 🎯 Tone presets (optimized by application)
export const tonePresets = {
  shadow: (overrides?: Partial<Parameters<typeof createTone>[0]>) =>
    createTone({
      pattern: 'dots_85' as const,
      density: 0.3,
      opacity: 0.4,
      blendMode: 'multiply',
      ...overrides
    }),
    
  highlight: (overrides?: Partial<Parameters<typeof createTone>[0]>) =>
    createTone({
      pattern: 'dots_120' as const,
      density: 0.15,
      opacity: 0.2,
      blendMode: 'screen',
      ...overrides
    }),
    
  texture: (overrides?: Partial<Parameters<typeof createTone>[0]>) =>
    createTone({
      pattern: 'lines_horizontal' as const,
      density: 0.1,
      opacity: 0.15,
      blendMode: 'overlay',
      ...overrides
    }),
    
  mood: (overrides?: Partial<Parameters<typeof createTone>[0]>) =>
    createTone({
      pattern: 'lines_diagonal' as const,
      density: 0.2,
      opacity: 0.3,
      blendMode: 'multiply',
      ...overrides
    }),
};

// ==========================================
// 🔧 Integrated Scene Factory (Editorial Compatibility Edition)
// ==========================================

export interface UnifiedSceneConfig {
  characters?: Array<{
    preset: keyof typeof characterPresets;
    overrides?: Partial<Parameters<typeof createCharacter>[0]>;
  }>;
  bubbles?: Array<{
    preset: keyof typeof bubblePresets;
    text: string;
    overrides?: Partial<Parameters<typeof createSpeechBubble>[0]>;
  }>;
  background?: {
    preset: keyof typeof backgroundPresets;
    overrides?: Partial<Parameters<typeof createBackground>[0]>;
  };
  effects?: Array<{
    preset: keyof typeof effectPresets;
    overrides?: Partial<Parameters<typeof createEffect>[0]>;
  }>;
  tones?: Array<{
    preset: keyof typeof tonePresets;
    overrides?: Partial<Parameters<typeof createTone>[0]>;
  }>;
}

export const createUnifiedScene = (config: UnifiedSceneConfig) => {
  const characters = (config.characters ?? []).map(char => 
    characterPresets[char.preset](char.overrides)
  );
  
  const speechBubbles = (config.bubbles ?? []).map(bubble =>
    bubblePresets[bubble.preset](bubble.text, bubble.overrides)
  );
  
  const backgrounds = config.background ? 
    [{ ...backgroundPresets[config.background.preset](), preset: config.background.preset }] : [];
  
  const effects = (config.effects ?? []).map(effect =>
    effectPresets[effect.preset](effect.overrides)
  );
  
  const tones = (config.tones ?? []).map(tone =>
    tonePresets[tone.preset](tone.overrides)
  );
  
  return {
    characters,
    speechBubbles,
    backgrounds,
    effects,
    tones,
  };
};

// ==========================================
// 🎮 
// ==========================================

export const scenePresets = {
  // 😊 
  happy_basic: () => createUnifiedScene({
    characters: [{ preset: 'happy' }],
    bubbles: [{ preset: 'normal', text: '' }],
    background: { preset: 'happy' },
    effects: [{ preset: 'flash' }]
  }),
  
  // 😢 
  sad_basic: () => createUnifiedScene({
    characters: [{ 
      preset: 'sad',
      overrides: { y: 0.65 }
    }],
    bubbles: [{ preset: 'thought', text: '...' }],
    background: { preset: 'sad' },
    tones: [{ preset: 'shadow' }]
  }),
  
  // 😡 
  angry_basic: () => createUnifiedScene({
    characters: [{ preset: 'angry' }],
    bubbles: [{ preset: 'shout', text: '' }],
    background: { preset: 'angry' },
    effects: [{ preset: 'explosion' }]
  }),
  
  // 🏃 
  running_basic: () => createUnifiedScene({
    characters: [{ preset: 'running' }],
    bubbles: [{ preset: 'shout', text: '' }],
    effects: [{ preset: 'speed_horizontal' }]
  }),
  
  // 🤝 
  dialogue_basic: () => createUnifiedScene({
    characters: [
      { preset: 'dialogue_left' },
      { preset: 'dialogue_right' }
    ],
    bubbles: [
      { preset: 'left', text: '' },
      { preset: 'right', text: '' }
    ],
    background: { preset: 'calm' }
  }),
  
  // 💭 
  thinking_basic: () => createUnifiedScene({
    characters: [{ preset: 'thoughtful' }],
    bubbles: [{ preset: 'thought', text: '...' }],
    background: { preset: 'neutral' },
    tones: [{ preset: 'texture' }]
  }),
};

// ==========================================
// 🔧 Legacy conversion function (compatibility with existing code)
// ==========================================

/**
 * Convert old format background settings to new format
 */
export const convertLegacyBackground = (legacyBg: any): Omit<BackgroundElement, 'id' | 'panelId'> => {
  if (legacyBg.colors && Array.isArray(legacyBg.colors)) {
    // Convert Old Format Scene Template Background to New Format
    return createBackground({
      type: legacyBg.type,
      gradientType: legacyBg.type === 'gradient' ? 'linear' : undefined,
      gradientColors: legacyBg.colors,
      gradientDirection: 180,
      solidColor: legacyBg.type === 'solid' ? legacyBg.colors[0] : undefined,
      opacity: legacyBg.opacity ?? 1
    });
  }
  
  // Return as is if it is already in the new format
  return legacyBg;
};

/**
 * Element generation for background templates
 */
export const createBackgroundTemplateElements = (
  baseConfig: Parameters<typeof createBackground>[0],
  variations?: Array<Partial<Parameters<typeof createBackground>[0]>>
): Omit<BackgroundElement, 'id' | 'panelId'>[] => {
  const baseElement = createBackground(baseConfig);
  
  if (!variations) {
    return [baseElement];
  }
  
  return [
    baseElement,
    ...variations.map(variation => createBackground({
      ...baseConfig,
      ...variation
    }))
  ];
};

// ==========================================
// 🛠️ IDID
// ==========================================

/**
 * IDID
 */
export const addElementIds = <T extends Record<string, any>>(
  elements: T[],
  panelId: number,
  prefix: string
): (T & { id: string; panelId: number })[] => {
  return elements.map((element, index) => ({
    ...element,
    id: `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${index}`,
    panelId: panelId
  }));
};

/**
 * →
 */
export const convertToAbsolutePosition = <T extends { x: number; y: number; isGlobalPosition?: boolean }>(
  element: T,
  panel: { x: number; y: number; width: number; height: number }
): T => {
  if (element.isGlobalPosition) {
    // Absolute coordinates do not need to be converted
    return element;
  }
  
  return {
    ...element,
    x: panel.x + (element.x * panel.width),
    y: panel.y + (element.y * panel.height),
    isGlobalPosition: true
  };
};

// ==========================================
// 📋 
// ==========================================

/*
// 🎭 
const happyCharacter = characterPresets.happy({
  name: "",
  x: 0.3,
  y: 0.5
});

// 💬 
const normalBubble = bubblePresets.normal("", {
  x: 0.1,
  y: 0.2
});

// 🎨 
const happyBackground = backgroundPresets.happy();

// ⚡ 
const speedEffect = effectPresets.speed_horizontal();

// 🎯 
const shadowTone = tonePresets.shadow();

// 🎮 
const completeScene = scenePresets.happy_basic();

// 🔧 
const customScene = createUnifiedScene({
  characters: [
    { 
      preset: 'happy',
      overrides: { name: "", scale: 2.5 }
    }
  ],
  bubbles: [
    { 
      preset: 'shout', 
      text: "",
      overrides: { x: 0.2, y: 0.1 }
    }
  ],
  background: { preset: 'determination' },
  effects: [{ preset: 'flash' }],
  tones: [{ preset: 'highlight' }]
});
*/

// ==========================================
// 🎯 
// ==========================================

export default {
  // 
  createCharacter,
  createSpeechBubble,
  createBackground,
  createEffect,
  createTone,
  createUnifiedScene,
  
  // 
  characterPresets,
  bubblePresets,
  backgroundPresets,
  effectPresets,
  tonePresets,
  scenePresets,
  
  // 
  convertLegacyBackground,
  createBackgroundTemplateElements,
  addElementIds,
  convertToAbsolutePosition,
};