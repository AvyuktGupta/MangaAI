// src/components/CanvasArea/effectTemplates.ts - 5
import { EffectTemplate } from '../../types';

export const effectTemplates: EffectTemplate[] = [
  // === 1. ===
  {
    id: 'speed_horizontal',
    name: '',
    type: 'speed',
    direction: 'horizontal',
    intensity: 0.8,
    density: 0.6,
    length: 0.9,
    angle: 0,
    color: '#000000',
    opacity: 0.7,
    blur: 1,
    description: '',
    category: 'action'
  },

  // === 2. ===
  {
    id: 'focus_center',
    name: '',
    type: 'focus',
    direction: 'radial',
    intensity: 0.9,
    density: 0.8,
    length: 0.8,
    angle: 0,
    color: '#000000',
    opacity: 0.6,
    blur: 0,
    description: 'Expressions of attention and surprise (most important)',
    category: 'emotion'
  },

  // === 3.  ===
  {
    id: 'explosion_intense',
    name: '',
    type: 'explosion',
    direction: 'radial',
    intensity: 1.0,
    density: 0.9,
    length: 1.0,
    angle: 0,
    color: '#000000',
    opacity: 0.9,
    blur: 0,
    description: '',
    category: 'action'
  },

  // === 4.  ===
  {
    id: 'flash_bright',
    name: '',
    type: 'flash',
    direction: 'radial',
    intensity: 0.8,
    density: 0.3,
    length: 0.9,
    angle: 0,
    color: '#FFFFFF',
    opacity: 0.8,
    blur: 3,
    description: '',
    category: 'special'
  },

  // === 5.  ===
  {
    id: 'wind_horizontal',
    name: '',
    type: 'speed',
    direction: 'horizontal',
    intensity: 0.4,
    density: 0.3,
    length: 0.6,
    angle: 15,
    color: '#666666',
    opacity: 0.5,
    blur: 2,
    description: '',
    category: 'environment'
  }
];

// Get Effect Line Template by Category
export const getEffectTemplatesByCategory = (category: EffectTemplate['category']): EffectTemplate[] => {
  return effectTemplates.filter(template => template.category === category);
};

// Get template by effect line type
export const getEffectTemplatesByType = (type: EffectTemplate['type']): EffectTemplate[] => {
  return effectTemplates.filter(template => template.type === type);
};

// EffectElement
export const createEffectFromTemplate = (
  template: EffectTemplate,
  x: number,
  y: number,
  panelId: number = 1,
  width: number = 200,
  height: number = 200
): import('../../types').EffectElement => {
  return {
    id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    panelId,
    type: template.type,
    x,
    y,
    width,
    height,
    direction: template.direction,
    intensity: template.intensity,
    density: template.density,
    length: template.length,
    angle: template.angle,
    color: template.color,
    opacity: template.opacity,
    blur: template.blur,
    centerX: template.direction === 'radial' ? x + width / 2 : undefined,
    centerY: template.direction === 'radial' ? y + height / 2 : undefined,
    selected: false,
    zIndex: 10,
    isGlobalPosition: false
  };
};