// src/components/CanvasArea/renderers/CharacterBodyRenderer.tsx ()
// types.ts
import { Character } from "../../../types";

export class CharacterBodyRenderer {
  // =====  =====
  static drawBodyHalf(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number,
    bodyStartY: number
  ) {
    // 🔧 types.ts
    const pose = character.action || "standing";  // bodyPose → action
    const direction = character.facing || "front";  // bodyDirection/faceAngle → facing
    const bodyWidth = charWidth * 0.7;
    const bodyHeight = charHeight * 0.55;
    const bodyX = charX + charWidth / 2 - bodyWidth / 2;
    const bodyY = bodyStartY;

    // 
    switch (pose) {
      case "sitting":
        CharacterBodyRenderer.drawSittingBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
        break;
      case "walking":
        CharacterBodyRenderer.drawWalkingBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
        break;
      case "pointing":
        CharacterBodyRenderer.drawPointingBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
        break;
      case "waving":
        CharacterBodyRenderer.drawWavingBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
        break;
      case "arms_crossed":
        CharacterBodyRenderer.drawArmsCrossedBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
        break;
      case "thinking":
        CharacterBodyRenderer.drawThinkingBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
        break;
      default: // standing
        CharacterBodyRenderer.drawStandingBody(ctx, bodyX, bodyY, bodyWidth, bodyHeight, direction);
    }
  }

