// src/App.tsx - v1.1.5 Initial screen display optimization version
import React, { useState, useEffect, useCallback, useMemo } from "react";
import CanvasComponent from "./components/CanvasComponent";
import CharacterDetailPanel from "./components/UI/CharacterDetailPanel";
import { Panel, Character, SpeechBubble, SnapSettings, BackgroundElement, EffectElement, ToneElement, BackgroundTemplate, CanvasSettings, DEFAULT_CANVAS_SETTINGS } from "./types";
import { templates } from "./components/CanvasArea/templates";
import { ExportPanel } from './components/UI/ExportPanel';
import { useRef } from 'react';
import "./App.css";
import { COLOR_PALETTE, getThemeColors } from './styles/colorPalette';

// import(Including tone function)
import useProjectSave from './hooks/useProjectSave';
import ProjectPanel from './components/UI/ProjectPanel';
import BackgroundPanel from './components/UI/BackgroundPanel';
import EffectPanel from './components/UI/EffectPanel';
import TonePanel from './components/UI/TonePanel';
import { CharacterSettingsPanel } from './components/UI/CharacterSettingsPanel';
import { PageManager } from './components/UI/PageManager';
import { usePageManager } from './hooks/usePageManager';
import { SceneTemplatePanel } from './components/UI/SceneTemplatePanel';
import PanelTemplateSelector from './components/UI/PanelTemplateSelector';
import { PaperSizeSelectPanel } from './components/UI/PaperSizeSelectPanel';
import SnapSettingsPanel from './components/UI/SnapSettingsPanel';
import { SimpleFeedbackPanel } from './components/UI/SimpleFeedbackPanel';
import { CURRENT_CONFIG, BetaUtils } from './config/betaConfig';
import { StoryToComicModal } from './components/UI/StoryToComicModal';
import { OllamaSettingsModal } from './components/UI/OllamaSettingsModal';
import { CharacterPromptRegisterModal } from './components/UI/CharacterPromptRegisterModal';
import HelpModal from './components/UI/HelpModal';
import { ollamaService } from './services/OllamaService';
import { usageLimitService } from './services/UsageLimitService';

import {
  calculateScaleTransform,
  scalePanel,
  scaleCharacter,
  scaleBubble,
  scaleBackground,
  scaleEffect,
  scaleTone,
  validateScaleTransform,
  logScaleTransform
} from './utils/ScaleTransformUtils';

