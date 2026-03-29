// src/components/CanvasArea/renderers/CharacterRenderer/CharacterRotation.ts
import { Character, Panel } from "../../../../types";
import { CharacterUtils } from "./utils/CharacterUtils";
import { CharacterBounds } from "./utils/CharacterBounds";

/**
 * Character rotation exclusive class
 * 2DIntegrated management of rotation operations, drawings and calculations
 */
export class CharacterRotation {

  // 🔄 
  static rotateCharacter(character: Character, newRotation: number): Character {
    const normalizedRotation = CharacterUtils.normalizeAngle(newRotation);
    
    console.log(`🔄 : ${character.name} → ${Math.round(normalizedRotation)}°`);
    
    return {
      ...character,
      rotation: normalizedRotation
    };
  }

  // 🎨 Rotating handle drawing (unified coordinate revision)
  static drawRotationHandle(
    ctx: CanvasRenderingContext2D, 
    character: Character, 
    panel: Panel,
    bounds: any
  ) {
    // 🔧 CharacterBounds
    const characterBounds = CharacterBounds.getCharacterBounds(character, panel);
    const handleDistance = 35;
    const handleRadius = 20;
    const handleX = characterBounds.centerX;
    const handleY = characterBounds.y - handleDistance;
    
    console.log("🎨 Rotating handle drawing (coordinate unified version):", {
      handleX,
      handleY,
      characterBounds,
      calculation: `${characterBounds.y} - ${handleDistance} = ${handleY}`
    });

    ctx.save();
    
    // Connection line (from the top of the character to the rotating handle)
    ctx.strokeStyle = "rgba(255, 102, 0, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(characterBounds.centerX, characterBounds.y);
    ctx.lineTo(handleX, handleY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#4a90e2";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(handleX, handleY, handleRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // 
    const innerRadius = handleRadius * 0.6;
    const arrowSize = handleRadius * 0.3;
    
    // 
    ctx.strokeStyle = "#4a90e2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(handleX, handleY, innerRadius, -Math.PI/2, Math.PI);
    ctx.stroke();
    
    // 
    const arrowX = handleX + innerRadius * Math.cos(Math.PI);
    const arrowY = handleY + innerRadius * Math.sin(Math.PI);
    
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize/2);
    ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize/2);
    ctx.closePath();
    ctx.fill();
    
    // 
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(handleX, handleY, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // 🎯 
  static startRotation(
    character: Character,
    panel: Panel,
    mouseX: number,
    mouseY: number
  ): {
    startAngle: number;
    originalRotation: number;
  } {
    const { centerX, centerY } = CharacterUtils.calculateCenterCoordinates(character, panel);
    const startAngle = CharacterUtils.calculateAngle(centerX, centerY, mouseX, mouseY);
    const originalRotation = character.rotation || 0;

    console.log("🔄 :", {
      character: character.name,
      startAngle: Math.round(startAngle),
      originalRotation: Math.round(originalRotation),
      center: { x: Math.round(centerX), y: Math.round(centerY) }
    });

    return {
      startAngle,
      originalRotation
    };
  }

  // 🎯 
  static updateRotation(
    character: Character,
    panel: Panel,
    mouseX: number,
    mouseY: number,
    startAngle: number,
    originalRotation: number
  ): Character {
    const { centerX, centerY } = CharacterUtils.calculateCenterCoordinates(character, panel);
    const currentAngle = CharacterUtils.calculateAngle(centerX, centerY, mouseX, mouseY);
    
    // 
    const angleDiff = CharacterUtils.calculateAngleDifference(startAngle, currentAngle);
    const newRotation = CharacterUtils.normalizeAngle(originalRotation + angleDiff);
    
    // 
    return CharacterRotation.rotateCharacter(character, newRotation);
  }

  // 🎯 15
  static snapRotation(character: Character, snapEnabled: boolean = false): Character {
    if (!snapEnabled) return character;
    
    const currentRotation = character.rotation || 0;
    const snapAngle = 15; // 15
    const snappedRotation = Math.round(currentRotation / snapAngle) * snapAngle;
    
    if (Math.abs(currentRotation - snappedRotation) < 5) {
      console.log(`📐 : ${Math.round(currentRotation)}° → ${snappedRotation}°`);
      return CharacterRotation.rotateCharacter(character, snappedRotation);
    }
    
    return character;
  }

  // 🔄 
  static resetRotation(character: Character): Character {
    console.log(`🔄 : ${character.name}`);
    return CharacterRotation.rotateCharacter(character, 0);
  }

  // 🎯 
  static validateRotation(rotation: number): number {
    // NaN
    if (!isFinite(rotation) || isNaN(rotation)) {
      console.warn("⚠️ 0");
      return 0;
    }
    
    return CharacterUtils.normalizeAngle(rotation);
  }

  // 🎨 Draw Rotation Trajectory (for debugging)
  static drawRotationPath(
    ctx: CanvasRenderingContext2D,
    character: Character,
    panel: Panel,
    startAngle: number,
    currentAngle: number
  ) {
    const { centerX, centerY } = CharacterUtils.calculateCenterCoordinates(character, panel);
    const radius = 60;

    ctx.save();
    ctx.strokeStyle = "rgba(74, 144, 226, 0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // 
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.stroke();
    
    // 
    ctx.fillStyle = "#4a90e2";
    ctx.beginPath();
    ctx.arc(
      centerX + radius * Math.cos(startAngle),
      centerY + radius * Math.sin(startAngle),
      4, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 
    ctx.fillStyle = "#ff6600";
    ctx.beginPath();
    ctx.arc(
      centerX + radius * Math.cos(currentAngle),
      centerY + radius * Math.sin(currentAngle),
      4, 0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.restore();
  }

  // 🔄 Preset rotation (common angles)
  static applyPresetRotation(character: Character, preset: string): Character {
    const presetAngles: { [key: string]: number } = {
      'reset': 0,
      'right': 90,
      'down': 180,
      'left': 270,
      'slight-right': 15,
      'slight-left': -15,
      'back-right': 45,
      'back-left': -45
    };
    
    const angle = presetAngles[preset];
    if (angle !== undefined) {
      console.log(`🔄 : ${preset} (${angle}°)`);
      return CharacterRotation.rotateCharacter(character, angle);
    }
    
    console.warn(`⚠️ : ${preset}`);
    return character;
  }

  // 🎯 
  static getRotationInfo(character: Character): {
    rotation: number;
    rotationDegrees: string;
    rotationRadians: number;
    quadrant: number;
    isRotated: boolean;
  } {
    const rotation = character.rotation || 0;
    const radians = (rotation * Math.PI) / 180;
    const quadrant = Math.floor((rotation % 360) / 90) + 1;
    
    return {
      rotation,
      rotationDegrees: `${Math.round(rotation)}°`,
      rotationRadians: radians,
      quadrant,
      isRotated: Math.abs(rotation % 360) > 0.1
    };
  }
}