// src/components/CanvasArea/renderers/CharacterRenderer/utils/CharacterUtils.ts
// 🔧 2

import { Character, Panel } from "../../../../../types";

export class CharacterUtils {
  
  // 🎯 
  static getCharacterWidth(character: Character): number {
    // width
    if (character.width !== undefined && character.width > 0) {
      return character.width;
    }
    
    // scale
    const baseWidth = 100; // 400 → 100 
    let typeMultiplier = 1.0;
    
    switch (character.viewType) {
      case "face": typeMultiplier = 0.8; break;
      case "close_up_face": typeMultiplier = 1.2; break; // 
      case "upper_body": typeMultiplier = 1.0; break; // 🔧 : halfBody → upper_body
      case "chest_up": typeMultiplier = 1.1; break; // 
      case "three_quarters": typeMultiplier = 1.3; break; // 
      case "full_body": typeMultiplier = 1.1; break; // 🔧 : fullBody → full_body
      default: typeMultiplier = 1.0;
    }
    
    return baseWidth * character.scale * typeMultiplier;
  }

  // 🎯 
  static getCharacterHeight(character: Character): number {
    // height
    if (character.height !== undefined && character.height > 0) {
      return character.height;
    }
    
    // scale
    const baseHeight = 80; // 320 → 80 
    let typeMultiplier = 1.0;
    
    switch (character.viewType) {
      case "face": typeMultiplier = 0.8; break;
      case "close_up_face": typeMultiplier = 1.0; break; // 
      case "upper_body": typeMultiplier = 1.2; break; // 🔧 : halfBody → upper_body
      case "chest_up": typeMultiplier = 1.4; break; // 
      case "three_quarters": typeMultiplier = 1.6; break; // 
      case "full_body": typeMultiplier = 1.8; break; // 🔧 : fullBody → full_body
      default: typeMultiplier = 1.0;
    }
    
    return baseHeight * character.scale * typeMultiplier;
  }

  // 🎯 Character bounding box calculation (integrated version)
  static getCharacterBounds(character: Character, panel?: Panel): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    let charX, charY, charWidth, charHeight;
    
    if (character.isGlobalPosition) {
      charWidth = CharacterUtils.getCharacterWidth(character);
      charHeight = CharacterUtils.getCharacterHeight(character);
      charX = character.x - charWidth / 2;
      charY = character.y - charHeight / 2;
    } else if (panel) {
      charWidth = 400 * character.scale; // 200 → 400 
      charHeight = 320 * character.scale; // 160 → 320 
      charX = panel.x + panel.width * character.x - charWidth / 2;
      charY = panel.y + panel.height * character.y - charHeight / 2;
    } else {
      // 
      charWidth = 400 * character.scale; // 200 → 400 
      charHeight = 320 * character.scale; // 160 → 320 
      charX = character.x - charWidth / 2;
      charY = character.y - charHeight / 2;
    }