function App() {
  // 🔧 1: Unify and clarify initialization of state management
  const [selectedTemplate, setSelectedTemplate] = useState<string>("reverse_t");

  // 🔧 2: Optimizing initial panel settings
  const [panels, setPanels] = useState<Panel[]>(() => {
    // Console logging disabled
    const initialPanels = templates.reverse_t.panels;
    // Console logging disabled
    return [...initialPanels];
  });

  // Basic state management (optimized)
  const [characters, setCharacters] = useState<Character[]>([]);
  const [speechBubbles, setSpeechBubbles] = useState<SpeechBubble[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundElement[]>([]);
  const [effects, setEffects] = useState<EffectElement[]>([]);
  const [tones, setTones] = useState<ToneElement[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const [selectedPanels, setSelectedPanels] = useState<Panel[]>([]); // For multiple selection
  const [selectedEffect, setSelectedEffect] = useState<EffectElement | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneElement | null>(null);
  const [dialogueText, setDialogueText] = useState<string>("");

  // UIState management (optimized)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showCharacterPanel, setShowCharacterPanel] = useState<boolean>(false);
  const [isPanelEditMode, setIsPanelEditMode] = useState<boolean>(false);
  const [showProjectPanel, setShowProjectPanel] = useState<boolean>(false);
  const [showBackgroundPanel, setShowBackgroundPanel] = useState<boolean>(false);
  const [showEffectPanel, setShowEffectPanel] = useState<boolean>(false);
  const [showTonePanel, setShowTonePanel] = useState<boolean>(false);
  const [showCharacterSettingsPanel, setShowCharacterSettingsPanel] = useState<boolean>(false);
  const [editingCharacterType, setEditingCharacterType] = useState<string>('');
  const [showPanelSelector, setShowPanelSelector] = useState<boolean>(false);
  const [showSnapSettingsPanel, setShowSnapSettingsPanel] = useState<boolean>(false);
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(DEFAULT_CANVAS_SETTINGS);
  const [isPaperSizePanelVisible, setIsPaperSizePanelVisible] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState<boolean>(false);

  // Sidebar open/closed state
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(true);

  // 🔄 Frame replacement function
  const [swapPanel1, setSwapPanel1] = useState<number | null>(null);
  const [swapPanel2, setSwapPanel2] = useState<number | null>(null);
  const [isSwapMode, setIsSwapMode] = useState<boolean>(false);
  const lastPanelClickRef = useRef<{ panelId: number; timestamp: number } | null>(null);

  // 🧪 Beta feedback feature
  const [showFeedbackPanel, setShowFeedbackPanel] = useState<boolean>(false);
  
  // 🤖 Ollama Llama  + Flux 
  const [showStoryToComicModal, setShowStoryToComicModal] = useState<boolean>(false);
  const [storyModalMode, setStoryModalMode] = useState<'full' | 'single'>('full');
  const [showOllamaSettingsModal, setShowOllamaSettingsModal] = useState<boolean>(false);
  const [isGeneratingFromStory, setIsGeneratingFromStory] = useState<boolean>(false);
  const [isGeneratingFluxImage, setIsGeneratingFluxImage] = useState<boolean>(false);
  
  // 👤 Character prompt registration
  const [showCharacterPromptRegister, setShowCharacterPromptRegister] = useState<boolean>(false);
  const [registeringCharacterId, setRegisteringCharacterId] = useState<string>('character_1');
  
  // 📖 help modal
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Snap settings state management
  const [snapSettings, setSnapSettings] = useState<SnapSettings>({
    enabled: true,
    gridSize: 20,
    sensitivity: 'medium',
    gridDisplay: 'edit-only'
  });

  // 🔧 3: Optimizing default dark mode settings
  useEffect(() => {
    // Console logging disabled
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // 🔧 Apply initial template scaling
  useEffect(() => {
    const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
    const templateBaseWidth = 800;
    const templateBaseHeight = 600;
    
    const templateData = templates[selectedTemplate];
    if (templateData) {
      const scaledPanels = templateData.panels.map(panel => ({
        ...panel,
        x: Math.round(panel.x * pixelWidth / templateBaseWidth),
        y: Math.round(panel.y * pixelHeight / templateBaseHeight),
        width: Math.round(panel.width * pixelWidth / templateBaseWidth),
        height: Math.round(panel.height * pixelHeight / templateBaseHeight)
      }));
      setPanels(scaledPanels);
    }
  }, [canvasSettings.paperSize, selectedTemplate]);

  // 🔧 Initial canvas size settings
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
      
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      
      // Apply display scaling (optimize template placement)
      const containerWidth = 1000; // Adjust to appropriate size
      const containerHeight = 700; // 
      const displayScaleX = containerWidth / pixelWidth;
      const displayScaleY = containerHeight / pixelHeight;
      const displayScale = Math.min(displayScaleX, displayScaleY, 1);
      
      // Guaranteed minimum size (to a reasonable value)
      const minDisplayScale = 0.7;
      const finalDisplayScale = Math.max(displayScale, minDisplayScale);
      
      canvas.style.width = `${pixelWidth * finalDisplayScale}px`;
      canvas.style.height = `${pixelHeight * finalDisplayScale}px`;
      
      // Console logging disabled
    }
  }, [canvasSettings]);

  // Save projecthook
  const settings = useMemo(() => ({ 
    snapEnabled: snapSettings.enabled, 
    snapSize: snapSettings.gridSize, 
    darkMode: isDarkMode 
  }), [snapSettings.enabled, snapSettings.gridSize, isDarkMode]);

  const canvasSize = useMemo(() => ({ 
    width: 800, 
    height: 600 
  }), []);

  // For template countingmemo(optimized)
  const backgroundTemplateCount = useMemo(() => {
    const uniqueNames = new Set(
      backgrounds
        .filter(bg => bg.name)
        .map(bg => bg.name)
    );
    return uniqueNames.size;
  }, [backgrounds]);

  const effectTemplateCount = useMemo(() => {
    const uniqueNames = new Set(effects.map(effect => effect.type));
    return uniqueNames.size;
  }, [effects]);

  // Tone feature disabled

  // Character name management (optimized)
  const [characterNames, setCharacterNames] = useState<Record<string, string>>({
    character_1: 'Hero',
    character_2: 'Heroine',
    character_3: 'Rival',
    character_4: 'Friend'
  });

  const [characterSettings, setCharacterSettings] = useState<Record<string, any>>({
    character_1: { appearance: null, role: 'Hero' },
    character_2: { appearance: null, role: 'Heroine' },
    character_3: { appearance: null, role: 'Rival' },
    character_4: { appearance: null, role: 'Friend' }
  });

  const projectSave = useProjectSave();

  // for change detectionuseEffect
  useEffect(() => {
    const projectData = {
      panels,
      characters,
      bubbles: speechBubbles,
      backgrounds,
      effects,
      tones,
      canvasSize,
      settings,
      characterNames,
      characterSettings,
      canvasSettings
    };
    projectSave.checkForChanges(projectData);
  }, [panels, characters, speechBubbles, backgrounds, effects, tones, canvasSize, settings, characterNames, characterSettings, canvasSettings, projectSave]);

  // Update usage status (only in environment variable mode)
  useEffect(() => {
    const updateUsageStatus = async () => {
      if (process.env.REACT_APP_USE_ENV_API_KEY === 'true') {
        const statusText = await usageLimitService.getUsageStatusText();
        const statusElement = document.getElementById('usage-status');
        if (statusElement) {
          statusElement.textContent = statusText;
        }
      }
    };
    
    updateUsageStatus();
    const interval = setInterval(updateUsageStatus, 5000); // 5Updated every second
    
    return () => clearInterval(interval);
  }, []);

  const getCharacterDisplayName = useCallback((character: Character) => {
    return characterNames[character.type] || character.name || 'Character';
  }, [characterNames]);

  // State for function callbacks
  const [addCharacterFunc, setAddCharacterFunc] = useState<((type: string) => void) | null>(null);
  const [addBubbleFunc, setAddBubbleFunc] = useState<((type: string, text: string) => void) | null>(null);

  // /
  const [operationHistory, setOperationHistory] = useState<{
    characters: Character[][];
    speechBubbles: SpeechBubble[][];
    panels: Panel[][];
    backgrounds: BackgroundElement[][];
    effects: EffectElement[][];
    tones: ToneElement[][];
    currentIndex: number;
  }>({
    characters: [],
    speechBubbles: [],
    panels: [],
    backgrounds: [],
    effects: [],
    tones: [],
    currentIndex: -1,
  });
  
  // Undo redo flag (useRef)
  const isUndoRedoExecutingRef = useRef(false);
  
  // For initial mount judgment
  const isFirstMountRef = useRef(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Optimized history storage - Manage dependencies with strings
  const charactersSignature = useMemo(() => 
    characters.map(char => `${char.id}-${char.x}-${char.y}-${char.scale}`).join(','), 
    [characters]
  );
  
  const bubblesSignature = useMemo(() => 
    speechBubbles.map(bubble => `${bubble.id}-${bubble.x}-${bubble.y}-${bubble.width}-${bubble.height}`).join(','), 
    [speechBubbles]
  );
  
  const panelsSignature = useMemo(() => 
    panels.map(panel => `${panel.id}-${panel.x}-${panel.y}-${panel.width}-${panel.height}`).join(','), 
    [panels]
  );

  const backgroundsSignature = useMemo(() => 
    backgrounds.map(bg => `${bg.id}-${bg.x}-${bg.y}-${bg.width}-${bg.height}-${bg.opacity}`).join(','), 
    [backgrounds]
  );

  const effectsSignature = useMemo(() => 
    effects.map(effect => `${effect.id}-${effect.x}-${effect.y}-${effect.intensity}-${effect.density}`).join(','), 
    [effects]
  );

  // Tone feature disabled

  // history save function
  const saveToHistory = useCallback((
    newCharacters: Character[], 
    newBubbles: SpeechBubble[], 
    newPanels: Panel[],
    newBackgrounds: BackgroundElement[],
    newEffects: EffectElement[]
  ) => {
    setOperationHistory(prev => {
      // Special handling when saving for the first time
      if (prev.currentIndex === -1) {
        return {
          characters: [[...newCharacters]],
          speechBubbles: [[...newBubbles]],
          panels: [[...newPanels]],
          backgrounds: [[...newBackgrounds]],
          effects: [[...newEffects]],
          tones: [[]],
          currentIndex: 0,
        };
      }
      
      const newHistory = {
        characters: [...prev.characters.slice(0, prev.currentIndex + 1), [...newCharacters]],
        speechBubbles: [...prev.speechBubbles.slice(0, prev.currentIndex + 1), [...newBubbles]],
        panels: [...prev.panels.slice(0, prev.currentIndex + 1), [...newPanels]],
        backgrounds: [...prev.backgrounds.slice(0, prev.currentIndex + 1), [...newBackgrounds]],
        effects: [...prev.effects.slice(0, prev.currentIndex + 1), [...newEffects]],
        tones: [[]],
        currentIndex: prev.currentIndex + 1,
      };
      
      // History upper limit management
      if (newHistory.characters.length > 50) {
        newHistory.characters = newHistory.characters.slice(1);
        newHistory.speechBubbles = newHistory.speechBubbles.slice(1);
        newHistory.panels = newHistory.panels.slice(1);
        newHistory.backgrounds = newHistory.backgrounds.slice(1);
        newHistory.effects = newHistory.effects.slice(1);
        newHistory.tones = newHistory.tones.slice(1);
        newHistory.currentIndex = Math.max(0, newHistory.currentIndex - 1);
      }
      
      return newHistory;
    });
  }, []);


  // Automatic history saving (useEffect
  useEffect(() => {
    // Skip when mounting for the first time
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    
    // Skip during undo redo
    if (isUndoRedoExecutingRef.current) {
      return;
    }
    
    // Skip if empty
    if (characters.length === 0 && speechBubbles.length === 0 && panels.length === 0 && 
        backgrounds.length === 0 && effects.length === 0) {
      return;
    }

    // 500msSave history later (debounce)
    const timer = setTimeout(() => {
      saveToHistory(characters, speechBubbles, panels, backgrounds, effects);
    }, 500);

    return () => clearTimeout(timer);
  }, [charactersSignature, bubblesSignature, panelsSignature, backgroundsSignature, effectsSignature, saveToHistory]);

  // /
  const handleUndo = useCallback(() => {
    if (operationHistory.currentIndex > 0) {
      // flag as running
      isUndoRedoExecutingRef.current = true;
      
      const newIndex = operationHistory.currentIndex - 1;
      setCharacters([...operationHistory.characters[newIndex]]);
      setSpeechBubbles([...operationHistory.speechBubbles[newIndex]]);
      setPanels([...operationHistory.panels[newIndex]]);
      setBackgrounds([...operationHistory.backgrounds[newIndex]]);
      setEffects([...operationHistory.effects[newIndex]]);
      setOperationHistory(prev => ({ ...prev, currentIndex: newIndex }));
      
      // Reset flag (longer than history save timeout)
      setTimeout(() => {
        isUndoRedoExecutingRef.current = false;
      }, 600);
    }
  }, [operationHistory]);

  const handleRedo = useCallback(() => {
    if (operationHistory.currentIndex < operationHistory.characters.length - 1) {
      // flag as running
      isUndoRedoExecutingRef.current = true;
      
      const newIndex = operationHistory.currentIndex + 1;
      setCharacters([...operationHistory.characters[newIndex]]);
      setSpeechBubbles([...operationHistory.speechBubbles[newIndex]]);
      setPanels([...operationHistory.panels[newIndex]]);
      setBackgrounds([...operationHistory.backgrounds[newIndex]]);
      setEffects([...operationHistory.effects[newIndex]]);
      setOperationHistory(prev => ({ ...prev, currentIndex: newIndex }));
      
      // Reset flag (longer than history save timeout)
      setTimeout(() => {
        isUndoRedoExecutingRef.current = false;
      }, 600);
    }
  }, [operationHistory]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedCharacter) {
      const newCharacters = characters.filter(char => char.id !== selectedCharacter.id);
      setCharacters(newCharacters);
      setSelectedCharacter(null);
    }
  }, [selectedCharacter, characters]);

  // Keyboard event handling (optimized)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        (activeElement as HTMLElement).contentEditable === 'true'
      )) {
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleDeleteSelected();
      }
      
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
      
      if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault();
        setIsPanelEditMode(prev => !prev);
      }

      if (e.key === 'b' && e.ctrlKey) {
        e.preventDefault();
        setShowBackgroundPanel(prev => !prev);
      }

      if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setShowEffectPanel(prev => !prev);
      }

      // Tone feature disabled
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected, handleUndo, handleRedo]);

  // snap settings handler
  const handleSnapToggle = useCallback(() => {
    setShowSnapSettingsPanel(true);
  }, []);

  const handleSnapSettingsUpdate = useCallback((newSettings: SnapSettings) => {
    setSnapSettings(newSettings);
  }, []);


  const handleCharacterNameUpdate = useCallback((type: string, newName: string, newRole: string, appearance: any) => {
    // Console logging disabled
    
    setCharacterNames(prev => {
      const updated = { ...prev, [type]: newName };
      // Console logging disabled
      return updated;
    });
    
    setCharacterSettings(prev => {
      const updated = {
        ...prev,
        [type]: {
          appearance,
          role: newRole
        }
      };
      console.log(`⚙️ Settings update:`, updated);
      return updated;
    });
    
    setCharacters(prev => {
      const updated = prev.map(char => {
        if (char.type === type) {
          console.log(`🔄 Character update: ${char.id} (${type}) → ${newName}`);
          return {
            ...char,
            name: newName,
            role: newRole,
            appearance,
            label: newName,
            title: newName
          };
        }
        return char;
      });
      console.log(`✅ All characters updated:`, updated);
      return updated;
    });
    
    console.log(`✅ Character name updated: ${type} → ${newName}`);
  }, []);

  // Dark mode toggle
  const toggleTheme = useCallback(() => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
  }, [isDarkMode]);

  // 🔧 5: Optimization of template switching
  const handleTemplateClick = useCallback((template: string) => {
    console.log('🎯 Template change:', template);
    setSelectedTemplate(template);
    setSelectedCharacter(null);
    setSelectedPanel(null);
    setSelectedEffect(null);
    
    const templateData = templates[template];
    if (templateData) {
      console.log('📐 Template panels with corrected IDs:', templateData.panels);
      console.log('📐 Panel IDs:', templateData.panels.map(p => p.id));
      
      const { pixelWidth, pixelHeight } = canvasSettings.paperSize;
      const templateBaseWidth = 800;
      const templateBaseHeight = 600;
      
      const scaledPanels = templateData.panels.map(panel => ({
        ...panel,
        x: Math.round(panel.x * pixelWidth / templateBaseWidth),
        y: Math.round(panel.y * pixelHeight / templateBaseHeight),
        width: Math.round(panel.width * pixelWidth / templateBaseWidth),
        height: Math.round(panel.height * pixelHeight / templateBaseHeight)
      }));
      
    console.log('📐 Scaled panels:', scaledPanels);
    setPanels(scaledPanels);
    } else {
      console.error(`Template "${template}" not found`);
    }
    
    setCharacters([]);
    setSpeechBubbles([]);
    setBackgrounds([]);
    setEffects([]);
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('🔄 Canvas cleared for template change');
      }
    }
    
    console.log('✅ Template applied successfully with ratio scaling');
  }, [canvasSettings, saveToHistory]);

  // hook
  const pageManager = usePageManager({
    panels, characters, bubbles: speechBubbles, backgrounds, effects, tones,
    onDataUpdate: ({ panels: newPanels, characters: newCharacters, bubbles: newBubbles, backgrounds: newBackgrounds, effects: newEffects, tones: newTones }) => {
      setPanels(newPanels);
      setCharacters(newCharacters);
      setSpeechBubbles(newBubbles);
      setBackgrounds(newBackgrounds);
      setEffects(newEffects);
      setTones(newTones);
    }
  });

  // Canvas settings change handler (optimized)
  const handleCanvasSettingsChange = useCallback((newSettings: CanvasSettings) => {
    const oldSettings = canvasSettings;
    
    console.log('🔄 Canvas settings change initiated:', {
      from: {
        size: oldSettings.paperSize.displayName,
        pixels: `${oldSettings.paperSize.pixelWidth}×${oldSettings.paperSize.pixelHeight}`
      },
      to: {
        size: newSettings.paperSize.displayName,
        pixels: `${newSettings.paperSize.pixelWidth}×${newSettings.paperSize.pixelHeight}`
      }
    });
    
    if (oldSettings.paperSize.pixelWidth === newSettings.paperSize.pixelWidth && 
        oldSettings.paperSize.pixelHeight === newSettings.paperSize.pixelHeight) {
      console.log('📐 Canvas size unchanged, skipping scale transform');
      setCanvasSettings(newSettings);
      return;
    }
    
    const transform = calculateScaleTransform(oldSettings, newSettings);
    
    if (!validateScaleTransform(transform)) {
      console.error('❌ Invalid scale transform, aborting canvas resize');
      return;
    }
    
    logScaleTransform(oldSettings, newSettings, transform);
    
    setCanvasSettings(newSettings);
    
    if (pageManager && pageManager.pages && pageManager.pages.length > 0) {
      const currentPageData = pageManager.currentPage;
      
      const scaledPanels = currentPageData.panels.map(panel => scalePanel(panel, transform));
      const scaledCharacters = currentPageData.characters.map(char => scaleCharacter(char, transform));
      const scaledBubbles = currentPageData.bubbles.map(bubble => scaleBubble(bubble, transform));
      const scaledBackgrounds = currentPageData.backgrounds.map(bg => scaleBackground(bg, transform));
      const scaledEffects = currentPageData.effects.map(effect => scaleEffect(effect, transform));
      // Tone feature disabled
      
      setPanels(scaledPanels);
      setCharacters(scaledCharacters);
      setSpeechBubbles(scaledBubbles);
      setBackgrounds(scaledBackgrounds);
      setEffects(scaledEffects);
      // Tone feature disabled
    } else {
      setPanels(prev => prev.map(panel => scalePanel(panel, transform)));
      setCharacters(prev => prev.map(char => scaleCharacter(char, transform)));
      setSpeechBubbles(prev => prev.map(bubble => scaleBubble(bubble, transform)));
      setBackgrounds(prev => prev.map(bg => scaleBackground(bg, transform)));
      setEffects(prev => prev.map(effect => scaleEffect(effect, transform)));
      // Tone feature disabled
    }
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const newWidth = newSettings.paperSize.pixelWidth;
      const newHeight = newSettings.paperSize.pixelHeight;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      const containerWidth = 1200; // 1000 → 1200 
      const containerHeight = 800; // 700 → 800 
      const displayScaleX = containerWidth / newWidth;
      const displayScaleY = containerHeight / newHeight;
      const displayScale = Math.min(displayScaleX, displayScaleY, 1);
      
      // Guaranteed minimum size (to a reasonable value)
      const minDisplayScale = 0.8; // 0.7 → 0.8 
      const finalDisplayScale = Math.max(displayScale, minDisplayScale);
      
      canvas.style.width = `${newWidth * finalDisplayScale}px`;
      canvas.style.height = `${newHeight * finalDisplayScale}px`;
      
      console.log('🖼️ Canvas physical size updated');
      
      requestAnimationFrame(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log('🔄 Canvas cleared and ready for redraw');
          }
        }
      });
    }
    
    console.log('✅ Canvas settings change completed successfully');
  }, [canvasSettings, canvasRef, pageManager]);

  // Other handler functions (same as existing, omitted)
  const getCanvasDisplayScale = useCallback(() => {
    if (!canvasRef.current) return 1;
    
    const canvas = canvasRef.current;
    const actualWidth = canvas.width;
    const displayWidth = canvas.offsetWidth;
    
    if (actualWidth === 0 || displayWidth === 0) return 1;
    
    const scale = displayWidth / actualWidth;
    return scale;
  }, [canvasRef]);

  const convertMouseToCanvasCoordinates = useCallback((mouseX: number, mouseY: number) => {
    const displayScale = getCanvasDisplayScale();
    const canvasX = mouseX / displayScale;
    const canvasY = mouseY / displayScale;
    
    return { x: Math.round(canvasX), y: Math.round(canvasY) };
  }, [getCanvasDisplayScale]);

  // Character operation
  const handleCharacterClick = useCallback((charType: string) => {
    if (addCharacterFunc) {
      addCharacterFunc(charType);
    }
  }, [addCharacterFunc]);

  const handleBubbleClick = useCallback((bubbleType: string) => {
    if (addBubbleFunc) {
      const text = dialogueText || "Double-click to edit";
      addBubbleFunc(bubbleType, text);
      setDialogueText("");
    }
  }, [addBubbleFunc, dialogueText]);

  // 👤 Save character prompt registration
  const handleSaveCharacterPrompt = useCallback((characterId: string, name: string, prompt: string) => {
    // Update character name
    setCharacterNames(prev => ({
      ...prev,
      [characterId]: name
    }));

    // Save prompt in character settings
    setCharacterSettings(prev => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        appearance: {
          ...prev[characterId]?.appearance,
          basePrompt: prompt
        }
      }
    }));

    alert(`✅ Saved prompt for ${name}`);
  }, []);

  // 🤖 Ollama: Preview generation
  const handleGeneratePreview = useCallback(async (story: string, tone: string): Promise<any[]> => {
    // Prepare registered character information
    const registeredCharacters = Object.entries(characterNames)
      .filter(([id, name]) => characterSettings[id]?.appearance?.basePrompt)
      .map(([id, name]) => ({
        id,
        name,
        prompt: characterSettings[id].appearance.basePrompt
      }));

    const result = await ollamaService.generatePanelContent({
      story,
      panelCount: panels.length,
      tone,
      characters: registeredCharacters
    });

    if (!result.success || !result.panels) {
      throw new Error(result.error || 'Generation failed');
    }

    return result.panels;
  }, [panels, characterNames, characterSettings]);

  // 🤖 Ollama: Apply preview
  const handleApplyPreview = useCallback((previewData: any[]) => {
    const { updatedPanels, newBubbles } = ollamaService.applyPanelContent(
      panels,
      speechBubbles,
      previewData,
      characterSettings
    );

    setPanels(updatedPanels);
    setSpeechBubbles(newBubbles);
    
    alert(`✅ Applied content to ${previewData.length} panel(s)`);
  }, [panels, speechBubbles, characterSettings]);

  // 🤖 Ollama: 1
  const handleGenerateSinglePanel = useCallback(async (story: string, tone: string, targetPanelId: number) => {
    // Get existing frame information
    const existingPanels = panels.map(panel => ({
      panelId: panel.id,
      note: panel.note || '',
      dialogue: speechBubbles.find(bubble => bubble.panelId === panel.id)?.text || '',
      actionPrompt: panel.actionPrompt || '',
      characterId: panel.selectedCharacterId
    }));

    // Registered character information
    const characters = Object.entries(characterNames).map(([id, name]) => ({
      id,
      name,
      prompt: characterSettings[id]?.appearance?.basePrompt || ''
    }));

    const result = await ollamaService.generateSinglePanel(
      story,
      targetPanelId,
      existingPanels,
      tone || undefined,
      characters
    );

    return result;
  }, [panels, speechBubbles, characterNames, characterSettings]);

  // 🤖 Ollama: 1
  const handleApplySinglePanel = useCallback((panelData: any) => {
    if (!panelData) return;

    // Apply content to selected frame
    const updatedPanels = panels.map(panel => 
      panel.id === panelData.panelId 
        ? {
            ...panel,
            note: panelData.note,
            actionPrompt: panelData.actionPrompt,
            actionPromptJa: panelData.actionPromptJa,
            selectedCharacterId: panelData.characterId
          }
        : panel
    );
    setPanels(updatedPanels);

    // Updated dialogue bubble
    const updatedBubbles = speechBubbles.filter(bubble => bubble.panelId !== panelData.panelId);
    if (panelData.dialogue) {
      const bubbleTypeMap: Record<string, string> = {
        normal: 'normal',
        shout: 'shout',
        whisper: 'whisper',
        thought: 'thought',
        // Legacy Japanese labels (escaped — no CJK in source)
        '\u666e\u901a': 'normal',
        '\u53eb\u3073': 'shout',
        '\u5c0f\u58f0': 'whisper',
        '\u5fc3\u306e\u58f0': 'thought',
      };
      
      const newBubble = {
        id: Date.now().toString(),
        panelId: panelData.panelId,
        text: panelData.dialogue,
        x: 0.5,  // Panel center (relative coordinates)
        y: 0.3,  // Near the top of the panel (relative coordinates)
        width: 0.7,  // 70%(relative coordinates)
        height: 0.25, // panel height25%(relative coordinates)
        type: bubbleTypeMap[panelData.bubbleType || 'normal'] || 'normal',
        vertical: true,  // Default is vertical
        scale: 1,
        isGlobalPosition: false  // Use panel relative coordinates
      };
      
      
      updatedBubbles.push(newBubble);
    }
    setSpeechBubbles(updatedBubbles);

    alert(`✅ Applied content to panel ${panelData.panelId}`);
  }, [panels, speechBubbles]);

  const handleCharacterUpdate = useCallback((updatedCharacter: Character) => {
    setCharacters(prevCharacters => {
      const updated = prevCharacters.map(char => {
        if (char.id === updatedCharacter.id) {
          return {
            ...char,
            ...updatedCharacter,
            eyeState: (updatedCharacter as any).eyeState,
            mouthState: (updatedCharacter as any).mouthState,
            handGesture: (updatedCharacter as any).handGesture
          };
        }
        return char;
      });
      
      return updated;
    });
    
    setSelectedCharacter(updatedCharacter);
  }, []);

  const handleCharacterDelete = useCallback((characterToDelete: Character) => {
    const newCharacters = characters.filter(char => char.id !== characterToDelete.id);
    setCharacters(newCharacters);
    setSelectedCharacter(null);
  }, [characters]);

  const handleCharacterPanelClose = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  const handlePanelUpdate = useCallback((updatedPanels: Panel[]) => {
    setPanels(updatedPanels);
    // onDragEnd(to prevent continuous updates while dragging)
  }, []);
  

  const handlePanelAdd = useCallback((targetPanelId: string, position: 'above' | 'below' | 'left' | 'right') => {
    const targetPanel = panels.find(p => p.id.toString() === targetPanelId);
    if (!targetPanel) return;

    const maxId = Math.max(...panels.map(p => typeof p.id === 'string' ? parseInt(p.id) : p.id), 0);
    const newPanelId = maxId + 1;

    let newPanel: Panel;
    const spacing = 10;

    switch (position) {
      case 'above':
        newPanel = { id: newPanelId, x: targetPanel.x, y: targetPanel.y - targetPanel.height - spacing, width: targetPanel.width, height: targetPanel.height };
        break;
      case 'below':
        newPanel = { id: newPanelId, x: targetPanel.x, y: targetPanel.y + targetPanel.height + spacing, width: targetPanel.width, height: targetPanel.height };
        break;
      case 'left':
        newPanel = { id: newPanelId, x: targetPanel.x - targetPanel.width - spacing, y: targetPanel.y, width: targetPanel.width, height: targetPanel.height };
        break;
      case 'right':
        newPanel = { id: newPanelId, x: targetPanel.x + targetPanel.width + spacing, y: targetPanel.y, width: targetPanel.width, height: targetPanel.height };
        break;
      default:
        return;
    }

    setPanels(prevPanels => [...prevPanels, newPanel]);
    console.log(`✅ Panel added: ${newPanelId} (${position})`);
  }, [panels]);

  const handlePanelDelete = useCallback((panelId: string) => {
    if (panels.length <= 1) {
      console.log(`⚠️ Cannot delete the last panel`);
      return;
    }

    if (window.confirm(`Delete panel ${panelId}?`)) {
      const panelIdNum = parseInt(panelId);
      setCharacters(prev => prev.filter(char => char.panelId !== panelIdNum));
      setSpeechBubbles(prev => prev.filter(bubble => bubble.panelId !== panelIdNum));
      setBackgrounds(prev => prev.filter(bg => bg.panelId !== panelIdNum));
      setEffects(prev => prev.filter(effect => effect.panelId !== panelIdNum));
      // Tone feature disabled
      setPanels(prev => prev.filter(panel => panel.id !== panelIdNum));
      setSelectedPanel(null);
      setSelectedEffect(null);
      // Tone feature disabled
      console.log(`🗑️ Panel deleted: ${panelId}`);
    }
  }, [panels.length]);

  const handlePanelSplit = useCallback((panelId: number, direction: "horizontal" | "vertical") => {
    const panelToSplit = panels.find(p => p.id === panelId);
    if (!panelToSplit) return;

    const gap = 10;
    const maxId = Math.max(...panels.map(p => p.id), 0);
    const newId = maxId + 1;

    let newPanels: Panel[];
    if (direction === "horizontal") {
      const availableHeight = panelToSplit.height - gap;
      const halfHeight = availableHeight / 2;
      
      const topPanel: Panel = {
        ...panelToSplit,
        height: halfHeight,
      };
      const bottomPanel: Panel = {
        ...panelToSplit,
        id: newId,
        y: panelToSplit.y + halfHeight + gap,
        height: halfHeight,
      };
      newPanels = panels.map(p => p.id === panelId ? topPanel : p).concat([bottomPanel]);
    } else {
      const availableWidth = panelToSplit.width - gap;
      const halfWidth = availableWidth / 2;
      
      const leftPanel: Panel = {
        ...panelToSplit,
        width: halfWidth,
      };
      const rightPanel: Panel = {
        ...panelToSplit,
        id: newId,
        x: panelToSplit.x + halfWidth + gap,
        width: halfWidth,
      };
      newPanels = panels.map(p => p.id === panelId ? leftPanel : p).concat([rightPanel]);
    }

    setPanels(newPanels);
    console.log(`${direction} split done (gap ${gap}px)`);
  }, [panels]);

  // Frame swapping function (same size, only swaps content)
  const handlePanelSwap = useCallback((panelId1: number, panelId2: number) => {
    const panel1 = panels.find(p => p.id === panelId1);
    const panel2 = panels.find(p => p.id === panelId2);
    
    if (!panel1 || !panel2) return;

    const swappedPanel1: Panel = {
      ...panel1,
      note: panel2.note,
      prompt: panel2.prompt,
      characterPrompt: panel2.characterPrompt,
      actionPrompt: panel2.actionPrompt,
      actionPromptJa: panel2.actionPromptJa,
      selectedCharacterId: panel2.selectedCharacterId
    };

    const swappedPanel2: Panel = {
      ...panel2,
      note: panel1.note,
      prompt: panel1.prompt,
      characterPrompt: panel1.characterPrompt,
      actionPrompt: panel1.actionPrompt,
      actionPromptJa: panel1.actionPromptJa,
      selectedCharacterId: panel1.selectedCharacterId
    };

    setPanels(prev => prev.map(panel => {
      if (panel.id === panelId1) return swappedPanel1;
      if (panel.id === panelId2) return swappedPanel2;
      return panel;
    }));

    console.log(`🔄 Swapped content of panels ${panelId1} and ${panelId2}`);
  }, [panels]);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Clear all elements on the canvas?")) {
      setCharacters([]);
      setSpeechBubbles([]);
      setBackgrounds([]);
      setEffects([]);
      // Tone feature disabled
      setSelectedCharacter(null);
      setSelectedPanel(null);
      setSelectedEffect(null);
      // Tone feature disabled
    }
  }, []);

  const handleExport = useCallback((format: string) => {
    alert(`Export as ${format} is not implemented yet`);
  }, []);

  const handleCharacterRightClick = useCallback((e: React.MouseEvent, charType: string) => {
    e.preventDefault();
    setEditingCharacterType(charType);
    setShowCharacterSettingsPanel(true);
  }, []);

  const handleCanvasCharacterRightClick = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setShowCharacterPanel(true);
  }, []);

  const handlePanelEditModeToggle = (enabled: boolean) => {
    setIsPanelEditMode(enabled);
  };

  const handleBackgroundAdd = useCallback((template: BackgroundTemplate) => {
    console.log(`Applied background template "${template.name}"`);
  }, []);

  const handleEffectAdd = useCallback((effect: EffectElement) => {
    setEffects([...effects, effect]);
    setSelectedEffect(effect);
    console.log(`Added effect "${effect.type}"`);
  }, [effects]);

  const handleEffectUpdate = useCallback((updatedEffect: EffectElement) => {
    setEffects(prev => prev.map(effect => 
      effect.id === updatedEffect.id ? updatedEffect : effect
    ));
    setSelectedEffect(updatedEffect);
  }, []);

  // Tone feature disabled

  const handleCharacterSettingsUpdate = useCallback((characterData: any) => {
    const { name, role, appearance } = characterData;
    handleCharacterNameUpdate(editingCharacterType, name || characterNames[editingCharacterType], role || characterSettings[editingCharacterType].role, appearance);
  }, [editingCharacterType, characterNames, characterSettings, handleCharacterNameUpdate]);

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/*  */}
      <header className="header">
        <h1>📖 AI Comic Layout Maker</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button 
            className="control-btn"
            onClick={() => setShowHelpModal(true)}
            title="User guide"
            style={{
              background: '#3498db',
              color: "white",
              border: '1px solid #3498db',
              fontWeight: "bold"
            }}
          >
            📖 User guide
          </button>

          <div style={{ width: "1px", height: "24px", background: "var(--border-color)" }}></div>

          <button 
            className="control-btn"
            onClick={async () => {
              if (!projectSave.currentProjectId || !projectSave.currentProjectName) {
                alert('No saved project yet. Use 📁 Project manager → Save as.');
                return;
              }
              
              try {
                const projectData = {
                  panels,
                  characters,
                  bubbles: speechBubbles,
                  backgrounds,
                  effects,
                  tones,
                  canvasSize,
                  settings,
                  characterNames,
                  characterSettings,
                  canvasSettings
                };
                
                const success = await projectSave.saveProject(projectData);
                if (success) {
                  alert(`Saved project “${projectSave.currentProjectName}”`);
                } else {
                  alert('Save failed');
                }
              } catch (error) {
                console.error('Save error:', error);
                alert('An error occurred while saving');
              }
            }}
            title={projectSave.currentProjectName ? `Overwrite: ${projectSave.currentProjectName}` : 'Overwrite (no project saved)'}
            style={{
              background: projectSave.currentProjectId ? COLOR_PALETTE.buttons.save.primary : '#9ca3af',
              color: "white",
              border: `1px solid ${projectSave.currentProjectId ? COLOR_PALETTE.buttons.save.primary : '#9ca3af'}`,
              fontWeight: "bold",
              cursor: projectSave.currentProjectId ? 'pointer' : 'not-allowed'
            }}
          >
            💾 {projectSave.currentProjectName ? `Save: ${projectSave.currentProjectName}` : 'Overwrite save'}
          </button>

          <button 
            className="control-btn"
            onClick={() => setShowProjectPanel(true)}
            title="Project manager"
            style={{
              background: COLOR_PALETTE.buttons.manage.primary,
              color: "white",
              border: `1px solid ${COLOR_PALETTE.buttons.manage.primary}`,
              fontWeight: "bold"
            }}
          >
            📁 Project manager
          </button>

          <div style={{ width: "1px", height: "24px", background: "var(--border-color)" }}></div>

          <button 
            className="control-btn"
            onClick={() => setShowExportPanel(true)}
            title="Export prompts"
            style={{
              background: COLOR_PALETTE.buttons.export.primary,
              color: "white",
              border: `1px solid ${COLOR_PALETTE.buttons.export.primary}`,
              fontWeight: "bold"
            }}
          >
            📤 Export
          </button>

          <div style={{ width: "1px", height: "24px", background: "var(--border-color)" }}></div>

          <button 
            className={`control-btn ${snapSettings.enabled ? 'active' : ''}`}
            onClick={handleSnapToggle}
            title="Snap settings"
            style={{
              background: snapSettings.enabled ? COLOR_PALETTE.buttons.success.primary : "var(--bg-tertiary)",
              color: snapSettings.enabled ? "white" : "var(--text-primary)",
              border: `1px solid ${snapSettings.enabled ? COLOR_PALETTE.buttons.success.primary : "var(--border-color)"}`,
            }}
          >
            ⚙️ Snap
          </button>
          
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Beta feedback */}
          {CURRENT_CONFIG.isBetaVersion && (
            <button 
              className="feedback-button"
              onClick={() => setShowFeedbackPanel(true)}
              title="Send beta feedback"
              style={{
                padding: "8px 12px",
                backgroundColor: COLOR_PALETTE.primary.orange,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                marginLeft: "8px"
              }}
            >
              🧪 Feedback
            </button>
          )}
        </div>
      </header>

      <PageManager
        currentPage={pageManager.currentPage}
        pages={pageManager.pages}
        currentPageIndex={pageManager.currentPageIndex}
        onPageChange={pageManager.switchToPage}
        onPageAdd={pageManager.addPage}
        onPageDelete={pageManager.deletePage}
        onPageDuplicate={pageManager.duplicatePage}
        onPageRename={pageManager.renamePage}
        onPageReorder={pageManager.reorderPages}
        onCurrentPageUpdate={pageManager.updateCurrentPageData}
        isDarkMode={isDarkMode}
      />

      <div className="main-content">
        {!isLeftSidebarOpen && (
          <button
            onClick={() => setIsLeftSidebarOpen(true)}
            style={{
              position: 'fixed',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '12px 8px',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
              zIndex: 100,
              fontSize: '16px'
            }}
          >
            ▶
          </button>
        )}
        
        {isLeftSidebarOpen && (
        <div className="sidebar left-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>🛠️ Tools</h3>
            <button
              onClick={() => setIsLeftSidebarOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px'
              }}
            >
              ◀
            </button>
          </div>
          <div className="section">
            <h3>📐 Panel templates</h3>
            <button 
              className="control-btn"
              onClick={() => setShowPanelSelector(true)}
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--accent-color)",
                color: "white",
                border: "none",
                borderRadius: "6px"
              }}
            >
              🎯 Choose layout ({Object.keys(templates).length} types)
            </button>
            <div className="section-info">
              ✨ Templates grouped by panel count
            </div>
          </div>

          {/* Character registration section */}
          <div className="section">
            <h3>👤 Characters</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {Object.entries(characterNames).map(([id, name]) => (
                <button 
                  key={id}
                  onClick={() => {
                    setRegisteringCharacterId(id);
                    setShowCharacterPromptRegister(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>{name}</span>
                  <span style={{ fontSize: "10px", opacity: 0.7 }}>
                    {characterSettings[id]?.appearance?.basePrompt ? '✅' : 'Not set'}
                  </span>
                </button>
              ))}
                </div>
            <div className="section-info" style={{ marginTop: "8px" }}>
              💡 Register prompts to reuse them
              </div>
            </div>

          <div className="section">
            <h3>📐 Paper size</h3>
            <button
              onClick={() => setIsPaperSizePanelVisible(true)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📄 {canvasSettings.paperSize.displayName}
            </button>
          </div>

          {/* SceneTemplatePanel - Focus on simple naming tools */}
        </div>
        )}

        {/* main area */}
        <div className="canvas-area">
          <div className="canvas-controls">
            <div className="undo-redo-buttons">
              <button 
                className="control-btn"
                onClick={handleUndo}
                disabled={operationHistory.currentIndex <= 0 || operationHistory.characters.length === 0}
                title="Undo (Ctrl+Z)"
              >
                ↶ Undo
              </button>
              <button 
                className="control-btn"
                onClick={handleRedo}
                disabled={operationHistory.currentIndex >= operationHistory.characters.length - 1 || operationHistory.characters.length === 0}
                title="Redo (Ctrl+Y)"
              >
                ↷ Redo
              </button>
              <button 
                className="control-btn delete-btn"
                onClick={handleDeleteSelected}
                disabled={!selectedCharacter}
                title="Delete selection (Backspace)"
              >
                🗑️ Delete
              </button>
            </div>
            <div className="canvas-info">
              History: {operationHistory.currentIndex + 1} / {Math.max(1, operationHistory.characters.length)}
              {selectedCharacter && <span> | Selected: {getCharacterDisplayName(selectedCharacter)}</span>}
              {selectedPanel && <span> | Panel {selectedPanel.id} selected</span>}
              {selectedEffect && <span> | Effect selected</span>}
              {/* Tone feature disabled */}
              {isPanelEditMode && <span> | 🔧 Panel edit mode</span>}
              {snapSettings.enabled && <span> | ⚙️ Snap: {snapSettings.gridSize}px ({snapSettings.sensitivity})</span>}
              {projectSave.isAutoSaving && <span> | 💾 Auto-saving…</span>}
              {projectSave.hasUnsavedChanges && <span> | ⚠️ Unsaved</span>}
              {backgrounds.length > 0 && <span> | 🎨 Backgrounds: {backgrounds.length}</span>}
              {effects.length > 0 && <span> | ⚡ Effects: {effects.length}</span>}
              {/* Tone function disabled */}
            </div>
          </div>

          <CanvasComponent
            ref={canvasRef}
            selectedTemplate={selectedTemplate}
            panels={panels}
            setPanels={handlePanelUpdate}
            characters={characters}
            setCharacters={setCharacters}
            speechBubbles={speechBubbles}
            setSpeechBubbles={setSpeechBubbles}
            backgrounds={backgrounds}
            setBackgrounds={setBackgrounds}
            effects={effects}
            setEffects={setEffects}
            tones={tones}
            setTones={setTones}
            selectedTone={selectedTone}
            onToneSelect={setSelectedTone}
            showTonePanel={showTonePanel}
            onTonePanelToggle={() => setShowTonePanel(!showTonePanel)}
            characterNames={characterNames}
            onCharacterAdd={(func: (type: string) => void) => setAddCharacterFunc(() => func)}
            onBubbleAdd={(func: (type: string, text: string) => void) => setAddBubbleFunc(() => func)}
            onPanelSelect={(panel: Panel | null) => {
              if (isSwapMode && panel) {
                const now = Date.now();
                if (lastPanelClickRef.current && 
                    lastPanelClickRef.current.panelId === panel.id && 
                    now - lastPanelClickRef.current.timestamp < 300) {
                  console.log('⏭️ Ignoring duplicate click');
                  return;
                }
                lastPanelClickRef.current = { panelId: panel.id, timestamp: now };
                
                console.log('🔄 Swap mode: panel click', { 
                  panelId: panel.id, 
                  currentSwap1: swapPanel1, 
                  currentSwap2: swapPanel2 
                });
                
                setSwapPanel1((prev1) => {
                  const currentSwap2 = swapPanel2;
                  
                  if (panel.id === prev1) {
                    console.log('❌ Cleared first panel selection');
                    return null;
                  } else if (panel.id === currentSwap2) {
                    console.log('❌ Cleared second panel selection');
                    setSwapPanel2(null);
                    return prev1;
                  } else if (!prev1) {
                    console.log('✅ First panel:', panel.id);
                    return panel.id;
                  } else if (prev1 && !currentSwap2) {
                    console.log('✅ Second panel:', panel.id);
                    setSwapPanel2(panel.id);
                    return prev1;
                  }
                  return prev1;
                });
                return;
              }
              setSelectedPanel(panel);
            }}
            onCharacterSelect={(character: Character | null) => setSelectedCharacter(character)}
            onCharacterRightClick={handleCanvasCharacterRightClick}
            isPanelEditMode={isPanelEditMode}
            onPanelSplit={handlePanelSplit}
            onPanelEditModeToggle={handlePanelEditModeToggle}
            onPanelAdd={handlePanelAdd}
            onPanelDelete={handlePanelDelete}
            snapSettings={snapSettings}
            swapPanel1={swapPanel1}
            swapPanel2={swapPanel2}
          />
        </div>

        {!isRightSidebarOpen && (
          <button
            onClick={() => setIsRightSidebarOpen(true)}
            style={{
              position: 'fixed',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '12px 8px',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px 0 0 6px',
              cursor: 'pointer',
              zIndex: 100,
              fontSize: '16px'
            }}
          >
            ◀
          </button>
        )}

        {isRightSidebarOpen && (
        <div className="sidebar right-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>⚙️ Settings</h3>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px'
              }}
            >
              ▶
            </button>
          </div>

          {/* Whole page memo */}
          <div className="section">
            <h3>📄 AI page</h3>
            
            <div style={{ marginBottom: "12px" }}>
              <label style={{
                fontSize: "11px",
                fontWeight: "bold",
                color: "var(--text-primary)",
                display: "block",
                marginBottom: "4px"
              }}>
                📝 Page notes (structure, beats, intent)
              </label>
              <textarea
                value={pageManager.currentPage.note || ''}
                onChange={(e) => {
                  pageManager.updateCurrentPageData({
                    note: e.target.value
                  });
                }}
                placeholder="Example: Hero wakes up shocked. Giant robot outside the window. They change fast and run out."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '8px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  resize: 'vertical'
                }}
              />
              
              {/* AI - 1Generate pages */}
              <button
                onClick={() => {
                  if (panels.length === 0) {
                    alert('Choose a panel template first');
                  } else {
                    setStoryModalMode('full');
                    setShowStoryToComicModal(true);
                  }
                }}
                disabled={panels.length === 0}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: panels.length === 0 ? '#999' : COLOR_PALETTE.buttons.export.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: panels.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginTop: '8px',
                  marginBottom: '4px'
                }}
              >
                🤖 Generate full page
              </button>
              
              <div style={{ 
                fontSize: "10px", 
                color: "var(--text-muted)", 
                marginTop: "4px",
                marginBottom: "8px" 
              }}>
                💡 Generate all panels from page notes
              </div>

              {/* Ollama (hidden when using env API mode) */}
              {process.env.REACT_APP_USE_ENV_API_KEY !== 'true' && (
                <button
                  onClick={() => setShowOllamaSettingsModal(true)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginTop: '8px'
                  }}
                >
                  ⚙️ Ollama connection
                </button>
              )}
              
              {/* Usage (env API mode) */}
              {process.env.REACT_APP_USE_ENV_API_KEY === 'true' && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '10px',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>📊 Usage</div>
                  <div id="usage-status">Today: 0/10 | All-time: 0/100</div>
                  <div style={{ marginTop: '4px', fontSize: '9px' }}>
                    💡 Free tier: 10/day, 100 total
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frame settings section */}
          {selectedPanel && (
            <div className="section">
              <h3>📝 Panel {selectedPanel.id}</h3>
              
              <button
                onClick={() => {
                  setStoryModalMode('single');
                  setShowStoryToComicModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: COLOR_PALETTE.buttons.export.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}
              >
                🤖 Generate panel with AI
              </button>
              
              <div style={{ marginBottom: "12px" }}>
                <label style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: "6px"
                }}>
                  ⭐ Importance
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: 'normal', label: 'Normal', color: '#6b7280', emoji: '○' },
                    { value: 'important', label: 'Important', color: '#f59e0b', emoji: '⭐' },
                    { value: 'climax', label: 'Highlight', color: '#ef4444', emoji: '🔥' }
                  ].map(({ value, label, color, emoji }) => (
                    <button
                      key={value}
                      onClick={() => {
                        const updatedPanels = panels.map(p =>
                          p.id === selectedPanel.id
                            ? { ...p, importance: value as 'normal' | 'important' | 'climax' }
                            : p
                        );
                        setPanels(updatedPanels);
                        setSelectedPanel({ ...selectedPanel, importance: value as 'normal' | 'important' | 'climax' });
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        fontSize: "11px",
                        borderRadius: "4px",
                        border: `2px solid ${(selectedPanel.importance || 'normal') === value ? color : 'var(--border-color)'}`,
                        background: (selectedPanel.importance || 'normal') === value ? color : 'var(--bg-primary)',
                        color: (selectedPanel.importance || 'normal') === value ? 'white' : 'var(--text-primary)',
                        cursor: "pointer",
                        fontWeight: (selectedPanel.importance || 'normal') === value ? 'bold' : 'normal'
                      }}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/*  */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: "4px"
                }}>
                  📌 Notes (composition, scene)
                </label>
                <textarea
                  value={selectedPanel.note || ''}
                  onChange={(e) => {
                    const updatedPanels = panels.map(p =>
                      p.id === selectedPanel.id
                        ? { ...p, note: e.target.value }
                        : p
                    );
                    setPanels(updatedPanels);
                    setSelectedPanel({ ...selectedPanel, note: e.target.value });
                  }}
                  placeholder="e.g. Rina shocked, Sayu grinning with a quip"
                  style={{
                    width: '100%',
                    minHeight: '50px',
                    padding: '8px',
                    fontSize: '12px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Character selection + prompt display */}
              <div style={{ marginBottom: "12px" }}>
                <label style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: "4px"
                }}>
                  👤 Character
                </label>
                
                <select
                  value={selectedPanel.selectedCharacterId || ''}
                  onChange={(e) => {
                    const charId = e.target.value;
                    const updatedPanels = panels.map(p =>
                      p.id === selectedPanel.id
                        ? { ...p, selectedCharacterId: charId }
                        : p
                    );
                    setPanels(updatedPanels);
                    setSelectedPanel({ ...selectedPanel, selectedCharacterId: charId });
                    
                    // Automatically get prompts from character settings
                    if (charId && characterSettings[charId]?.appearance?.basePrompt) {
                      const basePrompt = characterSettings[charId].appearance.basePrompt;
                      const updatedPanelsWithPrompt = panels.map(p =>
                        p.id === selectedPanel.id
                          ? { ...p, selectedCharacterId: charId, characterPrompt: basePrompt }
                          : p
                      );
                      setPanels(updatedPanelsWithPrompt);
                      setSelectedPanel({ 
                        ...selectedPanel, 
                        selectedCharacterId: charId,
                        characterPrompt: basePrompt 
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '12px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}
                >
                  <option value="">(none)</option>
                  {Object.entries(characterNames).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>

                {/* Character prompt display (read-only) */}
                {selectedPanel.characterPrompt && (
                  <div style={{
                    padding: '8px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    background: isDarkMode ? '#1a1a1a' : '#f8f8f8',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    maxHeight: '60px',
                    overflowY: 'auto',
                    lineHeight: '1.4'
                  }}>
                    {selectedPanel.characterPrompt}
            </div>
                )}
                
            <div style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  padding: "4px 8px",
                  background: "var(--bg-secondary)",
                  borderRadius: "4px",
                  marginTop: "4px"
                }}>
                  💡 Register in the left sidebar → pick here to autofill
                </div>
              </div>

              <div>
                <label style={{
              fontSize: "11px", 
                  fontWeight: "bold",
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: "4px"
                }}>
                  🎬 Action / situation
                </label>
                
                <div style={{ marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. turns around with a shocked face"
                    id={`action-input-${selectedPanel.id}`}
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '12px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      marginBottom: '6px'
                    }}
                  />
                  <button
                    onClick={async () => {
                      const input = document.getElementById(`action-input-${selectedPanel.id}`) as HTMLInputElement;
                      const description = input?.value?.trim();
                      
                      if (!description) {
                        alert('Describe the action or situation');
                        return;
                      }

                      try {
                        setIsGeneratingFromStory(true);
                        
                        const actionPrompt: { prompt: string; promptJa: string } = await ollamaService.generateActionPrompt(description);
                        
                        if (actionPrompt) {
                          const updatedPanels = panels.map(p =>
                            p.id === selectedPanel.id
                              ? { ...p, actionPrompt: actionPrompt.prompt, actionPromptJa: description }
                              : p
                          );
                          setPanels(updatedPanels);
                          setSelectedPanel({ 
                            ...selectedPanel, 
                            actionPrompt: actionPrompt.prompt,
                            actionPromptJa: description
                          });
                          
                          // Clear input field
                          if (input) input.value = '';
                        }
                      } catch (error) {
                        console.error('Action prompt generation error:', error);
                        alert('Action prompt failed: ' + (error as Error).message);
                      } finally {
                        setIsGeneratingFromStory(false);
                      }
                    }}
                    disabled={isGeneratingFromStory}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: isGeneratingFromStory ? '#999' : COLOR_PALETTE.buttons.export.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isGeneratingFromStory ? 'not-allowed' : 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  >
                    {isGeneratingFromStory ? '🤖 ...' : '🎬 Prompt generation'}
                  </button>
                </div>

                <textarea
                  value={selectedPanel.actionPrompt || ''}
                  onChange={(e) => {
                    const updatedPanels = panels.map(p =>
                      p.id === selectedPanel.id
                        ? { ...p, actionPrompt: e.target.value }
                        : p
                    );
                    setPanels(updatedPanels);
                    setSelectedPanel({ ...selectedPanel, actionPrompt: e.target.value });
                  }}
                  placeholder="Action, expression, layout (Ollama / Llama or type manually)"
                  style={{
                    width: '100%',
                    minHeight: '60px',
                    padding: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />

                <button
                  type="button"
                  onClick={async () => {
                    const parts = [
                      selectedPanel.characterPrompt,
                      selectedPanel.actionPrompt,
                    ].filter(Boolean) as string[];
                    if (parts.length === 0) {
                      alert('Enter a character prompt and/or English action prompt first.');
                      return;
                    }
                    const imagePrompt = `${parts.join(', ')}, anime manga illustration, clean composition`;
                    try {
                      setIsGeneratingFluxImage(true);
                      const blob = await ollamaService.generatePanelImageBlob(imagePrompt);
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank', 'noopener,noreferrer');
                    } catch (err) {
                      console.error(err);
                      alert(
                        'Flux image failed: ' +
                          (err instanceof Error ? err.message : String(err)) +
                          '\nCheck your Ollama image model name and pull.'
                      );
                    } finally {
                      setIsGeneratingFluxImage(false);
                    }
                  }}
                  disabled={isGeneratingFluxImage}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '8px',
                    background: isGeneratingFluxImage ? '#999' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isGeneratingFluxImage ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  {isGeneratingFluxImage ? '🖼️ Generating…' : '🖼️ Flux (Ollama) preview image'}
                </button>
                
                {(selectedPanel as any).actionPromptJa && (
                  <div style={{
                    fontSize: "11px",
                    color: isDarkMode ? "#fbbf24" : "#d97706",
                    padding: "6px 8px",
                    background: isDarkMode ? "#2d2520" : "#fef3c7",
                    border: `1px solid ${isDarkMode ? "#92400e" : "#fbbf24"}`,
                    borderRadius: "4px",
                    marginTop: "6px",
                    lineHeight: "1.5"
                  }}>
                    💬 Notes: {(selectedPanel as any).actionPromptJa}
                  </div>
                )}
                
                <div style={{
                  fontSize: "10px",
              color: "var(--text-muted)",
              padding: "4px 8px",
              background: "var(--bg-secondary)",
              borderRadius: "4px",
                  marginTop: "4px"
            }}>
                  💡 Final image prompt = character + action combined
            </div>
          </div>

              {isPanelEditMode && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                  <h4 style={{ fontSize: "12px", marginBottom: "8px", color: "var(--text-primary)" }}>
                    🔧 Panel editing
                  </h4>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleClearAll}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: COLOR_PALETTE.buttons.delete.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}
                  >
                    🧹 Clear all
                  </button>
                  <div style={{ 
                    fontSize: "10px", 
                    color: "var(--text-muted)",
                    padding: "8px",
                    background: "var(--bg-secondary)",
                    borderRadius: "4px",
                    lineHeight: "1.4",
                  }}>
                    <strong>How to:</strong><br/>
                    • 🔵 Move: drag the center handle<br/>
                    • 🟧 Resize: corner handles<br/>
                    • ✂️ Split: split icon<br/>
                    • 🗑️ Delete: trash icon
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="section">
            <h3>💬 Dialogue & bubbles</h3>
            <div className="bubble-types">
              {[
                { id: 'normal', icon: '💬', name: 'Normal' },
                { id: 'shout', icon: '❗', name: 'Shout' },
                { id: 'whisper', icon: '💭', name: 'Whisper' },
                { id: 'thought', icon: '☁️', name: 'Thought' }
              ].map(bubble => (
                <div 
                  key={bubble.id}
                  className="bubble-btn"
                  onClick={() => handleBubbleClick(bubble.id)}
                >
                  {bubble.icon} {bubble.name}
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>🔧 Edit</h3>
            <button 
              className={`control-btn ${isPanelEditMode ? 'active' : ''}`}
              onClick={() => setIsPanelEditMode(!isPanelEditMode)}
              style={{
                width: "100%",
                padding: "10px",
                background: isPanelEditMode ? COLOR_PALETTE.buttons.edit.primary : "var(--bg-secondary)",
                color: isPanelEditMode ? "white" : "var(--text-primary)",
                border: `1px solid ${isPanelEditMode ? COLOR_PALETTE.buttons.edit.primary : "var(--border-color)"}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold"
              }}
            >
              {isPanelEditMode ? "✅ Edit mode on" : "🔧 Panel edit mode"}
            </button>
            <div style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              padding: "8px",
              background: "var(--bg-tertiary)",
              borderRadius: "4px",
              marginTop: "8px",
              lineHeight: "1.4"
            }}>
              💡 Click a panel, then use handles to move, resize, or split
            </div>
          </div>

          <div className="section">
            <h3>🎨 Decor</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button 
                className="control-btn"
                onClick={() => setShowBackgroundPanel(true)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: backgroundTemplateCount > 0 ? COLOR_PALETTE.buttons.export.primary : "var(--bg-secondary)",
                  color: backgroundTemplateCount > 0 ? "white" : "var(--text-primary)",
                  border: `1px solid ${backgroundTemplateCount > 0 ? COLOR_PALETTE.buttons.export.primary : "var(--border-color)"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                🎨 Background
                {backgroundTemplateCount > 0 && <span style={{ marginLeft: "4px" }}>({backgroundTemplateCount})</span>}
              </button>

              <button 
                className="control-btn"
                onClick={() => setShowEffectPanel(true)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: effectTemplateCount > 0 ? COLOR_PALETTE.primary.red : "var(--bg-secondary)",
                  color: effectTemplateCount > 0 ? "white" : "var(--text-primary)",
                  border: `1px solid ${effectTemplateCount > 0 ? COLOR_PALETTE.primary.red : "var(--border-color)"}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                ⚡ Effects
                {effectTemplateCount > 0 && <span style={{ marginLeft: "4px" }}>({effectTemplateCount})</span>}
              </button>
          </div>
        </div>

          {panels.length > 1 && (
          <div className="section">
              <h3>🔄 Panels</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => {
                    setIsSwapMode(!isSwapMode);
                    if (isSwapMode) {
                      setSwapPanel1(null);
                      setSwapPanel2(null);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: isSwapMode ? COLOR_PALETTE.buttons.delete.primary : COLOR_PALETTE.buttons.save.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold"
                  }}
                >
                  {isSwapMode ? "❌ Exit swap mode" : "🔄 Swap panel content"}
                </button>

                {isSwapMode && (
                  <>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{
                        flex: 1,
                        padding: "8px",
                        background: swapPanel1 ? COLOR_PALETTE.buttons.success.primary : "#f3f4f6",
                        color: swapPanel1 ? "white" : "#374151",
                        border: `2px solid ${swapPanel1 ? COLOR_PALETTE.buttons.success.primary : "#d1d5db"}`,
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        1️⃣ {swapPanel1 ? `Panel ${swapPanel1}` : "None"}
                      </div>
                      <div style={{
                        flex: 1,
                        padding: "8px",
                        background: swapPanel2 ? COLOR_PALETTE.buttons.success.primary : "#f3f4f6",
                        color: swapPanel2 ? "white" : "#374151",
                        border: `2px solid ${swapPanel2 ? COLOR_PALETTE.buttons.success.primary : "#d1d5db"}`,
                        borderRadius: "6px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        2️⃣ {swapPanel2 ? `Panel ${swapPanel2}` : "None"}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (swapPanel1 && swapPanel2 && swapPanel1 !== swapPanel2) {
                          handlePanelSwap(swapPanel1, swapPanel2);
                          setSwapPanel1(null);
                          setSwapPanel2(null);
                          setIsSwapMode(false);
                        } else {
                          alert('Pick two different panels');
                        }
                      }}
                      disabled={!swapPanel1 || !swapPanel2 || swapPanel1 === swapPanel2}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: (!swapPanel1 || !swapPanel2 || swapPanel1 === swapPanel2) ? "#999" : COLOR_PALETTE.buttons.success.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: (!swapPanel1 || !swapPanel2 || swapPanel1 === swapPanel2) ? "not-allowed" : "pointer",
                        fontSize: "13px",
                        fontWeight: "bold"
                      }}
                    >
                      🔄 Swap content
                    </button>
                  </>
                )}
              </div>
              {isSwapMode && (
                <div style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  padding: "8px",
                  background: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: "4px",
                  marginTop: "8px"
                }}>
                  💡 Click two panels, then Swap — only notes, prompts, and character swap<br/>
                  Positions and sizes stay the same
                </div>
              )}
            </div>
          )}

          {/* Output moved to top bar */}
        </div>
        )}
      </div>

      {/* Modal panels */}
      {showCharacterPanel && selectedCharacter && (
        <CharacterDetailPanel
          selectedCharacter={selectedCharacter}
          onCharacterUpdate={handleCharacterUpdate}
          onCharacterDelete={handleCharacterDelete}
          onClose={handleCharacterPanelClose}
          characterNames={characterNames}
        />
      )}

      <BackgroundPanel
        isOpen={showBackgroundPanel}
        onClose={() => setShowBackgroundPanel(false)}
        backgrounds={backgrounds}
        setBackgrounds={setBackgrounds}
        selectedPanel={selectedPanel}
        onBackgroundAdd={handleBackgroundAdd}
      />

      <EffectPanel
        isOpen={showEffectPanel}
        onClose={() => setShowEffectPanel(false)}
        onAddEffect={handleEffectAdd}
        selectedEffect={selectedEffect}
        onUpdateEffect={handleEffectUpdate}
        isDarkMode={isDarkMode}
        selectedPanel={selectedPanel}
        effects={effects}
      />

      {showExportPanel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowExportPanel(false)}>
          <div style={{
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>📤 Prompt export</h3>
              <button
                onClick={() => setShowExportPanel(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                ×
              </button>
            </div>
            <ExportPanel
              panels={panels}
              characters={characters}
              bubbles={speechBubbles}
              backgrounds={backgrounds}
              effects={effects}
              tones={tones}
              canvasRef={canvasRef}
              characterSettings={characterSettings}
              characterNames={characterNames}
              currentPageIndex={pageManager.currentPageIndex}
              pages={pageManager.pages}
              paperSize={canvasSettings.paperSize}
            />
          </div>
        </div>
      )}

      <PaperSizeSelectPanel
        currentSettings={canvasSettings}
        onSettingsChange={(newSettings: CanvasSettings) => {
          setCanvasSettings(newSettings);
        }}
        isVisible={isPaperSizePanelVisible}
        onToggle={() => setIsPaperSizePanelVisible(!isPaperSizePanelVisible)}
        isDarkMode={isDarkMode}
      />

      {/* Tone function disabled */}

      <CharacterSettingsPanel
        isOpen={showCharacterSettingsPanel}
        onClose={() => setShowCharacterSettingsPanel(false)}
        characterType={editingCharacterType}
        currentName={characterNames[editingCharacterType]}
        currentSettings={characterSettings[editingCharacterType]}
        onCharacterUpdate={handleCharacterSettingsUpdate}
        isDarkMode={isDarkMode}
      />

      <SnapSettingsPanel
        isOpen={showSnapSettingsPanel}
        onClose={() => setShowSnapSettingsPanel(false)}
        snapSettings={snapSettings}
        onSnapSettingsUpdate={handleSnapSettingsUpdate}
        isDarkMode={isDarkMode}
      />

      {/* Ollama Cooperation modal */}
      <StoryToComicModal
        isOpen={showStoryToComicModal}
        onClose={() => setShowStoryToComicModal(false)}
        panelCount={panels.length}
        onGeneratePreview={handleGeneratePreview}
        onGenerateSinglePanel={handleGenerateSinglePanel}
        onApply={handleApplyPreview}
        onApplySinglePanel={handleApplySinglePanel}
        isDarkMode={isDarkMode}
        characterNames={characterNames}
        selectedPanelId={selectedPanel?.id}
        initialStory={storyModalMode === 'full' ? (pageManager.currentPage.note || '') : ''}
        initialMode={storyModalMode}
      />

      <OllamaSettingsModal
        isOpen={showOllamaSettingsModal}
        onClose={() => setShowOllamaSettingsModal(false)}
        isDarkMode={isDarkMode}
      />

      <CharacterPromptRegisterModal
        isOpen={showCharacterPromptRegister}
        onClose={() => setShowCharacterPromptRegister(false)}
        characterId={registeringCharacterId}
        characterName={characterNames[registeringCharacterId] || `Character ${registeringCharacterId.replace('character_', '')}`}
        currentPrompt={characterSettings[registeringCharacterId]?.appearance?.basePrompt || selectedPanel?.characterPrompt || ''}
        onSave={handleSaveCharacterPrompt}
        isDarkMode={isDarkMode}
      />

      <ProjectPanel
        isOpen={showProjectPanel}
        onClose={() => setShowProjectPanel(false)}
        onLoadProject={(projectId) => {
          console.log('📂 App.tsx: load project start - projectId:', projectId);
          
          const project = projectSave.loadProject(projectId);
          console.log('📊 loadProject result:', project ? 'has data' : 'empty');
          
          if (project) {
            setPanels(project.panels || []);
            setCharacters(project.characters || []);
            setSpeechBubbles(project.bubbles || []);
            setBackgrounds(project.backgrounds || []);
            setEffects(project.effects || []);
            setTones(project.tones || []);
            
            if (project.characterNames) {
              setCharacterNames(project.characterNames);
            }
            if (project.characterSettings) {
              setCharacterSettings(project.characterSettings);
            }
            
            if (project.settings) {
              setSnapSettings(prev => ({
                ...prev,
                enabled: project.settings.snapEnabled,
                gridSize: project.settings.snapSize
              }));
              setIsDarkMode(project.settings.darkMode);
              document.documentElement.setAttribute("data-theme", project.settings.darkMode ? "dark" : "light");
            }
            
            console.log('✅ Project load complete');
          } else {
            console.error('❌ Could not load project data');
          }
        }}
        onNewProject={() => {
          projectSave.newProject();
          setPanels([]);
          setCharacters([]);
          setSpeechBubbles([]);
          setBackgrounds([]);
          setEffects([]);
          // Tone feature disabled
          
          setCharacterNames({
            character_1: 'Hero',
            character_2: 'Heroine',
            character_3: 'Rival',
            character_4: 'Friend'
          });
          setCharacterSettings({
            character_1: { appearance: null, role: 'Hero' },
            character_2: { appearance: null, role: 'Heroine' },
            character_3: { appearance: null, role: 'Rival' },
            character_4: { appearance: null, role: 'Friend' }
          });
          
          setSelectedCharacter(null);
          setSelectedPanel(null);
          setSelectedEffect(null);
          // Tone feature disabled
        }}
        currentProjectId={projectSave.currentProjectId}
        saveStatus={projectSave.saveStatus}
        onSaveProject={async (name?: string) => {
          const projectData = {
            panels,
            characters,
            bubbles: speechBubbles,
            backgrounds,
            effects,
            tones,
            canvasSize,
            settings,
            characterNames,
            characterSettings,
            canvasSettings
          };
          
          const success = await projectSave.saveProject(projectData, name);
          return success ? 'saved' : null;
        }}
        isDarkMode={isDarkMode}
      />

      <PanelTemplateSelector
        onTemplateSelect={(templateId) => {
          if (templateId && templates[templateId]) {
            handleTemplateClick(templateId);
          }
          setShowPanelSelector(false);
        }}
        onClose={() => setShowPanelSelector(false)}
        isDarkMode={isDarkMode}
        isVisible={showPanelSelector}
      />

      {/* 🧪 Beta feedback panel */}
      <SimpleFeedbackPanel
        isVisible={showFeedbackPanel}
        onClose={() => setShowFeedbackPanel(false)}
        onDarkMode={isDarkMode}
      />

      {/* 📖 help modal */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;