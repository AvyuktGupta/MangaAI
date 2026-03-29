// src/components/CanvasComponent/hooks/useElementActions.ts - Data retention revision when moving characters
import { useEffect } from 'react';
import { Panel, Character, SpeechBubble } from '../../../types';
import { CanvasState, CanvasStateActions } from './useCanvasState';
import { templates } from '../../CanvasArea/templates';

export interface ElementActionsHookProps {
  state: CanvasState;
  actions: CanvasStateActions;
  selectedTemplate: string;
  panels: Panel[];
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  speechBubbles: SpeechBubble[];
  setSpeechBubbles: (bubbles: SpeechBubble[]) => void;
  onCharacterAdd: (addFunction: (type: string) => void) => void;
  onBubbleAdd: (addFunction: (type: string, text: string) => void) => void;
  onCharacterSelect?: (character: Character | null) => void;
}

export interface ElementActionsReturn {
  addCharacter: (type: string) => void;
  addBubble: (type: string, text: string) => void;
  handleEditComplete: () => void;
  handleEditCancel: () => void;
  // 🆕 Added data retention when moving characters
  updateCharacterPosition: (characterId: string, newX: number, newY: number, additionalUpdates?: Partial<Character>) => void;
}

/**
 * CanvasCustom to manage the ability to add and edit elementshook
 * Centralize character and callout additions and editing
 */
