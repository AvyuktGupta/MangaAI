// src/components/CanvasArea/ContextMenuHandler.ts - 
import React from "react";
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement } from "../../types";

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: 'character' | 'bubble' | 'panel' | 'background' | 'effect' | 'tone' | null; // 🆕 tone
  targetElement: Character | SpeechBubble | Panel | BackgroundElement | EffectElement | ToneElement | null; // 🆕 ToneElement
}

export interface ClipboardState {
  type: 'panel' | 'character' | 'bubble' | 'background' | 'effect' | 'tone'; // 🆕 tone
  data: Panel | Character | SpeechBubble | BackgroundElement | EffectElement | ToneElement; // 🆕 ToneElement
}

export interface ContextMenuActions {
  onDuplicateCharacter: (character: Character) => void;
  onDuplicatePanel: (panel: Panel) => void;
  onDuplicateBackground?: (background: BackgroundElement) => void;
  onDuplicateEffect?: (effect: EffectElement) => void;
  onDuplicateTone?: (tone: ToneElement) => void; // 🆕 
  onCopyToClipboard: (type: 'panel' | 'character' | 'bubble' | 'background' | 'effect' | 'tone', element: Panel | Character | SpeechBubble | BackgroundElement | EffectElement | ToneElement) => void;
  onPasteFromClipboard: () => void;
  onDeleteElement: (type: 'character' | 'bubble' | 'background' | 'effect' | 'tone', element: Character | SpeechBubble | BackgroundElement | EffectElement | ToneElement) => void;
  onDeletePanel: (panel: Panel) => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onEditPanel: (panel: Panel) => void;
  onSplitPanel: (panel: Panel, direction: 'horizontal' | 'vertical') => void;
  onSelectElement: (type: 'character' | 'bubble' | 'panel' | 'background' | 'effect' | 'tone', element: Character | SpeechBubble | Panel | BackgroundElement | EffectElement | ToneElement) => void;
  onOpenCharacterPanel: (character: Character) => void;
  onOpenBackgroundPanel?: (background: BackgroundElement) => void;
  onOpenEffectPanel?: (effect: EffectElement) => void;
  onOpenTonePanel?: (tone: ToneElement) => void; // 🆕 
  onDeselectAll: () => void;
}

export class ContextMenuHandler {
  /**
   * Right-click menu action processing (tone-enabled version)
   */
  static handleAction(
    action: string,
    contextMenu: ContextMenuState,
    actions: ContextMenuActions
  ): void {
    console.log("🔍 :", action);
    
    const { target, targetElement } = contextMenu;
    
    switch (action) {
      case 'duplicateCharacter':
        if (target === 'character' && targetElement) {
          actions.onDuplicateCharacter(targetElement as Character);
        }
        break;

      case 'duplicatePanel':
        if (target === 'panel' && targetElement) {
          actions.onDuplicatePanel(targetElement as Panel);
        }
        break;

      case 'duplicateBackground':
        if (target === 'background' && targetElement && actions.onDuplicateBackground) {
          actions.onDuplicateBackground(targetElement as BackgroundElement);
        }
        break;

      case 'duplicateEffect':
        // 
        break;

      // 🆕 
      case 'duplicateTone':
        if (target === 'tone' && targetElement && actions.onDuplicateTone) {
          actions.onDuplicateTone(targetElement as ToneElement);
        }
        break;

      case 'copy':
        if (target === 'panel' && targetElement) {
          actions.onCopyToClipboard('panel', targetElement as Panel);
        } else if (target === 'character' && targetElement) {
          actions.onCopyToClipboard('character', targetElement as Character);
        } else if (target === 'bubble' && targetElement) {
          actions.onCopyToClipboard('bubble', targetElement as SpeechBubble);
        } else if (target === 'background' && targetElement) {
          actions.onCopyToClipboard('background', targetElement as BackgroundElement);
        } else if (target === 'effect' && targetElement) {
          actions.onCopyToClipboard('effect', targetElement as EffectElement);
        } else if (target === 'tone' && targetElement) {
          // 🆕 
          actions.onCopyToClipboard('tone', targetElement as ToneElement);
        }
        break;

      case 'paste':
        actions.onPasteFromClipboard();
        break;

      case 'flipHorizontal':
        actions.onFlipHorizontal();
        break;

      case 'flipVertical':
        actions.onFlipVertical();
        break;

      case 'editPanel':
        if (target === 'panel' && targetElement) {
          actions.onEditPanel(targetElement as Panel);
        }
        break;

      case 'delete':
        if (target === 'panel' && targetElement) {
          actions.onDeletePanel(targetElement as Panel);
        } else if (target && targetElement) {
          // 🆕 
          actions.onDeleteElement(target as 'character' | 'bubble' | 'background' | 'effect' | 'tone', targetElement as Character | SpeechBubble | BackgroundElement | EffectElement | ToneElement);
        }
        break;

      case 'select':
        if (target === 'character' && targetElement) {
          actions.onSelectElement('character', targetElement as Character);
        } else if (target === 'bubble' && targetElement) {
          actions.onSelectElement('bubble', targetElement as SpeechBubble);
        } else if (target === 'panel' && targetElement) {
          actions.onSelectElement('panel', targetElement as Panel);
        } else if (target === 'background' && targetElement) {
          actions.onSelectElement('background', targetElement as BackgroundElement);
        } else if (target === 'effect' && targetElement) {
          actions.onSelectElement('effect', targetElement as EffectElement);
        } else if (target === 'tone' && targetElement) {
          // 🆕 
          actions.onSelectElement('tone', targetElement as ToneElement);
        }
        break;

      case 'characterPanel':
        if (target === 'character' && targetElement) {
          actions.onOpenCharacterPanel(targetElement as Character);
        }
        break;

      case 'backgroundPanel':
        if (target === 'background' && targetElement && actions.onOpenBackgroundPanel) {
          actions.onOpenBackgroundPanel(targetElement as BackgroundElement);
        }
        break;

      case 'effectPanel':
        // 
        break;

      // 🆕 
      case 'tonePanel':
        if (target === 'tone' && targetElement && actions.onOpenTonePanel) {
          actions.onOpenTonePanel(targetElement as ToneElement);
        }
        break;

      case 'splitHorizontal':
        if (target === 'panel' && targetElement) {
          actions.onSplitPanel(targetElement as Panel, 'horizontal');
        }
        break;

      case 'splitVertical':
        if (target === 'panel' && targetElement) {
          actions.onSplitPanel(targetElement as Panel, 'vertical');
        }
        break;

      case 'deselect':
        actions.onDeselectAll();
        break;
    }
  }

