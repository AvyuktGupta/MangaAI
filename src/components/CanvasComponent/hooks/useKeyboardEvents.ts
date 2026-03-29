// src/components/CanvasComponent/hooks/useKeyboardEvents.ts
import { useEffect } from 'react';
import { Panel, Character, SpeechBubble } from '../../../types';
import { CanvasState, CanvasStateActions } from './useCanvasState';
import { ClipboardState, ContextMenuActions } from '../../CanvasArea/ContextMenuHandler';

export interface KeyboardEventHookProps {
  state: CanvasState;
  actions: CanvasStateActions;
  clipboard: ClipboardState | null;
  setClipboard: (clipboard: ClipboardState | null) => void;
  contextMenuActions: ContextMenuActions;
  onPanelSelect?: (panel: Panel | null) => void;
  onCharacterSelect?: (character: Character | null) => void;
}

/**
 * Custom to manage keyboard event processinghook
 * Centralize shortcut key processing
 */
export const useKeyboardEvents = ({
  state,
  actions,
  clipboard,
  setClipboard,
  contextMenuActions,
  onPanelSelect,
  onCharacterSelect,
}: KeyboardEventHookProps) => {

  /**
   * Keyboard Event Handler
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    //  (Ctrl+C)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      if (state.selectedPanel) {
        contextMenuActions.onCopyToClipboard('panel', state.selectedPanel);
        console.log("📋 Copy panel to clipboard");
      } else if (state.selectedCharacter) {
        contextMenuActions.onCopyToClipboard('character', state.selectedCharacter);
        console.log("📋 Copy character to clipboard");
      } else if (state.selectedBubble) {
        contextMenuActions.onCopyToClipboard('bubble', state.selectedBubble);
        console.log("📋 Copy callout to clipboard");
      }
    }
    
    //  (Ctrl+V)
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      contextMenuActions.onPasteFromClipboard();
      console.log("📌 ");
    }
    
    //  (Delete / Backspace) - 
    if ((e.key === 'Delete' || e.key === 'Backspace') && !state.editingBubble) {
      e.preventDefault();
      if (state.selectedPanel) {
        contextMenuActions.onDeletePanel(state.selectedPanel);
        // 
      } else if (state.selectedCharacter) {
        contextMenuActions.onDeleteElement('character', state.selectedCharacter);
        // 
      } else if (state.selectedBubble) {
        contextMenuActions.onDeleteElement('bubble', state.selectedBubble);
        // 
      }
    }

    // Deselect Clipboard Clear (Escape)
    if (e.key === 'Escape') {
      e.preventDefault();
      actions.setSelectedPanel(null);
      actions.setSelectedCharacter(null);
      actions.setSelectedBubble(null);
      setClipboard(null);
      if (onPanelSelect) onPanelSelect(null);
      if (onCharacterSelect) onCharacterSelect(null);
      console.log("❌ Deselect all · Clear clipboard");
    }

    //  (Ctrl+A) - 
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      // 
      console.log("🔄 ");
    }

    //  (Ctrl+Z) - 
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      // 
      console.log("↶ ");
    }

    //  (Ctrl+Shift+Z  Ctrl+Y) - 
    if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) {
      e.preventDefault();
      // 
      console.log("↷ ");
    }

    // For debugging: outputs the current state (Ctrl+Shift+D)
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      console.log("🔍 :", {
        selectedPanel: state.selectedPanel?.id,
        selectedCharacter: state.selectedCharacter?.name,
        selectedBubble: state.selectedBubble?.text,
        isDragging: state.isDragging,
        isResizing: state.isBubbleResizing || state.isCharacterResizing,
        clipboard: clipboard?.type,
      });
    }
  };

  /**
   * useEffectRegister/Unregister Event Listeners in
   */
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    state.selectedPanel, 
    state.selectedCharacter, 
    state.selectedBubble, 
    state.editingBubble, // 🆕 
    clipboard,
    // Include other dependencies because they are referenced in the function
  ]);

  // hookprovides only event handlers and does not require a return value
  return null;
};