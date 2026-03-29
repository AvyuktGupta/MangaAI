// src/components/CanvasArea/renderers/CharacterRenderer/drawing/CharacterHair.ts
// 💇 Character Hair Drawing Class (Modified)

import { Character } from "../../../../../types";

export class CharacterHair {
  
  // 🎯 
  static drawHair(
    ctx: CanvasRenderingContext2D,
    character: Character,
    headX: number,
    headY: number,
    headSize: number,
    direction: string
  ) {
    const { hairColor, hairStyle } = CharacterHair.getHairStyle(character);
    
    ctx.fillStyle = hairColor;

    // 
    switch (hairStyle) {
      case "long":
        CharacterHair.drawLongHair(ctx, headX, headY, headSize, direction);
        break;
      case "spiky":
        CharacterHair.drawSpikyHair(ctx, headX, headY, headSize, direction);
        break;
      case "curly":
        CharacterHair.drawCurlyHair(ctx, headX, headY, headSize, direction);
        break;
      case "short":
        CharacterHair.drawShortHair(ctx, headX, headY, headSize, direction);
        break;
      case "ponytail":
        CharacterHair.drawPonytailHair(ctx, headX, headY, headSize, direction);
        break;
      default:
        CharacterHair.drawNormalHair(ctx, headX, headY, headSize, direction);
    }
  }

  // 🎯 Determining hair color and hairstyle by character type
  static getHairStyle(character: Character): { hairColor: string; hairStyle: string } {
    let hairColor = "#8B4513"; // 
    let hairStyle = "normal";
    
    switch (character.type) {
      case "heroine": 
        hairColor = "#D2691E"; // 
        hairStyle = "long";
        break;
      case "rival": 
        hairColor = "#2F4F4F"; // 
        hairStyle = "spiky";
        break;
      case "friend":
        hairColor = "#A0522D"; // 
        hairStyle = "curly";
        break;
      case "mentor":
        hairColor = "#696969"; // 
        hairStyle = "short";
        break;
      case "sister":
        hairColor = "#CD853F"; // 
        hairStyle = "ponytail";
        break;
      default: 
        hairColor = "#8B4513";
        hairStyle = "normal";
    }
    
    return { hairColor, hairStyle };
  }

  // 💇 
  static drawNormalHair(
    ctx: CanvasRenderingContext2D, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    const hairHeight = headSize * 0.3; // 🔧 : 0.4 → 0.3 
    const hairWidth = headSize * 0.8;
    const hairY = headY - headSize * 0.1; // 🔧 : 
    
    switch (direction) {
      case "back":
      case "leftBack":
      case "rightBack":
        // Backwards: Covers the entire hair
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.1, hairY, hairWidth, headSize * 0.6, 8);
        ctx.fill();
        break;
        
      case "left":
        // 
        ctx.beginPath();
        ctx.roundRect(headX, hairY, hairWidth * 0.7, hairHeight, 6);
        ctx.fill();
        break;
        
      case "right":
        // 
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.3, hairY, hairWidth * 0.7, hairHeight, 6);
        ctx.fill();
        break;
        