  /**
   * Generate right-click menu components (tone-enabled version)
   */
  static renderContextMenu(
    contextMenu: ContextMenuState,
    clipboard: ClipboardState | null,
    isPanelEditMode: boolean,
    onAction: (action: string) => void,
    onStopPropagation: (e: React.MouseEvent) => void
  ): React.ReactElement | null {
    if (!contextMenu.visible) return null;

    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    
    const menuStyle: React.CSSProperties = {
      position: "fixed",
      top: contextMenu.y,
      left: contextMenu.x,
      background: isDarkMode ? "#2d2d2d" : "white",
      border: `1px solid ${isDarkMode ? "#555555" : "#ccc"}`,
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 1000,
      minWidth: "120px",
      color: isDarkMode ? "#ffffff" : "#333333",
    };

    const itemStyle: React.CSSProperties = {
      padding: "8px 12px",
      cursor: "pointer",
      borderBottom: `1px solid ${isDarkMode ? "#555555" : "#eee"}`,
      transition: "background-color 0.2s",
    };

    const dangerItemStyle: React.CSSProperties = {
      ...itemStyle,
      color: "#ff4444",
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      target.style.backgroundColor = isDarkMode ? "#3d3d3d" : "#f5f5f5";
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      target.style.backgroundColor = "transparent";
    };

    return React.createElement(
      'div',
      { 
        style: menuStyle, 
        onClick: onStopPropagation 
      },
      contextMenu.target === 'character' && [
        React.createElement(
          'div',
          {
            key: 'characterPanel',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('characterPanel')
          },
          '⚙️ '
        ),
        React.createElement(
          'div',
          {
            key: 'duplicateCharacter',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('duplicateCharacter')
          },
          '👥 '
        ),
        React.createElement(
          'div',
          {
            key: 'copyCharacter',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('copy')
          },
          '📋  (Ctrl+C)'
        ),
        React.createElement(
          'div',
          {
            key: 'deleteCharacter',
            style: dangerItemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('delete')
          },
          '🗑️ '
        )
      ],
      
      contextMenu.target === 'bubble' && [
        React.createElement(
          'div',
          {
            key: 'selectBubble',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('select')
          },
          '👆 '
        ),
        React.createElement(
          'div',
          {
            key: 'copyBubble',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('copy')
          },
          '📋  (Ctrl+C)'
        ),
        React.createElement(
          'div',
          {
            key: 'deleteBubble',
            style: dangerItemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('delete')
          },
          '🗑️ '
        )
      ],

      contextMenu.target === 'background' && [
        React.createElement(
          'div',
          {
            key: 'backgroundPanel',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('backgroundPanel')
          },
          '🎨 '
        ),
        React.createElement(
          'div',
          {
            key: 'duplicateBackground',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('duplicateBackground')
          },
          '🎭 '
        ),
        React.createElement(
          'div',
          {
            key: 'copyBackground',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('copy')
          },
          '📋  (Ctrl+C)'
        ),
        React.createElement(
          'div',
          {
            key: 'deleteBackground',
            style: dangerItemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('delete')
          },
          '🗑️ '
        )
      ],

      contextMenu.target === 'effect' && [
        React.createElement(
          'div',
          {
            key: 'deleteEffect',
            style: dangerItemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('delete')
          },
          '🗑️ '
        )
      ],

      // 🆕 
      contextMenu.target === 'tone' && [
        React.createElement(
          'div',
          {
            key: 'tonePanel',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('tonePanel')
          },
          '🎯 '
        ),
        React.createElement(
          'div',
          {
            key: 'duplicateTone',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('duplicateTone')
          },
          '🎯 '
        ),
        React.createElement(
          'div',
          {
            key: 'copyTone',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('copy')
          },
          '📋  (Ctrl+C)'
        ),
        React.createElement(
          'div',
          {
            key: 'deleteTone',
            style: dangerItemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('delete')
          },
          '🗑️ '
        )
      ],
      
      contextMenu.target === 'panel' && [
        !isPanelEditMode && React.createElement(
          'div',
          {
            key: 'editPanel',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('editPanel')
          },
          '🔧 '
        ),
        React.createElement(
          'div',
          {
            key: 'duplicatePanel',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('duplicatePanel')
          },
          '📋 '
        ),
        React.createElement(
          'div',
          {
            key: 'copyPanel',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('copy')
          },
          '📋  (Ctrl+C)'
        ),
        isPanelEditMode && React.createElement(
          'div',
          {
            key: 'flipHorizontal',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('flipHorizontal')
          },
          '↔️ '
        ),
        isPanelEditMode && React.createElement(
          'div',
          {
            key: 'flipVertical',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('flipVertical')
          },
          '↕️ '
        ),
        React.createElement(
          'div',
          {
            key: 'splitHorizontal',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('splitHorizontal')
          },
          '✂️ '
        ),
        React.createElement(
          'div',
          {
            key: 'splitVertical',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('splitVertical')
          },
          '✂️ '
        ),
        React.createElement(
          'div',
          {
            key: 'deletePanel',
            style: dangerItemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('delete')
          },
          '🗑️ '
        )
      ].filter(Boolean),
      
      !contextMenu.target && [
        clipboard && React.createElement(
          'div',
          {
            key: 'paste',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('paste')
          },
          `📌  (Ctrl+V) - ${clipboard.type}`
        ),
        React.createElement(
          'div',
          {
            key: 'deselect',
            style: itemStyle,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: () => onAction('deselect')
          },
          '❌ '
        )
      ].filter(Boolean)
    );
  }

