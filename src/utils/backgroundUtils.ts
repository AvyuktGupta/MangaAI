// src/utils/backgroundUtils.ts - infer integrated background labels
import { BackgroundElement } from '../types';

/** Guess a human-readable background name from panel background elements */
export const getIntegratedBackgroundName = (backgrounds: BackgroundElement[], panelId: number): string => {
  const panelBackgrounds = backgrounds.filter(bg => bg.panelId === panelId);
  if (panelBackgrounds.length === 0) return '';

  // Pattern heuristics
  const hasGradientBlue = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientColors?.includes('#87CEEB')
  );
  
  const hasBlackboard = panelBackgrounds.some(bg => 
    bg.type === 'solid' && 
    bg.solidColor === '#2F4F2F'
  );
  
  const hasForestPattern = panelBackgrounds.some(bg => 
    bg.type === 'pattern' && 
    bg.patternColor === '#2D5016'
  );

  const hasSunsetGradient = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientColors?.includes('#FF6B6B')
  );

  const hasLivingRoomColor = panelBackgrounds.some(bg => 
    bg.type === 'solid' && 
    bg.solidColor === '#F5F5DC'
  );

  const hasBedroomGradient = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientColors?.includes('#FFB6C1')
  );

  const hasKitchenColor = panelBackgrounds.some(bg => 
    bg.type === 'solid' && 
    bg.solidColor === '#FFFAF0'
  );

  const hasClassroomColor = panelBackgrounds.some(bg => 
    bg.type === 'solid' && 
    bg.solidColor === '#F0F8FF'
  );

  const hasHallwayGradient = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientColors?.includes('#E6E6FA')
  );

  const hasLibraryColor = panelBackgrounds.some(bg => 
    bg.type === 'solid' && 
    bg.solidColor === '#FDF5E6'
  );

  const hasStreetGradient = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientColors?.includes('#87CEEB') && 
    panelBackgrounds.some(bg2 => bg2.solidColor === '#696969')
  );

  const hasParkGreen = panelBackgrounds.some(bg => 
    bg.type === 'solid' && 
    bg.solidColor === '#90EE90'
  );

  const hasHappyRadial = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientType === 'radial' &&
    bg.gradientColors?.includes('#FFD700')
  );

  const hasSadGradient = panelBackgrounds.some(bg => 
    bg.type === 'gradient' && 
    bg.gradientColors?.includes('#2F4F4F')
  );

  if (hasGradientBlue && panelBackgrounds.some(bg => bg.type === 'pattern')) return 'Blue sky';
  if (hasSunsetGradient) return 'Sunset';
  if (hasForestPattern) return 'Forest';
  if (hasBlackboard) return 'Classroom';
  if (hasLivingRoomColor && panelBackgrounds.length > 1) return 'Living room';
  if (hasBedroomGradient) return 'Bedroom';
  if (hasKitchenColor && panelBackgrounds.some(bg => bg.type === 'pattern')) return 'Kitchen';
  if (hasClassroomColor && hasBlackboard) return 'Classroom';
  if (hasHallwayGradient) return 'Hallway';
  if (hasLibraryColor && panelBackgrounds.some(bg => bg.type === 'pattern')) return 'Library';
  if (hasStreetGradient) return 'Street';
  if (hasParkGreen) return 'Park';
  if (hasHappyRadial) return 'Bright';
  if (hasSadGradient) return 'Moody';

  const firstBg = panelBackgrounds[0];
  if (panelBackgrounds.length === 1 && firstBg.type === 'solid') {
    if (firstBg.solidColor === '#FFFFFF') return 'White';
    if (firstBg.solidColor === '#000000') return 'Black';
  }

  return 'Custom background';
};

/** Whether two background elements belong to the same applied group */
export const isSameBackgroundGroup = (
  bg1: BackgroundElement, 
  bg2: BackgroundElement,
  backgrounds: BackgroundElement[]
): boolean => {
  // Same panel and creation batch (id timestamp)
  if (bg1.panelId !== bg2.panelId) return false;
  
  const timestamp1 = bg1.id.split('_')[1];
  const timestamp2 = bg2.id.split('_')[1];
  
  return timestamp1 === timestamp2;
};

/** First-created background element in a panel (main layer) */
export const getMainBackgroundElement = (
  panelBackgrounds: BackgroundElement[]
): BackgroundElement | null => {
  if (panelBackgrounds.length === 0) return null;
  
  // Sort by id timestamp and index
  const sorted = panelBackgrounds.sort((a, b) => {
    const aTimestamp = parseInt(a.id.split('_')[1]);
    const bTimestamp = parseInt(b.id.split('_')[1]);
    const aIndex = parseInt(a.id.split('_')[2]);
    const bIndex = parseInt(b.id.split('_')[2]);
    
    if (aTimestamp !== bTimestamp) {
      return aTimestamp - bTimestamp;
    }
    return aIndex - bIndex;
  });
  
  return sorted[0];
};

/** Display label for canvas (prefers integrated name) */
export const getCanvasBackgroundDisplayName = (
  backgroundElement: BackgroundElement,
  allBackgrounds: BackgroundElement[]
): string => {
  const integratedName = getIntegratedBackgroundName(allBackgrounds, backgroundElement.panelId);
  
  if (integratedName && integratedName !== 'Custom background') {
    return integratedName;
  }

  switch (backgroundElement.type) {
    case 'solid': return 'Solid';
    case 'gradient': return 'Gradient';
    case 'pattern': return 'Pattern';
    case 'image': return 'Image';
    default: return 'Background';
  }
};

/** Swatch color for UI preview */
export const getBackgroundPreviewColor = (backgroundElement: BackgroundElement): string => {
  if (backgroundElement.type === 'solid') {
    return backgroundElement.solidColor || '#CCCCCC';
  } else if (backgroundElement.type === 'gradient') {
    return backgroundElement.gradientColors?.[0] || '#CCCCCC';
  } else if (backgroundElement.type === 'pattern') {
    return backgroundElement.patternColor || '#CCCCCC';
  }
  return '#CCCCCC';
};