      default: // front, leftFront, rightFront
        // 
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.1, hairY, hairWidth, hairHeight, 6);
        ctx.fill();
    }
  }

  // 💇 
  static drawLongHair(
    ctx: CanvasRenderingContext2D, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    const hairHeight = headSize * 0.4; // 🔧 : 0.5 → 0.4 
    const hairWidth = headSize * 0.9;
    const hairY = headY - headSize * 0.1; // 🔧 : 
    
    // 
    ctx.beginPath();
    ctx.roundRect(headX + headSize * 0.05, hairY, hairWidth, hairHeight, 8);
    ctx.fill();
    
    // Draw long hair on the side if not facing backwards
    if (direction !== "back" && direction !== "leftBack" && direction !== "rightBack") {
      const sideHairW = headSize * 0.15;
      const sideHairH = headSize * 0.8;
      
      // 
      ctx.beginPath();
      ctx.roundRect(headX - sideHairW / 2, headY + headSize * 0.3, sideHairW, sideHairH, 4);
      ctx.fill();
      
      // 
      ctx.beginPath();
      ctx.roundRect(headX + headSize - sideHairW / 2, headY + headSize * 0.3, sideHairW, sideHairH, 4);
      ctx.fill();
      
      // 
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.7;
      
      for (let i = 0; i < 3; i++) {
        const lineY = headY + headSize * (0.4 + i * 0.15);
        ctx.beginPath();
        ctx.moveTo(headX + headSize * 0.2, lineY);
        ctx.quadraticCurveTo(
          headX + headSize * 0.3, 
          lineY + headSize * 0.1, 
          headX + headSize * 0.15, 
          lineY + headSize * 0.2
        );
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(headX + headSize * 0.8, lineY);
        ctx.quadraticCurveTo(
          headX + headSize * 0.7, 
          lineY + headSize * 0.1, 
          headX + headSize * 0.85, 
          lineY + headSize * 0.2
        );
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1.0;
    }
  }

  // 💇 
  static drawSpikyHair(
    ctx: CanvasRenderingContext2D, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    // If facing backwards, substitute normal hair
    if (direction === "back" || direction === "leftBack" || direction === "rightBack") {
      CharacterHair.drawNormalHair(ctx, headX, headY, headSize, direction);
      return;
    }
    
    // 
    const spikeCount = 6;
    for (let i = 0; i < spikeCount; i++) {
      const spikeX = headX + headSize * (0.1 + i * 0.15);
      const spikeY = headY;
      const spikeW = headSize * 0.08;
      const spikeH = headSize * (0.25 + Math.random() * 0.1); // 
      
      ctx.beginPath();
      ctx.moveTo(spikeX, spikeY + spikeH);
      ctx.lineTo(spikeX + spikeW / 2, spikeY);
      ctx.lineTo(spikeX + spikeW, spikeY + spikeH);
      ctx.closePath();
      ctx.fill();
      
      // 
      ctx.fillStyle = CharacterHair.darkenColor(ctx.fillStyle as string, 0.2);
      ctx.beginPath();
      ctx.moveTo(spikeX + spikeW * 0.6, spikeY + spikeH);
      ctx.lineTo(spikeX + spikeW / 2, spikeY);
      ctx.lineTo(spikeX + spikeW, spikeY + spikeH);
      ctx.closePath();
      ctx.fill();
      
      // 
      const { hairColor } = CharacterHair.getHairStyle({ type: "rival" } as Character);
      ctx.fillStyle = hairColor;
    }
  }

  // 💇 
  static drawCurlyHair(
    ctx: CanvasRenderingContext2D, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    const hairHeight = headSize * 0.45;
    const hairWidth = headSize * 0.85;
    
    // 
    ctx.beginPath();
    ctx.roundRect(headX + headSize * 0.075, headY, hairWidth, hairHeight, 10);
    ctx.fill();
    
    // Add wave decoration if not backwards
    if (direction !== "back" && direction !== "leftBack" && direction !== "rightBack") {
      const originalFillStyle = ctx.fillStyle;
      ctx.fillStyle = CharacterHair.lightenColor(originalFillStyle as string, 0.1);
      
      // 
      for (let row = 0; row < 4; row++) {
        const waveY = headY + headSize * (0.08 + row * 0.08);
        const waveCount = 4;
        
        for (let i = 0; i < waveCount; i++) {
          const waveX = headX + headSize * (0.15 + i * 0.18);
          const waveSize = headSize * 0.025;
          
          ctx.beginPath();
          ctx.arc(waveX, waveY, waveSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.fillStyle = originalFillStyle;
    }
  }

  // 💇 
  static drawShortHair(
    ctx: CanvasRenderingContext2D, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    const hairHeight = headSize * 0.3;
    const hairWidth = headSize * 0.75;
    
    switch (direction) {
      case "back":
      case "leftBack":
      case "rightBack":
        // 
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.125, headY, hairWidth, headSize * 0.6, 6);
        ctx.fill();
        break;
        
      case "left":
        // 
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.05, headY, hairWidth * 0.6, hairHeight, 4);
        ctx.fill();
        break;
        
      case "right":
        // 
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.35, headY, hairWidth * 0.6, hairHeight, 4);
        ctx.fill();
        break;
        
      default:
        // 
        ctx.beginPath();
        ctx.roundRect(headX + headSize * 0.125, headY, hairWidth, hairHeight, 4);
        ctx.fill();
        
        // 
        ctx.strokeStyle = CharacterHair.darkenColor(ctx.fillStyle as string, 0.3);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(headX + headSize * 0.5, headY + headSize * 0.02);
        ctx.lineTo(headX + headSize * 0.48, headY + hairHeight * 0.7);
        ctx.stroke();
    }
  }

  // 💇 
  static drawPonytailHair(
    ctx: CanvasRenderingContext2D, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    const hairHeight = headSize * 0.35;
    const hairWidth = headSize * 0.8;
    
    // 
    ctx.beginPath();
    ctx.roundRect(headX + headSize * 0.1, headY, hairWidth, hairHeight, 6);
    ctx.fill();
    
    // 
    switch (direction) {
      case "back":
      case "leftBack":
      case "rightBack":
        // Backwards: Ponytail visible
        const ponytailX = headX + headSize * 0.5;
        const ponytailY = headY + headSize * 0.4;
        const ponytailW = headSize * 0.12;
        const ponytailH = headSize * 0.5;
        
        ctx.beginPath();
        ctx.roundRect(ponytailX - ponytailW/2, ponytailY, ponytailW, ponytailH, 3);
        ctx.fill();
        
        // 
        ctx.fillStyle = "#8B4513";
        ctx.beginPath();
        ctx.roundRect(ponytailX - ponytailW/2 - 1, ponytailY, ponytailW + 2, headSize * 0.05, 2);
        ctx.fill();
        break;
        
      case "left":
        // 
        const leftPonytailX = headX + headSize * 0.85;
        const leftPonytailY = headY + headSize * 0.4;
        
        ctx.beginPath();
        ctx.roundRect(leftPonytailX, leftPonytailY, headSize * 0.08, headSize * 0.4, 3);
        ctx.fill();
        break;
        
      case "right":
        // 
        const rightPonytailX = headX + headSize * 0.05;
        const rightPonytailY = headY + headSize * 0.4;
        
        ctx.beginPath();
        ctx.roundRect(rightPonytailX, rightPonytailY, headSize * 0.08, headSize * 0.4, 3);
        ctx.fill();
        break;
        
      default:
        // Front: Ponytail invisible but hair bundled
        ctx.strokeStyle = CharacterHair.darkenColor(ctx.fillStyle as string, 0.2);
        ctx.lineWidth = 1;
        
        // 
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(headX + headSize * (0.3 + i * 0.2), headY + headSize * 0.25);
          ctx.quadraticCurveTo(
            headX + headSize * 0.5, 
            headY + headSize * 0.35, 
            headX + headSize * (0.3 + i * 0.2), 
            headY + headSize * 0.4
          );
          ctx.stroke();
        }
    }
  }

  // 🎨 
  static darkenColor(color: string, factor: number): string {
    // 
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const newR = Math.max(0, Math.floor(r * (1 - factor)));
      const newG = Math.max(0, Math.floor(g * (1 - factor)));
      const newB = Math.max(0, Math.floor(b * (1 - factor)));
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  static lightenColor(color: string, factor: number): string {
    // 
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
      const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
      const newB = Math.min(255, Math.floor(b + (255 - b) * factor));
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  // 🎯 
  static getHairColorVariations(): Record<string, string> {
    return {
      black: "#2C1B18",
      darkBrown: "#8B4513", 
      brown: "#D2691E",
      lightBrown: "#CD853F",
      blonde: "#F0E68C",
      red: "#B22222",
      auburn: "#A0522D",
      gray: "#696969",
      silver: "#C0C0C0",
      blue: "#4169E1",
      green: "#228B22",
      purple: "#8A2BE2"
    };
  }

  // 🎯 Recommended hair color by character type
  static getRecommendedHairColor(characterType: string): string {
    const colors = CharacterHair.getHairColorVariations();
    
    switch (characterType) {
      case "protagonist": return colors.brown;
      case "heroine": return colors.lightBrown;
      case "rival": return colors.darkBrown;
      case "friend": return colors.auburn;
      case "mentor": return colors.gray;
      case "sister": return colors.blonde;
      case "mysterious": return colors.silver;
      case "villain": return colors.black;
      default: return colors.brown;
    }
  }

  // 🎯 
  static getAvailableHairStyles(): Array<{
    id: string;
    name: string;
    description: string;
    suitableFor: string[];
  }> {
    return [
      {
        id: "normal",
        name: "",
        description: "Orthodox short hair",
        suitableFor: ["protagonist", "friend"]
      },
      {
        id: "long", 
        name: "",
        description: "",
        suitableFor: ["heroine", "mysterious"]
      },
      {
        id: "spiky",
        name: "", 
        description: "",
        suitableFor: ["rival", "protagonist"]
      },
      {
        id: "curly",
        name: "",
        description: "", 
        suitableFor: ["friend", "sister"]
      },
      {
        id: "short",
        name: "",
        description: "",
        suitableFor: ["mentor", "teacher"]
      },
      {
        id: "ponytail", 
        name: "",
        description: "",
        suitableFor: ["sister", "athlete"]
      }
    ];
  }

  // 🎯 Hair information output for debugging (modified version)
  static debugHairInfo(character: Character, headSize: number): void {
    const { hairColor, hairStyle } = CharacterHair.getHairStyle(character);
    
    console.log(`💇  [${character.name}]:`, {
      characterType: character.type,
      hairStyle,
      hairColor,
      headSize: Math.round(headSize),
      bodyDirection: character.facing || "front" // 🔧 : bodyDirection/faceAngle → facing
    });
  }

  // 🎯 For hair animation (future expansion)
  static calculateHairAnimation(
    character: Character,
    animationFrame: number,
    windStrength: number = 0
  ): {
    offsetX: number;
    offsetY: number;
    waveIntensity: number;
  } {
    const { hairStyle } = CharacterHair.getHairStyle(character);
    
    // Animation intensity according to hairstyle
    let animationStrength = 1.0;
    switch (hairStyle) {
      case "long": animationStrength = 1.5; break;
      case "curly": animationStrength = 0.7; break;
      case "short": animationStrength = 0.3; break;
      case "spiky": animationStrength = 0.5; break;
      default: animationStrength = 1.0;
    }
    
    const time = animationFrame * 0.1;
    const baseWave = Math.sin(time) * animationStrength;
    
    return {
      offsetX: baseWave * windStrength * 2,
      offsetY: Math.abs(baseWave) * windStrength,
      waveIntensity: baseWave * 0.5 + 0.5 // 0-1
    };
  }
}