  /**
   * Clipboard operation (tone-enabled version)
   */
  static copyToClipboard(
    type: 'panel' | 'character' | 'bubble' | 'background' | 'effect' | 'tone', // 🆕 tone
    element: Panel | Character | SpeechBubble | BackgroundElement | EffectElement | ToneElement // 🆕 ToneElement
  ): ClipboardState {
    console.log(`📋 ${type}:`, element);
    return { type, data: element };
  }

  /**
   * 
   */
  static duplicateCharacter(
    originalCharacter: Character,
    canvasWidth: number = 600,
    canvasHeight: number = 800
  ): Character {
    console.log("🔍 :", originalCharacter.name);
    
    const newCharacter: Character = {
      ...originalCharacter,
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: `${originalCharacter.name}()`,
      x: originalCharacter.x + 50,
      y: originalCharacter.y + 20,
    };
    
    // 
    if (newCharacter.x + 60 > canvasWidth) {
      newCharacter.x = originalCharacter.x - 50;
      if (newCharacter.x < 0) {
        newCharacter.x = 20;
        newCharacter.y = originalCharacter.y + 60;
      }
    }
    if (newCharacter.y + 60 > canvasHeight) {
      newCharacter.y = Math.max(20, originalCharacter.y - 60);
    }
    
    console.log(`✅ : ${originalCharacter.name} → ${newCharacter.name}`);
    return newCharacter;
  }

