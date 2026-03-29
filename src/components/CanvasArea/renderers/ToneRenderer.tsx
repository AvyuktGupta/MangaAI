// src/components/CanvasArea/renderers/ToneRenderer.tsx - 
import React from 'react';
import { ToneElement, Panel } from '../../../types';

/**
 * Manga Production Tone Drawing Engine (Performance Optimized Version)
 * Reduces heavy processing weight, prevents infinite loops, and limits drawing
 */
export class ToneRenderer {
  
  /**
   * Draw single tone (main function)- 
   */
  static renderTone(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    panel: Panel,
    isSelected: boolean = false
  ): void {
    // 
    const absoluteX = panel.x + tone.x * panel.width;
    const absoluteY = panel.y + tone.y * panel.height;
    const absoluteWidth = tone.width * panel.width;
    const absoluteHeight = tone.height * panel.height;

    // Do not draw if hidden or out of range
    if (!tone.visible || absoluteWidth <= 0 || absoluteHeight <= 0) return;

    // 🚀 Size Limit (Performance Protection)
    const MAX_AREA = 50000; // 
    if (absoluteWidth * absoluteHeight > MAX_AREA) {
      console.warn("⚠️ The tone drawing area is too large. Switches to lightweight drawing mode.");
      this.renderSimpleTone(ctx, tone, panel, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
      if (isSelected) {
        this.drawToneSelectionClipped(ctx, tone, panel, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
      }
      return;
    }

    ctx.save();

    // 
    ctx.beginPath();
    ctx.rect(panel.x, panel.y, panel.width, panel.height);
    ctx.clip();

    // 
    this.applyBlendMode(ctx, tone.blendMode);

    // 
    ctx.globalAlpha = Math.max(0.1, Math.min(1.0, tone.opacity));

    // Drawing by Tone Type (Lightweight Version)
    switch (tone.type) {
      case 'halftone':
        this.renderHalftoneOptimized(ctx, tone, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'gradient':
        this.renderGradientOptimized(ctx, tone, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'crosshatch':
        this.renderCrosshatchOptimized(ctx, tone, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'dots':
        this.renderDotsOptimized(ctx, tone, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'lines':
        this.renderLinesOptimized(ctx, tone, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      case 'noise':
        this.renderNoiseOptimized(ctx, tone, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
      default:
        this.renderSimpleTone(ctx, tone, panel, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
        break;
    }

    ctx.restore();

    // 
    if (isSelected) {
      this.drawToneSelectionClipped(ctx, tone, panel, absoluteX, absoluteY, absoluteWidth, absoluteHeight);
    }
  }

  /**
   * 🚀 
   */
  private static renderSimpleTone(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    panel: Panel,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.save();
    ctx.globalAlpha = tone.opacity * 0.3;
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(x, y, width, height);
    
    // 
    ctx.globalAlpha = tone.opacity * 0.6;
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x, y, width, height);
    
    ctx.restore();
  }

  /**
   * 🚀 
   */
  private static renderHalftoneOptimized(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const density = Math.max(0.1, Math.min(1.0, tone.density));
    const scale = Math.max(0.5, Math.min(3.0, tone.scale || 1.0));
    
    // 🚀 
    const spacing = Math.max(3, Math.min(20, 8 * scale));
    const dotSize = Math.max(0.5, Math.min(spacing * 0.4, density * 4));
    
    ctx.save();
    ctx.fillStyle = tone.invert ? '#ffffff' : '#000000';
    
    // 🚀 Drawing range limit (infinite loop prevention)
    const maxDots = 1000; // 
    let dotCount = 0;
    
    const startX = Math.floor(x / spacing) * spacing;
    const startY = Math.floor(y / spacing) * spacing;
    const endX = x + width;
    const endY = y + height;
    
    for (let px = startX; px < endX && dotCount < maxDots; px += spacing) {
      for (let py = startY; py < endY && dotCount < maxDots; py += spacing) {
        // Offset with checkerboard pattern
        const offsetX = ((Math.floor(py / spacing) % 2) === 0) ? 0 : spacing / 2;
        const dotX = px + offsetX;
        const dotY = py;
        
        // 
        if (dotX >= x - dotSize && dotX <= endX + dotSize &&
            dotY >= y - dotSize && dotY <= endY + dotSize) {
          
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fill();
          dotCount++;
        }
      }
    }
    
    ctx.restore();
  }

  /**
   * 🚀 Gradient Drawing (Optimized)
   */
  private static renderGradientOptimized(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.save();

    let gradient: CanvasGradient;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // 
    gradient = ctx.createLinearGradient(x, y, x + width, y + height);

    // 
    const baseOpacity = Math.max(0.1, Math.min(1.0, tone.density));
    const startColor = tone.invert ? 
      `rgba(255, 255, 255, ${baseOpacity})` : 
      `rgba(0, 0, 0, ${baseOpacity})`;
    const endColor = tone.invert ? 
      `rgba(0, 0, 0, 0.1)` : 
      `rgba(255, 255, 255, 0.1)`;

    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    ctx.restore();
  }

  /**
   * 🚀 Crosshatch Drawing (Optimized)
   */
  private static renderCrosshatchOptimized(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.save();

    const density = Math.max(0.1, Math.min(1.0, tone.density));
    const spacing = Math.max(4, Math.min(15, 8 / density));
    const lineWidth = Math.max(0.5, Math.min(3, density * 2));
    
    ctx.strokeStyle = tone.invert ? '#ffffff' : '#000000';
    ctx.lineWidth = lineWidth;

    // 🚀 Line Limit (Performance Protection)
    const maxLines = 50;
    const lineCount = Math.min(maxLines, Math.floor((width + height) / spacing));
    
    // 45
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const offset = (i * spacing) - Math.max(width, height);
      const startX = x + offset;
      const startY = y;
      const endX = x + offset + Math.max(width, height);
      const endY = y + Math.max(width, height);
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 🚀 
   */
  private static renderDotsOptimized(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const density = Math.max(0.1, Math.min(1.0, tone.density));
    const scale = Math.max(0.5, Math.min(2.0, tone.scale || 1.0));
    const spacing = Math.max(5, 15 * scale);
    const dotRadius = Math.max(1, density * 3);

    ctx.save();
    ctx.fillStyle = tone.invert ? '#ffffff' : '#000000';

    // 🚀 
    const maxDots = 500;
    let dotCount = 0;

    for (let px = x; px < x + width && dotCount < maxDots; px += spacing) {
      for (let py = y; py < y + height && dotCount < maxDots; py += spacing) {
        ctx.beginPath();
        ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        dotCount++;
      }
    }

    ctx.restore();
  }

  /**
   * 🚀 
   */
  private static renderLinesOptimized(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.save();

    const density = Math.max(0.1, Math.min(1.0, tone.density));
    const spacing = Math.max(3, 8 / density);
    const lineWidth = Math.max(0.3, density * 1.5);
    
    ctx.strokeStyle = tone.invert ? '#ffffff' : '#000000';
    ctx.lineWidth = lineWidth;

    // 🚀 
    const maxLines = 100;
    const lineCount = Math.min(maxLines, Math.floor(height / spacing));

    // 
    ctx.beginPath();
    for (let i = 0; i < lineCount; i++) {
      const y_pos = y + (i * spacing);
      if (y_pos <= y + height) {
        ctx.moveTo(x, y_pos);
        ctx.lineTo(x + width, y_pos);
      }
    }
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 🚀 
   */
  private static renderNoiseOptimized(
    ctx: CanvasRenderingContext2D,
    tone: ToneElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    ctx.save();

    const density = Math.max(0.1, Math.min(1.0, tone.density));
    const noiseSize = Math.max(1, 2 * (tone.scale || 1.0));

    ctx.fillStyle = tone.invert ? '#ffffff' : '#000000';

    // 🚀 Dramatically limit the number of particles (infinite loop prevention)
    const maxParticles = Math.min(200, Math.floor(width * height * density * 0.001));
    
    for (let i = 0; i < maxParticles; i++) {
      const px = x + Math.random() * width;
      const py = y + Math.random() * height;
      const size = Math.max(0.5, noiseSize * (0.5 + Math.random() * 0.5));

      ctx.globalAlpha = tone.opacity * (0.3 + Math.random() * 0.4);
      
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Blend mode application (lightweight version)
   */
  private static applyBlendMode(ctx: CanvasRenderingContext2D, blendMode: string): void {
    // 
    switch (blendMode) {
      case 'multiply':
        ctx.globalCompositeOperation = 'multiply';
        break;
      case 'screen':
        ctx.globalCompositeOperation = 'screen';
        break;
      case 'normal':
      default:
        ctx.globalCompositeOperation = 'source-over';
        break;
    }
  }

  /**
   * 🔧 Drawing the tone selection state (panel boundary compatible version)
   */
  // 6️⃣ drawToneSelectionClippedReplace the function with the following (panel boundary compatible version)
private static drawToneSelectionClipped(
  ctx: CanvasRenderingContext2D,
  tone: ToneElement,
  panel: Panel,
  absoluteX: number,
  absoluteY: number,
  absoluteWidth: number,
  absoluteHeight: number
): void {
  ctx.save();
  
  // Calculate the selected area clipped at the panel boundary
  const clippedX = Math.max(absoluteX, panel.x);
  const clippedY = Math.max(absoluteY, panel.y);
  const clippedRight = Math.min(absoluteX + absoluteWidth, panel.x + panel.width);
  const clippedBottom = Math.min(absoluteY + absoluteHeight, panel.y + panel.height);
  const clippedWidth = clippedRight - clippedX;
  const clippedHeight = clippedBottom - clippedY;
  
  // Draw only when clipped area is enabled
  if (clippedWidth > 0 && clippedHeight > 0) {
    ctx.globalAlpha = 0.8;
    
    // 
    ctx.strokeStyle = '#00a8ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(clippedX, clippedY, clippedWidth, clippedHeight);
    
    // 🔧 Improved resize handle (only within panel boundaries)
    const handleSize = 8;
    const handles = [
      { x: clippedX - handleSize/2, y: clippedY - handleSize/2, direction: 'nw' },
      { x: clippedRight - handleSize/2, y: clippedY - handleSize/2, direction: 'ne' },
      { x: clippedX - handleSize/2, y: clippedBottom - handleSize/2, direction: 'sw' },
      { x: clippedRight - handleSize/2, y: clippedBottom - handleSize/2, direction: 'se' },
    ];
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#00a8ff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    // Draw only handles within panel boundaries
    handles.forEach(handle => {
      const handleCenterX = handle.x + handleSize/2;
      const handleCenterY = handle.y + handleSize/2;
      
      // Draw only if the center of the handle is within the panel boundary
      if (handleCenterX >= panel.x && handleCenterX <= panel.x + panel.width &&
          handleCenterY >= panel.y && handleCenterY <= panel.y + panel.height) {
        
        // further clipping the handle area at the panel boundary
        const handleClippedX = Math.max(handle.x, panel.x);
        const handleClippedY = Math.max(handle.y, panel.y);
        const handleClippedRight = Math.min(handle.x + handleSize, panel.x + panel.width);
        const handleClippedBottom = Math.min(handle.y + handleSize, panel.y + panel.height);
        const handleClippedWidth = handleClippedRight - handleClippedX;
        const handleClippedHeight = handleClippedBottom - handleClippedY;
        
        if (handleClippedWidth > 0 && handleClippedHeight > 0) {
          ctx.fillRect(handleClippedX, handleClippedY, handleClippedWidth, handleClippedHeight);
          ctx.strokeRect(handleClippedX, handleClippedY, handleClippedWidth, handleClippedHeight);
        }
      }
    });

    // 🆕 Panel boundary display (if the tone is overhanging the panel)
    if (absoluteX < panel.x || absoluteY < panel.y || 
        absoluteX + absoluteWidth > panel.x + panel.width ||
        absoluteY + absoluteHeight > panel.y + panel.height) {
      
      // 
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ ', clippedX + clippedWidth/2, clippedY - 5);
    }
  }
  
  ctx.restore();
}

  /**
   * zIndex
   */
  static renderTones(
    ctx: CanvasRenderingContext2D,
    tones: ToneElement[],
    panels: Panel[],
    selectedTone: ToneElement | null = null
  ): void {
    // 🚀 Tone Limit (Performance Protection)
    const MAX_TONES_PER_PANEL = 10;
    
    panels.forEach(panel => {
      // zIndex
      const panelTones = tones
        .filter(tone => tone.panelId === panel.id && tone.visible)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .slice(0, MAX_TONES_PER_PANEL); // 🚀 

      // Draw the tones in the panel sequentially
      panelTones.forEach(tone => {
        const isSelected = selectedTone?.id === tone.id;
        this.renderTone(ctx, tone, panel, isSelected);
      });
    });
  }
}