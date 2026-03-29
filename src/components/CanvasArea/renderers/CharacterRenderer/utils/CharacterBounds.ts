// src/components/CanvasArea/renderers/CharacterRenderer/utils/CharacterBounds.ts
// 🎯 Character boundary/percussion class only

import { Character, Panel, CharacterBounds as CharacterBoundsType } from "../../../../../types";
import { CharacterUtils } from "./CharacterUtils";

export class CharacterBounds {
  
  // 🎯 
  static getCharacterBounds(
    character: Character,
    panel: Panel
  ): CharacterBoundsType {
    const { charX, charY, charWidth, charHeight } = 
      CharacterUtils.calculateDrawingCoordinates(character, panel);
    
    return {
      x: charX,
      y: charY,
      width: charWidth,
      height: charHeight,
      centerX: charX + charWidth / 2,
      centerY: charY + charHeight / 2
    };
  }

  // 🎯 Character boundaries with rotation
  static getRotatedCharacterBounds(
    character: Character,
    panel: Panel
  ): {
    original: CharacterBoundsType;
    rotated: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
      width: number;
      height: number;
    };
  } {
    const original = CharacterBounds.getCharacterBounds(character, panel);
    const rotation = character.rotation || 0;
    
    if (rotation === 0) {
      return {
        original,
        rotated: {
          minX: original.x,
          minY: original.y,
          maxX: original.x + original.width,
          maxY: original.y + original.height,
          width: original.width,
          height: original.height
        }
      };
    }
    
    const rotated = CharacterUtils.calculateRotatedBounds(
      original.x,
      original.y,
      original.width,
      original.height,
      rotation
    );
    
    return { original, rotated };
  }

  // 🎯 Character click judgment (rotation correspondence)
  static isCharacterClicked(
    mouseX: number,
    mouseY: number,
    character: Character,
    panel: Panel
  ): boolean {
    const rotation = character.rotation || 0;
    
    if (rotation === 0) {
      // 
      const bounds = CharacterBounds.getCharacterBounds(character, panel);
      return (
        mouseX >= bounds.x &&
        mouseX <= bounds.x + bounds.width &&
        mouseY >= bounds.y &&
        mouseY <= bounds.y + bounds.height
      );
    } else {
      // 
      return CharacterBounds.isRotatedCharacterClicked(mouseX, mouseY, character, panel);
    }
  }

  // 🎯 Determining the Click of a Rotating Character
  static isRotatedCharacterClicked(
    mouseX: number,
    mouseY: number,
    character: Character,
    panel: Panel
  ): boolean {
    const bounds = CharacterBounds.getCharacterBounds(character, panel);
    const rotation = character.rotation || 0;
    
    // Reverse the mouse coordinates and determine by character local coordinates
    const reversedPoint = CharacterUtils.rotatePoint(
      mouseX,
      mouseY,
      bounds.centerX,
      bounds.centerY,
      -rotation // 
    );
    
    // Normal rectangular determination with reverse rotation coordinates
    return (
      reversedPoint.x >= bounds.x &&
      reversedPoint.x <= bounds.x + bounds.width &&
      reversedPoint.y >= bounds.y &&
      reversedPoint.y <= bounds.y + bounds.height
    );
  }

  // 🎯 Search multiple characters for clicks
  static findCharacterAt(
    mouseX: number,
    mouseY: number,
    characters: Character[],
    panels: Panel[]
  ): Character | null {
    // Search from the back (prioritize those drawn above)
    for (let i = characters.length - 1; i >= 0; i--) {
      const character = characters[i];
      const panel = panels.find((p) => p.id === character.panelId);
      
      if (!panel) {
        console.warn(`⚠️  - : ${character.name}, ID: ${character.panelId}`);
        continue;
      }

      if (CharacterBounds.isCharacterClicked(mouseX, mouseY, character, panel)) {
        // 
        return character;
      }
    }
    
    return null;
  }

  // 🎯 Resize handle boundary calculation (four-corner version only)
  static getResizeHandleBounds(
    character: Character,
    panel: Panel
  ): Array<{
    direction: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }> {
    const bounds = CharacterBounds.getCharacterBounds(character, panel);
    const handleSize = 12;
    
    return [
      // 
      { direction: "nw", x: bounds.x - handleSize/2, y: bounds.y - handleSize/2, width: handleSize, height: handleSize },
      { direction: "ne", x: bounds.x + bounds.width - handleSize/2, y: bounds.y - handleSize/2, width: handleSize, height: handleSize },
      { direction: "se", x: bounds.x + bounds.width - handleSize/2, y: bounds.y + bounds.height - handleSize/2, width: handleSize, height: handleSize },
      { direction: "sw", x: bounds.x - handleSize/2, y: bounds.y + bounds.height - handleSize/2, width: handleSize, height: handleSize }
    ];
  }

  // 🎯 Resize Handle Click Determination
  static isResizeHandleClicked(
    mouseX: number,
    mouseY: number,
    character: Character,
    panel: Panel
  ): { isClicked: boolean; direction: string } {
    const handles = CharacterBounds.getResizeHandleBounds(character, panel);
    const tolerance = 10; // 
    
    for (const handle of handles) {
      const inRangeX = mouseX >= handle.x - tolerance && 
                      mouseX <= handle.x + handle.width + tolerance;
      const inRangeY = mouseY >= handle.y - tolerance && 
                      mouseY <= handle.y + handle.height + tolerance;
      
      if (inRangeX && inRangeY) {
        console.log(`🔧  ${handle.direction} !`);
        return { isClicked: true, direction: handle.direction };
      }
    }

    return { isClicked: false, direction: "" };
  }

  // CharacterBounds.ts  getRotationHandleBounds 

