// src/components/CanvasArea/renderers/CharacterRenderer/CharacterRenderer.tsx 
// 🔧 Separate class integrated version (greatly reduced/high quality)
// types.ts

// CharacterRenderer.tsx
import { Character, Panel } from "../../../../types"; // ← ../1
import { CharacterRotation } from "./CharacterRotation";
import { CharacterUtils } from "./utils/CharacterUtils";
import { CharacterBounds } from "./utils/CharacterBounds";
import { CharacterHair } from "./drawing/CharacterHair";
import { CharacterBodyRenderer } from "../CharacterBodyRenderer";

export class CharacterRenderer {
  
  // 🎯 Character group drawing (main control)
  // 1. drawCharacters getCharacterDisplayName 
  static drawCharacters(
    ctx: CanvasRenderingContext2D,
    characters: Character[],
    panels: Panel[],
    selectedCharacter: Character | null,
    getCharacterDisplayName?: (character: Character) => string // 🆕 
  ) {
    characters.forEach((character) => {
      const panel = panels.find((p) => String(p.id) === String(character.panelId));
      
      if (!panel) {
        console.warn(`⚠️  - ${character.name} (ID: ${character.panelId})`);
        const fallbackPanel = panels[0];
        if (fallbackPanel) {
          console.log(`🚑 : ${fallbackPanel.id}`);
          CharacterRenderer.drawCharacter(ctx, character, fallbackPanel, selectedCharacter, getCharacterDisplayName);
        }
        return;
      }
      
      CharacterRenderer.drawCharacter(ctx, character, panel, selectedCharacter, getCharacterDisplayName);
    });
  }

  // 🎯 Individual character drawing (rotation correspondence/separation class utilization)
  // 2. drawCharacter getCharacterDisplayName 
  static drawCharacter(
    ctx: CanvasRenderingContext2D,
    character: Character,
    panel: Panel,
    selectedCharacter: Character | null,
    getCharacterDisplayName?: (character: Character) => string // 🆕 
  ) {
    // 🔧 Drawing coordinate calculation (using isolation class)
    const { charX, charY, charWidth, charHeight } = 
      CharacterUtils.calculateDrawingCoordinates(character, panel);
    
    // 🔄 
    const rotation = character.rotation || 0;
    
    // 🔄 
    if (rotation !== 0) {
      ctx.save();
      const { centerX, centerY } = CharacterUtils.calculateCenterCoordinates(character, panel);
      
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      
      console.log(`🔄  [${character.name}]: ${rotation}°`);
    }

    // 🎯 
    if (character === selectedCharacter) {
      CharacterRenderer.drawSelectionBackground(ctx, charX, charY, charWidth, charHeight);
    }

    // 🎯 
    CharacterRenderer.drawCharacterBody(ctx, character, charX, charY, charWidth, charHeight);

    // 🎯  - 🔧 
    CharacterRenderer.drawCharacterName(ctx, character, charX, charY, charWidth, charHeight, getCharacterDisplayName);

    // 🔄 
    if (rotation !== 0) {
      ctx.restore();
    }

    // 🎯 Handle drawing on selection (run without rotation conversion)
    if (character === selectedCharacter) {
      CharacterRenderer.drawSelectionHandles(ctx, character, panel);
    }
  }

  // 🎯 
  static drawSelectionBackground(
    ctx: CanvasRenderingContext2D,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const padding = 5;
    
    // 
    ctx.fillStyle = "rgba(255, 102, 0, 0.2)";
    ctx.fillRect(charX - padding, charY - padding, charWidth + padding * 2, charHeight + padding * 2);
    
    // 
    ctx.strokeStyle = "#ff6600";
    ctx.lineWidth = 2;
    ctx.strokeRect(charX - padding, charY - padding, charWidth + padding * 2, charHeight + padding * 2);
    
    // 
    ctx.strokeStyle = "rgba(255, 102, 0, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(charX, charY, charWidth, charHeight);
    ctx.setLineDash([]);
  }

  // 🎯 Handle Drawing on Selection (Resize + 
  static drawSelectionHandles(
    ctx: CanvasRenderingContext2D,
    character: Character,
    panel: Panel
  ) {
    const { charX, charY, charWidth, charHeight } = 
      CharacterUtils.calculateDrawingCoordinates(character, panel);
    
    // 🔧 Resize Handle Drawing (Square with Four Corners)
    CharacterRenderer.drawResizeHandles(ctx, charX, charY, charWidth, charHeight);
    
    // 🔄 
    const bounds = CharacterBounds.getCharacterBounds(character, panel);
    CharacterRotation.drawRotationHandle(ctx, character, panel, bounds);
  }

