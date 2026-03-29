// src/components/CanvasComponent/hooks/useCanvasDrawing.ts - ToneRenderer
import { RefObject, useEffect } from 'react';
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement, SnapSettings } from '../../../types';
import { CanvasState } from './useCanvasState';
import { CanvasDrawing } from '../../CanvasArea/CanvasDrawing';
import { BubbleRenderer } from '../../CanvasArea/renderers/BubbleRenderer';
import { CharacterRenderer } from '../../CanvasArea/renderers/CharacterRenderer/CharacterRenderer';
import { BackgroundRenderer } from '../../CanvasArea/renderers/BackgroundRenderer';
import { ToneRenderer } from '../../CanvasArea/renderers/ToneRenderer'; // 🆕 ToneRenderer

// 1.  - getCharacterDisplayName
export interface CanvasDrawingHookProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  state: CanvasState;
  panels: Panel[];
  characters: Character[];
  speechBubbles: SpeechBubble[];
  backgrounds: BackgroundElement[];
  selectedBackground?: BackgroundElement | null;
  // 🆕 
  effects: EffectElement[];
  selectedEffect?: EffectElement | null;
  // 🆕 
  tones: ToneElement[];
  selectedTone?: ToneElement | null;
  isPanelEditMode: boolean;
  snapSettings: SnapSettings;
  // 🆕 Added character name retrieval function
  getCharacterDisplayName?: (character: Character) => string;
  
  // 🆕 
  swapPanel1?: number | null;
  swapPanel2?: number | null;
}

/**
 * Canvashook+
 * :  →  →  →  →  →  →  →  → UI
 */
