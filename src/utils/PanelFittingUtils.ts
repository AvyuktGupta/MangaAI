// src/utils/PanelFittingUtils.ts - Paste Frame Function Utility
import { Panel, ToneElement, EffectElement, BackgroundElement } from '../types';

/**
 * 
 */
export interface ElementPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 
 */
export interface FitOptions {
  padding?: number;           // : 0.05 = 5%
  maintainAspectRatio?: boolean; // Maintain Aspect Ratio (Default: false
  centerPosition?: boolean;   // : true
  maxScale?: number;         // : 0.9 = 90%
  minScale?: number;         // : 0.1 = 10%
}

/**
 * 
 */
const DEFAULT_FIT_OPTIONS: Required<FitOptions> = {
  padding: 0.05,              // 5%
  maintainAspectRatio: false,
  centerPosition: true,
  maxScale: 0.9,              // 90%
  minScale: 0.1,              // 10%
};

/**
 * Relative coordinate system in the panel (0.0 - 1.0
 */
export class PanelFittingUtils {
  
  /**
   * 🎨 Fit tone to panel
   */
  static fitToneToPanel(
    panel: Panel,
    options: FitOptions = {}
  ): ElementPosition {
    const opts = { ...DEFAULT_FIT_OPTIONS, ...options };
    
    // Default size for tones (panel60%
    const defaultSize = {
      width: 0.6,
      height: 0.6
    };
    
    return this.calculateFitPosition(defaultSize, opts);
  }

  /**
   * ⚡ Fit effect lines to panels (optimized by effect line type)
   */
  static fitEffectToPanel(
    panel: Panel,
    effectType: string,
    options: FitOptions = {}
  ): ElementPosition {
    const opts = { ...DEFAULT_FIT_OPTIONS, ...options };
    
    // Default size by effect line type
    const getEffectSize = (type: string) => {
      switch (type) {
        case 'speed':
          return { width: 0.8, height: 0.3 }; // 
        case 'focus':
          return { width: 0.9, height: 0.9 }; // 
        case 'explosion':
          return { width: 0.7, height: 0.7 }; // 
        case 'flash':
          return { width: 0.6, height: 0.6 }; // 
        default:
          return { width: 0.6, height: 0.6 }; // 
      }
    };
    
    const effectSize = getEffectSize(effectType);
    return this.calculateFitPosition(effectSize, opts);
  }

  /**
   * 🖼️ Fit background to panel
   */
  static fitBackgroundToPanel(
    panel: Panel,
    options: FitOptions = {}
  ): ElementPosition {
    // Cover the whole panel with a little margin in the background
    const opts = { 
      ...DEFAULT_FIT_OPTIONS, 
      padding: -0.02,    // 2%
      maxScale: 1.02,    // 102%
      ...options 
    };
    
    const backgroundSize = {
      width: 1.0,        // 
      height: 1.0
    };
    
    return this.calculateFitPosition(backgroundSize, opts);
  }

  /**
   * 📐 
   */
  private static calculateFitPosition(
    elementSize: { width: number; height: number },
    options: Required<FitOptions>
  ): ElementPosition {
    const { padding, centerPosition, maxScale, minScale } = options;
    
    // 
    const availableWidth = 1.0 - (padding * 2);
    const availableHeight = 1.0 - (padding * 2);
    
    // 
    let finalWidth = Math.max(minScale, Math.min(elementSize.width, maxScale));
    let finalHeight = Math.max(minScale, Math.min(elementSize.height, maxScale));
    
    // Adjust to fit within the available area
    if (finalWidth > availableWidth) {
      const scale = availableWidth / finalWidth;
      finalWidth = availableWidth;
      finalHeight = finalHeight * scale;
    }
    
    if (finalHeight > availableHeight) {
      const scale = availableHeight / finalHeight;
      finalHeight = availableHeight;
      finalWidth = finalWidth * scale;
    }
    
    // 
    let x: number, y: number;
    
    if (centerPosition) {
      // 
      x = padding + (availableWidth - finalWidth) / 2;
      y = padding + (availableHeight - finalHeight) / 2;
    } else {
      // 
      x = padding;
      y = padding;
    }
    
    return {
      x: Math.max(0, Math.min(x, 1 - finalWidth)),
      y: Math.max(0, Math.min(y, 1 - finalHeight)),
      width: finalWidth,
      height: finalHeight
    };
  }

  /**
   * 🔄 
   */
  static findOptimalPosition(
    panel: Panel,
    newElementSize: { width: number; height: number },
    existingElements: ElementPosition[] = [],
    options: FitOptions = {}
  ): ElementPosition {
    const basePosition = this.calculateFitPosition(newElementSize, {
      ...DEFAULT_FIT_OPTIONS,
      ...options
    });
    
    // 
    const hasOverlap = (pos: ElementPosition) => {
      return existingElements.some(existing => 
        !(pos.x + pos.width <= existing.x ||
          existing.x + existing.width <= pos.x ||
          pos.y + pos.height <= existing.y ||
          existing.y + existing.height <= pos.y)
      );
    };
    
    // Return as is if there is no overlap
    if (!hasOverlap(basePosition)) {
      return basePosition;
    }
    
    // Try a slightly shifted position if there is an overlap
    const offsets = [
      { x: 0.1, y: 0 },     // 
      { x: -0.1, y: 0 },    // 
      { x: 0, y: 0.1 },     // 
      { x: 0, y: -0.1 },    // 
      { x: 0.1, y: 0.1 },   // 
      { x: -0.1, y: -0.1 }, // 
      { x: 0.1, y: -0.1 },  // 
      { x: -0.1, y: 0.1 },  // 
    ];
    
    for (const offset of offsets) {
      const testPosition = {
        x: Math.max(0, Math.min(basePosition.x + offset.x, 1 - basePosition.width)),
        y: Math.max(0, Math.min(basePosition.y + offset.y, 1 - basePosition.height)),
        width: basePosition.width,
        height: basePosition.height
      };
      
      if (!hasOverlap(testPosition)) {
        return testPosition;
      }
    }
    
    // Returns the base position if the correct position cannot be found
    return basePosition;
  }

