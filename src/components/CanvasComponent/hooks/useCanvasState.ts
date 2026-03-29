// src/components/CanvasComponent/hooks/useCanvasState.ts
import { useState } from 'react';
import { Panel, Character, SpeechBubble } from '../../../types';

export interface CanvasState {
  // 
  selectedPanel: Panel | null;
  selectedCharacter: Character | null;
  selectedBubble: SpeechBubble | null;
  
  // &
  isDragging: boolean;
  isCharacterResizing: boolean;
  isBubbleResizing: boolean;
  isPanelResizing: boolean;
  isPanelMoving: boolean;
  resizeDirection: string;
  dragOffset: { x: number; y: number };
  
  // 🆕 
  isCharacterRotating: boolean;
  rotationStartAngle: number;
  originalRotation: number;
  
  // 
  initialBubbleBounds: {
    x: number; y: number; width: number; height: number;
  } | null;
  initialCharacterBounds: {
    x: number; y: number; width: number; height: number;
  } | null;
  
  // UI
  snapLines: Array<{
    x1: number; y1: number; x2: number; y2: number; 
    type: 'vertical' | 'horizontal';
  }>;
  editingBubble: SpeechBubble | null;
  editText: string;
}

export interface CanvasStateActions {
  // 
  setSelectedPanel: (panel: Panel | null) => void;
  setSelectedCharacter: (character: Character | null) => void;
  setSelectedBubble: (bubble: SpeechBubble | null) => void;
  
  // 
  setIsDragging: (isDragging: boolean) => void;
  setIsCharacterResizing: (isResizing: boolean) => void;
  setIsBubbleResizing: (isResizing: boolean) => void;
  setIsPanelResizing: (isResizing: boolean) => void;
  setIsPanelMoving: (isMoving: boolean) => void;
  setResizeDirection: (direction: string) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;

  // 🆕 
  setIsCharacterRotating: (isRotating: boolean) => void;
  setRotationStartAngle: (angle: number) => void;
  setOriginalRotation: (rotation: number) => void;
  
  // 
  setInitialBubbleBounds: (bounds: {
    x: number; y: number; width: number; height: number;
  } | null) => void;
  setInitialCharacterBounds: (bounds: {
    x: number; y: number; width: number; height: number;
  } | null) => void;
  
  // UI
  setSnapLines: (lines: Array<{
    x1: number; y1: number; x2: number; y2: number; 
    type: 'vertical' | 'horizontal';
  }>) => void;
  setEditingBubble: (bubble: SpeechBubble | null) => void;
  setEditText: (text: string) => void;
  
  // 
  resetAllStates: () => void;
  resetDragStates: () => void;
}

/**
 * CanvasOperation related state management customhook
 * CanvasComponent
 */
export const useCanvasState = (): [CanvasState, CanvasStateActions] => {
  // 
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedBubble, setSelectedBubble] = useState<SpeechBubble | null>(null);
  
  // &
  const [isDragging, setIsDragging] = useState(false);
  const [isCharacterResizing, setIsCharacterResizing] = useState(false);
  const [isBubbleResizing, setIsBubbleResizing] = useState(false);
  const [isPanelResizing, setIsPanelResizing] = useState(false);
  const [isPanelMoving, setIsPanelMoving] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  

  // &
  const [isCharacterRotating, setIsCharacterRotating] = useState(false);
  const [rotationStartAngle, setRotationStartAngle] = useState(0);
  const [originalRotation, setOriginalRotation] = useState(0);
  

  // 
  const [initialBubbleBounds, setInitialBubbleBounds] = useState<{
    x: number; y: number; width: number; height: number;
  } | null>(null);
  const [initialCharacterBounds, setInitialCharacterBounds] = useState<{
    x: number; y: number; width: number; height: number;
  } | null>(null);
  
  // UI
  const [snapLines, setSnapLines] = useState<Array<{
    x1: number; y1: number; x2: number; y2: number; 
    type: 'vertical' | 'horizontal';
  }>>([]);
  const [editingBubble, setEditingBubble] = useState<SpeechBubble | null>(null);
  const [editText, setEditText] = useState("");

  // 
  const state: CanvasState = {
    selectedPanel,
    selectedCharacter,
    selectedBubble,
    isDragging,
    isCharacterRotating,
    rotationStartAngle,
    originalRotation,
    isCharacterResizing,
    isBubbleResizing,
    isPanelResizing,
    isPanelMoving,
    resizeDirection,
    dragOffset,
    initialBubbleBounds,
    initialCharacterBounds,
    snapLines,
    editingBubble,
    editText,
  };

  // 
  const resetAllStates = () => {
    setSelectedPanel(null);
    setSelectedCharacter(null);
    setSelectedBubble(null);
    resetDragStates();
    setSnapLines([]);
    setEditingBubble(null);
    setEditText("");
  };

  // 
  const resetDragStates = () => {
    setIsDragging(false);
    setIsCharacterResizing(false);
    setIsCharacterRotating(false); // ← 
    setRotationStartAngle(0);      // ← 
    setOriginalRotation(0);        // ← 
    setIsBubbleResizing(false);
    setIsPanelResizing(false);
    setIsPanelMoving(false);
    setResizeDirection("");
    setInitialBubbleBounds(null);
    setInitialCharacterBounds(null);
  };

  // 
  const actions: CanvasStateActions = {
    setSelectedPanel,
    setSelectedCharacter,
    setSelectedBubble,
    setIsDragging,
    setIsCharacterRotating,  // ← 
    setRotationStartAngle,   // ← 
    setOriginalRotation,     // ← 
    setIsCharacterResizing,
    setIsBubbleResizing,
    setIsPanelResizing,
    setIsPanelMoving,
    setResizeDirection,
    setDragOffset,
    setInitialBubbleBounds,
    setInitialCharacterBounds,
    setSnapLines,
    setEditingBubble,
    setEditText,
    resetAllStates,
    resetDragStates,
  };

  return [state, actions];
};

