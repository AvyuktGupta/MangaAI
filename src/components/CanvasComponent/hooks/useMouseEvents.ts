// src/components/CanvasComponent/hooks/useMouseEvents.ts - +
import { RefObject } from 'react';
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement, SnapSettings } from '../../../types';
import { CanvasState, CanvasStateActions } from './useCanvasState';
import { BubbleRenderer } from '../../CanvasArea/renderers/BubbleRenderer';
import { CharacterRenderer } from '../../CanvasArea/renderers/CharacterRenderer/CharacterRenderer';
import { PanelManager } from '../../CanvasArea/PanelManager';
import { ContextMenuState, ContextMenuActions } from '../../CanvasArea/ContextMenuHandler';
import { CharacterUtils } from '../../CanvasArea/renderers/CharacterRenderer/utils/CharacterUtils';
import { CharacterBounds } from '../../CanvasArea/renderers/CharacterRenderer/utils/CharacterBounds';
import { BackgroundRenderer } from '../../CanvasArea/renderers/BackgroundRenderer';

export interface MouseEventHandlers {
  handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleCanvasMouseUp: () => void;
  handleCanvasContextMenu: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleCanvasDoubleClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export interface MouseEventHookProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  state: CanvasState;
  actions: CanvasStateActions;
  panels: Panel[];
  setPanels: (panels: Panel[]) => void;
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  speechBubbles: SpeechBubble[];
  setSpeechBubbles: (bubbles: SpeechBubble[]) => void;
  // props
  backgrounds?: BackgroundElement[];
  setBackgrounds?: (backgrounds: BackgroundElement[]) => void;
  selectedBackground?: BackgroundElement | null;
  setSelectedBackground?: (background: BackgroundElement | null) => void;
  // 🆕 props
  effects?: EffectElement[];
  setEffects?: (effects: EffectElement[]) => void;
  selectedEffect?: EffectElement | null;
  setSelectedEffect?: (effect: EffectElement | null) => void;
  // 🆕 props
  tones?: ToneElement[];
  setTones?: (tones: ToneElement[]) => void;
  selectedTone?: ToneElement | null;
  setSelectedTone?: (tone: ToneElement | null) => void;
  isPanelEditMode: boolean;
  snapSettings: SnapSettings;
  contextMenu: ContextMenuState;
  setContextMenu: (menu: ContextMenuState) => void;
  contextMenuActions: ContextMenuActions;
  onPanelSelect?: (panel: Panel | null) => void;
  onCharacterSelect?: (character: Character | null) => void;
  onPanelSplit?: (panelId: number, direction: 'horizontal' | 'vertical') => void;
}

// Simple Background Click Interpretation Helper
const findBackgroundAt = (
  x: number, 
  y: number, 
  backgrounds: BackgroundElement[], 
  panels: Panel[]
): BackgroundElement | null => {
  for (let i = backgrounds.length - 1; i >= 0; i--) {
    const background = backgrounds[i];
    const panel = panels.find(p => p.id === background.panelId);
    if (panel) {
      const absoluteX = panel.x + background.x * panel.width;
      const absoluteY = panel.y + background.y * panel.height;
      const absoluteWidth = background.width * panel.width;
      const absoluteHeight = background.height * panel.height;
      
      if (x >= absoluteX && x <= absoluteX + absoluteWidth &&
          y >= absoluteY && y <= absoluteY + absoluteHeight) {
        return background;
      }
    }
  }
  return null;
};

// 🆕 
const findEffectAt = (
  x: number, 
  y: number, 
  effects: EffectElement[], 
  panels: Panel[]
): EffectElement | null => {
  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    const panel = panels.find(p => p.id === effect.panelId);
    if (panel) {
      const absoluteX = panel.x + effect.x * panel.width;
      const absoluteY = panel.y + effect.y * panel.height;
      const absoluteWidth = effect.width * panel.width;
      const absoluteHeight = effect.height * panel.height;
      
      if (x >= absoluteX && x <= absoluteX + absoluteWidth &&
          y >= absoluteY && y <= absoluteY + absoluteHeight) {
        return effect;
      }
    }
  }
  return null;
};

// 1️⃣ findToneAtReplace the function with the following (panel boundary compatible version)
const findToneAt = (
  x: number, 
  y: number, 
  tones: ToneElement[], 
  panels: Panel[]
): ToneElement | null => {
  // Z-indexClick determination in descending order (from top layer)
  const sortedTones = [...tones].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
  
  for (const tone of sortedTones) {
    if (!tone.visible) continue; // 
    
    const panel = panels.find(p => p.id === tone.panelId);
    if (!panel) continue;

    // Convert from in-panel relative coordinates to absolute coordinates
    const absoluteX = panel.x + tone.x * panel.width;
    const absoluteY = panel.y + tone.y * panel.height;
    const absoluteWidth = tone.width * panel.width;
    const absoluteHeight = tone.height * panel.height;
    
    // 🔧 Calculate the actual display area clipped at the panel boundary
    const clippedX = Math.max(absoluteX, panel.x);
    const clippedY = Math.max(absoluteY, panel.y);
    const clippedRight = Math.min(absoluteX + absoluteWidth, panel.x + panel.width);
    const clippedBottom = Math.min(absoluteY + absoluteHeight, panel.y + panel.height);
    
    // If the clipped area is active and there is a click position in it
    if (clippedRight > clippedX && clippedBottom > clippedY &&
        x >= clippedX && x <= clippedRight &&
        y >= clippedY && y <= clippedBottom) {
      // 
      return tone;
    }
  }
  return null;
};

