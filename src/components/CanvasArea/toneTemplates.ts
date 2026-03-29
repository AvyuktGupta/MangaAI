// src/components/CanvasArea/toneTemplates.ts - 8
import { ToneTemplate, ToneElement, BlendMode } from '../../types';

// ==========================================
// Practical tone templates (8
// ==========================================

// === 1. 60===
export const tone_dot_60: ToneTemplate = {
  id: 'shadow_soft_60',
  name: '60',
  type: 'halftone',
  pattern: 'dots_60',
  density: 0.4,
  opacity: 0.8,
  rotation: 45,
  scale: 1.0,
  blendMode: 'multiply',
  contrast: 1.1,
  brightness: 0,
  description: '',
  category: 'shadow',
  preview: { backgroundColor: '#ffffff', showPattern: true }
};

// === 2. 80===
export const tone_dot_80: ToneTemplate = {
  id: 'shadow_medium_80',
  name: '80',
  type: 'halftone',
  pattern: 'dots_85',
  density: 0.5,
  opacity: 0.9,
  rotation: 45,
  scale: 1.0,
  blendMode: 'multiply',
  contrast: 1.2,
  brightness: -0.1,
  description: '',
  category: 'shadow',
  preview: { backgroundColor: '#ffffff', showPattern: true }
};

// === 3. 100===
export const tone_dot_100: ToneTemplate = {
  id: 'shadow_dark_100',
  name: '100',
  type: 'halftone',
  pattern: 'dots_120',
  density: 0.7,
  opacity: 1.0,
  rotation: 45,
  scale: 1.0,
  blendMode: 'multiply',
  contrast: 1.3,
  brightness: -0.2,
  description: '',
  category: 'shadow',
  preview: { backgroundColor: '#ffffff', showPattern: true }
};

// === 4. ===
export const tone_line_diagonal: ToneTemplate = {
  id: 'shadow_diagonal_lines',
  name: '',
  type: 'lines',
  pattern: 'lines_cross',
  density: 0.6,
  opacity: 0.8,
  rotation: 0,
  scale: 0.8,
  blendMode: 'multiply',
  contrast: 1.0,
  brightness: 0,
  description: '',
  category: 'shadow',
  preview: { backgroundColor: '#ffffff', showPattern: true }
};

// === 5. ===
export const tone_gradient: ToneTemplate = {
  id: 'bg_sky_gradient',
  name: '',
  type: 'gradient',
  pattern: 'gradient_linear',
  density: 0.2,
  opacity: 0.3,
  rotation: 90,
  scale: 2.0,
  blendMode: 'multiply',
  contrast: 0.7,
  brightness: 0.2,
  description: '',
  category: 'background',
  preview: { backgroundColor: '#87ceeb', showPattern: true }
};

// === 6. ===
export const tone_noise: ToneTemplate = {
  id: 'texture_rough',
  name: '',
  type: 'noise',
  pattern: 'noise_coarse',
  density: 0.5,
  opacity: 0.6,
  rotation: 0,
  scale: 0.8,
  blendMode: 'multiply',
  contrast: 1.2,
  brightness: -0.1,
  description: '',
  category: 'texture',
  preview: { backgroundColor: '#ffffff', showPattern: true }
};

// === 7. ===
export const tone_highlight: ToneTemplate = {
  id: 'highlight_soft',
  name: '',
  type: 'gradient',
  pattern: 'gradient_radial',
  density: 0.3,
  opacity: 0.6,
  rotation: 0,
  scale: 1.2,
  blendMode: 'screen',
  contrast: 0.8,
  brightness: 0.3,
  description: '',
  category: 'highlight',
  preview: { backgroundColor: '#666666', showPattern: true }
};

// === 8. ===
export const tone_speed_effect: ToneTemplate = {
  id: 'effect_speed',
  name: '',
  type: 'lines',
  pattern: 'speed_lines',
  density: 0.7,
  opacity: 0.8,
  rotation: 0,
  scale: 1.0,
  blendMode: 'multiply',
  contrast: 1.3,
  brightness: 0,
  description: '',
  category: 'effect',
  preview: { backgroundColor: '#ffffff', showPattern: true }
};

// ==========================================
// 8
// ==========================================
export const allToneTemplates: ToneTemplate[] = [
  tone_dot_60,
  tone_dot_80, 
  tone_dot_100,
  tone_line_diagonal,
  tone_gradient,
  tone_noise,
  tone_highlight,
  tone_speed_effect
];

// 4
export const shadowToneTemplates: ToneTemplate[] = [
  tone_dot_60,
  tone_dot_80,
  tone_dot_100,
  tone_line_diagonal
];

// 1
export const backgroundToneTemplates: ToneTemplate[] = [
  tone_gradient
];

// 1
export const textureToneTemplates: ToneTemplate[] = [
  tone_noise
];

// 1
export const highlightToneTemplates: ToneTemplate[] = [
  tone_highlight
];

// 1
export const effectToneTemplates: ToneTemplate[] = [
  tone_speed_effect
];

// Category Tone Template
export const toneTemplatesByCategory = {
  shadow: shadowToneTemplates,
  background: backgroundToneTemplates,
  texture: textureToneTemplates,
  highlight: highlightToneTemplates,
  effect: effectToneTemplates,
};

/**
 * Functions that create tone elements from templates
 */
export const createToneFromTemplate = (
  template: ToneTemplate,
  panelId: number,
  x: number = 0,
  y: number = 0,
  width: number = 1,
  height: number = 1
): ToneElement => {
  return {
    id: `tone_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    panelId,
    type: template.type,
    pattern: template.pattern,
    x,
    y,
    width,
    height,
    density: template.density,
    opacity: template.opacity,
    rotation: template.rotation,
    scale: template.scale,
    blendMode: template.blendMode,
    contrast: template.contrast,
    brightness: template.brightness,
    invert: false,
    maskEnabled: false,
    maskShape: 'rectangle',
    maskFeather: 0,
    selected: false,
    zIndex: 0,
    isGlobalPosition: false,
    visible: true,
  };
};

/**
 * 5
 */
export const getToneCategoryInfo = () => ({
  shadow: { name: '', icon: '🌑', description: '' },
  background: { name: '', icon: '🌄', description: '' },
  texture: { name: '', icon: '🧱', description: '' },
  highlight: { name: '', icon: '✨', description: '' },
  effect: { name: '', icon: '⚡', description: '' },
});

/**
 * 
 */
export const getDefaultToneSettings = () => ({
  density: 0.5,
  opacity: 0.7,
  rotation: 0,
  scale: 1.0,
  blendMode: 'multiply' as BlendMode,
  contrast: 1.0,
  brightness: 0,
  invert: false,
  maskEnabled: false,
  maskShape: 'rectangle' as const,
  maskFeather: 0,
});