  // 
  static drawStandingBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    switch (direction) {
      case "back":
      case "leftBack":
      case "rightBack":
        CharacterBodyRenderer.drawBodyBack(ctx, x, y, w, h);
        break;
      case "left":
      case "leftFront":
        CharacterBodyRenderer.drawBodySide(ctx, x, y, w, h, "left");
        break;
      case "right":
      case "rightFront":
        CharacterBodyRenderer.drawBodySide(ctx, x, y, w, h, "right");
        break;
      default:
        CharacterBodyRenderer.drawBodyFront(ctx, x, y, w, h);
    }
  }

  // 
  static drawSittingBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    // 
    const torsoHeight = h * 0.6;
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.roundRect(x, y, w, torsoHeight, 8);
    ctx.fill();
    
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    const legY = y + torsoHeight - h * 0.1;
    ctx.fillStyle = "#1976D2";
    ctx.beginPath();
    ctx.roundRect(x + w * 0.1, legY, w * 0.8, h * 0.3, 4);
    ctx.fill();
    
    ctx.strokeStyle = "#1565C0";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    CharacterBodyRenderer.drawArms(ctx, x, y, w, h, "sitting", direction);
  }

  // 
  static drawWalkingBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    // 
    ctx.save();
    ctx.translate(x + w/2, y + h/2);
    ctx.rotate(direction === "right" ? 0.05 : -0.05);
    
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.roundRect(-w/2, -h/2, w, h * 0.7, 8);
    ctx.fill();
    
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();

    // 
    CharacterBodyRenderer.drawArms(ctx, x, y, w, h, "walking", direction);
  }

  // 
  static drawPointingBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    // 
    CharacterBodyRenderer.drawBodyFront(ctx, x, y, w, h);
    
    // 
    const armW = w * 0.12;
    const armH = h * 0.6;
    
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(x + w, y + h * 0.2, armW * 2, armH, 4);
    ctx.fill();
    
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(x + w + armW * 2, y + h * 0.3, armW * 0.5, armH * 0.3, 2);
    ctx.fill();
    ctx.stroke();
  }

  // 
  static drawWavingBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    // 
    CharacterBodyRenderer.drawBodyFront(ctx, x, y, w, h);
    
    // 
    const armW = w * 0.12;
    const armH = h * 0.5;
    
    ctx.save();
    ctx.translate(x + w + armW/2, y + h * 0.1);
    ctx.rotate(-0.3);
    
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(-armW/2, 0, armW, armH, 4);
    ctx.fill();
    
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();

    // 
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(x - armW/2, y + h * 0.1, armW, armH, 4);
    ctx.fill();
    ctx.stroke();
  }

  // 
  static drawArmsCrossedBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    // 
    CharacterBodyRenderer.drawBodyFront(ctx, x, y, w, h);
    
    // 
    const armW = w * 0.15;
    const armH = h * 0.4;
    
    // 
    ctx.save();
    ctx.translate(x + w * 0.7, y + h * 0.3);
    ctx.rotate(-0.3);
    
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(-armW/2, 0, armW, armH, 4);
    ctx.fill();
    
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();

    // 
    ctx.save();
    ctx.translate(x + w * 0.3, y + h * 0.3);
    ctx.rotate(0.3);
    
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(-armW/2, 0, armW, armH, 4);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }

  // 
  static drawThinkingBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: string
  ) {
    // 
    CharacterBodyRenderer.drawBodyFront(ctx, x, y, w, h);
    
    // 
    const armW = w * 0.12;
    const armH = h * 0.3;
    
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(x + w * 0.8, y + h * 0.1, armW, armH, 4);
    ctx.fill();
    
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    ctx.beginPath();
    ctx.roundRect(x - armW/2, y + h * 0.1, armW, h * 0.5, 4);
    ctx.fill();
    ctx.stroke();
  }

  // 
  static drawArms(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    pose: string,
    direction: string
  ) {
    const armW = w * 0.18;
    const armH = h * 0.75;
    
    ctx.fillStyle = "#FFCCAA";
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 0.5;

    switch (pose) {
      case "walking":
        // 
        // 
        ctx.save();
        ctx.translate(x, y + h * 0.1);
        ctx.rotate(0.2);
        ctx.beginPath();
        ctx.roundRect(-armW/2, 0, armW, armH, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 
        ctx.save();
        ctx.translate(x + w, y + h * 0.1);
        ctx.rotate(-0.2);
        ctx.beginPath();
        ctx.roundRect(-armW/2, 0, armW, armH, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        break;
        
      default:
        // 
        ctx.beginPath();
        ctx.roundRect(x - armW / 2, y + h * 0.1, armW, armH, 4);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.roundRect(x + w - armW / 2, y + h * 0.1, armW, armH, 4);
        ctx.fill();
        ctx.stroke();
    }
  }

  // 
  static drawBodyFront(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // 
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    ctx.fillStyle = "#2E7D32";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h * 0.2 + i * h * 0.2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 
    CharacterBodyRenderer.drawArms(ctx, x, y, w, h, "standing", "front");
  }

  // 
  static drawBodyBack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // 
    ctx.fillStyle = "#2E7D32";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    
    ctx.strokeStyle = "#1B5E20";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    ctx.strokeStyle = "#1B5E20";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.15, y + h * 0.1);
    ctx.lineTo(x + w * 0.85, y + h * 0.1);
    ctx.stroke();
  }

  // 
  static drawBodySide(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, direction: "left" | "right") {
    // 
    const sideW = w * 0.6;
    const sideX = x + (w - sideW) / 2;
    
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.roundRect(sideX, y, sideW, h, 6);
    ctx.fill();
    
    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 1
    const armW = w * 0.12;
    const armH = h * 0.75;
    const armX = direction === "left" ? sideX - armW / 2 : sideX + sideW - armW / 2;
    
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    ctx.roundRect(armX, y + h * 0.1, armW, armH, 3);
    ctx.fill();
    
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // 
  static drawBodyFull(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number,
    bodyStartY: number
  ) {
    // 
    CharacterBodyRenderer.drawBodyHalf(ctx, character, charX, charY, charWidth, charHeight * 0.5, bodyStartY);
    
    // 
    const legStartY = bodyStartY + charHeight * 0.3;
    const legWidth = charWidth * 0.5;
    const legHeight = charHeight * 0.45;
    const legX = charX + charWidth / 2 - legWidth / 2;
    
    // 🔧 types.ts
    // 
    const pose = character.action || "standing";  // bodyPose → action
    switch (pose) {
      case "walking":
        CharacterBodyRenderer.drawWalkingLegs(ctx, legX, legStartY, legWidth, legHeight);
        break;
      case "sitting":
        // Do not draw legs when sitting
        break;
      default:
        CharacterBodyRenderer.drawStandingLegs(ctx, legX, legStartY, legWidth, legHeight);
    }
  }

  // 🎯 
  static drawBodyChestUp(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number,
    bodyStartY: number
  ) {
    // 
    CharacterBodyRenderer.drawBodyHalf(ctx, character, charX, charY, charWidth, charHeight, bodyStartY);
  }

  // 🎯 3/4
  static drawBodyThreeQuarters(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number,
    bodyStartY: number
  ) {
    // 
    CharacterBodyRenderer.drawBodyHalf(ctx, character, charX, charY, charWidth, charHeight * 0.6, bodyStartY);
    
    // 
    const legStartY = bodyStartY + charHeight * 0.4;
    const legWidth = charWidth * 0.5;
    const legHeight = charHeight * 0.3; // 
    const legX = charX + charWidth / 2 - legWidth / 2;
    
    // 
    const pose = character.action || "standing";
    switch (pose) {
      case "walking":
        CharacterBodyRenderer.drawWalkingLegs(ctx, legX, legStartY, legWidth, legHeight);
        break;
      case "sitting":
        // Do not draw legs when sitting
        break;
      default:
        CharacterBodyRenderer.drawStandingLegs(ctx, legX, legStartY, legWidth, legHeight);
    }
  }

  // 
  static drawStandingLegs(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    // 
    ctx.fillStyle = "#1976D2";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    
    ctx.strokeStyle = "#1565C0";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 
    const feetWidth = w * 1.1;
    const feetHeight = h * 0.1;
    const feetX = x - (feetWidth - w) / 2;
    const feetY = y + h;
    
    ctx.fillStyle = "#5D4037";
    ctx.beginPath();
    ctx.roundRect(feetX, feetY, feetWidth, feetHeight, 3);
    ctx.fill();
    
    ctx.strokeStyle = "#3E2723";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // 
  static drawWalkingLegs(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const legW = w * 0.4;
    
    // 
    ctx.save();
    ctx.translate(x + w * 0.2, y);
    ctx.rotate(0.1);
    
    ctx.fillStyle = "#1976D2";
    ctx.beginPath();
    ctx.roundRect(0, 0, legW, h, 4);
    ctx.fill();
    
    ctx.strokeStyle = "#1565C0";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();

    // 
    ctx.save();
    ctx.translate(x + w * 0.6, y);
    ctx.rotate(-0.1);
    
    ctx.fillStyle = "#1976D2";
    ctx.beginPath();
    ctx.roundRect(0, 0, legW, h, 4);
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();

    // 2
    CharacterBodyRenderer.drawStandingLegs(ctx, x, y, w, h);
  }
}