export const useElementActions = ({
  state,
  actions,
  selectedTemplate,
  panels,
  characters,
  setCharacters,
  speechBubbles,
  setSpeechBubbles,
  onCharacterAdd,
  onBubbleAdd,
  onCharacterSelect,
}: ElementActionsHookProps): ElementActionsReturn => {

  /**
   * 🆕 Advanced setting retention function when updating character position
   */
  const updateCharacterPosition = (
    characterId: string, 
    newX: number, 
    newY: number, 
    additionalUpdates?: Partial<Character>
  ) => {
    console.log('🔧 :', {
      characterId,
      newPosition: { x: newX, y: newY },
      additionalUpdates
    });

    const updatedCharacters = characters.map(char => {
      if (char.id === characterId) {
        // 🔧 
        console.log('🔍 Character advanced settings before moving:', {
          id: char.id,
          name: char.name,
          expression: char.expression,
          action: char.action,
          facing: char.facing,
          eyeState: (char as any).eyeState,
          mouthState: (char as any).mouthState,
          handGesture: (char as any).handGesture,
          emotion_primary: (char as any).emotion_primary,
          physical_state: (char as any).physical_state
        });

        const updatedChar = {
          ...char,  // 🔧 
          x: newX,
          y: newY,
          ...additionalUpdates   // Apply additional updates as needed
        };

        // 🔧 
        console.log('✅ Confirmation of character detail setting retention after moving:', {
          id: updatedChar.id,
          name: updatedChar.name,
          preserved_expression: updatedChar.expression,
          preserved_action: updatedChar.action,
          preserved_facing: updatedChar.facing,
          preserved_eyeState: (updatedChar as any).eyeState,
          preserved_mouthState: (updatedChar as any).mouthState,
          preserved_handGesture: (updatedChar as any).handGesture,
          preserved_emotion_primary: (updatedChar as any).emotion_primary,
          preserved_physical_state: (updatedChar as any).physical_state,
          new_position: `(${newX}, ${newY})`
        });

        return updatedChar;
      }
      return char;  // Don't change other characters
    });

    setCharacters(updatedCharacters);

    // 🔧 
    if (state.selectedCharacter && state.selectedCharacter.id === characterId) {
      const updatedSelectedChar = updatedCharacters.find(c => c.id === characterId);
      if (updatedSelectedChar) {
        actions.setSelectedCharacter(updatedSelectedChar);
        if (onCharacterSelect) onCharacterSelect(updatedSelectedChar);
      }
    }
  };

  /**
   * 🆕 Calculate new callout placement (avoid duplicates)
   */
  const calculateBubblePosition = (
    targetPanel: Panel,
    bubbleWidth: number,
    bubbleHeight: number,
    existingBubbles: SpeechBubble[]
  ): { x: number; y: number } => {
    
    // Placement area definition in panel (top to bottom, left to right)
    const placementAreas = [
      { x: 0.2, y: 0.1 }, // 
      { x: 0.7, y: 0.1 }, // 
      { x: 0.5, y: 0.2 }, // 
      { x: 0.1, y: 0.4 }, // 
      { x: 0.8, y: 0.4 }, // 
      { x: 0.3, y: 0.6 }, // 
      { x: 0.6, y: 0.6 }, // 
      { x: 0.5, y: 0.8 }, // 
    ];

    // Count the number of existing bubbles in the panel
    const panelBubbles = existingBubbles.filter(b => b.panelId === targetPanel.id);
    console.log(`💬 ${targetPanel.id}: ${panelBubbles.length}`);

    // 
    for (let i = 0; i < placementAreas.length; i++) {
      const areaIndex = (panelBubbles.length + i) % placementAreas.length;
      const area = placementAreas[areaIndex];
      
      const candidateX = targetPanel.x + targetPanel.width * area.x - bubbleWidth / 2;
      const candidateY = targetPanel.y + targetPanel.height * area.y - bubbleHeight / 2;
      
      // Check if it overlaps with an existing callout
      const hasOverlap = existingBubbles.some(bubble => {
        if (bubble.panelId !== targetPanel.id) return false;
        
        const distance = Math.sqrt(
          Math.pow(bubble.x - candidateX, 2) + Math.pow(bubble.y - candidateY, 2)
        );
        return distance < 80; // 80px
      });

      if (!hasOverlap) {
        console.log(`✅ : ${areaIndex + 1} (${candidateX.toFixed(1)}, ${candidateY.toFixed(1)})`);
        return { x: candidateX, y: candidateY };
      }
    }

    // Random placement if all areas are filled
    const randomX = targetPanel.x + Math.random() * (targetPanel.width - bubbleWidth);
    const randomY = targetPanel.y + Math.random() * (targetPanel.height - bubbleHeight);
    console.log(`🎲 : (${randomX.toFixed(1)}, ${randomY.toFixed(1)})`);
    
    return { x: randomX, y: randomY };
  };

  /**
   * 
   */
  const addCharacter = (type: string) => {
    let availablePanels = panels;
    if (availablePanels.length === 0 && selectedTemplate && templates[selectedTemplate]) {
      availablePanels = templates[selectedTemplate].panels;
    }
    
    const targetPanel = state.selectedPanel || availablePanels[0];
    if (!targetPanel) {
      console.log("⚠️ No panels available");
      return;
    }

    const characterNames: Record<string, string> = {
      hero: "",
      heroine: "", 
      rival: "",
      friend: "",
      character_1: "", // 🔧 character_1
      character_2: "", // 🔧 character_2
      character_3: "", // 🔧 character_3
      character_4: "", // 🔧 character_4
    };

    let viewType: "face" | "upper_body" | "full_body";

    switch (type) {
      case "hero":
      case "character_1":
        viewType = "upper_body";
        break;
      case "heroine":
      case "character_2":
        viewType = "upper_body";
        break;
      case "rival":
      case "character_3":
        viewType = "upper_body";
        break;
      case "friend":
      case "character_4":
        viewType = "face";
        break;
      default:
        viewType = "upper_body";
    }

    const newCharacter: Character = {
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      panelId: targetPanel.id,
      characterId: `char_${type}_${Date.now()}`,
      type: type,
      name: characterNames[type] || "",
      x: targetPanel.x + targetPanel.width * 0.5,
      y: targetPanel.y + targetPanel.height * 0.7,
      scale: 2.0,
      // width: initialWidth,    // 🔧 
      // height: initialHeight,  // 🔧 
      facing: "",           // 🔧 
      action: "",           // 🔧 
      expression: "",       // 🔧 
      viewType: viewType,
      eyeState: "",         // 🔧 
      mouthState: "",       // 🔧 
      handGesture: "",      // 🔧 
      isGlobalPosition: true,
    };

    setCharacters([...characters, newCharacter]);
    actions.setSelectedCharacter(newCharacter);
    if (onCharacterSelect) onCharacterSelect(newCharacter);
    console.log("✅ :", newCharacter.name, `()`);
  };

  /**
   * 🔧 Callout Addition (Duplicate Avoidance)
   */
  const addBubble = (type: string, text: string) => {
    let availablePanels = panels;
    if (availablePanels.length === 0 && selectedTemplate && templates[selectedTemplate]) {
      availablePanels = templates[selectedTemplate].panels;
    }
    
    const targetPanel = state.selectedPanel || availablePanels[0];
    if (!targetPanel) {
      console.log("⚠️ No panels available");
      return;
    }

    const textLength = text.length;
    const baseWidth = Math.max(60, textLength * 8 + 20);
    const baseHeight = Math.max(80, Math.ceil(textLength / 4) * 20 + 40);

    // 🔧 
    const position = calculateBubblePosition(targetPanel, baseWidth, baseHeight, speechBubbles);

    const newBubble: SpeechBubble = {
      id: `bubble_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      panelId: targetPanel.id,
      type: type,
      text: text || "",
      x: position.x,  // 🔧 
      y: position.y,  // 🔧 
      scale: 1.0,
      width: baseWidth,
      height: baseHeight,
      vertical: true,
      isGlobalPosition: true,
    };

    // 🔧 Add a new callout while retaining the coordinates of the existing callout
    setSpeechBubbles([...speechBubbles, newBubble]);
    actions.setSelectedBubble(newBubble);
    
    console.log("✅ :", type, `:(${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
  };

  /**
   * 
   */
  const handleEditComplete = () => {
    if (state.editingBubble && state.editText.trim()) {
      const textLength = state.editText.length;
      
      // Separate processing by relative coordinates or absolute coordinates
      let newWidth: number;
      let newHeight: number;
      
      if (state.editingBubble.isGlobalPosition === false) {
        // AI: 0-1
        // Keep the original size (does not auto-adjust according to the amount of text)
        newWidth = state.editingBubble.width;
        newHeight = state.editingBubble.height;
      } else {
        // : 
        newWidth = Math.max(60, textLength * 8 + 20);
        newHeight = Math.max(80, Math.ceil(textLength / 4) * 20 + 40);
      }
      
      const updatedBubble = {
        ...state.editingBubble,
        text: state.editText,
        width: newWidth,
        height: newHeight,
      };
      
      // 🔧 Keep and update existing callout positions
      setSpeechBubbles(
        speechBubbles.map((bubble) =>
          bubble.id === state.editingBubble!.id ? updatedBubble : bubble
        )
      );
      
      console.log("✅ :", state.editText);
    }
    
    actions.setEditingBubble(null);
    actions.setEditText("");
  };

  /**
   * 
   */
  const handleEditCancel = () => {
    actions.setEditingBubble(null);
    actions.setEditText("");
    console.log("❌ ");
  };

  useEffect(() => {
    onCharacterAdd(addCharacter);
  }, [state.selectedPanel, characters.length]);

  useEffect(() => {
    onBubbleAdd(addBubble);
  }, [state.selectedPanel, speechBubbles.length]);

  return {
    addCharacter,
    addBubble,
    handleEditComplete,
    handleEditCancel,
    updateCharacterPosition  // 🆕 
  };
};