  // 🔧 Resize Handle Drawing (Revised)
  static drawResizeHandles(
    ctx: CanvasRenderingContext2D,
    charX: number,
    charY: number,
    width: number,
    height: number
  ) {
    const handleSize = 12; // 
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    // 
    const corners = [
      { x: charX - handleSize/2, y: charY - handleSize/2 }, // 
      { x: charX + width - handleSize/2, y: charY - handleSize/2 }, // 
      { x: charX + width - handleSize/2, y: charY + height - handleSize/2 }, // 
      { x: charX - handleSize/2, y: charY + height - handleSize/2 }  // 
    ];

    // 
    ctx.fillStyle = "#ff6600"; // 
    ctx.strokeStyle = isDarkMode ? "#fff" : "#000"; // 
    ctx.lineWidth = 2;

    corners.forEach(corner => {
      // 
      ctx.fillRect(corner.x, corner.y, handleSize, handleSize);
      ctx.strokeRect(corner.x, corner.y, handleSize, handleSize);
    });
    
    console.log("🔧 Character Four Corner Handle Drawing Complete");
  }

  // CharacterRenderer.tsx  drawCharacterName 

  static drawCharacterName(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number,
    getCharacterDisplayName?: (character: Character) => string
  ) {
    // 🔧 
    const baseFontSize = 28; // 24 → 28 
    const fontSize = Math.max(20, baseFontSize * character.scale); // 16 → 20 
    const padding = 6;
    const textY = charY + charHeight + 25; // 12 → 25
    
    // 🌙 
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    // 🔧 
    const displayName = getCharacterDisplayName ? getCharacterDisplayName(character) : character.name;
    
    
    // Font settings (bold for better visibility)
    ctx.font = `bold ${fontSize}px 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 
    const textMetrics = ctx.measureText(displayName);
    const textWidth = textMetrics.width;
    const bgWidth = textWidth + padding * 2;
    const bgHeight = fontSize + padding * 2;
    const bgX = charX + charWidth / 2 - bgWidth / 2;
    const bgY = textY - bgHeight / 2;
    
    // 🌙 
    const colors = isDarkMode ? {
      shadow: 'rgba(0, 0, 0, 0.6)',
      background: 'rgba(45, 45, 45, 0.95)',
      border: 'rgba(255, 255, 255, 0.3)',
      textOutline: '#000000',
      textMain: '#ffffff'
    } : {
      shadow: 'rgba(0, 0, 0, 0.4)',
      background: 'rgba(255, 255, 255, 0.95)',
      border: 'rgba(0, 0, 0, 0.2)',
      textOutline: '#ffffff',
      textMain: '#2c3e50'
    };
    
    // 1. 
    ctx.save();
    ctx.fillStyle = colors.shadow;
    ctx.fillRect(bgX + 3, bgY + 3, bgWidth, bgHeight);
    ctx.restore();
    
    // 2. 
    ctx.save();
    ctx.fillStyle = colors.background;
    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 4);
    ctx.fill();
    ctx.restore();
    
    // 3. 
    ctx.save();
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 4);
    ctx.stroke();
    ctx.restore();
    
    // 4. 
    ctx.save();
    ctx.strokeStyle = colors.textOutline;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(displayName, charX + charWidth / 2, textY);
    ctx.restore();
    
    // 5. 
    ctx.save();
    ctx.fillStyle = colors.textMain;
    ctx.fillText(displayName, charX + charWidth / 2, textY);
    ctx.restore();
  }

  // 🎯 viewType
  static drawCharacterBody(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    // 🔧 viewType: types.ts
    switch (character.viewType) {
      case "face":
        CharacterRenderer.drawFaceOnly(ctx, character, charX, charY, charWidth, charHeight);
        break;
      case "close_up_face":
        CharacterRenderer.drawCloseUpFace(ctx, character, charX, charY, charWidth, charHeight);
        break;
      case "upper_body":  // halfBody → upper_body
        CharacterRenderer.drawHalfBody(ctx, character, charX, charY, charWidth, charHeight);
        break;
      case "chest_up":
        CharacterRenderer.drawChestUp(ctx, character, charX, charY, charWidth, charHeight);
        break;
      case "three_quarters":
        CharacterRenderer.drawThreeQuarters(ctx, character, charX, charY, charWidth, charHeight);
        break;
      case "full_body":   // fullBody → full_body
        CharacterRenderer.drawFullBody(ctx, character, charX, charY, charWidth, charHeight);
        break;
      default:
        CharacterRenderer.drawHalfBody(ctx, character, charX, charY, charWidth, charHeight);
    }
  }

  // 🎯 
  static drawFaceOnly(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const { headX, headY, headSize } = CharacterUtils.calculateHeadDimensions(
      charWidth, charHeight, charX, charY, "face"
    );
    
    CharacterRenderer.drawHead(ctx, character, headX, headY, headSize);
  }

  // 🎯 Close-up Face Drawing (Larger)
  static drawCloseUpFace(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const { headX, headY, headSize } = CharacterUtils.calculateHeadDimensions(
      charWidth, charHeight, charX, charY, "close_up_face"
    );
    
    CharacterRenderer.drawHead(ctx, character, headX, headY, headSize);
  }

  // 🎯 
  static drawHalfBody(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const { headX, headY, headSize } = CharacterUtils.calculateHeadDimensions(
      charWidth, charHeight, charX, charY, "upper_body"  // halfBody → upper_body
    );
    
    const bodyStartY = CharacterUtils.calculateBodyStartY(charY, charHeight, headSize, "upper_body");  // halfBody → upper_body
    
    // 
    CharacterRenderer.drawBodyHalf(ctx, character, charX, charY, charWidth, charHeight, bodyStartY);
    
    // Draw the head at the end (so that the hair overlaps the body)
    CharacterRenderer.drawHead(ctx, character, headX, headY, headSize);
  }

  // 🎯 
  static drawChestUp(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const { headX, headY, headSize } = CharacterUtils.calculateHeadDimensions(
      charWidth, charHeight, charX, charY, "chest_up"
    );
    
    const bodyStartY = CharacterUtils.calculateBodyStartY(charY, charHeight, headSize, "chest_up");
    
    // Draw body first (chest to top only)
    CharacterBodyRenderer.drawBodyChestUp(ctx, character, charX, charY, charWidth, charHeight, bodyStartY);
    
    // 
    CharacterRenderer.drawHead(ctx, character, headX, headY, headSize);
  }

  // 🎯 3/4
  static drawThreeQuarters(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const { headX, headY, headSize } = CharacterUtils.calculateHeadDimensions(
      charWidth, charHeight, charX, charY, "three_quarters"
    );
    
    const bodyStartY = CharacterUtils.calculateBodyStartY(charY, charHeight, headSize, "three_quarters");
    
    // 
    CharacterBodyRenderer.drawBodyThreeQuarters(ctx, character, charX, charY, charWidth, charHeight, bodyStartY);
    
    // 
    CharacterRenderer.drawHead(ctx, character, headX, headY, headSize);
  }

  // 🎯 
  static drawFullBody(
    ctx: CanvasRenderingContext2D,
    character: Character,
    charX: number,
    charY: number,
    charWidth: number,
    charHeight: number
  ) {
    const { headX, headY, headSize } = CharacterUtils.calculateHeadDimensions(
      charWidth, charHeight, charX, charY, "full_body"  // fullBody → full_body
    );
    
    const bodyStartY = CharacterUtils.calculateBodyStartY(charY, charHeight, headSize, "full_body");  // fullBody → full_body
    
    // 
    CharacterRenderer.drawBodyFull(ctx, character, charX, charY, charWidth, charHeight, bodyStartY);
    
    // 
    CharacterRenderer.drawHead(ctx, character, headX, headY, headSize);
  }

  // 🎯 Head Drawing (Separate Class Integrated Edition)
  static drawHead(
    ctx: CanvasRenderingContext2D,
    character: Character,
    headX: number,
    headY: number,
    headSize: number
  ) {
    // 🔧 types.ts
    const direction = character.facing || "front";  // bodyDirection/faceAngle → facing
    
    // 1. 
    CharacterRenderer.drawHeadShape(ctx, headX, headY, headSize);
    
    // 2. 
    CharacterHair.drawHair(ctx, character, headX, headY, headSize, direction);

    // Do not draw facial features when facing backwards
    if (direction === "back" || direction === "leftBack" || direction === "rightBack") {
      return;
    }

    // 3. 
    CharacterRenderer.drawFaceFeatures(ctx, character, headX, headY, headSize, direction);
  }

  // 🎯 
  static drawHeadShape(
    ctx: CanvasRenderingContext2D,
    headX: number,
    headY: number,
    headSize: number
  ) {
    // 
    ctx.fillStyle = "#FFCCAA";
    ctx.beginPath();
    
    const headWidth = headSize * 1.0; // 0.85 → 1.0 
    const headHeight = headSize;
    ctx.ellipse(
      headX + headSize / 2, 
      headY + headSize / 2, 
      headWidth / 2, 
      headHeight / 2, 
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 
    ctx.strokeStyle = "#E8B887";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // ===== Below are the methods for drawing faces and bodies (maintaining existing logic) =====
  // drawFaceFeatures, drawBodyHalf, drawBodyFull
  // Port the method as it is (long, omitted)

  static drawFaceFeatures(ctx: CanvasRenderingContext2D, character: Character, headX: number, headY: number, headSize: number, direction: string) {
    // 🎯 Drawing facial expressions at prompts
    CharacterRenderer.drawExpressionBasedFace(ctx, character, headX, headY, headSize, direction);
  }

  // 🎯 Drawing facial expressions at prompts (dictionary-based)
  static drawExpressionBasedFace(
    ctx: CanvasRenderingContext2D, 
    character: Character, 
    headX: number, 
    headY: number, 
    headSize: number, 
    direction: string
  ) {
    const expression = character.expression || "neutral";
    const eyeState = character.eyeState || "normal";
    const mouthState = character.mouthState || "neutral";
    
    // 🎯 
    CharacterRenderer.drawExpressionEyes(ctx, character, headX, headY, headSize, expression, eyeState);
    
    // 🎯 
    CharacterRenderer.drawExpressionMouth(ctx, character, headX, headY, headSize, expression, mouthState);
  }

  // 🎯 Eye drawing according to facial expression (original coordinate system + 
  static drawExpressionEyes(
    ctx: CanvasRenderingContext2D, 
    character: Character, 
    headX: number, 
    headY: number, 
    headSize: number, 
    expression: string,
    eyeState: string
  ) {
    // 🔧 
    const eyeSize = headSize * 0.06;
    const eyeY = headY + headSize * 0.35;
    const leftEyeX = headX + headSize * 0.3;
    const rightEyeX = headX + headSize * 0.7;
    
    // Drawing eyes according to facial expressions (dictionary prompt version)
    switch (expression) {
      case "smiling":
      case "soft_smile":
      case "bright_smile":
      case "big_smile":
      case "smiling_open_mouth":
      case "laughing":
      case "smug":
      case "maniacal_grin":
      case "cartoonish_grin":
        // 
        CharacterRenderer.drawSmilingEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "sad":
      case "crying":
      case "teary_eyes":
      case "sleepy_eyes":
      case "comedic_crying":
      case "crying_a_river":
      case "despairing_expression":
      case "gloomy":
        // 
        CharacterRenderer.drawSadEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "angry_look":
      case "furious":
      case "vein_popping":
      case "gritted_teeth":
      case "chibi_angry":
        // 
        CharacterRenderer.drawAngryEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "surprised":
      case "surprised_mild":
      case "shocked_expression":
      case "dismayed_expression":
      case "aghast_expression":
      case "stunned_expression":
        // 
        CharacterRenderer.drawSurprisedEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "blushing":
      case "slight_blush":
      case "embarrassed_face":
      case "shy":
        // 
        CharacterRenderer.drawSmilingEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "determined":
      case "serious":
      case "confident":
        // 
        CharacterRenderer.drawAngryEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "thoughtful":
      case "worried_face":
      case "nervous_face":
        // 
        CharacterRenderer.drawSadEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "excited":
      case "heart_eyes":
        // 
        CharacterRenderer.drawSurprisedEyes(ctx, leftEyeX, rightEyeX, eyeY, eyeSize);
        break;
      case "neutral_expression":
      case "deadpan":
      case "frown":
      case "pouting":
      case "relieved":
      case "disappointed":
      case "frustrated":
      case "scared":
      default:
        // 
        CharacterRenderer.drawSimpleEyes(ctx, headX, headY, headSize, character.facing || "front");
    }
  }

  // 🎯 Drawing the mouth according to the expression (original coordinate system + 
  static drawExpressionMouth(
    ctx: CanvasRenderingContext2D, 
    character: Character, 
    headX: number, 
    headY: number, 
    headSize: number, 
    expression: string,
    mouthState: string
  ) {
    // 🔧 
    const mouthY = headY + headSize * 0.6;
    const mouthX = headX + headSize * 0.5;
    const mouthWidth = headSize * 0.15;
    
    // Drawing the mouth according to the expression (scene template compatible version)
    switch (expression) {
      case "smiling":
        // 
        CharacterRenderer.drawSmilingMouth(ctx, mouthX, mouthY, mouthWidth);
        break;
      case "sad":
        // 
        CharacterRenderer.drawSadMouth(ctx, mouthX, mouthY, mouthWidth);
        break;
      case "angry_look":
        // 
        CharacterRenderer.drawAngryMouth(ctx, mouthX, mouthY, mouthWidth);
        break;
      case "surprised":
        // 
        CharacterRenderer.drawSurprisedMouth(ctx, mouthX, mouthY, mouthWidth);
        break;
      case "neutral_expression":
      default:
        // 
        CharacterRenderer.drawSimpleMouth(ctx, headX, headY, headSize, character.facing || "front");
    }
  }



  // 🎯 Smiling eyes (no lines, natural drawing)
  static drawSmilingEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    // 
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.2, 0, Math.PI * 2);
    ctx.arc(rightEyeX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawSadEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY + 2, eyeSize, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY + 2, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    // 
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY + 2, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY + 2, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawAngryEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    // 
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.8, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawSurprisedEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 1.2, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 1.2, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    // 
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.8, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawEmbarrassedEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawDeterminedEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.7, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawThoughtfulEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawExcitedEyes(ctx: CanvasRenderingContext2D, leftEyeX: number, rightEyeX: number, eyeY: number, eyeSize: number) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 1.1, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 1.1, 0, Math.PI * 2);
    ctx.fill();
    // 
    
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.7, 0, Math.PI * 2);
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🎯 
  static drawSmilingMouth(ctx: CanvasRenderingContext2D, mouthX: number, mouthY: number, mouthWidth: number) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouthX, mouthY, mouthWidth, 0, Math.PI);
    ctx.stroke();
  }

  // 🎯 
  static drawSadMouth(ctx: CanvasRenderingContext2D, mouthX: number, mouthY: number, mouthWidth: number) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouthX, mouthY + 5, mouthWidth, Math.PI, 0);
    ctx.stroke();
  }

  // 🎯 
  static drawAngryMouth(ctx: CanvasRenderingContext2D, mouthX: number, mouthY: number, mouthWidth: number) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouthX - mouthWidth, mouthY);
    ctx.lineTo(mouthX + mouthWidth, mouthY);
    ctx.stroke();
  }

  // 🎯 
  static drawSurprisedMouth(ctx: CanvasRenderingContext2D, mouthX: number, mouthY: number, mouthWidth: number) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(mouthX, mouthY, mouthWidth * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }



  static drawSimpleEyes(ctx: CanvasRenderingContext2D, headX: number, headY: number, headSize: number, direction: string) {
  const eyeSize = headSize * 0.06;
  const eyeY = headY + headSize * 0.35;
  
  if (direction !== "left" && direction !== "leftBack") {
    const leftEyeX = headX + headSize * 0.3;
    
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(leftEyeX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  if (direction !== "right" && direction !== "rightBack") {
    const rightEyeX = headX + headSize * 0.7;
    
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 
    ctx.fillStyle = "#2E2E2E";
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY, eyeSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // 
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(rightEyeX - eyeSize * 0.2, eyeY - eyeSize * 0.2, eyeSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

  static drawSimpleMouth(ctx: CanvasRenderingContext2D, headX: number, headY: number, headSize: number, expression: string) {
    const mouthX = headX + headSize * 0.5;
    const mouthY = headY + headSize * 0.6;
    
    ctx.strokeStyle = "#D84315";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    switch (expression) {
      case "smile":
        ctx.arc(mouthX, mouthY - headSize * 0.01, headSize * 0.05, 0, Math.PI);
        break;
      case "sad":
        ctx.arc(mouthX, mouthY + headSize * 0.02, headSize * 0.03, Math.PI, 0);
        break;
      default:
        ctx.arc(mouthX, mouthY, headSize * 0.02, 0, Math.PI);
    }
    ctx.stroke();
  }

  static drawBodyHalf(ctx: CanvasRenderingContext2D, character: Character, charX: number, charY: number, charWidth: number, charHeight: number, bodyStartY: number) {
    const bodyWidth = charWidth * 1.0; // 0.7 → 1.0 
    const bodyHeight = charHeight * 0.8; // 0.55 → 0.8 
    const bodyX = charX + charWidth / 2 - bodyWidth / 2;
    
    // 🎨 
    const { bodyColor, isFemale } = CharacterUtils.getCharacterDisplayConfig(character);
    const strokeColor = isFemale ? "#C2185B" : "#2E7D32";
    
    ctx.fillStyle = bodyColor;
    ctx.fillRect(bodyX, bodyStartY, bodyWidth, bodyHeight);
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(bodyX, bodyStartY, bodyWidth, bodyHeight);
  }

  static drawBodyFull(ctx: CanvasRenderingContext2D, character: Character, charX: number, charY: number, charWidth: number, charHeight: number, bodyStartY: number) {
    // 
    CharacterRenderer.drawBodyHalf(ctx, character, charX, charY, charWidth, charHeight * 0.5, bodyStartY);
    
    // 
    const legWidth = charWidth * 0.8; // 0.5 → 0.8 
    const legHeight = charHeight * 0.6; // 0.4 → 0.6 
    const legX = charX + charWidth / 2 - legWidth / 2;
    const legY = bodyStartY + charHeight * 0.3;
    
    ctx.fillStyle = "#1976D2";
    ctx.fillRect(legX, legY, legWidth, legHeight);
  }

  // ===== Integrated Steering Wheel Determination Method =====
  
  // 🎯 Integrated handle click judgment (added)
    static isCharacterHandleClicked(
    mouseX: number,
    mouseY: number,
    character: Character,
    panel: Panel
    ): { isClicked: boolean; type: "none" | "resize" | "rotate"; direction?: string } {
    return CharacterBounds.getHandleClickInfo(mouseX, mouseY, character, panel);
    }

  // 🎯 
  static findCharacterAt(
    mouseX: number,
    mouseY: number,
    characters: Character[],
    panels: Panel[]
  ): Character | null {
    return CharacterBounds.findCharacterAt(mouseX, mouseY, characters, panels);
  }

  // 🔧 Resize Processing (Isolation Class Utilized Edition)
  static resizeCharacter(
    character: Character,
    direction: string,
    deltaX: number,
    deltaY: number,
    originalBounds: { x: number; y: number; width: number; height: number }
  ): Character {
    let newWidth = originalBounds.width;
    let newHeight = originalBounds.height;
    const minWidth = 30;
    const minHeight = 40;

    console.log("🔧 :", { direction, deltaX, deltaY });

    switch (direction) {
      case "nw": 
        newWidth = Math.max(minWidth, originalBounds.width - deltaX);
        newHeight = Math.max(minHeight, originalBounds.height - deltaY);
        break;
      case "n": 
        newHeight = Math.max(minHeight, originalBounds.height - deltaY);
        break;
      case "ne": 
        newWidth = Math.max(minWidth, originalBounds.width + deltaX);
        newHeight = Math.max(minHeight, originalBounds.height - deltaY);
        break;
      case "e": 
        newWidth = Math.max(minWidth, originalBounds.width + deltaX);
        break;
      case "se": 
        newWidth = Math.max(minWidth, originalBounds.width + deltaX);
        newHeight = Math.max(minHeight, originalBounds.height + deltaY);
        break;
      case "s": 
        newHeight = Math.max(minHeight, originalBounds.height + deltaY);
        break;
      case "sw": 
        newWidth = Math.max(minWidth, originalBounds.width - deltaX);
        newHeight = Math.max(minHeight, originalBounds.height + deltaY);
        break;
      case "w": 
        newWidth = Math.max(minWidth, originalBounds.width - deltaX);
        break;
    }

    return { ...character, width: newWidth, height: newHeight };
  }

  // ===== Utility Methods (Leveraging Isolated Classes) =====
  
  static getCharacterWidth = CharacterUtils.getCharacterWidth;
  static getCharacterHeight = CharacterUtils.getCharacterHeight;
  
  // 
  static isResizeHandleClicked(mouseX: number, mouseY: number, character: Character, panel: Panel): boolean {
    const result = CharacterBounds.isResizeHandleClicked(mouseX, mouseY, character, panel);
    return result.isClicked;
  }

  static isCharacterResizeHandleClicked(mouseX: number, mouseY: number, character: Character, panel: Panel) {
    return CharacterBounds.isResizeHandleClicked(mouseX, mouseY, character, panel);
  }
}