  /**
   * 📊 
   */
  static checkElementDensity(
    panel: Panel,
    elements: ElementPosition[]
  ): {
    coverage: number;      //  (0.0 - 1.0)
    density: 'low' | 'medium' | 'high' | 'crowded';
    canFitMore: boolean;   // 
  } {
    if (elements.length === 0) {
      return { coverage: 0, density: 'low', canFitMore: true };
    }
    
    // Calculate Actual Cover Area Considering Duplicates
    const totalArea = this.calculateTotalCoverage(elements);
    
    let density: 'low' | 'medium' | 'high' | 'crowded';
    let canFitMore: boolean;
    
    if (totalArea < 0.3) {
      density = 'low';
      canFitMore = true;
    } else if (totalArea < 0.6) {
      density = 'medium';
      canFitMore = true;
    } else if (totalArea < 0.8) {
      density = 'high';
      canFitMore = true;
    } else {
      density = 'crowded';
      canFitMore = false;
    }
    
    return { coverage: totalArea, density, canFitMore };
  }

  /**
   * 🧮 Calculation of total cover area considering duplication
   */
  private static calculateTotalCoverage(elements: ElementPosition[]): number {
    if (elements.length === 0) return 0;
    if (elements.length === 1) return elements[0].width * elements[0].height;
    
    // Simple Implementation: Returns the largest element area
    //  Union-Find 
    return Math.max(...elements.map(el => el.width * el.height));
  }

  /**
   * 🎯 Smart placement: Optimized by type
   */
  static smartPlacement(
    panel: Panel,
    elementType: 'tone' | 'effect' | 'background',
    elementSubtype: string = '',
    existingElements: {
      tones: ToneElement[];
      effects: EffectElement[];
      backgrounds: BackgroundElement[];
    } = { tones: [], effects: [], backgrounds: [] },
    options: FitOptions = {}
  ): ElementPosition {
    
    // 
    const existingPositions: ElementPosition[] = [
      ...existingElements.tones.map(t => ({ x: t.x, y: t.y, width: t.width, height: t.height })),
      ...existingElements.effects.map(e => ({ x: e.x, y: e.y, width: e.width, height: e.height })),
      ...existingElements.backgrounds.map(b => ({ x: b.x, y: b.y, width: b.width, height: b.height }))
    ];
    
    // 
    const densityInfo = this.checkElementDensity(panel, existingPositions);
    
    if (!densityInfo.canFitMore) {
      console.warn(`⚠️ ${panel.id} (: ${Math.round(densityInfo.coverage * 100)}%)`);
    }
    
    // 
    let basePosition: ElementPosition;
    
    switch (elementType) {
      case 'tone':
        basePosition = this.fitToneToPanel(panel, options);
        break;
      case 'effect':
        basePosition = this.fitEffectToPanel(panel, elementSubtype, options);
        break;
      case 'background':
        basePosition = this.fitBackgroundToPanel(panel, options);
        break;
      default:
        basePosition = this.calculateFitPosition({ width: 0.5, height: 0.5 }, {
          ...DEFAULT_FIT_OPTIONS,
          ...options
        });
    }
    
    // 
    const optimalPosition = this.findOptimalPosition(
      panel, 
      { width: basePosition.width, height: basePosition.height },
      existingPositions,
      options
    );
    
    console.log(`✨ ${elementType}: ${panel.id} (${Math.round(optimalPosition.x * 100)}, ${Math.round(optimalPosition.y * 100)}) (${Math.round(optimalPosition.width * 100)}%, ${Math.round(optimalPosition.height * 100)}%)`);
    
    return optimalPosition;
  }

  /**
   * 📏 Check if the element fits in the panel
   */
  static isElementInsidePanel(
    element: ElementPosition,
    tolerance: number = 0.01
  ): boolean {
    return (
      element.x >= -tolerance &&
      element.y >= -tolerance &&
      element.x + element.width <= 1 + tolerance &&
      element.y + element.height <= 1 + tolerance
    );
  }

  /**
   * 🔧 Force adjustment of elements within panel boundaries
   */
  static constrainToPanel(element: ElementPosition): ElementPosition {
    return {
      x: Math.max(0, Math.min(element.x, 1 - element.width)),
      y: Math.max(0, Math.min(element.y, 1 - element.height)),
      width: Math.max(0.05, Math.min(element.width, 1)), // 5%
      height: Math.max(0.05, Math.min(element.height, 1))
    };
  }

  /**
   * 📐  ↔ 
   */
  static absoluteToRelative(
    absolutePos: { x: number; y: number; width: number; height: number },
    panel: Panel
  ): ElementPosition {
    return {
      x: (absolutePos.x - panel.x) / panel.width,
      y: (absolutePos.y - panel.y) / panel.height,
      width: absolutePos.width / panel.width,
      height: absolutePos.height / panel.height
    };
  }

  static relativeToAbsolute(
    relativePos: ElementPosition,
    panel: Panel
  ): { x: number; y: number; width: number; height: number } {
    return {
      x: panel.x + relativePos.x * panel.width,
      y: panel.y + relativePos.y * panel.height,
      width: relativePos.width * panel.width,
      height: relativePos.height * panel.height
    };
  }
}

export default PanelFittingUtils;