    return { x: charX, y: charY, width: charWidth, height: charHeight };
  }

  // 🎯 
  static calculateDrawingCoordinates(
    character: Character,
    panel: Panel
  ): {
    charX: number;
    charY: number;
    charWidth: number;
    charHeight: number;
  } {
    let charX, charY, charWidth, charHeight;
    
    if (character.isGlobalPosition) {
      charWidth = CharacterUtils.getCharacterWidth(character);
      charHeight = CharacterUtils.getCharacterHeight(character);
      charX = character.x - charWidth / 2;
      charY = character.y - charHeight / 2;
      console.log(`🌍  [${character.name}]:`, { charWidth, charHeight, scale: character.scale });
    } else {
      charWidth = 100 * character.scale; // 400 → 100 
      charHeight = 80 * character.scale; // 320 → 80 
      charX = panel.x + panel.width * character.x - charWidth / 2;
      charY = panel.y + panel.height * character.y - charHeight / 2;
      console.log(`📐  [${character.name}]:`, { charWidth, charHeight, scale: character.scale, x: character.x, y: character.y });
    }

    return { charX, charY, charWidth, charHeight };
  }

  // 🎯 
  static calculateCenterCoordinates(
    character: Character,
    panel: Panel
  ): { centerX: number; centerY: number } {
    const { charX, charY, charWidth, charHeight } = 
      CharacterUtils.calculateDrawingCoordinates(character, panel);
    
    return {
      centerX: charX + charWidth / 2,
      centerY: charY + charHeight / 2
    };
  }

  // 🎯 viewType
  static calculateHeadDimensions(
    charWidth: number,
    charHeight: number,
    charX: number,
    charY: number,
    viewType: string
  ): { headX: number; headY: number; headSize: number } {
    let headSize, headX, headY;
    
    switch (viewType) {
      case "face":
        headSize = Math.min(charWidth, charHeight) * 1.5; // 1.2 → 1.5 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight / 2 - headSize / 2;
        break;
        
      case "close_up_face":
        headSize = Math.min(charWidth, charHeight) * 1.8; // 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight / 2 - headSize / 2;
        break;
        
      case "upper_body": // 🔧 : halfBody → upper_body
        headSize = charWidth * 1.0; // 0.7 → 1.0 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight * 0.05;
        break;
        
      case "chest_up":
        headSize = charWidth * 1.1; // 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight * 0.03;
        break;
        
      case "three_quarters":
        headSize = charWidth * 0.8; // 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight * 0.02;
        break;
        
      case "full_body": // 🔧 : fullBody → full_body
        headSize = charWidth * 0.9; // 0.6 → 0.9 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight * 0.02;
        break;
        
      default:
        headSize = charWidth * 1.0; // 0.7 → 1.0 
        headX = charX + charWidth / 2 - headSize / 2;
        headY = charY + charHeight * 0.05;
    }
    
    return { headX, headY, headSize };
  }

  // 🎯 Y
  static calculateBodyStartY(
    charY: number,
    charHeight: number,
    headSize: number,
    viewType: string
  ): number {
    switch (viewType) {
      case "face":
        return charY + charHeight; // 
        
      case "close_up_face":
        return charY + charHeight; // 
        
      case "upper_body": // 🔧 : halfBody → upper_body
        return charY + charHeight * 0.05 + headSize;
        
      case "chest_up":
        return charY + charHeight * 0.03 + headSize;
        
      case "three_quarters":
        return charY + charHeight * 0.02 + headSize;
        
      case "full_body": // 🔧 : fullBody → full_body
        return charY + charHeight * 0.02 + headSize;
        
      default:
        return charY + charHeight * 0.05 + headSize;
    }
  }

  // 🎯 Display settings according to character type (gender difference correspondence)
  static getCharacterDisplayConfig(character: Character): {
    hairColor: string;
    hairStyle: string;
    bodyColor: string;
    defaultExpression: string;
    isFemale: boolean;
  } {
    // 🔧 characterIdnametypeFixed as judged by (partial match correspondence)
    const identifier = character.characterId || character.name || character.type;
    
    // 🔍 
    console.log(`🎨 : ${character.name}`, {
      characterId: character.characterId,
      name: character.name,
      type: character.type,
      identifier: identifier
    });
    
    // 
    if (identifier.includes("heroine") || identifier.includes("")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#D2691E", 
        hairStyle: "long",
        bodyColor: "#FF69B4", // 
        defaultExpression: "smiling",
        isFemale: true
      };
    }
    
    if (identifier.includes("rival") || identifier.includes("")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#2F4F4F", 
        hairStyle: "spiky",
        bodyColor: "#FF5722",
        defaultExpression: "angry",
        isFemale: false
      };
    }
    
    if (identifier.includes("friend") || identifier.includes("")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#A0522D",
        hairStyle: "curly",
        bodyColor: "#2196F3",
        defaultExpression: "smiling",
        isFemale: false
      };
    }
    
    // 🔧 character_1
    if (identifier.includes("character_1")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#8B4513",
        hairStyle: "normal",
        bodyColor: "#4CAF50", // 
        defaultExpression: "neutral_expression",
        isFemale: false
      };
    }
    
    // 🔧 character_2Type Special (Heroine)
    if (identifier.includes("character_2")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#D2691E", 
        hairStyle: "long",
        bodyColor: "#FF69B4", // 
        defaultExpression: "smiling",
        isFemale: true
      };
    }
    
    // 🔧 character_3Type Specialization (Rivals)
    if (identifier.includes("character_3")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#2F4F4F", 
        hairStyle: "spiky",
        bodyColor: "#FF5722",
        defaultExpression: "angry",
        isFemale: false
      };
    }
    
    // 🔧 character_4
    if (identifier.includes("character_4")) {
      console.log(`🎨 : ${character.name} → `);
      return {
        hairColor: "#A0522D",
        hairStyle: "curly",
        bodyColor: "#2196F3",
        defaultExpression: "smiling",
        isFemale: false
      };
    }
    
    // 
    console.log(`🎨 : ${character.name} → `);
    return {
      hairColor: "#8B4513",
      hairStyle: "normal",
      bodyColor: "#4CAF50", // 
      defaultExpression: "neutral_expression",
      isFemale: false
    };
  }

  // 🎯 
  static calculateAngle(
    centerX: number,
    centerY: number,
    mouseX: number,
    mouseY: number
  ): number {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // 0-360
    if (angle < 0) {
      angle += 360;
    }
    
    return angle;
  }

  // 🎯 0-360
  static normalizeAngle(angle: number): number {
    let normalized = angle % 360;
    if (normalized < 0) {
      normalized += 360;
    }
    return normalized;
  }

  // 🎯 
  static calculateAngleDifference(startAngle: number, currentAngle: number): number {
    let diff = currentAngle - startAngle;
    
    // -180 ~ 180
    if (diff > 180) {
      diff -= 360;
    } else if (diff < -180) {
      diff += 360;
    }
    
    return diff;
  }

  // 🎯 
  static snapToAngle(angle: number, snapInterval: number = 15): number {
    return Math.round(angle / snapInterval) * snapInterval;
  }

  // 🎯 
  static calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 🎯 
  static rotatePoint(
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    angleDegrees: number
  ): { x: number; y: number } {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    
    const translatedX = x - centerX;
    const translatedY = y - centerY;
    
    return {
      x: centerX + (translatedX * cos - translatedY * sin),
      y: centerY + (translatedX * sin + translatedY * cos)
    };
  }

  // 🎯 
  static calculateRotatedBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    angleDegrees: number
  ): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // 4
    const corners = [
      CharacterUtils.rotatePoint(x, y, centerX, centerY, angleDegrees),
      CharacterUtils.rotatePoint(x + width, y, centerX, centerY, angleDegrees),
      CharacterUtils.rotatePoint(x + width, y + height, centerX, centerY, angleDegrees),
      CharacterUtils.rotatePoint(x, y + height, centerX, centerY, angleDegrees)
    ];
    
    const xValues = corners.map(corner => corner.x);
    const yValues = corners.map(corner => corner.y);
    
    const minX = Math.min(...xValues);
    const minY = Math.min(...yValues);
    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);
    
    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  // 🎯 
  static validateScale(scale: number): number {
    return Math.max(0.5, Math.min(5.0, scale));
  }

  // 🎯 Coordinate Limit Check (fits inside canvas)
  static validatePosition(
    x: number, 
    y: number, 
    character: Character, 
    canvasWidth: number, 
    canvasHeight: number
  ): { x: number; y: number } {
    const width = CharacterUtils.getCharacterWidth(character);
    const height = CharacterUtils.getCharacterHeight(character);
    
    const minX = width / 2;
    const maxX = canvasWidth - width / 2;
    const minY = height / 2;
    const maxY = canvasHeight - height / 2;
    
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }

  // 🎯 Character resizing (integrated version)
  static resizeCharacter(
    character: Character,
    direction: string,
    deltaX: number,
    deltaY: number,
    initialScale: number
  ): Character {
    let scaleDelta = 0;
    
    switch (direction) {
      case "nw":
      case "sw":
        scaleDelta = -deltaX / 100; // 
        break;
      case "ne":
      case "se":
      case "e":
        scaleDelta = deltaX / 100; // 
        break;
      case "n":
        scaleDelta = -deltaY / 100; // 
        break;
      case "s":
        scaleDelta = deltaY / 100; // 
        break;
      case "w":
        scaleDelta = -deltaX / 100; // 
        break;
      default:
        scaleDelta = (deltaX + deltaY) / 200; // 
    }
    
    const newScale = CharacterUtils.validateScale(initialScale + scaleDelta);
    
    return {
      ...character,
      scale: newScale,
    };
  }

  // 

  // 
}