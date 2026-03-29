// src/components/CanvasArea/renderers/BubbleRenderer.tsx - 
import { SpeechBubble, Panel } from "../../../types";

export class BubbleRenderer {
  // editingBubble
  static drawBubbles(
    ctx: CanvasRenderingContext2D,
    bubbles: SpeechBubble[],
    panels: Panel[],
    selectedBubble: SpeechBubble | null,
    editingBubble?: SpeechBubble | null  // 🔧 5
  ) {
    bubbles.forEach(bubble => {
      this.drawSingleBubble(ctx, bubble, panels, selectedBubble, editingBubble);
    });
  }

  // 
  static calculateBubblePosition(bubble: SpeechBubble, panel: Panel): { x: number; y: number; width: number; height: number } {
    if (bubble.isGlobalPosition) {
      // For Absolute Coordinates: Enlarge Size
      const scaleFactor = 2.0; // 2
      return {
        x: bubble.x,
        y: bubble.y,
        width: bubble.width * scaleFactor,
        height: bubble.height * scaleFactor
      };
    } else {
      // For relative coordinates: Calculated based on panel size (no enlargement)
      const x = panel.x + (bubble.x * panel.width);
      const y = panel.y + (bubble.y * panel.height);
      const width = bubble.width * panel.width;
      const height = bubble.height * panel.height;
      
      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
  }

  // Single callout drawing (coordinate conversion compatible/displaying while editing)
  static drawSingleBubble(
    ctx: CanvasRenderingContext2D,
    bubble: SpeechBubble,
    panels: Panel[],
    selectedBubble: SpeechBubble | null,
    editingBubble?: SpeechBubble | null
  ) {
    const panel = panels.find(p => p.id === bubble.panelId) || panels[0];
    if (!panel) {
      console.warn(`⚠️ : bubble=${bubble.id}, panelId=${bubble.panelId}`);
      return;
    }

    // 
    const bubblePos = this.calculateBubblePosition(bubble, panel);
    const transformedBubble = { ...bubble, ...bubblePos };

    ctx.save();

    // 🔧 Show semi-transparent callouts while editing
    if (editingBubble && editingBubble.id === bubble.id) {
      ctx.globalAlpha = 0.7;
    }

    // 
    this.drawBubbleBackground(ctx, transformedBubble);
    
    // 
    this.drawBubbleTextEnhanced(ctx, transformedBubble);
    
    // If selected, resize handle drawing
    if (selectedBubble && selectedBubble.id === bubble.id) {
      this.drawResizeHandles(ctx, transformedBubble);
    }

    ctx.restore();
  }

  // Callout background drawing (complete shape separation version)
  static drawBubbleBackground(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    // 
    ctx.fillStyle = isDarkMode ? "#2d2d2d" : "white";
    ctx.strokeStyle = isDarkMode ? "#555" : "#333";
    ctx.lineWidth = 2;

    // 🔧 Ensure that different shapes are drawn according to the type
    switch (bubble.type) {
      case "speech":
      case "":
      case "normal":
        this.drawSpeechBubble(ctx, bubble);
        break;
        
      case 'thought':
        this.drawThoughtBubble(ctx, bubble);
        break;

      case 'shout':
        this.drawShoutBubble(ctx, bubble);
        break;

      case 'whisper':
        this.drawWhisperBubble(ctx, bubble);
        break;
        
      default:
        this.drawSpeechBubble(ctx, bubble);
    }
  }

  // Normal Callout (Rounded Rectangle + Tail)
  static drawSpeechBubble(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    const cornerRadius = 12;
    
    // 
    ctx.beginPath();
    ctx.roundRect(bubble.x, bubble.y, bubble.width, bubble.height, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // 
    const tailX = bubble.x + bubble.width * 0.15;
    const tailY = bubble.y + bubble.height;
    
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tailX - 15, tailY + 20);
    ctx.lineTo(tailX + 15, tailY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Thought Bubble (Oval + Small Bubble)
  static drawThoughtBubble(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    // 
    ctx.beginPath();
    ctx.ellipse(
      bubble.x + bubble.width / 2,
      bubble.y + bubble.height / 2,
      bubble.width / 2 - 5,
      bubble.height / 2 - 5,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();

    // 3
    const bubblePositions = [
      { x: bubble.x + bubble.width * 0.2, y: bubble.y + bubble.height + 15, size: 12 },
      { x: bubble.x + bubble.width * 0.15, y: bubble.y + bubble.height + 35, size: 8 },
      { x: bubble.x + bubble.width * 0.1, y: bubble.y + bubble.height + 50, size: 5 }
    ];

    bubblePositions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  // Scream Bubble (Jagged Explosive)
  static drawShoutBubble(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    const centerX = bubble.x + bubble.width / 2;
    const centerY = bubble.y + bubble.height / 2;
    const spikes = 12;
    const innerRadius = Math.min(bubble.width, bubble.height) / 2 - 10;
    const outerRadius = Math.min(bubble.width, bubble.height) / 2 + 15;
    
    ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      const radius = (i % 2 === 0) ? outerRadius : innerRadius;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const startRadius = outerRadius + 5;
      const endRadius = outerRadius + 25;
      
      const startX = centerX + Math.cos(angle) * startRadius;
      const startY = centerY + Math.sin(angle) * startRadius;
      const endX = centerX + Math.cos(angle) * endRadius;
      const endY = centerY + Math.sin(angle) * endRadius;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // 
    ctx.lineWidth = 2;
  }

  // Whisper Callouts (Dotted Border + Smaller)
  static drawWhisperBubble(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    // 
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 1.5;
    
    // 
    const cornerRadius = 15;
    
    ctx.beginPath();
    ctx.roundRect(bubble.x + 5, bubble.y + 5, bubble.width - 10, bubble.height - 10, cornerRadius);
    ctx.fill();
    ctx.stroke();
    
    // 
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    
    // 
    ctx.setLineDash([4, 3]);
    const tailX = bubble.x + bubble.width * 0.3;
    const tailY = bubble.y + bubble.height;
    
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tailX - 8, tailY + 12);
    ctx.lineTo(tailX + 8, tailY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 
    ctx.setLineDash([]);
  }

  // 🆕 Text Drawing (Enhanced: Special while editing)
  static drawBubbleTextEnhanced(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    if (!bubble.text || bubble.text.trim() === "") {
      // 🔧 If the text is empty, "Editing...
      ctx.fillStyle = "#888";
      ctx.font = "12px 'Noto Sans JP', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("...", bubble.x + bubble.width / 2, bubble.y + bubble.height / 2);
      return;
    }

    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    ctx.fillStyle = isDarkMode ? "#fff" : "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate the text rendering area in the callout (leave a margin)
    const padding = 12;
    const textArea = {
      x: bubble.x + padding,
      y: bubble.y + padding,
      width: bubble.width - (padding * 2),
      height: bubble.height - (padding * 2)
    };

    // 
    if (textArea.width <= 0 || textArea.height <= 0) return;

    if (bubble.vertical) {
      // 
      this.drawVerticalText(ctx, bubble.text, textArea, bubble.fontSize);
    } else {
      // Landscape mode (character wrapping)
      this.drawHorizontalText(ctx, bubble.text, textArea, bubble.fontSize);
    }
  }

  // 🆕 Horizontal Text Drawing (Auto Wrap/Font Size Adjustment)
  static drawHorizontalText(ctx: CanvasRenderingContext2D, text: string, area: {x: number, y: number, width: number, height: number}, customFontSize?: number) {
    // Start with the base font size (use it if you have a custom size)
    let fontSize = customFontSize || 32;
    let lines: string[] = [];
    let lineHeight = 0;
    
    // Adjust the font size so that the text fits within the area
    const minSize = Math.max(18, customFontSize ? customFontSize * 0.6 : 18);
    for (let size = fontSize; size >= minSize; size -= 1) {
      ctx.font = `${size}px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif`;
      lineHeight = size * 1.2;
      
      lines = this.wrapTextAdvanced(ctx, text, area.width);
      
      const totalHeight = lines.length * lineHeight;
      
      if (totalHeight <= area.height) {
        fontSize = size;
        break;
      }
    }

    // 
    ctx.font = `${fontSize}px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif`;
    
    // Calculate Drawing Start Position (Center)
    const totalTextHeight = lines.length * lineHeight;
    const startY = area.y + (area.height - totalTextHeight) / 2 + lineHeight / 2;
    const centerX = area.x + area.width / 2;

    // 
    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      ctx.fillText(line, centerX, y);
    });

    console.log(`💬 : "${text.substring(0, 10)}..." :${fontSize} :${lines.length}`);
  }

  // 🆕 Vertical Text Drawing (Improved)
  static drawVerticalText(ctx: CanvasRenderingContext2D, text: string, area: {x: number, y: number, width: number, height: number}, customFontSize?: number) {
    // Vertical basic settings (use custom size if available)
    let fontSize = customFontSize || 32;
    const chars = Array.from(text); // Unicode
    
    // 
    const maxColumns = Math.floor(area.width / (fontSize * 1.2));
    const charsPerColumn = Math.floor(area.height / (fontSize * 1.2));
    
    // 
    const minSize = Math.max(18, customFontSize ? customFontSize * 0.6 : 18);
    for (let size = fontSize; size >= minSize; size -= 1) {
      const columnWidth = size * 1.2;
      const charHeight = size * 1.2;
      
      const columns = Math.ceil(chars.length / Math.floor(area.height / charHeight));
      const totalWidth = columns * columnWidth;
      
      if (totalWidth <= area.width) {
        fontSize = size;
        break;
      }
    }

    ctx.font = `${fontSize}px 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif`;
    
    const columnWidth = fontSize * 1.2;
    const charHeight = fontSize * 1.2;
    const charsPerCol = Math.floor(area.height / charHeight);
    const totalColumns = Math.ceil(chars.length / charsPerCol);
    
    // Drawing start position (right to left)
    const startX = area.x + area.width - columnWidth / 2;
    const startY = area.y + (area.height - (charsPerCol * charHeight)) / 2 + charHeight / 2;

    // 
    for (let col = 0; col < totalColumns; col++) {
      const x = startX - (col * columnWidth);
      
      for (let charIndex = 0; charIndex < charsPerCol; charIndex++) {
        const textIndex = col * charsPerCol + charIndex;
        if (textIndex >= chars.length) break;
        
        const char = chars[textIndex];
        const y = startY + charIndex * charHeight;
        
        ctx.fillText(char, x, y);
      }
    }

  }

  // 🆕 Advanced Text Wrap Processing (Japanese)
  static wrapTextAdvanced(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n'); // 

    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        lines.push(''); // 
        continue;
      }

      const words = this.segmentJapaneseText(paragraph);
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
    }

    return lines;
  }

  // 🆕 Segmentation of Japanese text (split into units suitable for line breaks)
  static segmentJapaneseText(text: string): string[] {
    const segments: string[] = [];
    let current = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      current += char;

      // 
      const shouldBreak = this.isBreakablePoint(char, nextChar);

      if (shouldBreak || i === text.length - 1) {
        segments.push(current);
        current = '';
      }
    }

    return segments.filter(seg => seg.length > 0);
  }

