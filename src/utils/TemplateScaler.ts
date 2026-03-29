// src/utils/TemplateScaler.ts - Dynamic Template Generation System
import { Panel, CanvasSettings } from '../types';
import { templates } from '../components/CanvasArea/templates';

/**
 * Base template size (expected size for fixed templates)
 */
const BASE_CANVAS_SIZE = {
  width: 800,
  height: 600
};

/**
 * 
 */
const MARGINS = {
  outer: 20,  // 
  gap: 10     // 
};

/**
 * Scale template to current canvas size
 */
export const scaleTemplateToCanvas = (
  templateKey: string, 
  canvasSettings: CanvasSettings
): Panel[] => {
  const template = templates[templateKey];
  if (!template) {
    console.error(`Template "${templateKey}" not found`);
    return [];
  }

  const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
  
  // 
  const scaleX = pixelWidth / BASE_CANVAS_SIZE.width;
  const scaleY = pixelHeight / BASE_CANVAS_SIZE.height;
  
  console.group('📐 Template Scaling Applied');
  console.log('Template:', templateKey);
  console.log('Base canvas:', BASE_CANVAS_SIZE);
  console.log('Target canvas:', { width: pixelWidth, height: pixelHeight });
  console.log('Scale factors:', { 
    scaleX: `${(scaleX * 100).toFixed(1)}%`, 
    scaleY: `${(scaleY * 100).toFixed(1)}%` 
  });
  
  // 
  const scaledPanels = template.panels.map(panel => {
    const scaledPanel = {
      ...panel,
      x: Math.round(panel.x * scaleX),
      y: Math.round(panel.y * scaleY),
      width: Math.round(panel.width * scaleX),
      height: Math.round(panel.height * scaleY)
    };
    
    console.log(`Panel ${panel.id}:`, {
      original: { x: panel.x, y: panel.y, width: panel.width, height: panel.height },
      scaled: { x: scaledPanel.x, y: scaledPanel.y, width: scaledPanel.width, height: scaledPanel.height }
    });
    
    return scaledPanel;
  });
  
  console.log(`✅ Scaled ${scaledPanels.length} panels for template "${templateKey}"`);
  console.groupEnd();
  
  return scaledPanels;
};

/**
 * Dynamic template generation optimized for paper size (for future use)
 */
export const generateDynamicTemplate = (
  templateKey: string,
  canvasSettings: CanvasSettings
): Panel[] => {
  const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
  const workWidth = pixelWidth - (MARGINS.outer * 2);
  const workHeight = pixelHeight - (MARGINS.outer * 2);
  
  switch (templateKey) {
    case '4koma_dynamic':
      return generate4KomaTemplate(workWidth, workHeight);
    case 'grid_2x2_dynamic':
      return generate2x2GridTemplate(workWidth, workHeight);
    default:
      // Fallback: Scale Existing Template
      return scaleTemplateToCanvas(templateKey, canvasSettings);
  }
};

/**
 * 4Dynamic generation of comic strip templates
 */
const generate4KomaTemplate = (workWidth: number, workHeight: number): Panel[] => {
  const panelHeight = (workHeight - (MARGINS.gap * 3)) / 4;
  
  return [
    { id: 1, x: MARGINS.outer, y: MARGINS.outer, width: workWidth, height: panelHeight },
    { id: 2, x: MARGINS.outer, y: MARGINS.outer + panelHeight + MARGINS.gap, width: workWidth, height: panelHeight },
    { id: 3, x: MARGINS.outer, y: MARGINS.outer + (panelHeight + MARGINS.gap) * 2, width: workWidth, height: panelHeight },
    { id: 4, x: MARGINS.outer, y: MARGINS.outer + (panelHeight + MARGINS.gap) * 3, width: workWidth, height: panelHeight }
  ];
};

/**
 * 2×2Dynamic Generation of Grid Templates
 */
const generate2x2GridTemplate = (workWidth: number, workHeight: number): Panel[] => {
  const panelWidth = (workWidth - MARGINS.gap) / 2;
  const panelHeight = (workHeight - MARGINS.gap) / 2;
  
  return [
    { id: 1, x: MARGINS.outer, y: MARGINS.outer, width: panelWidth, height: panelHeight },
    { id: 2, x: MARGINS.outer + panelWidth + MARGINS.gap, y: MARGINS.outer, width: panelWidth, height: panelHeight },
    { id: 3, x: MARGINS.outer, y: MARGINS.outer + panelHeight + MARGINS.gap, width: panelWidth, height: panelHeight },
    { id: 4, x: MARGINS.outer + panelWidth + MARGINS.gap, y: MARGINS.outer + panelHeight + MARGINS.gap, width: panelWidth, height: panelHeight }
  ];
};

/**
 * 
 */
export const getTemplateInfo = (templateKey: string) => {
  const template = templates[templateKey];
  if (!template) return null;
  
  return {
    key: templateKey,
    panelCount: template.panels.length,
    baseSize: BASE_CANVAS_SIZE
  };
};

/**
 * For Debugging: Validating Scale Transformations
 */
export const validateScaledTemplate = (
  originalPanels: Panel[],
  scaledPanels: Panel[],
  canvasSettings: CanvasSettings
): boolean => {
  const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
  
  // 
  if (originalPanels.length !== scaledPanels.length) {
    console.error('Panel count mismatch');
    return false;
  }
  
  // 
  for (const panel of scaledPanels) {
    if (panel.x < 0 || panel.y < 0 || 
        panel.x + panel.width > pixelWidth || 
        panel.y + panel.height > pixelHeight) {
      console.warn('Panel extends beyond canvas:', panel);
    }
  }
  
  return true;
};