// 🆕 Effect Line Resize Handle Determination Helper
const isEffectResizeHandleClicked = (
  mouseX: number,
  mouseY: number,
  effect: EffectElement,
  panel: Panel
): { isClicked: boolean; direction: string } => {
  const absoluteX = panel.x + effect.x * panel.width;
  const absoluteY = panel.y + effect.y * panel.height;
  const absoluteWidth = effect.width * panel.width;
  const absoluteHeight = effect.height * panel.height;
  
  const handleSize = 8;
  const tolerance = 5;
  
  // 4
  const handles = [
    { x: absoluteX - handleSize/2, y: absoluteY - handleSize/2, direction: 'nw' },
    { x: absoluteX + absoluteWidth - handleSize/2, y: absoluteY - handleSize/2, direction: 'ne' },
    { x: absoluteX - handleSize/2, y: absoluteY + absoluteHeight - handleSize/2, direction: 'sw' },
    { x: absoluteX + absoluteWidth - handleSize/2, y: absoluteY + absoluteHeight - handleSize/2, direction: 'se' },
  ];
  
  for (const handle of handles) {
    if (mouseX >= handle.x - tolerance && mouseX <= handle.x + handleSize + tolerance &&
        mouseY >= handle.y - tolerance && mouseY <= handle.y + handleSize + tolerance) {
      return { isClicked: true, direction: handle.direction };
    }
  }
  
  return { isClicked: false, direction: '' };
};

// 2️⃣ isToneResizeHandleClickedReplace the function with the following (panel boundary compatible version)
const isToneResizeHandleClicked = (
  mouseX: number,
  mouseY: number,
  tone: ToneElement,
  panel: Panel
): { isClicked: boolean; direction: string } => {
  const absoluteX = panel.x + tone.x * panel.width;
  const absoluteY = panel.y + tone.y * panel.height;
  const absoluteWidth = tone.width * panel.width;
  const absoluteHeight = tone.height * panel.height;
  
  // 🔧 Calculate the actual handle position clipped at the panel boundary
  const clippedX = Math.max(absoluteX, panel.x);
  const clippedY = Math.max(absoluteY, panel.y);
  const clippedRight = Math.min(absoluteX + absoluteWidth, panel.x + panel.width);
  const clippedBottom = Math.min(absoluteY + absoluteHeight, panel.y + panel.height);
  
  const handleSize = 8;
  const tolerance = 5;
  
  // 🔧 Determine only handles within panel boundaries
  const handles = [
    { x: clippedX - handleSize/2, y: clippedY - handleSize/2, direction: 'nw' },
    { x: clippedRight - handleSize/2, y: clippedY - handleSize/2, direction: 'ne' },
    { x: clippedX - handleSize/2, y: clippedBottom - handleSize/2, direction: 'sw' },
    { x: clippedRight - handleSize/2, y: clippedBottom - handleSize/2, direction: 'se' },
  ];
  
  for (const handle of handles) {
    // Check if the center of the handle is within the panel boundary
    const handleCenterX = handle.x + handleSize/2;
    const handleCenterY = handle.y + handleSize/2;
    
    if (handleCenterX >= panel.x && handleCenterX <= panel.x + panel.width &&
        handleCenterY >= panel.y && handleCenterY <= panel.y + panel.height &&
        mouseX >= handle.x - tolerance && mouseX <= handle.x + handleSize + tolerance &&
        mouseY >= handle.y - tolerance && mouseY <= handle.y + handleSize + tolerance) {
      // 
      return { isClicked: true, direction: handle.direction };
    }
  }
  
  return { isClicked: false, direction: '' };
};