// 2. useCanvasDrawing
export const useCanvasDrawing = ({
  canvasRef,
  state,
  panels,
  characters,
  speechBubbles,
  backgrounds,
  selectedBackground,
  // 🆕 
  effects,
  selectedEffect,
  // 🆕 
  tones,
  selectedTone,
  isPanelEditMode,
  snapSettings,
  getCharacterDisplayName, // 🆕 
  swapPanel1, // 🆕 1
  swapPanel2, // 🆕 2
}: CanvasDrawingHookProps) => {

  /**
   *  zIndex 
   */
  const drawBackgrounds = (ctx: CanvasRenderingContext2D) => {
    panels.forEach(panel => {
      // zIndex
      const panelBackgrounds = backgrounds
        .filter(bg => bg.panelId === panel.id)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      // 
      panelBackgrounds.forEach(background => {
        const isSelected = selectedBackground?.id === background.id;
        
        BackgroundRenderer.renderBackground(
          ctx,
          background,
          panel,
          isSelected
        );
      });
    });
  };

  /**
   * 🆕 Draw tone (after background, before effect line)- ToneRenderer
   */
  const drawTones = (ctx: CanvasRenderingContext2D) => {
    panels.forEach(panel => {
      // Get the tone elements of each panel (zIndex
      const panelTones = tones
        .filter(tone => tone.panelId === panel.id && tone.visible)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      // Draw the tones in the panel in order (ToneRenderer
      panelTones.forEach(tone => {
        const isSelected = selectedTone?.id === tone.id;
        
        // ✅ ToneRenderer.renderTone
        ToneRenderer.renderTone(ctx, tone, panel, isSelected);
      });
    });
  };

  /**
   * 🆕  zIndex 
   */
  const drawEffects = (ctx: CanvasRenderingContext2D) => {
    panels.forEach(panel => {
      // Obtain the effect line elements for each panel (zIndex
      const panelEffects = effects
        .filter(effect => effect.panelId === panel.id)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      // Draw effect lines in the panel sequentially
      panelEffects.forEach(effect => {
        const isSelected = selectedEffect?.id === effect.id;
        
        drawSingleEffect(ctx, effect, panel, isSelected);
      });
    });
  };

  /**
   * 🆕 
   */
  const drawSingleEffect = (
    ctx: CanvasRenderingContext2D,
    effect: EffectElement,
    panel: Panel,
    isSelected: boolean
  ) => {
    // 
    const absoluteX = panel.x + effect.x * panel.width;
    const absoluteY = panel.y + effect.y * panel.height;
    const absoluteWidth = effect.width * panel.width;
    const absoluteHeight = effect.height * panel.height;

    ctx.save();
    ctx.globalAlpha = effect.opacity;

    // 
    switch (effect.type) {
      case 'speed':
        drawSpeedLines(ctx, effect, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'focus':
        drawFocusLines(ctx, effect, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'explosion':
        drawExplosionLines(ctx, effect, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'flash':
        drawFlashLines(ctx, effect, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
    }

    ctx.restore();

    // 
    if (isSelected) {
      drawEffectSelection(ctx, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
    }
  };

  /**
   * 🆕 Speed line drawing (whole frame, naturally from the edge)
   */
  const drawSpeedLines = (
    ctx: CanvasRenderingContext2D,
    effect: EffectElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = Math.max(0.5, effect.intensity * 2);

    const lineCount = Math.floor(effect.density * 50);
    const baseLength = Math.min(width, height) * effect.length * 0.6;

    // 
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    for (let i = 0; i < lineCount; i++) {
      let x1, y1, x2, y2;

      if (effect.direction === 'horizontal') {
        //  - 
        const isFromLeft = Math.random() > 0.5;
        const yPos = y + height * 0.1 + Math.random() * height * 0.8; // 
        const lineLength = baseLength * (0.4 + Math.random() * 0.6);
        
        if (isFromLeft) {
          // 
          x1 = x - lineLength * 0.3; // 
          x2 = x1 + lineLength;
        } else {
          // 
          x1 = x + width + lineLength * 0.3; // 
          x2 = x1 - lineLength;
        }
        y1 = y2 = yPos;
      } else if (effect.direction === 'vertical') {
        //  - 
        const isFromTop = Math.random() > 0.5;
        const xPos = x + width * 0.1 + Math.random() * width * 0.8; // 
        const lineLength = baseLength * (0.4 + Math.random() * 0.6);
        
        if (isFromTop) {
          // 
          y1 = y - lineLength * 0.3; // 
          y2 = y1 + lineLength;
        } else {
          // 
          y1 = y + height + lineLength * 0.3; // 
          y2 = y1 - lineLength;
        }
        x1 = x2 = xPos;
      } else {
        //  - 
        const angleRad = (effect.angle * Math.PI) / 180;
        const lineLength = baseLength * (0.5 + Math.random() * 0.5);
        
        // Determine the starting position according to the angle orientation
        let startX, startY;
        const normalizedAngle = ((effect.angle % 360) + 360) % 360;
        
        if (normalizedAngle >= 315 || normalizedAngle < 45) {
          //  - 
          startX = x - 20 + Math.random() * 40;
          startY = y + Math.random() * height;
        } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
          //  - 
          startX = x + Math.random() * width;
          startY = y - 20 + Math.random() * 40;
        } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
          //  - 
          startX = x + width - 20 + Math.random() * 40;
          startY = y + Math.random() * height;
        } else {
          //  - 
          startX = x + Math.random() * width;
          startY = y + height - 20 + Math.random() * 40;
        }
        
        x1 = startX;
        y1 = startY;
        x2 = startX + Math.cos(angleRad) * lineLength;
        y2 = startY + Math.sin(angleRad) * lineLength;
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  /**
   * 🆕 Focus line drawing (radiation from the entire frame and four corners)
   */
  const drawFocusLines = (
    ctx: CanvasRenderingContext2D,
    effect: EffectElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = effect.color;

    const lineCount = Math.floor(effect.density * 60);
    // Set the focus point (the default is center, but you can also lean towards the edge)
    const focusX = x + width * (effect.centerX || 0.5);
    const focusY = y + height * (effect.centerY || 0.5);

    // 
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * 2 * Math.PI;
      
      // Calculate the edge of the frame in the direction of extending the line from the focus
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Calculate the distance from the focus to the end of the frame
      let endX, endY;
      const t1 = cos > 0 ? (x + width - focusX) / cos : cos < 0 ? (x - focusX) / cos : Infinity;
      const t2 = sin > 0 ? (y + height - focusY) / sin : sin < 0 ? (y - focusY) / sin : Infinity;
      const t = Math.min(Math.abs(t1), Math.abs(t2)) * effect.length;
      
      endX = focusX + cos * t;
      endY = focusY + sin * t;
      
      // 
      const startRadius = Math.min(width, height) * 0.05;
      const startX = focusX + cos * startRadius;
      const startY = focusY + sin * startRadius;

      // Adjust the thickness of the line according to the distance (the center is thick and the edges are thin)
      const distance = Math.sqrt((endX - focusX) ** 2 + (endY - focusY) ** 2);
      const maxDistance = Math.sqrt(width ** 2 + height ** 2) / 2;
      const lineWidth = Math.max(0.3, effect.intensity * 3 * (1 - distance / maxDistance));
      ctx.lineWidth = lineWidth;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    ctx.restore();
  };

  /**
   * 🆕 Explosion line drawing (intense radiation from the whole frame and center)
   */
  const drawExplosionLines = (
    ctx: CanvasRenderingContext2D,
    effect: EffectElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = Math.max(0.5, effect.intensity * 3);

    const lineCount = Math.floor(effect.density * 80);
    const centerX = x + width * (effect.centerX || 0.5);
    const centerY = y + height * (effect.centerY || 0.5);

    // 
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    for (let i = 0; i < lineCount; i++) {
      const angle = (i / lineCount) * 2 * Math.PI;
      
      // 
      const randomFactor = 0.7 + Math.random() * 0.6;
      const cos = Math.cos(angle) * randomFactor;
      const sin = Math.sin(angle) * randomFactor;
      
      // Line extending beyond the frame edge from the center
      const baseLength = Math.max(width, height) * effect.length;
      const length = baseLength * (0.8 + Math.random() * 0.5);
      
      const startRadius = Math.min(width, height) * 0.1 * Math.random();
      const x1 = centerX + cos * startRadius;
      const y1 = centerY + sin * startRadius;
      const x2 = centerX + cos * length;
      const y2 = centerY + sin * length;

      ctx.globalAlpha = effect.opacity * (0.6 + Math.random() * 0.4);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  };

  /**
   * 🆕 Flash line drawing (whole frame, cross + diagonal main ray)
   */
  const drawFlashLines = (
    ctx: CanvasRenderingContext2D,
    effect: EffectElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = effect.color;

    const centerX = x + width * (effect.centerX || 0.5);
    const centerY = y + height * (effect.centerY || 0.5);

    // 
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    // 8
    const mainDirections = [0, 45, 90, 135, 180, 225, 270, 315];
    mainDirections.forEach((angle) => {
      const angleRad = (angle * Math.PI) / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      
      // 
      const length = Math.max(width, height) * effect.length * 1.2;
      const x2 = centerX + cos * length;
      const y2 = centerY + sin * length;
      
      ctx.globalAlpha = effect.opacity * 0.9;
      ctx.lineWidth = Math.max(1, effect.intensity * 3);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // 
    const subLineCount = Math.floor(effect.density * 40);
    for (let i = 0; i < subLineCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const length = Math.max(width, height) * effect.length * (0.3 + Math.random() * 0.4);
      const x2 = centerX + Math.cos(angle) * length;
      const y2 = centerY + Math.sin(angle) * length;

      ctx.globalAlpha = effect.opacity * (0.2 + Math.random() * 0.3);
      ctx.lineWidth = Math.max(0.5, effect.intensity * 1);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  };

  /**
   * 🆕 
   */
  const drawEffectSelection = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.save();
    ctx.globalAlpha = 0.8;
    
    // 
    ctx.strokeStyle = '#007AFF';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x, y, width, height);
    
    // 
    const handleSize = 8;
    const handles = [
      { x: x - handleSize/2, y: y - handleSize/2 }, // 
      { x: x + width - handleSize/2, y: y - handleSize/2 }, // 
      { x: x - handleSize/2, y: y + height - handleSize/2 }, // 
      { x: x + width - handleSize/2, y: y + height - handleSize/2 }, // 
    ];
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#007AFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
      ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
    });
    
    ctx.restore();
  };

  /**
   * Draw handles for selected backgrounds
   */
  const drawBackgroundHandles = (ctx: CanvasRenderingContext2D) => {
    if (!selectedBackground) return;

    const panel = panels.find(p => p.id === selectedBackground.panelId);
    if (!panel) return;

    BackgroundRenderer.drawBackgroundHandles(
      ctx,
      selectedBackground,
      panel
    );
  };



  // src/components/CanvasComponent/hooks/useCanvasDrawing.ts 

  // useCanvasDrawing.ts  Canvas

  /**
   * 🆕 Canvas
   */
  const drawElementLabels = (ctx: CanvasRenderingContext2D) => {
    // 
    // 
    const drawnPanels = new Set<number>();
      backgrounds.forEach((bg) => {
    const panel = panels.find(p => p.id === bg.panelId);
    if (!panel || drawnPanels.has(panel.id)) return;
    
    drawnPanels.add(panel.id);

    // →
    let absoluteX, absoluteY, absoluteWidth, absoluteHeight;
    if (bg.x <= 1 && bg.y <= 1) {
      absoluteX = panel.x + (bg.x * panel.width);
      absoluteY = panel.y + (bg.y * panel.height);
      absoluteWidth = bg.width <= 1 ? bg.width * panel.width : bg.width;
      absoluteHeight = bg.height <= 1 ? bg.height * panel.height : bg.height;
    } else {
      absoluteX = bg.x;
      absoluteY = bg.y;
      absoluteWidth = bg.width;
      absoluteHeight = bg.height;
    }

    // Preferred background name with fallback
    let label = "🎨 ";
    if (bg.name) {
      label += bg.name;
    } else {
      switch (bg.type) {
        case 'solid':
          label += ``;
          break;
        case 'gradient':
          const gradientType = bg.gradientType === 'radial' ? '' : '';
          label += `${gradientType}`;
          break;
        case 'pattern':
          label += ``;
          break;
        case 'image':
          label += ``;
          break;
        default:
          label += bg.type;
      }
    }

    // 
    drawLabel(ctx, absoluteX + 10, absoluteY + 10, label, 'rgba(0, 0, 0, 0.8)', 150);
  });

    // 
    effects.forEach((effect) => {
      const panel = panels.find(p => p.id === effect.panelId);
      if (!panel) return;

      // 
      const absoluteX = panel.x + (effect.x * panel.width);
      const absoluteY = panel.y + (effect.y * panel.height);
      const absoluteWidth = effect.width * panel.width;
      const absoluteHeight = effect.height * panel.height;

      // 
      const typeNames = {
        'speed': '',
        'focus': '', 
        'explosion': '',
        'flash': ''
      };
      const directionNames = {
        'horizontal': '',
        'vertical': '',
        'radial': '',
        'custom': ''
      };
      
      const typeName = typeNames[effect.type] || effect.type;
      const directionName = directionNames[effect.direction] || effect.direction;
      const label = `⚡ ${typeName} (${directionName})`;

      // 
      drawLabel(ctx, absoluteX + 10, absoluteY + absoluteHeight - 34, label, 'rgba(255, 0, 0, 0.8)', 140);
    });

    // 
    tones.filter(tone => tone.visible !== false).forEach((tone) => {
      const panel = panels.find(p => p.id === tone.panelId);
      if (!panel) return;

      // 
      let absoluteX, absoluteY, absoluteWidth, absoluteHeight;
      if (tone.x <= 1 && tone.y <= 1) {
        absoluteX = panel.x + (tone.x * panel.width);
        absoluteY = panel.y + (tone.y * panel.height);
        absoluteWidth = tone.width <= 1 ? tone.width * panel.width : tone.width;
        absoluteHeight = tone.height <= 1 ? tone.height * panel.height : tone.height;
      } else {
        absoluteX = tone.x;
        absoluteY = tone.y;
        absoluteWidth = tone.width;
        absoluteHeight = tone.height;
      }

      // 
      const patternNames = {
        'dots_60': '60%',
        'dots_85': '85%',
        'dots_100': '100%',
        'dots_120': '120%',
        'dots_150': '150%',
        'lines_horizontal': '',
        'lines_vertical': '',
        'lines_diagonal': '',
        'lines_cross': '',
        'gradient_linear': '',
        'gradient_radial': '',
        'noise_fine': '',
        'noise_coarse': ''
      };
      
      const patternName = patternNames[tone.pattern as keyof typeof patternNames] || tone.pattern;
      const label = `🎯 ${patternName}`;

      // 
      drawLabel(ctx, absoluteX + absoluteWidth - 140, absoluteY + 10, label, 'rgba(0, 128, 255, 0.8)', 130);
    });
  };

  /**
   * 🆕 
   */
  const drawLabel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    bgColor: string,
    width: number = 120
  ) => {
    ctx.save();
    
    // 
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, 24);
    
    // 
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, 24);
    
    // 
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width/2, y + 12);
    
    ctx.restore();
  };
  /**
   * 
   */
  const showGrid = snapSettings.gridDisplay === 'always' || 
                  (snapSettings.gridDisplay === 'edit-only' && isPanelEditMode);

/**
   * Canvas+ + 
   */
    const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn("⚠️ Canvas");
      return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("⚠️ Canvas 2DUnable to get context");
      return;
    }

    // 
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

    try {
      // 1. 
      CanvasDrawing.clearCanvas(ctx, canvas.width, canvas.height);
      
      // 2. 
      CanvasDrawing.drawBackground(ctx, canvas.width, canvas.height, isDarkMode);

      // 3. Grid Drawing (depending on settings)
      if (showGrid) {
        CanvasDrawing.drawGrid(ctx, canvas.width, canvas.height, snapSettings.gridSize, isDarkMode);
      }

      // 4. 
      CanvasDrawing.drawPanels(ctx, panels, state.selectedPanel, isDarkMode, isPanelEditMode, swapPanel1, swapPanel2);
      
      // 5.  zIndex 
      drawBackgrounds(ctx);
      
      // 🆕 6. Tone drawing (after background, before effect lines)- ToneRenderer
      drawTones(ctx);
      
      // 🆕 7. Effect line drawing (after tone, before callout)
      drawEffects(ctx);
      
      // 8. 
      BubbleRenderer.drawBubbles(ctx, speechBubbles, panels, state.selectedBubble);

      
      // 🔧 9.  - getCharacterDisplayName 
      CharacterRenderer.drawCharacters(ctx, characters, panels, state.selectedCharacter, getCharacterDisplayName);

      // 10. 
      if (state.snapLines.length > 0) {
        CanvasDrawing.drawSnapLines(ctx, state.snapLines, isDarkMode);
      }

      // 11. 
      drawBackgroundHandles(ctx);

      // 12. 
      drawElementLabels(ctx);
      
      // 
      effects.forEach((effect, index) => {
        const panel = panels.find(p => p.id === effect.panelId);
        if (!panel) return;
        
        // 🔧 
        let absoluteX, absoluteY, absoluteHeight;
        
        if (effect.x <= 1 && effect.y <= 1 && effect.width <= 1 && effect.height <= 1) {
          // 
          absoluteX = panel.x + (effect.x * panel.width);
          absoluteY = panel.y + (effect.y * panel.height);
          absoluteHeight = effect.height * panel.height;
        } else {
          // 
          absoluteX = effect.x;
          absoluteY = effect.y;
          absoluteHeight = effect.height;
        }
        
        // 🔧 
        if (absoluteX < 0 || absoluteX > 1000 || absoluteY < 0 || absoluteY > 1000) {
          console.warn(`⚠️ ${index}: (${absoluteX}, ${absoluteY}) - `);
          return;
        }
        
        const typeNames = { 'speed': '', 'focus': '', 'explosion': '', 'flash': '' };
        const directionNames = { 'horizontal': '', 'vertical': '', 'radial': '', 'custom': '' };
        const typeName = typeNames[effect.type] || effect.type;
        const directionName = directionNames[effect.direction] || effect.direction;
        const label = `⚡ ${typeName}(${directionName})`;
        
        const labelX = Math.max(10, absoluteX + 10);
        const labelY = Math.max(30, absoluteY + absoluteHeight - 38);
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.85)';
        ctx.fillRect(labelX, labelY, 140, 28);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(labelX, labelY, 140, 28);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, labelX + 70, labelY + 14);
      });
      
      // 
      const visibleTones = tones.filter(tone => tone.visible !== false);
      visibleTones.forEach((tone, index) => {
        const panel = panels.find(p => p.id === tone.panelId);
        if (!panel) return;
        
        let absoluteX, absoluteY, absoluteWidth;
        if (tone.x <= 1 && tone.y <= 1) {
          absoluteX = panel.x + (tone.x * panel.width);
          absoluteY = panel.y + (tone.y * panel.height);
          absoluteWidth = tone.width <= 1 ? tone.width * panel.width : tone.width;
        } else {
          absoluteX = tone.x;
          absoluteY = tone.y;
          absoluteWidth = tone.width;
        }
        
        const patternNames = {
          'dots_60': '60%', 'dots_85': '85%', 'dots_100': '100%',
          'lines_horizontal': '', 'lines_vertical': '', 'lines_diagonal': ''
        };
        const patternName = patternNames[tone.pattern as keyof typeof patternNames] || tone.pattern;
        const label = `🎯 ${patternName}`;
        
        ctx.fillStyle = 'rgba(0, 128, 255, 0.85)';
        ctx.fillRect(absoluteX + absoluteWidth - 150, absoluteY + 10, 140, 28);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(absoluteX + absoluteWidth - 150, absoluteY + 10, 140, 28);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, absoluteX + absoluteWidth - 150 + 70, absoluteY + 10 + 14);
      });
      
      // 
    } catch (error) {
      console.error("❌ Canvas:", error);
    }
  };

  /**
   * 
   */
  const observeThemeChange = () => {
    const handleThemeChange = () => {
      // 
      drawCanvas();
    };
    
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    
    return () => {
      observer.disconnect();
      // 
    };
  };

  /**
   * useEffect+
   */
  // 1. 🔧 useEffect  characterNames 
  useEffect(() => {
    drawCanvas();
    // 
  }, [
    panels.length,
    state.selectedPanel,
    characters.length,
    state.selectedCharacter,
    speechBubbles.length,
    state.selectedBubble,
    backgrounds.length,
    selectedBackground,
    effects.length,
    selectedEffect,
    tones.length,
    selectedTone,
    isPanelEditMode,
    state.snapLines.length,
    showGrid,
    snapSettings.gridSize,
    snapSettings.gridDisplay,
    // 🆕 getCharacterDisplayName
    getCharacterDisplayName, // ← 
    // JSON.stringify +
    JSON.stringify(panels.map(p => ({ id: p.id, x: p.x, y: p.y, width: p.width, height: p.height }))),
    JSON.stringify(characters.map(c => ({ id: c.id, x: c.x, y: c.y, scale: c.scale, width: c.width, height: c.height }))),
    JSON.stringify(speechBubbles.map(b => ({ id: b.id, x: b.x, y: b.y, width: b.width, height: b.height }))),
    JSON.stringify(backgrounds.map(bg => ({ id: bg.id, panelId: bg.panelId, type: bg.type, x: bg.x, y: bg.y, width: bg.width, height: bg.height, opacity: bg.opacity }))),
    JSON.stringify(effects.map(effect => ({ id: effect.id, panelId: effect.panelId, type: effect.type, x: effect.x, y: effect.y, width: effect.width, height: effect.height, opacity: effect.opacity }))),
    JSON.stringify(tones.map(tone => ({ id: tone.id, panelId: tone.panelId, type: tone.type, x: tone.x, y: tone.y, width: tone.width, height: tone.height, opacity: tone.opacity }))),
  ]);

  /**
   * useEffect
   */
  useEffect(() => {
    return observeThemeChange();
  }, []);

  /**
   * Returns a manual redraw function (can be called externally if necessary)
   */
  return {
    drawCanvas,
    showGrid,
  };
};