  // 🆕 
  static isBreakablePoint(char: string, nextChar?: string): boolean {
    if (!nextChar) return true;

    const code = char.charCodeAt(0);
    const nextCode = nextChar.charCodeAt(0);

    if (/[.,;:!?'"()[\]{}]/.test(char)) return true;

    if ((code >= 0x3040 && code <= 0x309f) &&
        (nextCode >= 0x30a0 && nextCode <= 0x30ff)) return true;

    if ((code >= 0x4e00 && code <= 0x9faf) &&
        (nextCode >= 0x3040 && nextCode <= 0x309f)) return true;

    if (/[a-zA-Z0-9]/.test(char) && /[-–—]/.test(nextChar)) return true;
    if (/[-–—]/.test(char) && /[a-zA-Z0-9]/.test(nextChar)) return true;

    // 
    if (/\s/.test(char)) return true;

    // By default, line breaks are possible on a character-by-character basis2
    return false;
  }

  // 8
  static drawResizeHandles(ctx: CanvasRenderingContext2D, bubble: SpeechBubble) {
    const handleSize = 12;
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    ctx.fillStyle = "#ff6b35";
    ctx.strokeStyle = isDarkMode ? "#fff" : "#000";
    ctx.lineWidth = 2;

    // 8
    const handles = [
      { x: bubble.x - handleSize/2, y: bubble.y - handleSize/2, dir: "nw" },
      { x: bubble.x + bubble.width/2 - handleSize/2, y: bubble.y - handleSize/2, dir: "n" },
      { x: bubble.x + bubble.width - handleSize/2, y: bubble.y - handleSize/2, dir: "ne" },
      { x: bubble.x + bubble.width - handleSize/2, y: bubble.y + bubble.height/2 - handleSize/2, dir: "e" },
      { x: bubble.x + bubble.width - handleSize/2, y: bubble.y + bubble.height - handleSize/2, dir: "se" },
      { x: bubble.x + bubble.width/2 - handleSize/2, y: bubble.y + bubble.height - handleSize/2, dir: "s" },
      { x: bubble.x - handleSize/2, y: bubble.y + bubble.height - handleSize/2, dir: "sw" },
      { x: bubble.x - handleSize/2, y: bubble.y + bubble.height/2 - handleSize/2, dir: "w" }
    ];

    handles.forEach(handle => {
      if (["nw", "ne", "se", "sw"].includes(handle.dir)) {
        // 
        ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
      } else {
        // 
        ctx.beginPath();
        ctx.arc(handle.x + handleSize/2, handle.y + handleSize/2, handleSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });
  }

  // 
  static isBubbleResizeHandleClicked(
    mouseX: number, 
    mouseY: number, 
    bubble: SpeechBubble, 
    panel: Panel
  ): { isClicked: boolean; direction: string } {
    const bubblePos = this.calculateBubblePosition(bubble, panel);
    const transformedBubble = { ...bubble, ...bubblePos };
    
    const handleSize = 12;
    const tolerance = 8;

    const handles = [
      { x: transformedBubble.x - handleSize/2, y: transformedBubble.y - handleSize/2, dir: "nw" },
      { x: transformedBubble.x + transformedBubble.width/2 - handleSize/2, y: transformedBubble.y - handleSize/2, dir: "n" },
      { x: transformedBubble.x + transformedBubble.width - handleSize/2, y: transformedBubble.y - handleSize/2, dir: "ne" },
      { x: transformedBubble.x + transformedBubble.width - handleSize/2, y: transformedBubble.y + transformedBubble.height/2 - handleSize/2, dir: "e" },
      { x: transformedBubble.x + transformedBubble.width - handleSize/2, y: transformedBubble.y + transformedBubble.height - handleSize/2, dir: "se" },
      { x: transformedBubble.x + transformedBubble.width/2 - handleSize/2, y: transformedBubble.y + transformedBubble.height - handleSize/2, dir: "s" },
      { x: transformedBubble.x - handleSize/2, y: transformedBubble.y + transformedBubble.height - handleSize/2, dir: "sw" },
      { x: transformedBubble.x - handleSize/2, y: transformedBubble.y + transformedBubble.height/2 - handleSize/2, dir: "w" }
    ];

    for (const handle of handles) {
      const inRangeX = mouseX >= handle.x - tolerance && mouseX <= handle.x + handleSize + tolerance;
      const inRangeY = mouseY >= handle.y - tolerance && mouseY <= handle.y + handleSize + tolerance;
      
      if (inRangeX && inRangeY) {
        return { isClicked: true, direction: handle.dir };
      }
    }

    return { isClicked: false, direction: "" };
  }

  // 
  static findBubbleAt(
    x: number, 
    y: number, 
    bubbles: SpeechBubble[], 
    panels: Panel[]
  ): SpeechBubble | null {
    console.log(`🔎 findBubbleAt: click=(${x},${y}), bubbles=${bubbles.length}`);
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      const panel = panels.find(p => p.id === bubble.panelId) || panels[0];
      if (!panel) continue;
      
      const bubblePos = this.calculateBubblePosition(bubble, panel);
      console.log(`  ${i}: id=${bubble.id}, =(${bubble.x},${bubble.y}), =(${bubblePos.x},${bubblePos.y}), =${bubblePos.width}x${bubblePos.height}, isGlobal=${bubble.isGlobalPosition}`);
      
      if (x >= bubblePos.x && 
          x <= bubblePos.x + bubblePos.width &&
          y >= bubblePos.y && 
          y <= bubblePos.y + bubblePos.height) {
        console.log(`  ✅ `);
        return bubble;
      }
    }
    
    return null;
  }

  // 
  static resizeBubble(
    bubble: SpeechBubble,
    direction: string,
    deltaX: number,
    deltaY: number,
    originalBounds: { x: number; y: number; width: number; height: number },
    panel?: Panel
  ): SpeechBubble {
    let newX = bubble.x;
    let newY = bubble.y;
    let newWidth = bubble.width;
    let newHeight = bubble.height;

    // For relative coordinates, normalize delta values by panel size
    let adjustedDeltaX = deltaX;
    let adjustedDeltaY = deltaY;
    
    if (!bubble.isGlobalPosition && panel) {
      adjustedDeltaX = deltaX / panel.width;
      adjustedDeltaY = deltaY / panel.height;
    }
    
    // For relative coordinates, the minimum size is also specified in relative values.
    const minWidth = bubble.isGlobalPosition ? 60 : 0.1;
    const minHeight = bubble.isGlobalPosition ? 40 : 0.05;

    switch (direction) {
      case "nw":
        newWidth = Math.max(minWidth, originalBounds.width - adjustedDeltaX);
        newHeight = Math.max(minHeight, originalBounds.height - adjustedDeltaY);
        newX = originalBounds.x + originalBounds.width - newWidth;
        newY = originalBounds.y + originalBounds.height - newHeight;
        break;
      case "n":
        newHeight = Math.max(minHeight, originalBounds.height - adjustedDeltaY);
        newY = originalBounds.y + originalBounds.height - newHeight;
        break;
      case "ne":
        newWidth = Math.max(minWidth, originalBounds.width + adjustedDeltaX);
        newHeight = Math.max(minHeight, originalBounds.height - adjustedDeltaY);
        newY = originalBounds.y + originalBounds.height - newHeight;
        break;
      case "e":
        newWidth = Math.max(minWidth, originalBounds.width + adjustedDeltaX);
        break;
      case "se":
        newWidth = Math.max(minWidth, originalBounds.width + adjustedDeltaX);
        newHeight = Math.max(minHeight, originalBounds.height + adjustedDeltaY);
        break;
      case "s":
        newHeight = Math.max(minHeight, originalBounds.height + adjustedDeltaY);
        break;
      case "sw":
        newWidth = Math.max(minWidth, originalBounds.width - adjustedDeltaX);
        newHeight = Math.max(minHeight, originalBounds.height + adjustedDeltaY);
        newX = originalBounds.x + originalBounds.width - newWidth;
        break;
      case "w":
        newWidth = Math.max(minWidth, originalBounds.width - adjustedDeltaX);
        newX = originalBounds.x + originalBounds.width - newWidth;
        break;
      default:
        return bubble;
    }

    return {
      ...bubble,
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
  }
}