export const useMouseEvents = ({
  canvasRef,
  state,
  actions,
  panels,
  setPanels,
  characters,
  setCharacters,
  speechBubbles,
  setSpeechBubbles,
  // 
  backgrounds = [],
  setBackgrounds,
  selectedBackground = null,
  setSelectedBackground,
  // 🆕 
  effects = [],
  setEffects,
  selectedEffect = null,
  setSelectedEffect,
  // 🆕 
  tones = [],
  setTones,
  selectedTone = null,
  setSelectedTone,
  isPanelEditMode,
  snapSettings,
  contextMenu,
  setContextMenu,
  contextMenuActions,
  onPanelSelect,
  onCharacterSelect,
  onPanelSplit,
}: MouseEventHookProps): MouseEventHandlers => {

  // 
  const convertMouseToCanvasCoordinates = (mouseX: number, mouseY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: mouseX, y: mouseY };
    
    const actualWidth = canvas.width;
    const displayWidth = canvas.offsetWidth;
    const displayScale = actualWidth > 0 && displayWidth > 0 ? displayWidth / actualWidth : 1;
    
    return {
      x: Math.round(mouseX / displayScale),
      y: Math.round(mouseY / displayScale)
    };
  };

  // 🔧  handleCanvasClick - +
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    const { x, y } = convertMouseToCanvasCoordinates(mouseX, mouseY);

    // 

    setContextMenu({ ...contextMenu, visible: false });

    // Click Determination Priority (Effect Line+
    // 1. Callout click judgment (top priority)
    const clickedBubble = BubbleRenderer.findBubbleAt(x, y, speechBubbles, panels);
    if (clickedBubble) {
      actions.setSelectedBubble(clickedBubble);
      actions.setSelectedCharacter(null);
      actions.setSelectedPanel(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (setSelectedTone) setSelectedTone(null);
      if (onPanelSelect) onPanelSelect(null);
      if (onCharacterSelect) onCharacterSelect(null);
      // 
      return;
    }

    // 2. 2 - 
    // 
    const clickedCharacter = CharacterRenderer.findCharacterAt(x, y, characters, panels);
    if (clickedCharacter) {
      // 
      actions.setSelectedCharacter(clickedCharacter);
      actions.setSelectedBubble(null);
      actions.setSelectedPanel(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (setSelectedTone) setSelectedTone(null);
      if (onPanelSelect) onPanelSelect(null);
      if (onCharacterSelect) onCharacterSelect(clickedCharacter);
      // 
      return;
    } else {
      // 
    }

    // 🆕 3. 3
    if (effects.length > 0 && setSelectedEffect) {
      const clickedEffect = findEffectAt(x, y, effects, panels);
      if (clickedEffect) {
        setSelectedEffect(clickedEffect);
        actions.setSelectedBubble(null);
        actions.setSelectedCharacter(null);
        actions.setSelectedPanel(null);
        if (setSelectedBackground) setSelectedBackground(null);
        if (setSelectedTone) setSelectedTone(null);
        if (onPanelSelect) onPanelSelect(null);
        if (onCharacterSelect) onCharacterSelect(null);
        // 
        return;
      }
    }

    // 🆕 4. 4
    if (tones.length > 0 && setSelectedTone) {
      const clickedTone = findToneAt(x, y, tones, panels);
      if (clickedTone) {
        setSelectedTone(clickedTone);
        actions.setSelectedBubble(null);
        actions.setSelectedCharacter(null);
        actions.setSelectedPanel(null);
        if (setSelectedBackground) setSelectedBackground(null);
        if (setSelectedEffect) setSelectedEffect(null);
        if (onPanelSelect) onPanelSelect(null);
        if (onCharacterSelect) onCharacterSelect(null);
        // 
        return;
      }
    }

    // 5. Panel Click Determination (Preferred over Background)
    const clickedPanel = PanelManager.findPanelAt(x, y, panels);
    if (clickedPanel) {
      actions.setSelectedPanel(clickedPanel);
      actions.setSelectedCharacter(null);
      actions.setSelectedBubble(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (setSelectedTone) setSelectedTone(null);
      if (onPanelSelect) onPanelSelect(clickedPanel);
      if (onCharacterSelect) onCharacterSelect(null);
      // 
      return;
    }

    // 6. Background Click Determination (Last Priority)
    if (backgrounds.length > 0 && setSelectedBackground) {
      const clickedBackground = findBackgroundAt(x, y, backgrounds, panels);
      if (clickedBackground) {
        setSelectedBackground(clickedBackground);
        actions.setSelectedBubble(null);
        actions.setSelectedCharacter(null);
        actions.setSelectedPanel(null);
        if (setSelectedEffect) setSelectedEffect(null);
        if (setSelectedTone) setSelectedTone(null);
        if (onPanelSelect) onPanelSelect(null);
        if (onCharacterSelect) onCharacterSelect(null);
        // 
        return;
      }
    }

    // 7. 
    // 
    actions.setSelectedPanel(null);
    actions.setSelectedCharacter(null);
    actions.setSelectedBubble(null);
    if (setSelectedBackground) setSelectedBackground(null);
    if (setSelectedEffect) setSelectedEffect(null);
    if (setSelectedTone) setSelectedTone(null);
    if (onPanelSelect) onPanelSelect(null);
    if (onCharacterSelect) onCharacterSelect(null);
  };

  // 🔧  handleCanvasMouseDown - +
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setContextMenu({ ...contextMenu, visible: false });
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    const { x, y } = convertMouseToCanvasCoordinates(mouseX, mouseY);

    // 

    // 1: Panel Edit Mode Handle Determination (Top Priority)
    if (isPanelEditMode && state.selectedPanel) {
      const panelHandle = PanelManager.getPanelHandleAt(x, y, state.selectedPanel);
      
      if (panelHandle) {
        // 
        
        if (panelHandle.type === "delete") {
          contextMenuActions.onDeletePanel(state.selectedPanel);
          e.preventDefault();
          return;
        } else if (panelHandle.type === "resize") {
          actions.setIsPanelResizing(true);
          actions.setResizeDirection(panelHandle.direction || "");
          actions.setDragOffset({ x, y });
          e.preventDefault();
          return;
        } else if (panelHandle.type === "move") {
          actions.setIsPanelMoving(true);
          actions.setDragOffset({
            x: mouseX - state.selectedPanel.x,
            y: mouseY - state.selectedPanel.y,
          });
          e.preventDefault();
          return;
        } else if (panelHandle.type === "split" && onPanelSplit) {
          const direction = window.confirm("Split horizontally (up and down)?\nCancel and split vertically (left and right)") 
            ? "horizontal" 
            : "vertical";
          onPanelSplit(state.selectedPanel.id, direction);
          e.preventDefault();
          return;
        }
      }
    }

    // 2: 
    let clickedCharacter: Character | null = null;
    for (let i = characters.length - 1; i >= 0; i--) {
      const character = characters[i];
      const panel = panels.find(p => p.id === character.panelId);
      
      if (panel) {
        const bounds = CharacterBounds.getCharacterBounds(character, panel);
        const expandedBounds = {
          x: bounds.x - 50,
          y: bounds.y - 50,
          width: bounds.width + 100,
          height: bounds.height + 100
        };
        
        const expandedClicked = (
          x >= expandedBounds.x &&
          x <= expandedBounds.x + expandedBounds.width &&
          y >= expandedBounds.y &&
          y <= expandedBounds.y + expandedBounds.height
        );
        
        if (expandedClicked) {
          clickedCharacter = character;
          // 
          break;
        }
      }
    }

    if (clickedCharacter) {
      // 
      
      // Always select a character (even if it's already selected)
      actions.setSelectedCharacter(clickedCharacter);
      actions.setSelectedBubble(null);
      actions.setSelectedPanel(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (setSelectedTone) setSelectedTone(null);
      if (onCharacterSelect) onCharacterSelect(clickedCharacter);
      // 
      
      const panel = panels.find(p => p.id === clickedCharacter!.panelId);
      if (!panel) {
        console.error("❌ ");
        e.preventDefault();
        return;
      }
      
      // 
      const rotationClicked = CharacterBounds.isRotationHandleClicked(
        x, y, clickedCharacter, panel
      );
      
      if (rotationClicked) {
        // 
        actions.setIsCharacterRotating(true);
        
        const { centerX, centerY } = CharacterUtils.calculateCenterCoordinates(clickedCharacter, panel);
        const startAngle = CharacterUtils.calculateAngle(centerX, centerY, x, y);
        
        actions.setRotationStartAngle(startAngle);
        actions.setOriginalRotation(clickedCharacter.rotation || 0);
        
        e.preventDefault();
        return;
      }
      
      // 
      const resizeResult = CharacterRenderer.isCharacterResizeHandleClicked(
        x, y, clickedCharacter, panel
      );
      
      if (resizeResult.isClicked) {
        // 
        actions.setIsCharacterResizing(true);
        actions.setResizeDirection(resizeResult.direction);
        actions.setDragOffset({ x: mouseX, y: mouseY });
        
        const currentWidth = CharacterRenderer.getCharacterWidth(clickedCharacter);
        const currentHeight = CharacterRenderer.getCharacterHeight(clickedCharacter);
        actions.setInitialCharacterBounds({
          x: clickedCharacter.x,
          y: clickedCharacter.y,
          width: currentWidth,
          height: currentHeight
        });
        
        e.preventDefault();
        return;
      }
      
      // 
      // 
      actions.setIsDragging(true);
      actions.setDragOffset({
        x: x - clickedCharacter.x,
        y: y - clickedCharacter.y,
      });
      
      e.preventDefault();
      return;
    }

    // 3: 
    const clickedBubble = BubbleRenderer.findBubbleAt(x, y, speechBubbles, panels);
    if (clickedBubble) {
      // 
      
      actions.setSelectedBubble(clickedBubble);
      actions.setSelectedCharacter(null);
      actions.setSelectedPanel(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (setSelectedTone) setSelectedTone(null);
      
      const panel = panels.find(p => p.id === clickedBubble.panelId) || panels[0];
      if (!panel) {
        console.error("❌ ");
        return;
      }
      
      const resizeResult = BubbleRenderer.isBubbleResizeHandleClicked(x, y, clickedBubble, panel);
      
      if (resizeResult.isClicked) {
        // 
        actions.setIsBubbleResizing(true);
        actions.setResizeDirection(resizeResult.direction);
        actions.setDragOffset({ x: mouseX, y: mouseY });
        actions.setInitialBubbleBounds({
          x: clickedBubble.x,
          y: clickedBubble.y,
          width: clickedBubble.width,
          height: clickedBubble.height
        });
      } else {
        // 
        actions.setIsDragging(true);
        
        // For relative coordinates, use the converted coordinates
        if (!clickedBubble.isGlobalPosition) {
          const bubblePos = BubbleRenderer.calculateBubblePosition(clickedBubble, panel);
          actions.setDragOffset({
            x: mouseX - bubblePos.x,
            y: mouseY - bubblePos.y,
          });
          console.log(`🖱️ (): bubble=(${clickedBubble.x},${clickedBubble.y}), =(${bubblePos.x},${bubblePos.y}), mouse=(${mouseX},${mouseY}), offset=(${mouseX - bubblePos.x},${mouseY - bubblePos.y})`);
        } else {
          // 
          actions.setDragOffset({
            x: mouseX - clickedBubble.x,
            y: mouseY - clickedBubble.y,
          });
          console.log(`🖱️ (): bubble=(${clickedBubble.x},${clickedBubble.y}), mouse=(${mouseX},${mouseY}), offset=(${mouseX - clickedBubble.x},${mouseY - clickedBubble.y})`);
        }
      }
      
      e.preventDefault();
      return;
    }

    // 🆕 4: 
    if (effects.length > 0 && setSelectedEffect) {
      const clickedEffect = findEffectAt(x, y, effects, panels);
      if (clickedEffect) {
        // 
        
        const isAlreadySelected = selectedEffect?.id === clickedEffect.id;
        
        if (!isAlreadySelected) {
          setSelectedEffect(clickedEffect);
          actions.setSelectedCharacter(null);
          actions.setSelectedBubble(null);
          actions.setSelectedPanel(null);
          if (setSelectedBackground) setSelectedBackground(null);
          if (setSelectedTone) setSelectedTone(null);
          if (onCharacterSelect) onCharacterSelect(null);
          if (onPanelSelect) onPanelSelect(null);
          // 
        }
        
        const panel = panels.find(p => p.id === clickedEffect.panelId);
        if (!panel) {
          console.error("❌ ");
          e.preventDefault();
          return;
        }
        
        // 
        const resizeResult = isEffectResizeHandleClicked(x, y, clickedEffect, panel);
        
        if (resizeResult.isClicked) {
          // 
          actions.setIsCharacterResizing(true); // 
          actions.setResizeDirection(resizeResult.direction);
          actions.setDragOffset({ x, y });
          actions.setInitialCharacterBounds({
            x: clickedEffect.x,
            y: clickedEffect.y,
            width: clickedEffect.width,
            height: clickedEffect.height
          });
        } else if (isAlreadySelected) {
          // Normal Drag (starts only if selected)
          // 
          actions.setIsDragging(true);
          actions.setDragOffset({
            x: mouseX - (panel.x + clickedEffect.x * panel.width),
            y: mouseY - (panel.y + clickedEffect.y * panel.height),
          });
        }
        
        e.preventDefault();
        return;
      }
    }

    // 🔧 5: Tone operation judgment (in-panel integrated version)
if (tones.length > 0 && setSelectedTone) {
  const clickedTone = findToneAt(x, y, tones, panels);
  if (clickedTone) {
    // 
    
    const isAlreadySelected = selectedTone?.id === clickedTone.id;
    
    if (!isAlreadySelected) {
      setSelectedTone(clickedTone);
      actions.setSelectedCharacter(null);
      actions.setSelectedBubble(null);
      actions.setSelectedPanel(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (onCharacterSelect) onCharacterSelect(null);
      if (onPanelSelect) onPanelSelect(null);
      // 
    }
    
    const panel = panels.find(p => p.id === clickedTone.panelId);
    if (!panel) {
      console.error("❌ ");
      e.preventDefault();
      return;
    }
    
    // 🔧 Tone resize handle determination (panel boundary correspondence)
    const resizeResult = isToneResizeHandleClicked(x, y, clickedTone, panel);
    
    if (resizeResult.isClicked) {
      // 
      actions.setIsCharacterResizing(true); // 
      actions.setResizeDirection(resizeResult.direction);
      actions.setDragOffset({ x: mouseX, y: mouseY });
      actions.setInitialCharacterBounds({
        x: clickedTone.x,
        y: clickedTone.y,
        width: clickedTone.width,
        height: clickedTone.height
      });
    } else if (isAlreadySelected) {
      // 🔧 Start dragging in relative coordinates in the panel
      // 
      actions.setIsDragging(true);
      
      // Calculate drag offset with in-panel relative coordinates
      const absoluteX = panel.x + clickedTone.x * panel.width;
      const absoluteY = panel.y + clickedTone.y * panel.height;
      
      actions.setDragOffset({
        x: mouseX - absoluteX,
        y: mouseY - absoluteY,
      });
    }
    
    e.preventDefault();
    return;
  }
}

    // 6: Normal panel processing (overrides background)
    const clickedPanel = PanelManager.findPanelAt(x, y, panels);
    if (clickedPanel) {
      // 
      actions.setSelectedPanel(clickedPanel);
      actions.setSelectedCharacter(null);
      actions.setSelectedBubble(null);
      if (setSelectedBackground) setSelectedBackground(null);
      if (setSelectedEffect) setSelectedEffect(null);
      if (setSelectedTone) setSelectedTone(null);
      if (onPanelSelect) onPanelSelect(clickedPanel);
      if (onCharacterSelect) onCharacterSelect(null);
      return;
    }

    // 7: 
    if (backgrounds.length > 0 && setSelectedBackground) {
      const clickedBackground = findBackgroundAt(x, y, backgrounds, panels);
      if (clickedBackground) {
        // 
        setSelectedBackground(clickedBackground);
        actions.setSelectedCharacter(null);
        actions.setSelectedBubble(null);
        actions.setSelectedPanel(null);
        if (setSelectedEffect) setSelectedEffect(null);
        if (setSelectedTone) setSelectedTone(null);
        if (onPanelSelect) onPanelSelect(null);
        if (onCharacterSelect) onCharacterSelect(null);
        e.preventDefault();
        return;
      }
    }

    // : 
    // 
    actions.setSelectedPanel(null);
    actions.setSelectedCharacter(null);
    actions.setSelectedBubble(null);
    if (setSelectedBackground) setSelectedBackground(null);
    if (setSelectedEffect) setSelectedEffect(null);
    if (setSelectedTone) setSelectedTone(null);
    if (onPanelSelect) onPanelSelect(null);
    if (onCharacterSelect) onCharacterSelect(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    const { x, y } = convertMouseToCanvasCoordinates(mouseX, mouseY);

    // Early returns if nothing is being manipulated
    if (!state.isDragging && !state.isPanelResizing && !state.isPanelMoving && 
        !state.isCharacterResizing && !state.isBubbleResizing && !state.isCharacterRotating) {
      return;
    }

    // Character rotation (steering wheel only)
    if (state.isCharacterRotating && state.selectedCharacter) {
      // 
      
      const panel = panels.find(p => p.id === state.selectedCharacter!.panelId);
      if (panel && state.selectedCharacter) {
        const { centerX, centerY } = CharacterUtils.calculateCenterCoordinates(
          state.selectedCharacter, panel
        );
        const currentAngle = CharacterUtils.calculateAngle(centerX, centerY, x, y);
        
        const angleDiff = CharacterUtils.calculateAngleDifference(
          state.rotationStartAngle, currentAngle
        );
        const newRotation = CharacterUtils.normalizeAngle(
          state.originalRotation + angleDiff
        );
        
        const updatedCharacter = { 
          ...state.selectedCharacter,
          rotation: newRotation 
        };
        
        setCharacters(characters.map((char: Character) => 
          char.id === updatedCharacter.id ? updatedCharacter : char
        ));
        
        actions.setSelectedCharacter(updatedCharacter);
      }
      return;
    }

    // 🆕 Effect line resizing (using character resizing flag)
    if (selectedEffect && state.isCharacterResizing && state.initialCharacterBounds && setEffects) {
      const deltaX = mouseX - state.dragOffset.x;
      const deltaY = mouseY - state.dragOffset.y;
      
      const panel = panels.find(p => p.id === selectedEffect.panelId);
      if (!panel) return;
      
      // Resize calculation with relative coordinates in panel
      const relativeScaleX = deltaX / panel.width;
      const relativeScaleY = deltaY / panel.height;
      
      let newWidth = state.initialCharacterBounds.width;
      let newHeight = state.initialCharacterBounds.height;
      let newX = state.initialCharacterBounds.x;
      let newY = state.initialCharacterBounds.y;
      
      switch (state.resizeDirection) {
        case 'se': // 
          newWidth = Math.max(0.1, state.initialCharacterBounds.width + relativeScaleX);
          newHeight = Math.max(0.1, state.initialCharacterBounds.height + relativeScaleY);
          break;
        case 'sw': // 
          newWidth = Math.max(0.1, state.initialCharacterBounds.width - relativeScaleX);
          newHeight = Math.max(0.1, state.initialCharacterBounds.height + relativeScaleY);
          newX = state.initialCharacterBounds.x + relativeScaleX;
          break;
        case 'ne': // 
          newWidth = Math.max(0.1, state.initialCharacterBounds.width + relativeScaleX);
          newHeight = Math.max(0.1, state.initialCharacterBounds.height - relativeScaleY);
          newY = state.initialCharacterBounds.y + relativeScaleY;
          break;
        case 'nw': // 
          newWidth = Math.max(0.1, state.initialCharacterBounds.width - relativeScaleX);
          newHeight = Math.max(0.1, state.initialCharacterBounds.height - relativeScaleY);
          newX = state.initialCharacterBounds.x + relativeScaleX;
          newY = state.initialCharacterBounds.y + relativeScaleY;
          break;
      }
      
      const updatedEffect = {
        ...selectedEffect,
        x: Math.max(0, Math.min(newX, 1 - newWidth)),
        y: Math.max(0, Math.min(newY, 1 - newHeight)),
        width: newWidth,
        height: newHeight,
      };
      
      if (setEffects) {
        setEffects(effects.map(effect => 
          effect.id === selectedEffect.id ? updatedEffect : effect
        ));
      }
      if (setSelectedEffect) {
        setSelectedEffect(updatedEffect);
      }
      return;
    }

    // 🔧 Tone resizing (in-panel integration)
if (selectedTone && state.isCharacterResizing && state.initialCharacterBounds && setTones) {
  const deltaX = mouseX - state.dragOffset.x;
  const deltaY = mouseY - state.dragOffset.y;
  
  const panel = panels.find(p => p.id === selectedTone.panelId);
  if (!panel) return;
  
  // Resize calculation with relative coordinates in panel
  const relativeScaleX = deltaX / panel.width;
  const relativeScaleY = deltaY / panel.height;
  
  let newWidth = state.initialCharacterBounds.width;
  let newHeight = state.initialCharacterBounds.height;
  let newX = state.initialCharacterBounds.x;
  let newY = state.initialCharacterBounds.y;
  
  switch (state.resizeDirection) {
    case 'se': // 
      newWidth = Math.max(0.05, state.initialCharacterBounds.width + relativeScaleX);
      newHeight = Math.max(0.05, state.initialCharacterBounds.height + relativeScaleY);
      break;
    case 'sw': // 
      newWidth = Math.max(0.05, state.initialCharacterBounds.width - relativeScaleX);
      newHeight = Math.max(0.05, state.initialCharacterBounds.height + relativeScaleY);
      newX = state.initialCharacterBounds.x + relativeScaleX;
      break;
    case 'ne': // 
      newWidth = Math.max(0.05, state.initialCharacterBounds.width + relativeScaleX);
      newHeight = Math.max(0.05, state.initialCharacterBounds.height - relativeScaleY);
      newY = state.initialCharacterBounds.y + relativeScaleY;
      break;
    case 'nw': // 
      newWidth = Math.max(0.05, state.initialCharacterBounds.width - relativeScaleX);
      newHeight = Math.max(0.05, state.initialCharacterBounds.height - relativeScaleY);
      newX = state.initialCharacterBounds.x + relativeScaleX;
      newY = state.initialCharacterBounds.y + relativeScaleY;
      break;
  }
  
  // 🔧 Clamp at panel boundary (important)
  const updatedTone = {
    ...selectedTone,
    x: Math.max(0, Math.min(newX, 1 - newWidth)),
    y: Math.max(0, Math.min(newY, 1 - newHeight)),
    width: Math.min(newWidth, 1 - Math.max(0, newX)),
    height: Math.min(newHeight, 1 - Math.max(0, newY)),
  };
  
  setTones(tones.map(tone => 
    tone.id === selectedTone.id ? updatedTone : tone
  ));
  setSelectedTone?.(updatedTone);
  // 
  return;
}

    // 🆕 
    if (selectedEffect && state.isDragging && setEffects) {
      const panel = panels.find(p => p.id === selectedEffect.panelId);
      if (!panel) return;
      
      // Calculate movement with relative coordinates in the panel
      const absoluteX = mouseX - state.dragOffset.x;
      const absoluteY = mouseY - state.dragOffset.y;
      const relativeX = (absoluteX - panel.x) / panel.width;
      const relativeY = (absoluteY - panel.y) / panel.height;
      
      const updatedEffect = {
        ...selectedEffect,
        x: Math.max(0, Math.min(relativeX, 1 - selectedEffect.width)),
        y: Math.max(0, Math.min(relativeY, 1 - selectedEffect.height)),
      };
      
      if (setEffects) {
        setEffects(effects.map(effect => 
          effect.id === selectedEffect.id ? updatedEffect : effect
        ));
      }
      if (setSelectedEffect) {
        setSelectedEffect(updatedEffect);
      }
      return;
    }

    // 🆕 
    if (selectedTone && state.isDragging && setTones) {
      const panel = panels.find(p => p.id === selectedTone.panelId);
      if (!panel) return;
      
      // Calculate movement with relative coordinates in the panel
      const absoluteX = mouseX - state.dragOffset.x;
      const absoluteY = mouseY - state.dragOffset.y;
      const relativeX = (absoluteX - panel.x) / panel.width;
      const relativeY = (absoluteY - panel.y) / panel.height;
      
      const updatedTone = {
        ...selectedTone,
        x: Math.max(0, Math.min(relativeX, 1 - selectedTone.width)),
        y: Math.max(0, Math.min(relativeY, 1 - selectedTone.height)),
      };
      
      if (setTones) {
        setTones(tones.map(tone => 
          tone.id === selectedTone.id ? updatedTone : tone
        ));
      }
      if (setSelectedTone) {
        setSelectedTone(updatedTone);
      }
      return;
    }

    // 
    if (state.selectedCharacter && state.isCharacterResizing && state.initialCharacterBounds) {
      const deltaX = mouseX - state.dragOffset.x;
      const deltaY = mouseY - state.dragOffset.y;
      
      const resizedCharacter = CharacterRenderer.resizeCharacter(
        state.selectedCharacter,
        state.resizeDirection,
        deltaX,
        deltaY,
        state.initialCharacterBounds
      );
      
      setCharacters(
        characters.map((char) =>
          char.id === state.selectedCharacter!.id ? resizedCharacter : char
        )
      );
      actions.setSelectedCharacter(resizedCharacter);
      if (onCharacterSelect) onCharacterSelect(resizedCharacter);
      return;
    }

    // Move Character (No Rotation)
    if (state.selectedCharacter && state.isDragging) {
      // 
      
      const newX = x - state.dragOffset.x;
      const newY = y - state.dragOffset.y;
      
      const updatedCharacter = {
        ...state.selectedCharacter,
        x: newX,
        y: newY,
      };
      
      setCharacters(
        characters.map((char) =>
          char.id === state.selectedCharacter!.id ? updatedCharacter : char
        )
      );
      actions.setSelectedCharacter(updatedCharacter);
      if (onCharacterSelect) onCharacterSelect(updatedCharacter);
      return;
    }

    // 
    if (state.selectedBubble && state.isBubbleResizing && state.initialBubbleBounds) {
      const deltaX = mouseX - state.dragOffset.x;
      const deltaY = mouseY - state.dragOffset.y;
      
      // Get panel (required for relative coordinate conversion)
      const panel = panels.find(p => p.id === state.selectedBubble!.panelId) || panels[0];
      
      const resizedBubble = BubbleRenderer.resizeBubble(
        state.selectedBubble,
        state.resizeDirection,
        deltaX,
        deltaY,
        state.initialBubbleBounds,
        panel
      );
      
      setSpeechBubbles(
        speechBubbles.map((bubble) =>
          bubble.id === state.selectedBubble!.id ? resizedBubble : bubble
        )
      );
      actions.setSelectedBubble(resizedBubble);
      return;
    }

    // 
    if (state.selectedBubble && state.isDragging) {
      const panel = panels.find(p => p.id === state.selectedBubble!.panelId) || panels[0];
      
      if (panel && !state.selectedBubble.isGlobalPosition) {
        // : 
        const newAbsX = mouseX - state.dragOffset.x;
        const newAbsY = mouseY - state.dragOffset.y;
        
        const relativeX = (newAbsX - panel.x) / panel.width;
        const relativeY = (newAbsY - panel.y) / panel.height;
        
        console.log(`📍 (): mouse=(${mouseX},${mouseY}), offset=(${state.dragOffset.x},${state.dragOffset.y}), =(${newAbsX},${newAbsY}), panel=(${panel.x},${panel.y},${panel.width}x${panel.height}), =(${relativeX},${relativeY})`);
        
        const updatedBubble = {
          ...state.selectedBubble,
          x: relativeX,
          y: relativeY,
        };
        
        setSpeechBubbles(
          speechBubbles.map((bubble) =>
            bubble.id === state.selectedBubble!.id ? updatedBubble : bubble
          )
        );
        actions.setSelectedBubble(updatedBubble);
      } else {
        // 
        const newX = mouseX - state.dragOffset.x;
        const newY = mouseY - state.dragOffset.y;
        
        console.log(`📍 (): mouse=(${mouseX},${mouseY}), offset=(${state.dragOffset.x},${state.dragOffset.y}), =(${newX},${newY})`);
        
        const updatedBubble = {
          ...state.selectedBubble,
          x: newX,
          y: newY,
        };
        
        setSpeechBubbles(
          speechBubbles.map((bubble) =>
            bubble.id === state.selectedBubble!.id ? updatedBubble : bubble
          )
        );
        actions.setSelectedBubble(updatedBubble);
      }
      return;
    }

    // 
    if (state.selectedPanel && state.isPanelResizing) {
      const deltaX = x - state.dragOffset.x;
      const deltaY = y - state.dragOffset.y;
      
      const updatedPanel = PanelManager.resizePanel(
        state.selectedPanel,
        state.resizeDirection,
        deltaX,
        deltaY
      );
      
      setPanels(panels.map(p => p.id === state.selectedPanel!.id ? updatedPanel : p));
      actions.setSelectedPanel(updatedPanel);
      actions.setDragOffset({ x, y });
      return;
    }

    // 
    if (state.selectedPanel && state.isPanelMoving) {
      const deltaX = x - state.dragOffset.x - state.selectedPanel.x;
      const deltaY = y - state.dragOffset.y - state.selectedPanel.y;
      
      const moveResult = PanelManager.movePanel(
        state.selectedPanel,
        deltaX,
        deltaY,
        canvas.width,
        canvas.height,
        snapSettings,
        panels
      );
      
      setPanels(panels.map(p => p.id === state.selectedPanel!.id ? moveResult.panel : p));
      actions.setSelectedPanel(moveResult.panel);
      actions.setSnapLines(moveResult.snapLines);
      return;
    }
  };

  const handleCanvasMouseUp = () => {
    // 
    
    // 
    if (state.isCharacterRotating && state.selectedCharacter) {
      // 
      const currentCharacter = state.selectedCharacter;
      
      // 
      actions.resetDragStates();
      actions.setSnapLines([]);
      
      // 
      setTimeout(() => {
        actions.setSelectedCharacter(currentCharacter);
        if (onCharacterSelect) onCharacterSelect(currentCharacter);
        // 
      }, 0);
      
      return;
    }
    
    // 🆕 Maintain selected state at end of effect line operation
    if ((state.isDragging || state.isCharacterResizing) && selectedEffect && setSelectedEffect) {
      // 
      const currentEffect = selectedEffect;
      
      // 
      actions.resetDragStates();
      actions.setSnapLines([]);
      
      // 
      setTimeout(() => {
        if (setSelectedEffect) {
          setSelectedEffect(currentEffect);
        }
        // 
      }, 0);
      
      return;
    }

    // 🆕 Maintain selected state at end of tone operation
    if ((state.isDragging || state.isCharacterResizing) && selectedTone && setSelectedTone) {
      // 
      const currentTone = selectedTone;
      
      // 
      actions.resetDragStates();
      actions.setSnapLines([]);
      
      // 
      setTimeout(() => {
        if (setSelectedTone) {
          setSelectedTone(currentTone);
        }
        // 
      }, 0);
      
      return;
    }

    // 🆕 Maintain selection state at end of character drag operation
    if ((state.isDragging || state.isCharacterResizing) && state.selectedCharacter) {
      // 
      const currentCharacter = state.selectedCharacter;
      
      // 
      actions.resetDragStates();
      actions.setSnapLines([]);
      
      // 
      setTimeout(() => {
        actions.setSelectedCharacter(currentCharacter);
        if (onCharacterSelect) onCharacterSelect(currentCharacter);
        // 
      }, 0);
      
      return;
    }
    
    // 
    actions.resetDragStates();
    actions.setSnapLines([]);
    // 
  };

  const handleCanvasContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    const { x, y } = convertMouseToCanvasCoordinates(mouseX, mouseY);

    // Use the right-click menu to also adjust the priority (effect line+
    // 1. Callout Right Click Interpretation (First Priority)
    const clickedBubble = BubbleRenderer.findBubbleAt(x, y, speechBubbles, panels);
    if (clickedBubble) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        target: 'bubble',
        targetElement: clickedBubble,
      });
      return;
    }

    // 2. Character Right Click Determination (2
    const clickedCharacter = CharacterRenderer.findCharacterAt(x, y, characters, panels);
    if (clickedCharacter) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        target: 'character',
        targetElement: clickedCharacter,
      });
      return;
    }

    // 🆕 3. 3
    if (effects.length > 0) {
      const clickedEffect = findEffectAt(x, y, effects, panels);
      if (clickedEffect) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          target: 'effect',
          targetElement: clickedEffect,
        });
        return;
      }
    }

    // 🆕 4. 4
    if (tones.length > 0) {
      const clickedTone = findToneAt(x, y, tones, panels);
      if (clickedTone) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          target: 'tone',
          targetElement: clickedTone,
        });
        return;
      }
    }

    // 5. Panel Right Click Interpretation (Preferred over Background)
    const clickedPanel = PanelManager.findPanelAt(x, y, panels);
    if (clickedPanel) {
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        target: 'panel',
        targetElement: clickedPanel,
      });
      return;
    }

    // 6. Background Right Click Interpretation (Last Priority)
    if (backgrounds.length > 0) {
      const clickedBackground = findBackgroundAt(x, y, backgrounds, panels);
      if (clickedBackground) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          target: 'background',
          targetElement: clickedBackground,
        });
        return;
      }
    }

    // 7. 
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target: null,
      targetElement: null,
    });
  };

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    const { x, y } = convertMouseToCanvasCoordinates(mouseX, mouseY);
    
    // 💬 Callout double-click processing (first priority)
    const clickedBubble = BubbleRenderer.findBubbleAt(x, y, speechBubbles, panels);
    if (clickedBubble) {
      actions.setEditingBubble(clickedBubble);
      actions.setEditText(clickedBubble.text);
      // 
      return;
    }

    // 🆕 
    if (effects.length > 0) {
      const clickedEffect = findEffectAt(x, y, effects, panels);
      if (clickedEffect && contextMenuActions.onOpenEffectPanel) {
        contextMenuActions.onOpenEffectPanel(clickedEffect);
        // 
        return;
      }
    }

    // 🆕 
    if (tones.length > 0) {
      const clickedTone = findToneAt(x, y, tones, panels);
      if (clickedTone && contextMenuActions.onOpenTonePanel) {
        contextMenuActions.onOpenTonePanel(clickedTone);
        // 
        return;
      }
    }
    
    // 
    if (backgrounds.length > 0) {
      const clickedBackground = findBackgroundAt(x, y, backgrounds, panels);
      if (clickedBackground && contextMenuActions.onOpenBackgroundPanel) {
        contextMenuActions.onOpenBackgroundPanel(clickedBackground);
        // 
        return;
      }
    }
  };

  return {
    handleCanvasClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasContextMenu,
    handleCanvasDoubleClick,
  };
};