// src/utils/RatioTemplateScaler.ts - Ratio Based Template Scaler
import { Panel, CanvasSettings } from '../types';
import { ratioTemplates } from '../components/CanvasArea/ratioTemplates';

/**
 * Apply ratio-based template to current canvas size
 */
export const applyRatioTemplate = (
  templateKey: string, 
  canvasSettings: CanvasSettings
): Panel[] => {
  const template = ratioTemplates[templateKey];
  if (!template) {
    console.error(`Ratio template "${templateKey}" not found`);
    return [];
  }

  const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
  
  // 
  
  // Convert ratio to actual pixel coordinates
  const scaledPanels = template.panels.map(panel => {
    const scaledPanel = {
      ...panel,
      x: Math.round(panel.x * pixelWidth),
      y: Math.round(panel.y * pixelHeight),
      width: Math.round(panel.width * pixelWidth),
      height: Math.round(panel.height * pixelHeight)
    };
    
    // 
    
    return scaledPanel;
  });
  
  // 
  // 
  
  return scaledPanels;
};

/**
 * 
 */
export const getRatioTemplateInfo = (templateKey: string) => {
  const template = ratioTemplates[templateKey];
  if (!template) return null;
  
  return {
    key: templateKey,
    panelCount: template.panels.length,
    isRatioBased: true
  };
};

/**
 * Get a list of available ratio templates
 */
export const getAvailableRatioTemplates = () => {
  return Object.keys(ratioTemplates);
};