// 🎯 Rotating handle boundary calculation (reduced range version)
static getRotationHandleBounds(
  character: Character,
  panel: Panel
): { x: number; y: number; radius: number } {
  const bounds = CharacterBounds.getCharacterBounds(character, panel);
  const handleDistance = 35;
  const handleRadius = 15; // 🔧 100px → 15px 
  
  return {
    x: bounds.centerX,
    y: bounds.y - handleDistance,
    radius: handleRadius  // 
  };
}

// 🎯 Rotating handle click judgment (reduced range version)
static isRotationHandleClicked(
  mouseX: number,
  mouseY: number,
  character: Character,
  panel: Panel
): boolean {
  const handle = CharacterBounds.getRotationHandleBounds(character, panel);
  const distance = Math.sqrt(
    Math.pow(mouseX - handle.x, 2) + 
    Math.pow(mouseY - handle.y, 2)
  );
  
  const isClicked = distance <= handle.radius;
  
  if (isClicked) {
    console.log("🔄 [] !", {
      distance: Math.round(distance),
      radius: handle.radius,
      mousePos: { x: mouseX, y: mouseY },
      handlePos: { x: handle.x, y: handle.y }
    });
  }
  
  return isClicked;
}

  // 🎯 Integrated Handle Click Interpretation (Full Revision)
  static getHandleClickInfo(
    mouseX: number,
    mouseY: number,
    character: Character,
    panel: Panel
  ): { 
    isClicked: boolean; 
    type: "none" | "resize" | "rotate";
    direction?: string 
  } {
    console.log("🎯 :", {
      mousePos: { x: mouseX, y: mouseY },
      character: character.name
    });

    // 🔄 
    if (CharacterBounds.isRotationHandleClicked(mouseX, mouseY, character, panel)) {
      console.log("✅ ");
      return { isClicked: true, type: "rotate" };
    }
    
    // 🔧 
    const resizeResult = CharacterBounds.isResizeHandleClicked(mouseX, mouseY, character, panel);
    if (resizeResult.isClicked) {
      console.log("✅ ", resizeResult.direction);
      return { 
        isClicked: true, 
        type: "resize", 
        direction: resizeResult.direction 
      };
    }
    
    console.log("❌ ");
    return { isClicked: false, type: "none" };
  }

  // 🎯 Character boundary and panel boundary duplication determination
  static isCharacterInPanel(
    character: Character,
    panel: Panel
  ): boolean {
    const charBounds = CharacterBounds.getCharacterBounds(character, panel);
    
    // 
    return (
      charBounds.x >= panel.x &&
      charBounds.y >= panel.y &&
      charBounds.x + charBounds.width <= panel.x + panel.width &&
      charBounds.y + charBounds.height <= panel.y + panel.height
    );
  }

  // 🎯 
  static areCharactersOverlapping(
    character1: Character,
    character2: Character,
    panels: Panel[]
  ): boolean {
    const panel1 = panels.find(p => p.id === character1.panelId);
    const panel2 = panels.find(p => p.id === character2.panelId);
    
    if (!panel1 || !panel2) return false;
    
    const bounds1 = CharacterBounds.getCharacterBounds(character1, panel1);
    const bounds2 = CharacterBounds.getCharacterBounds(character2, panel2);
    
    // 
    return !(
      bounds1.x + bounds1.width < bounds2.x ||
      bounds2.x + bounds2.width < bounds1.x ||
      bounds1.y + bounds1.height < bounds2.y ||
      bounds2.y + bounds2.height < bounds1.y
    );
  }

  // 🎯 
  static calculateSnapPosition(
    character: Character,
    panel: Panel,
    snapSettings: { enabled: boolean; gridSize: number; sensitivity: number }
  ): { x: number; y: number } {
    if (!snapSettings.enabled) {
      return { x: character.x, y: character.y };
    }
    
    const bounds = CharacterBounds.getCharacterBounds(character, panel);
    const { gridSize } = snapSettings;
    
    // Calculate the position closest to the grid
    const snappedX = Math.round(bounds.centerX / gridSize) * gridSize;
    const snappedY = Math.round(bounds.centerY / gridSize) * gridSize;
    
    // 
    if (character.isGlobalPosition) {
      return { x: snappedX, y: snappedY };
    } else {
      return {
        x: (snappedX - panel.x) / panel.width,
        y: (snappedY - panel.y) / panel.height
      };
    }
  }

  // 🎯 
  static debugBoundsInfo(
    character: Character,
    panel: Panel,
    operation: string
  ): void {
    const bounds = CharacterBounds.getCharacterBounds(character, panel);
    const rotation = character.rotation || 0;
    
    console.log(`🔍  [${operation}]:`, {
      character: character.name,
      bounds: {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
        centerX: Math.round(bounds.centerX),
        centerY: Math.round(bounds.centerY)
      },
      rotation: Math.round(rotation),
      panel: {
        id: panel.id,
        x: panel.x,
        y: panel.y,
        width: panel.width,
        height: panel.height
      }
    });
  }
}