  /**
   * 
   */
  static duplicateBackground(
    originalBackground: BackgroundElement,
    canvasWidth: number = 600,
    canvasHeight: number = 800
  ): BackgroundElement {
    console.log("🎨 :", originalBackground.type);
    
    const newBackground: BackgroundElement = {
      ...originalBackground,
      id: `bg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      x: Math.min(originalBackground.x + 0.1, 0.9),
      y: Math.min(originalBackground.y + 0.1, 0.9),
    };
    
    console.log(`✅ : ${originalBackground.type} → ${newBackground.id}`);
    return newBackground;
  }

  /**
   * 
   */
  static duplicateEffect(
    originalEffect: EffectElement,
    canvasWidth: number = 600,
    canvasHeight: number = 800
  ): EffectElement {
    console.log("⚡ :", originalEffect.type);
    
    const newEffect: EffectElement = {
      ...originalEffect,
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      x: Math.min(originalEffect.x + 0.1, 0.9),
      y: Math.min(originalEffect.y + 0.1, 0.9),
    };
    
    console.log(`✅ : ${originalEffect.type} → ${newEffect.id}`);
    return newEffect;
  }

  /**
   * 🆕 
   */
  static duplicateTone(
    originalTone: ToneElement,
    canvasWidth: number = 600,
    canvasHeight: number = 800
  ): ToneElement {
    console.log("🎯 :", originalTone.type);
    
    const newTone: ToneElement = {
      ...originalTone,
      id: `tone_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      x: Math.min(originalTone.x + 0.1, 0.9),
      y: Math.min(originalTone.y + 0.1, 0.9),
    };
    
    console.log(`✅ : ${originalTone.type} → ${newTone.id}`);
    return newTone;
  }

  /**
   * 
   */
  static flipElements(
    direction: 'horizontal' | 'vertical',
    panels: Panel[],
    characters: Character[],
    speechBubbles: SpeechBubble[],
    backgrounds: BackgroundElement[],
    effects: EffectElement[],
    tones: ToneElement[], // 🆕 tones
    canvasWidth: number = 600,
    canvasHeight: number = 800
  ): {
    panels: Panel[];
    characters: Character[];
    speechBubbles: SpeechBubble[];
    backgrounds: BackgroundElement[];
    effects: EffectElement[];
    tones: ToneElement[]; // 🆕 tones
  } {
    if (direction === 'horizontal') {
      const flippedPanels = panels.map(panel => ({
        ...panel,
        x: canvasWidth - panel.x - panel.width
      }));
      const flippedCharacters = characters.map(char => ({
        ...char,
        x: char.isGlobalPosition ? canvasWidth - char.x : char.x
      }));
      const flippedBubbles = speechBubbles.map(bubble => ({
        ...bubble,
        x: bubble.isGlobalPosition ? canvasWidth - bubble.x : bubble.x
      }));
      const flippedBackgrounds = backgrounds.map(bg => ({
        ...bg,
        x: 1 - bg.x - bg.width
      }));
      const flippedEffects = effects.map(effect => ({
        ...effect,
        x: 1 - effect.x - effect.width,
        angle: effect.type === 'speed' ? 180 - effect.angle : effect.angle
      }));
      // 🆕 
      const flippedTones = tones.map(tone => ({
        ...tone,
        x: 1 - tone.x - tone.width,
        rotation: tone.rotation !== undefined ? 360 - tone.rotation : tone.rotation
      }));
      
      console.log("↔️ Horizontal flip complete (including tones)");
      return {
        panels: flippedPanels,
        characters: flippedCharacters,
        speechBubbles: flippedBubbles,
        backgrounds: flippedBackgrounds,
        effects: flippedEffects,
        tones: flippedTones
      };
    } else {
      const flippedPanels = panels.map(panel => ({
        ...panel,
        y: canvasHeight - panel.y - panel.height
      }));
      const flippedCharacters = characters.map(char => ({
        ...char,
        y: char.isGlobalPosition ? canvasHeight - char.y : char.y
      }));
      const flippedBubbles = speechBubbles.map(bubble => ({
        ...bubble,
        y: bubble.isGlobalPosition ? canvasHeight - bubble.y : bubble.y
      }));
      const flippedBackgrounds = backgrounds.map(bg => ({
        ...bg,
        y: 1 - bg.y - bg.height
      }));
      const flippedEffects = effects.map(effect => ({
        ...effect,
        y: 1 - effect.y - effect.height,
        angle: effect.type === 'speed' ? -effect.angle : effect.angle
      }));
      // 🆕 
      const flippedTones = tones.map(tone => ({
        ...tone,
        y: 1 - tone.y - tone.height,
        rotation: tone.rotation !== undefined ? -tone.rotation : tone.rotation
      }));
      
      console.log("↕️ Vertical flip complete (including tones)");
      return {
        panels: flippedPanels,
        characters: flippedCharacters,
        speechBubbles: flippedBubbles,
        backgrounds: flippedBackgrounds,
        effects: flippedEffects,
        tones: flippedTones
      };
    }
  }

  /**
   * 
   */
  static duplicateBubble(originalBubble: SpeechBubble): SpeechBubble {
    return {
      ...originalBubble,
      id: `bubble_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      text: `${originalBubble.text}()`,
      x: originalBubble.x + 30,
      y: originalBubble.y + 30,
    };
  }
}