// src/components/CanvasArea/MouseEventHandler.ts
import React from "react";
import { Panel, Character, SpeechBubble, SnapSettings } from "../../types";
import { BubbleRenderer } from "./renderers/BubbleRenderer";
import { CharacterRenderer } from './renderers/CharacterRenderer/CharacterRenderer';
import { PanelManager } from "./PanelManager";

export interface MouseEventState {
  isDragging: boolean;
  isCharacterResizing: boolean;
  isBubbleResizing: boolean;
  isPanelResizing: boolean;
  isPanelMoving: boolean;
  resizeDirection: string;
  dragOffset: { x: number; y: number };
  snapLines: Array<{x1: number, y1: number, x2: number, y2: number, type: 'vertical' | 'horizontal'}>;
}

export interface MouseEventCallbacks {
  setSelectedPanel: (panel: Panel | null) => void;
  setSelectedCharacter: (character: Character | null) => void;
  setSelectedBubble: (bubble: SpeechBubble | null) => void;
  setEditingBubble: (bubble: SpeechBubble | null) => void;
  setEditText: (text: string) => void;
  setPanels: (panels: Panel[]) => void;
  setCharacters: (characters: Character[]) => void;
  setSpeechBubbles: (bubbles: SpeechBubble[]) => void;
  setMouseState: (state: Partial<MouseEventState>) => void;
  onPanelSelect?: (panel: Panel | null) => void;
  onCharacterSelect?: (character: Character | null) => void;
  onPanelSplit?: (panelId: string, direction: 'horizontal' | 'vertical') => void;
  onDeletePanel: (panel: Panel) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export class MouseEventHandler {
  /**
   * Canvas 
   */
  static handleCanvasClick(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    panels: Panel[],
    characters: Character[],
    speechBubbles: SpeechBubble[],
    callbacks: MouseEventCallbacks,
    setContextMenu: (menu: any) => void
  ): void {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setContextMenu({ visible: false });

    const clickedBubble = BubbleRenderer.findBubbleAt(x, y, speechBubbles, panels);
    if (clickedBubble) {
      callbacks.setSelectedBubble(clickedBubble);
      callbacks.setSelectedCharacter(null);
      callbacks.setSelectedPanel(null);
      if (callbacks.onPanelSelect) callbacks.onPanelSelect(null);
      if (callbacks.onCharacterSelect) callbacks.onCharacterSelect(null);
      return;
    }

    const clickedCharacter = CharacterRenderer.findCharacterAt(x, y, characters, panels);
    if (clickedCharacter) {
      callbacks.setSelectedCharacter(clickedCharacter);
      callbacks.setSelectedBubble(null);
      callbacks.setSelectedPanel(null);
      if (callbacks.onPanelSelect) callbacks.onPanelSelect(null);
      if (callbacks.onCharacterSelect) callbacks.onCharacterSelect(clickedCharacter);
      return;
    }

    const clickedPanel = PanelManager.findPanelAt(x, y, panels);
    callbacks.setSelectedPanel(clickedPanel || null);
    callbacks.setSelectedCharacter(null);
    callbacks.setSelectedBubble(null);
    if (callbacks.onPanelSelect) callbacks.onPanelSelect(clickedPanel || null);
    if (callbacks.onCharacterSelect) callbacks.onCharacterSelect(null);
  }

  /**
   * Canvas 
   */
  static handleCanvasMouseDown(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    selectedPanel: Panel | null,
    panels: Panel[],
    characters: Character[],
    speechBubbles: SpeechBubble[],
    isPanelEditMode: boolean,
    callbacks: MouseEventCallbacks,
    setContextMenu: (menu: any) => void
  ): void {
    setContextMenu({ visible: false });
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    if (isPanelEditMode && selectedPanel) {
      const panelHandle = PanelManager.getPanelHandleAt(mouseX, mouseY, selectedPanel);
      
      if (panelHandle) {
        if (panelHandle.type === "delete") {
          callbacks.onDeletePanel(selectedPanel);
          e.preventDefault();
          return;
        } else if (panelHandle.type === "resize") {
          callbacks.setMouseState({
            isPanelResizing: true,
            resizeDirection: String(panelHandle.direction || ""),
            dragOffset: { x: mouseX, y: mouseY }
          });
          // Fire event at start of drag
          if (callbacks.onDragStart) {
            callbacks.onDragStart();
          }
          e.preventDefault();
          return;
        } else if (panelHandle.type === "move") {
          callbacks.setMouseState({
            isPanelMoving: true,
            dragOffset: {
              x: mouseX - selectedPanel.x,
              y: mouseY - selectedPanel.y,
            }
          });
          // Fire event at start of drag
          if (callbacks.onDragStart) {
            callbacks.onDragStart();
          }
          e.preventDefault();
          return;
        } else if (panelHandle.type === "split" && callbacks.onPanelSplit) {
          const direction = window.confirm("Split horizontally (up and down)?\nCancel and split vertically (left and right)") 
            ? "horizontal" 
            : "vertical";
          callbacks.onPanelSplit(String(selectedPanel.id), direction);
          e.preventDefault();
          return;
        }
      }
    }

    // 
    const clickedBubble = BubbleRenderer.findBubbleAt(mouseX, mouseY, speechBubbles, panels);
    console.log(`🔍 : mouse=(${mouseX},${mouseY}), =${speechBubbles.length}, =${clickedBubble ? '' : ''}`);
    if (clickedBubble) {
      callbacks.setSelectedBubble(clickedBubble);
      
      // For relative coordinates, calculate the relative position to the panel
      const panel = panels.find(p => p.id === clickedBubble.panelId) || panels[0];
      if (panel && !clickedBubble.isGlobalPosition) {
        // : Save relative position in panel
        const bubblePos = BubbleRenderer.calculateBubblePosition(clickedBubble, panel);
        console.log(`🖱️ (): bubble=(${clickedBubble.x},${clickedBubble.y}), =(${bubblePos.x},${bubblePos.y}), mouse=(${mouseX},${mouseY}), offset=(${mouseX - bubblePos.x},${mouseY - bubblePos.y})`);
        callbacks.setMouseState({
          isDragging: true,
          dragOffset: {
            x: mouseX - bubblePos.x,
            y: mouseY - bubblePos.y,
          }
        });
      } else {
        // : 
        console.log(`🖱️ (): bubble=(${clickedBubble.x},${clickedBubble.y}), mouse=(${mouseX},${mouseY}), offset=(${mouseX - clickedBubble.x},${mouseY - clickedBubble.y})`);
        callbacks.setMouseState({
          isDragging: true,
          dragOffset: {
            x: mouseX - clickedBubble.x,
            y: mouseY - clickedBubble.y,
          }
        });
      }
      
      if (callbacks.onDragStart) {
        callbacks.onDragStart();
      }
      e.preventDefault();
      return;
    }

    // Character operation
    const clickedCharacter = CharacterRenderer.findCharacterAt(mouseX, mouseY, characters, panels);
    if (clickedCharacter) {
      callbacks.setSelectedCharacter(clickedCharacter);
      callbacks.setMouseState({
        isDragging: true,
        dragOffset: {
          x: mouseX - clickedCharacter.x,
          y: mouseY - clickedCharacter.y,
        }
      });
      if (callbacks.onDragStart) {
        callbacks.onDragStart();
      }
      e.preventDefault();
    }
  }

  /**
   * Canvas 
   */
  static handleCanvasMouseMove(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    selectedPanel: Panel | null,
    selectedCharacter: Character | null,
    selectedBubble: SpeechBubble | null,
    panels: Panel[],
    characters: Character[],
    speechBubbles: SpeechBubble[],
    mouseState: MouseEventState,
    snapSettings: SnapSettings,
    callbacks: MouseEventCallbacks
  ): void {
    if (!mouseState.isDragging && !mouseState.isPanelResizing && !mouseState.isPanelMoving) return;
    
    console.log(`🖱️ : isDragging=${mouseState.isDragging}, selectedBubble=${selectedBubble ? selectedBubble.id : ''}`);
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 
    if (selectedPanel && mouseState.isPanelResizing) {
      const deltaX = mouseX - mouseState.dragOffset.x;
      const deltaY = mouseY - mouseState.dragOffset.y;
      
      const updatedPanel = PanelManager.resizePanel(
        selectedPanel,
        String(mouseState.resizeDirection), // 
        deltaX,
        deltaY,
        50
      );
      
      callbacks.setPanels(panels.map(p => p.id === selectedPanel.id ? updatedPanel : p));
      callbacks.setSelectedPanel(updatedPanel);
      callbacks.setMouseState({ dragOffset: { x: mouseX, y: mouseY } });
      return;
    }

    // 
    if (selectedPanel && mouseState.isPanelMoving) {
      const deltaX = mouseX - mouseState.dragOffset.x - selectedPanel.x;
      const deltaY = mouseY - mouseState.dragOffset.y - selectedPanel.y;
      
      const moveResult = PanelManager.movePanel(
        selectedPanel,
        deltaX,
        deltaY,
        canvas.width,
        canvas.height,
        snapSettings,
        panels
      );
      
      callbacks.setPanels(panels.map(p => p.id === selectedPanel.id ? moveResult.panel : p));
      callbacks.setSelectedPanel(moveResult.panel);
      callbacks.setMouseState({ snapLines: moveResult.snapLines });
      return;
    }

    // 
    if (selectedBubble && mouseState.isDragging) {
      const panel = panels.find(p => p.id === selectedBubble.panelId) || panels[0];
      
      if (panel && !selectedBubble.isGlobalPosition) {
        // : Save as relative position in panel
        const newAbsX = mouseX - mouseState.dragOffset.x;
        const newAbsY = mouseY - mouseState.dragOffset.y;
        
        // Convert from absolute coordinates to panel relative coordinates
        const relativeX = (newAbsX - panel.x) / panel.width;
        const relativeY = (newAbsY - panel.y) / panel.height;
        
        console.log(`📍 (): mouse=(${mouseX},${mouseY}), offset=(${mouseState.dragOffset.x},${mouseState.dragOffset.y}), =(${newAbsX},${newAbsY}), panel=(${panel.x},${panel.y},${panel.width}x${panel.height}), =(${relativeX},${relativeY})`);
        
        const updatedBubble = {
          ...selectedBubble,
          x: relativeX,
          y: relativeY,
        };
        
        callbacks.setSpeechBubbles(
          speechBubbles.map((bubble) =>
            bubble.id === selectedBubble.id ? updatedBubble : bubble
          )
        );
        callbacks.setSelectedBubble(updatedBubble);
      } else {
        // : 
        const newX = mouseX - mouseState.dragOffset.x;
        const newY = mouseY - mouseState.dragOffset.y;
        
        console.log(`📍 (): mouse=(${mouseX},${mouseY}), offset=(${mouseState.dragOffset.x},${mouseState.dragOffset.y}), =(${newX},${newY})`);
        
        const updatedBubble = {
          ...selectedBubble,
          x: newX,
          y: newY,
        };
        
        callbacks.setSpeechBubbles(
          speechBubbles.map((bubble) =>
            bubble.id === selectedBubble.id ? updatedBubble : bubble
          )
        );
        callbacks.setSelectedBubble(updatedBubble);
      }
      return;
    }

    // 
    if (selectedCharacter && mouseState.isDragging) {
      const newX = mouseX - mouseState.dragOffset.x;
      const newY = mouseY - mouseState.dragOffset.y;
      
      const updatedCharacter = {
        ...selectedCharacter,
        x: newX,
        y: newY,
      };
      
      callbacks.setCharacters(
        characters.map((char) =>
          char.id === selectedCharacter.id ? updatedCharacter : char
        )
      );
      callbacks.setSelectedCharacter(updatedCharacter);
      if (callbacks.onCharacterSelect) callbacks.onCharacterSelect(updatedCharacter);
    }
  }

  /**
   * Canvas 
   */
  static handleCanvasMouseUp(
    callbacks: MouseEventCallbacks
  ): void {
    const wasDragging = callbacks.setMouseState({
      isDragging: false,
      isBubbleResizing: false,
      isCharacterResizing: false,
      isPanelResizing: false,
      isPanelMoving: false,
      resizeDirection: "",
      snapLines: []
    });
    
    // Fire event at end of drag
    if (callbacks.onDragEnd) {
      callbacks.onDragEnd();
    }
  }

  /**
   * Canvas Double-click event processing
   */
  static handleCanvasDoubleClick(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    speechBubbles: SpeechBubble[],
    panels: Panel[],
    callbacks: MouseEventCallbacks
  ): void {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const clickedBubble = BubbleRenderer.findBubbleAt(x, y, speechBubbles, panels);
    if (clickedBubble) {
      callbacks.setEditingBubble(clickedBubble);
      callbacks.setEditText(clickedBubble.text);
      console.log("✏️ :", clickedBubble.text);
    }
  }

  /**
   * Canvas 
   */
  static handleCanvasContextMenu(
    e: React.MouseEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    speechBubbles: SpeechBubble[],
    characters: Character[],
    panels: Panel[],
    setContextMenu: (menu: any) => void
  ): void {
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target: null,
      targetElement: null,
    });
  }
}