// src/components/UI/ExportPanel.tsx - 
import React, { useState } from 'react';
import { ExportService, ExportOptions, ExportProgress } from '../../services/ExportService';
import { promptService } from '../../services/PromptService';
import { nanoBananaExportService } from '../../services/NanoBananaExportService';
import { 
  Panel, 
  Character, 
  SpeechBubble, 
  BackgroundElement, 
  EffectElement, 
  ToneElement,
  NanoBananaExportOptions,
  NanoBananaExportProgress,
  DEFAULT_NANOBANANA_EXPORT_OPTIONS,
  PaperSize,
  PAPER_SIZES
} from '../../types';
import { BetaUtils } from '../../config/betaConfig';

type ExportPurpose = 'print' | 'image' | 'clipstudio' | 'prompt' | 'nanobanana';

const purposeDefaults: Record<ExportPurpose, Partial<ExportOptions>> = {
  print: {
    format: 'pdf',
    quality: 'high',
    resolution: 300,
    includeBackground: true,
    separatePages: false
  },
  image: {
    format: 'png',
    quality: 'medium',
    resolution: 150,
    includeBackground: true,
    separatePages: false
  },
  clipstudio: {
    format: 'psd',
    quality: 'high',
    resolution: 300,
    includeBackground: false,
    separatePages: false
  },
  prompt: {
    format: 'txt' as any,
    quality: 'high',
    resolution: 512,
    includeBackground: false,
    separatePages: true
  },
  nanobanana: {
    format: 'zip' as any,
    quality: 'high',
    resolution: 300,
    includeBackground: true,
    separatePages: false
  }
};

interface ExportPanelProps {
  panels: Panel[];
  characters: Character[];
  bubbles: SpeechBubble[];
  backgrounds: BackgroundElement[];
  effects: EffectElement[];
  tones: ToneElement[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  characterSettings?: Record<string, any>;
  characterNames?: Record<string, string>;
  paperSize?: PaperSize;
  currentPageIndex?: number;
  pages?: any[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  panels,
  characters,
  bubbles,
  backgrounds,
  effects,
  tones,
  canvasRef,
  characterSettings,
  characterNames,
  paperSize,
  currentPageIndex,
  pages
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<ExportPurpose | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [promptOutput, setPromptOutput] = useState<string>('');
  const [debugOutput, setDebugOutput] = useState<string>('');
  const [exportCurrentPageOnly, setExportCurrentPageOnly] = useState<boolean>(false);
  
  // 🆕 NanoBananastate
  const [nanoBananaOptions, setNanoBananaOptions] = useState<NanoBananaExportOptions>(DEFAULT_NANOBANANA_EXPORT_OPTIONS);
  const [nanoBananaProgress, setNanoBananaProgress] = useState<NanoBananaExportProgress | null>(null);
  const [isNanoBananaExporting, setIsNanoBananaExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    quality: 'high',
    resolution: 300,
    includeBackground: true,
    separatePages: false
  });

  const exportService = ExportService.getInstance();
  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

  // 🍌 NanoBanana
  const handleNanoBananaExport = async () => {
    if (!canvasRef.current || panels.length === 0) {
      alert('No content to export');
      return;
    }

    const currentPaperSize = paperSize || PAPER_SIZES.A4_PORTRAIT;

    setIsNanoBananaExporting(true);
    setNanoBananaProgress({ 
      step: 'initialize', 
      progress: 0, 
      message: 'NanoBananaStarting export...' 
    });

    try {
      const result = await nanoBananaExportService.exportForNanoBanana(
        panels,
        characters,
        bubbles,
        currentPaperSize,
        characterSettings,
        characterNames,
        nanoBananaOptions,
        setNanoBananaProgress
      );

      if (result.success && result.zipBlob) {
        // 
        const url = URL.createObjectURL(result.zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 
        alert(`NanoBananaExport completed\n\n: ${result.filename}\n: ${(result.size / 1024).toFixed(1)} KB\n\nZIPGoogle AI Studio`);
      } else {
        throw new Error(result.error || '');
      }
    } catch (error) {
      console.error('NanoBanana export error:', error);
      alert('NanoBanana: ' + (error as Error).message);
    } finally {
      setIsNanoBananaExporting(false);
      setTimeout(() => {
        setNanoBananaProgress(null);
        setSelectedPurpose(null);
      }, 2000);
    }
  };

  const handlePurposeClick = (purpose: ExportPurpose) => {
    // Otherwise, open the settings screen
    if (selectedPurpose === purpose) {
      setSelectedPurpose(null);
      setPromptOutput('');
      setDebugOutput('');
      setNanoBananaProgress(null); // 🆕 
    } else {
      setSelectedPurpose(purpose);
      setPromptOutput('');
      setDebugOutput('');
      setNanoBananaProgress(null); // 🆕 
      
      if (purpose === 'nanobanana') {
        // NanoBanana
        setNanoBananaOptions(DEFAULT_NANOBANANA_EXPORT_OPTIONS);
      } else if (purpose === 'prompt') {
        handlePromptExport();
      } else {
        setExportOptions({
          ...exportOptions,
          ...purposeDefaults[purpose]
        });
      }
    }
  };

  const handleExport = async () => {
    if (!canvasRef.current || !selectedPurpose) {
      alert('');
      return;
    }

    const errors = exportService.validateExportOptions(exportOptions);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setIsExporting(true);
    setExportProgress({ step: 'initialize', progress: 0, message: '...' });

    try {
      switch (exportOptions.format) {
        case 'pdf':
          await exportService.exportToPDF(canvasRef.current, panels, exportOptions, setExportProgress);
          break;
        case 'png':
          await exportService.exportToPNG(canvasRef.current, panels, exportOptions, setExportProgress);
          break;
        case 'psd':
          await exportService.exportToPSD(canvasRef.current, panels, characters, bubbles, backgrounds, effects, tones, exportOptions, setExportProgress);
          break;
      }
    } catch (error) {
      console.error(':', error);
      alert(': ' + (error as Error).message);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
      setSelectedPurpose(null);
    }
  };

  /**
   * 🔧 : Function to assign a character to the nearest panel (supports detailed debugging)
   */
  const assignCharacterToNearestPanel = (char: Character, allPanels: Panel[]): { panel: Panel | null; debug: string } => {
    if (allPanels.length === 0) {
      return { panel: null, debug: '' };
    }
    
    // Calculate Character Center Coordinates
    const charCenterX = char.x + (char.width || 50) / 2;
    const charCenterY = char.y + (char.height || 50) / 2;
    
    let nearestPanel = allPanels[0];
    let minDistance = Number.MAX_VALUE;
    let debugInfo = `🎭  "${char.name}" (ID: ${char.id})\n`;
    debugInfo += `📍 : (${char.x}, ${char.y}) : (${char.width || 50} x ${char.height || 50})\n`;
    debugInfo += `🎯 : (${charCenterX}, ${charCenterY})\n\n`;
    
    // 🔧 Calculate and record the distance from each panel
    const distanceCalculations: Array<{
      panel: Panel;
      distance: number;
      centerX: number;
      centerY: number;
      isInside: boolean;
    }> = [];
    
    allPanels.forEach(panel => {
      const panelCenterX = panel.x + panel.width / 2;
      const panelCenterY = panel.y + panel.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(charCenterX - panelCenterX, 2) + 
        Math.pow(charCenterY - panelCenterY, 2)
      );
      
      // 🆕 
      const isInside = charCenterX >= panel.x && 
                      charCenterX <= panel.x + panel.width &&
                      charCenterY >= panel.y && 
                      charCenterY <= panel.y + panel.height;
      
      distanceCalculations.push({
        panel,
        distance,
        centerX: panelCenterX,
        centerY: panelCenterY,
        isInside
      });
      
      debugInfo += `📐 Panel ${panel.id}:\n`;
      debugInfo += `   : (${panel.x}, ${panel.y}) : (${panel.width} x ${panel.height})\n`;
      debugInfo += `   : (${panelCenterX}, ${panelCenterY})\n`;
      debugInfo += `   : ${distance.toFixed(2)}px\n`;
      debugInfo += `   : ${isInside ? 'YES ✅' : 'NO ❌'}\n\n`;
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestPanel = panel;
      }
    });
    
    // 🆕 Sort by distance to see ranking
    distanceCalculations.sort((a, b) => a.distance - b.distance);
    debugInfo += '🏆 :\n';
    distanceCalculations.forEach((calc, index) => {
      const marker = index === 0 ? '👑 1' : `${index + 1}`;
      const insideFlag = calc.isInside ? ' 📍' : '';
      debugInfo += `${marker}: Panel ${calc.panel.id} (${calc.distance.toFixed(2)}px)${insideFlag}\n`;
    });
    
    // 🆕 
    const finalChoice = distanceCalculations[0];
    debugInfo += `\n✅ : Panel ${finalChoice.panel.id}\n`;
    debugInfo += `   : ${finalChoice.isInside ? 'Character exists in panel' : ''}\n`;
    debugInfo += `   : ${finalChoice.distance.toFixed(2)}px\n`;
    
    return { panel: nearestPanel, debug: debugInfo };
  };

  /**
   * 🆕 All Character Placement Determination Debug Function (Final Version)
   */
  const generatePanelAssignmentDebug = (): string => {
    let debugText = "=== Character Placement Determination Debug (v1.1.1 ===\n\n";
    
    debugText += `📊 :\n`;
    debugText += `- : ${panels.length}\n`;
    debugText += `- : ${characters.length}\n`;
    debugText += `- : ${new Date().toLocaleString()}\n\n`;
    
    // 
    debugText += `📐 :\n`;
    panels.forEach(panel => {
      const centerX = panel.x + panel.width / 2;
      const centerY = panel.y + panel.height / 2;
      const area = panel.width * panel.height;
      debugText += `Panel ${panel.id}:\n`;
      debugText += `  📍 : (${panel.x}, ${panel.y})\n`;
      debugText += `  📏 : ${panel.width} x ${panel.height} (: ${area})\n`;
      debugText += `  🎯 : (${centerX}, ${centerY})\n`;
      debugText += `  📦 : X[${panel.x} - ${panel.x + panel.width}], Y[${panel.y} - ${panel.y + panel.height}]\n\n`;
    });
    
    // 
    debugText += `👥 :\n`;
    const characterAssignments = new Map<number, Character[]>();
    
    // 
    panels.forEach(panel => {
      characterAssignments.set(panel.id, []);
    });
    
    // 
    characters.forEach((char, index) => {
      debugText += `\n${'='.repeat(50)}\n`;
      debugText += `Character ${index + 1}: ${char.name}\n`;
      debugText += `${'='.repeat(50)}\n`;
      
      const { panel, debug } = assignCharacterToNearestPanel(char, panels);
      debugText += debug + '\n';
      
      if (panel) {
        const panelChars = characterAssignments.get(panel.id) || [];
        panelChars.push(char);
        characterAssignments.set(panel.id, panelChars);
      }
    });
    
    // 
    debugText += `\n${'='.repeat(60)}\n`;
    debugText += `📋 \n`;
    debugText += `${'='.repeat(60)}\n`;
    
    let totalAssigned = 0;
    panels.forEach(panel => {
      const assignedChars = characterAssignments.get(panel.id) || [];
      totalAssigned += assignedChars.length;
      
      debugText += `Panel ${panel.id}: ${assignedChars.length}`;
      if (assignedChars.length > 0) {
        const names = assignedChars.map(c => `"${c.name}"`).join(', ');
        debugText += ` → ${names}`;
      } else {
        debugText += ` → ()`;
      }
      debugText += '\n';
    });
    
    debugText += `\n📈 :\n`;
    debugText += `- : ${characters.length}\n`;
    debugText += `- : ${totalAssigned}\n`;
    debugText += `- : ${characters.length - totalAssigned}\n`;
    
    if (totalAssigned === characters.length) {
      debugText += `✅ All characters have been placed\n`;
    } else {
      debugText += `⚠️ Some characters are not placed\n`;
    }
    
    debugText += `\n${'='.repeat(60)}\n`;
    debugText += ` - ${new Date().toISOString()}\n`;
    debugText += `${'='.repeat(60)}\n`;
    
    return debugText;
  };

  const handlePromptExport = async () => {
    setIsExporting(true);
    setExportProgress({ step: 'initialize', progress: 10, message: '...' });

    try {
      // 🔧 : Assign each character to the nearest panel based on coordinates
      const characterAssignments = new Map<number, Character[]>();
      
      // 
      panels.forEach(panel => {
        characterAssignments.set(panel.id, []);
      });
      
      // 🔧 : Determine each character at current coordinates
      characters.forEach(char => {
        console.log(`🔍 :`, {
          id: char.id,
          name: char.name,
          x: char.x,
          y: char.y,
          panelId: char.panelId,
          isGlobalPosition: char.isGlobalPosition
        });
        
        const { panel, debug } = assignCharacterToNearestPanel(char, panels);
        console.log(`🔍 :`, debug);
        
        if (panel) {
          const panelChars = characterAssignments.get(panel.id) || [];
          panelChars.push(char);
          characterAssignments.set(panel.id, panelChars);
          
          // 🆕 
          console.log(`📍  "${char.name}"  Panel ${panel.id}  (: ${char.x}, ${char.y})`);
        } else {
          console.log(`❌  "${char.name}" `);
        }
      });

      setExportProgress({ step: 'processing', progress: 30, message: '...' });

      // Filter if output is current page only
      let filteredPanels = panels;
      let filteredCharacters = characters;
      let filteredBubbles = bubbles;
      let filteredBackgrounds = backgrounds;
      let filteredEffects = effects;
      
      if (exportCurrentPageOnly && typeof currentPageIndex === 'number' && pages) {
        const currentPage = pages[currentPageIndex];
        if (currentPage) {
          filteredPanels = currentPage.panels || [];
          const panelIds = new Set(filteredPanels.map((p: Panel) => p.id));
          filteredCharacters = (currentPage.characters || []).filter((c: Character) => panelIds.has(c.panelId));
          filteredBubbles = (currentPage.speechBubbles || []).filter((b: SpeechBubble) => panelIds.has(b.panelId));
          filteredBackgrounds = (currentPage.backgrounds || []).filter((bg: BackgroundElement) => panelIds.has(bg.panelId));
          filteredEffects = (currentPage.effects || []).filter((e: EffectElement) => panelIds.has(e.panelId));
        }
      }

      // 🔧 : characterAssignmentsBuild your project data with
      const project = {
        panels: filteredPanels,
        characters: filteredCharacters,
        speechBubbles: filteredBubbles,
        backgrounds: filteredBackgrounds,
        effects: filteredEffects,
        characterSettings,
        characterNames
      };

      setExportProgress({ step: 'processing', progress: 50, message: 'Generating unselected value exclusion prompt...' });

      // 🔧 : PromptServicecharacterAssignments
      const promptData = promptService.generatePrompts(project, characterAssignments);
      
      setExportProgress({ step: 'processing', progress: 70, message: '...' });

      // 
      let output = '';
      
      if (exportCurrentPageOnly && typeof currentPageIndex === 'number' && pages) {
        // 
        const currentPage = pages[currentPageIndex];
        if (currentPage) {
          const pageInfo = {
            pageIndex: currentPageIndex,
            pageTitle: currentPage.title || `Page ${currentPageIndex + 1}`
          };
          output = promptService.formatPromptOutput(promptData, filteredPanels, pageInfo, characterSettings);
        }
      } else {
        // panels
        output = "=== AI ===\n\n";
        
        filteredPanels.forEach((panel: Panel, panelIdx: number) => {
            const sceneData = promptData.scenes[panelIdx];
            if (!sceneData) return;
            
            output += `Panel ${panelIdx + 1}\n`;
            
            // : 
            console.log(`Panel ${panelIdx + 1} :`, {
              note: panel.note,
              characterPrompt: panel.characterPrompt,
              actionPrompt: panel.actionPrompt,
              selectedCharacterId: panel.selectedCharacterId,
              prompt: panel.prompt,
              // 
              characterSettings: panel.selectedCharacterId ? characterSettings?.[panel.selectedCharacterId] : null
            });
            
            // Panel
            if (panel.note) {
              output += `📌 : ${panel.note}\n`;
            }
            
            // 🆕 : 
            const parts: string[] = [];
            
            // panel.characterPrompt or characterSettings
            let charPrompt = panel.characterPrompt;
            if (!charPrompt && panel.selectedCharacterId && characterSettings?.[panel.selectedCharacterId]?.appearance?.basePrompt) {
              charPrompt = characterSettings[panel.selectedCharacterId].appearance.basePrompt;
            }
            
            if (charPrompt) {
              parts.push(charPrompt.trim());
            }
            
            if (panel.actionPrompt) {
              parts.push(panel.actionPrompt.trim());
            }
            
            if (parts.length > 0) {
              const combinedPrompt = parts.join(', ');
              output += `: ${combinedPrompt}\n`;
            } else if (panel.prompt) {
              // : 
              output += `: ${panel.prompt}\n`;
            }
            
            output += '\n';
          });
        
        // Negative Prompt
        const negativePrompt = [
          'lowres', 'bad anatomy', 'bad hands', 'text', 'error',
          'worst quality', 'low quality', 'blurry', 'bad face',
          'extra fingers', 'watermark', 'signature',
          'deformed', 'mutated', 'disfigured', 'bad proportions'
        ].join(', ');
        output += `\nNegative Prompt\n${negativePrompt}\n`;
      }

      // Integrate additional background, effect line, and tone information
      output += await generateAdditionalPrompts(characterAssignments);

      setExportProgress({ step: 'finalizing', progress: 90, message: '...' });

      setPromptOutput(output);
      setExportProgress({ step: 'complete', progress: 100, message: '' });

    } catch (error) {
      console.error(':', error);
      alert('Prompt generation failed: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(null), 1000);
    }
  };

  const generateAdditionalPrompts = async (characterAssignments: Map<number, Character[]>): Promise<string> => {
    let additionalOutput = "";

    panels.forEach(panel => {
      const panelBackgrounds = backgrounds.filter(bg => bg.panelId === panel.id);
      const panelEffects = effects.filter(effect => effect.panelId === panel.id);
      const panelTones = tones.filter(tone => tone.panelId === panel.id);
      const panelChars = characterAssignments.get(panel.id) || [];

      if (panelBackgrounds.length > 0 && panelChars.length === 0) {
        additionalOutput += `━━━ Panel ${panel.id} - Background Only ━━━\n`;
        additionalOutput += `Positive Prompt\n`;
        additionalOutput += generateBackgroundPrompt(panelBackgrounds);
        additionalOutput += `\n\n\n`;
        additionalOutput += generateBackgroundJapaneseDescription(panelBackgrounds);
        additionalOutput += `\n\n───────────────────────────────\n\n`;
      }

      if (panelEffects.length > 0) {
        additionalOutput += `━━━ Panel ${panel.id} - Effects ━━━\n`;
        additionalOutput += `Positive Prompt\n`;
        additionalOutput += generateEffectsPrompt(panelEffects);
        additionalOutput += `\n\n\n`;
        additionalOutput += generateEffectsJapaneseDescription(panelEffects);
        additionalOutput += `\n\n───────────────────────────────\n\n`;
      }

      if (panelTones.length > 0) {
        additionalOutput += `━━━ Panel ${panel.id} - Tones ━━━\n`;
        additionalOutput += `Positive Prompt\n`;
        additionalOutput += generateTonesPrompt(panelTones);
        additionalOutput += `\n\n───────────────────────────────\n\n`;
      }
    });

    return additionalOutput;
  };

  const generateBackgroundPrompt = (backgrounds: BackgroundElement[]): string => {
    if (backgrounds.length === 0) return "";

    const bg = backgrounds[0];
    const parts = [
      "masterpiece, best quality",
      "detailed background",
      bg.type === 'solid' ? "simple background" : "detailed environment",
      "no humans",
      "anime style"
    ];

    switch (bg.type) {
      case 'gradient':
        parts.splice(2, 1, "gradient background", "soft lighting");
        break;
      case 'pattern':
        parts.splice(2, 1, "patterned background", "textured surface");
        break;
      case 'image':
        parts.splice(2, 1, "realistic background", "photographic style");
        break;
    }

    return parts.join(", ");
  };

  const generateBackgroundJapaneseDescription = (backgrounds: BackgroundElement[]): string => {
    if (backgrounds.length === 0) return "";

    const bg = backgrounds[0];
    const typeDescriptions = {
      'solid': '',
      'gradient': '',
      'pattern': '',
      'image': ''
    };

    return [
      `: ${typeDescriptions[bg.type] || ''}`,
      ": ",
      ": "
    ].join("\n");
  };

  const generateEffectsPrompt = (effects: EffectElement[]): string => {
    if (effects.length === 0) return "";

    const effectTypes = effects.map(effect => {
      switch (effect.type) {
        case 'speed': return "speed lines, motion blur";
        case 'focus': return "focus lines, concentration lines";
        case 'explosion': return "explosion effect, impact burst";
        case 'flash': return "flash effect, bright light";
        default: return "dynamic effects";
      }
    });

    const parts = [
      "masterpiece, best quality",
      ...effectTypes,
      "manga style effects",
      "anime style"
    ];

    return parts.join(", ");
  };

  const generateEffectsJapaneseDescription = (effects: EffectElement[]): string => {
    if (effects.length === 0) return "";

    const effectNames = effects.map(effect => {
      switch (effect.type) {
        case 'speed': return '';
        case 'focus': return '';
        case 'explosion': return '';
        case 'flash': return '';
        default: return '';
      }
    });

    return [
      `: ${effectNames.join('')}`,
      ": Dynamic, Energetic",
      ": "
    ].join("\n");
  };

  const generateTonesPrompt = (tones: ToneElement[]): string => {
    if (tones.length === 0) return "";

    const parts = [
      "masterpiece, best quality",
      "screen tone effects",
      "manga style shading",
      "halftone pattern",
      "anime style"
    ];

    return parts.join(", ");
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptOutput).then(() => {
      alert('Prompt copied to clipboard!');
    }).catch(err => {
      console.error(':', err);
      alert('Copy failed. Please manually select and copy the text.');
    });
  };

  const handleCopyDebug = () => {
    navigator.clipboard.writeText(debugOutput).then(() => {
      alert('Debug info copied to clipboard!');
    }).catch(err => {
      console.error(':', err);
      alert('');
    });
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([promptOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `v1.1.1-final-prompts-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const purposes = [
    {
      id: 'nanobanana' as ExportPurpose,
      icon: '🍌',
      title: 'NanoBanana',
      desc: 'AI'
    },
    {
      id: 'prompt' as ExportPurpose,
      icon: '🎨',
      title: '',
      desc: 'AI'
    },
    {
      id: 'print' as ExportPurpose,
      icon: '📄',
      title: 'PDF',
      desc: ''
    },
    {
      id: 'image' as ExportPurpose,
      icon: '🖼️',
      title: '',
      desc: 'SNSWeb'
    },
    {
      id: 'clipstudio' as ExportPurpose,
      icon: '🎭',
      title: '',
      desc: ''
    }
  ];

  const totalElements = characters.length + bubbles.length + backgrounds.length + effects.length + tones.length;

  return (
    <div 
      style={{
        background: isDarkMode ? "#2d2d2d" : "white",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 
        style={{
          color: isDarkMode ? "#ffffff" : "#333333",
          fontSize: "14px",
          fontWeight: "bold",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ color: "#ff8833" }}>📁</span>
        
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {purposes.map((purpose) => (
          <div key={purpose.id}>
            <button
              onClick={() => {
                if (purpose.id === 'prompt') {
                  if (selectedPurpose === 'prompt') {
                    setSelectedPurpose(null); // 
                    setPromptOutput(''); // 
                  } else {
                    setSelectedPurpose('prompt'); // 
                    handlePromptExport(); // 
                  }
                } else {
                  handlePurposeClick(purpose.id);
                }
              }}
              disabled={panels.length === 0 || isExporting}
              style={{
                width: "100%",
                padding: "12px",
                textAlign: "left",
                borderRadius: "4px",
                border: selectedPurpose === purpose.id 
                  ? "2px solid #ff8833" 
                  : `1px solid ${isDarkMode ? "#555555" : "#ddd"}`,
                background: selectedPurpose === purpose.id
                  ? (isDarkMode ? "rgba(255, 136, 51, 0.1)" : "rgba(255, 136, 51, 0.05)")
                  : (isDarkMode ? "#404040" : "#f9f9f9"),
                color: isDarkMode ? "#ffffff" : "#333333",
                cursor: panels.length === 0 || isExporting ? "not-allowed" : "pointer",
                opacity: panels.length === 0 || isExporting ? 0.5 : 1,
                transition: "all 0.2s",
                fontFamily: "inherit",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{purpose.icon}</span>
                <div>
                  <div style={{ 
                    fontWeight: "600", 
                    fontSize: "12px",
                    marginBottom: "2px"
                  }}>
                    {purpose.id === 'prompt' && isExporting && (
                      <span style={{ fontSize: "10px", marginLeft: "8px", color: "#f59e0b" }}>
                        🎯 ...
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: "10px", 
                    opacity: 0.7
                  }}>
                    {purpose.title}
                  </div>
                </div>
              </div>
            </button>

            {selectedPurpose === purpose.id && (
              <div 
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  background: isDarkMode ? "#404040" : "white",
                  border: `1px solid ${isDarkMode ? "#666666" : "#ddd"}`,
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                  {/*  */}
                  {selectedPurpose === 'prompt' && promptOutput && (
                    <div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "12px" 
                      }}>
                        <h4 style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: isDarkMode ? "#10b981" : "#059669",
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          ✅ 
                        </h4>
                        <button
                          onClick={handlePromptExport}
                          disabled={isExporting}
                          style={{
                            background: isExporting ? "#999999" : "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            fontSize: "10px",
                            fontWeight: "600",
                            cursor: isExporting ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {isExporting ? '...' : '🔄 '}
                        </button>
                      </div>

                      {/*  */}
                      <div style={{
                        marginBottom: "12px",
                        padding: "8px",
                        background: isDarkMode ? "#333" : "#f0f0f0",
                        borderRadius: "4px"
                      }}>
                        <label style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "11px",
                          cursor: "pointer"
                        }}>
                          <input
                            type="checkbox"
                            checked={exportCurrentPageOnly}
                            onChange={(e) => setExportCurrentPageOnly(e.target.checked)}
                          />
                          📄 
                        </label>
                      </div>

                      <div style={{ 
                        display: "flex", 
                        justifyContent: "center",
                        marginBottom: "12px" 
                      }}>
                        <button
                          onClick={handleCopyPrompt}
                          style={{
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "8px 24px",
                            fontSize: "11px",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          📋 
                        </button>
                      </div>

                      <div style={{
                        background: isDarkMode ? "#1f2937" : "#f9fafb",
                        border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                        borderRadius: "4px",
                        padding: "12px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        fontFamily: "monospace",
                        fontSize: "10px",
                        lineHeight: "1.4",
                        whiteSpace: "pre-wrap",
                        color: isDarkMode ? "#e5e7eb" : "#374151"
                      }}>
                        {promptOutput}
                      </div>
                    </div>
                  )}
                  
                  {/* 🍌 NanoBanana */}
                  {selectedPurpose === 'nanobanana' && (
                    <div>

                      {/*  */}
                      <div 
                        style={{
                          background: isDarkMode ? "rgba(251, 191, 36, 0.1)" : "rgba(245, 158, 11, 0.05)",
                          padding: "8px",
                          borderRadius: "4px",
                          marginBottom: "12px",
                          textAlign: "center",
                        }}
                      >
                        <p 
                          style={{
                            fontSize: "10px",
                            color: isDarkMode ? "#fbbf24" : "#f59e0b",
                            margin: 0,
                            lineHeight: "1.4"
                          }}
                        >
                          Batch output layout image + prompt + usage guide.<br/>
                          Google AI StudioNanoBananaYou can generate completed cartoons in.<br/>
                          <strong>GooglePlease follow the terms and conditions of the.</strong>
                        </p>
                      </div>

                      {/*  */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        
                        {/*  */}
                        <div>
                          <label 
                            style={{
                              display: "block",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: isDarkMode ? "#ffffff" : "#333333",
                              marginBottom: "4px",
                            }}
                          >
                            
                          </label>
                          <select
                            value={nanoBananaOptions.layoutImageQuality}
                            onChange={(e) => setNanoBananaOptions({
                              ...nanoBananaOptions,
                              layoutImageQuality: e.target.value as any
                            })}
                            disabled={isNanoBananaExporting}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              border: `1px solid ${isDarkMode ? "#666666" : "#ddd"}`,
                              borderRadius: "4px",
                              background: isDarkMode ? "#2d2d2d" : "white",
                              color: isDarkMode ? "#ffffff" : "#333333",
                              fontSize: "11px",
                              fontFamily: "inherit",
                            }}
                          >
                            <option value="high"></option>
                            <option value="medium"></option>
                            <option value="low"></option>
                          </select>
                        </div>

                        {/*  */}
                        <div>
                          <label 
                            style={{
                              display: "block",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: isDarkMode ? "#ffffff" : "#333333",
                              marginBottom: "4px",
                            }}
                          >
                            
                          </label>
                          <select
                            value={nanoBananaOptions.promptLanguage}
                            onChange={(e) => setNanoBananaOptions({
                              ...nanoBananaOptions,
                              promptLanguage: e.target.value as any
                            })}
                            disabled={isNanoBananaExporting}
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              border: `1px solid ${isDarkMode ? "#666666" : "#ddd"}`,
                              borderRadius: "4px",
                              background: isDarkMode ? "#2d2d2d" : "white",
                              color: isDarkMode ? "#ffffff" : "#333333",
                              fontSize: "11px",
                              fontFamily: "inherit",
                            }}
                          >
                            <option value="english"></option>
                            <option value="japanese"></option>
                            <option value="both"></option>
                          </select>
                        </div>

                        {/*  */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <label style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "6px",
                            fontSize: "11px",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            cursor: "pointer"
                          }}>
                            <input
                              type="checkbox"
                              checked={nanoBananaOptions.includeInstructions}
                              onChange={(e) => setNanoBananaOptions({
                                ...nanoBananaOptions,
                                includeInstructions: e.target.checked
                              })}
                              disabled={isNanoBananaExporting}
                              style={{ margin: 0 }}
                            />
                            
                          </label>

                          <label style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "6px",
                            fontSize: "11px",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            cursor: "pointer"
                          }}>
                            <input
                              type="checkbox"
                              checked={nanoBananaOptions.includeCharacterMapping}
                              onChange={(e) => setNanoBananaOptions({
                                ...nanoBananaOptions,
                                includeCharacterMapping: e.target.checked
                              })}
                              disabled={isNanoBananaExporting}
                              style={{ margin: 0 }}
                            />
                            Include character name correspondence table
                          </label>
                        </div>
                      </div>

                      {/*  */}
                      <button
                        onClick={handleNanoBananaExport}
                        disabled={isNanoBananaExporting || panels.length === 0}
                        style={{
                          width: "100%",
                          background: isNanoBananaExporting || panels.length === 0 ? "#999999" : "#f59e0b",
                          color: "white",
                          padding: "10px 12px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: isNanoBananaExporting || panels.length === 0 ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s",
                          fontFamily: "inherit",
                          marginTop: "12px"
                        }}
                      >
                        {isNanoBananaExporting ? (
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                            <div 
                              style={{
                                width: "12px",
                                height: "12px",
                                border: "2px solid white",
                                borderTop: "2px solid transparent",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                              }}
                            />
                            ...
                          </span>
                        ) : (
                          '🍌 NanoBanana'
                        )}
                      </button>

                      {/*  */}
                      {isNanoBananaExporting && nanoBananaProgress && (
                        <div 
                          style={{
                            marginTop: "12px",
                            background: isDarkMode ? "#404040" : "#f5f5f5",
                            padding: "10px",
                            borderRadius: "4px",
                          }}
                        >
                          <div 
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "10px",
                              marginBottom: "6px",
                              color: isDarkMode ? "#ffffff" : "#333333",
                            }}
                          >
                            <span>{nanoBananaProgress.message}</span>
                            <span style={{ fontWeight: "bold" }}>
                              {Math.round(nanoBananaProgress.progress)}%
                            </span>
                          </div>
                          {nanoBananaProgress.currentFile && (
                            <div style={{
                              fontSize: "9px",
                              color: isDarkMode ? "#cccccc" : "#666666",
                              marginBottom: "4px"
                            }}>
                              📄 {nanoBananaProgress.currentFile}
                            </div>
                          )}
                          <div 
                            style={{
                              width: "100%",
                              height: "4px",
                              background: isDarkMode ? "#666666" : "#e0e0e0",
                              borderRadius: "2px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                background: "#f59e0b",
                                borderRadius: "2px",
                                transition: "width 0.3s",
                                width: `${nanoBananaProgress.progress}%`,
                              }}
                            />
                          </div>

                          {/*  */}
                          {nanoBananaProgress.step === 'complete' && (
                            <div style={{
                              marginTop: "8px",
                              padding: "6px",
                              background: isDarkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.05)",
                              borderRadius: "4px",
                              fontSize: "10px",
                              color: isDarkMode ? "#10b981" : "#059669",
                              textAlign: "center"
                            }}>
                              ✅ ZIPPlease download the file.
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}
                  
                  {/*  */}
                  {selectedPurpose === 'print' && (
                    <>
                      <div>
                        <label 
                          style={{
                            display: "block",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            marginBottom: "4px",
                          }}
                        >
                          
                        </label>
                        <select
                          value={exportOptions.resolution}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            resolution: parseInt(e.target.value)
                          })}
                          disabled={isExporting}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            border: `1px solid ${isDarkMode ? "#666666" : "#ddd"}`,
                            borderRadius: "4px",
                            background: isDarkMode ? "#2d2d2d" : "white",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            fontSize: "11px",
                            fontFamily: "inherit",
                          }}
                        >
                          <option value={150}>150 DPI ()</option>
                          <option value={300}>300 DPI ()</option>
                          <option value={600}>600 DPI ()</option>
                        </select>
                      </div>
                      
                      <label style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px",
                        fontSize: "11px",
                        color: isDarkMode ? "#ffffff" : "#333333",
                        cursor: "pointer"
                      }}>
                        <input
                          type="checkbox"
                          checked={exportOptions.separatePages}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            separatePages: e.target.checked
                          })}
                          disabled={isExporting}
                          style={{ margin: 0 }}
                        />
                        
                      </label>
                    </>
                  )}

                  {/*  */}
                  {selectedPurpose === 'image' && (
                    <>
                      <div>
                        <label 
                          style={{
                            display: "block",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            marginBottom: "6px",
                          }}
                        >
                          
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {[
                            { value: 'high', label: '' },
                            { value: 'medium', label: '' },
                            { value: 'low', label: '' }
                          ].map((item) => (
                            <label 
                              key={item.value} 
                              style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "6px",
                                fontSize: "11px",
                                color: isDarkMode ? "#ffffff" : "#333333",
                                cursor: "pointer"
                              }}
                            >
                              <input
                                type="radio"
                                name="quality"
                                value={item.value}
                                checked={exportOptions.quality === item.value}
                                onChange={(e) => setExportOptions({
                                  ...exportOptions,
                                  quality: e.target.value as any
                                })}
                                disabled={isExporting}
                                style={{ margin: 0 }}
                              />
                              {item.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "6px",
                        fontSize: "11px",
                        color: isDarkMode ? "#ffffff" : "#333333",
                        cursor: "pointer"
                      }}>
                        <input
                          type="checkbox"
                          checked={!exportOptions.includeBackground}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            includeBackground: !e.target.checked
                          })}
                          disabled={isExporting}
                          style={{ margin: 0 }}
                        />
                        
                      </label>
                    </>
                  )}

                  {/*  */}
                  {selectedPurpose === 'clipstudio' && (
                    <>
                      <div 
                        style={{
                          background: isDarkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
                          padding: "8px",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <p 
                          style={{
                            fontSize: "10px",
                            color: isDarkMode ? "#93c5fd" : "#3b82f6",
                            margin: 0,
                          }}
                        >
                          JSONof the file and each element (background, character, callout, effect line, tone)PNG
                        </p>
                      </div>
                      
                      <div>
                        <label 
                          style={{
                            display: "block",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            marginBottom: "4px",
                          }}
                        >
                          
                        </label>
                        <select
                          value={exportOptions.resolution}
                          onChange={(e) => setExportOptions({
                            ...exportOptions,
                            resolution: parseInt(e.target.value)
                          })}
                          disabled={isExporting}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            border: `1px solid ${isDarkMode ? "#666666" : "#ddd"}`,
                            borderRadius: "4px",
                            background: isDarkMode ? "#2d2d2d" : "white",
                            color: isDarkMode ? "#ffffff" : "#333333",
                            fontSize: "11px",
                            fontFamily: "inherit",
                          }}
                        >
                          <option value={300}>300 DPI ()</option>
                          <option value={600}>600 DPI ()</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Output buttons (other than prompts) */}
                  <button
                    onClick={handleExport}
                    disabled={isExporting || panels.length === 0}
                    style={{
                      width: "100%",
                      background: isExporting || panels.length === 0 ? "#999999" : "#ff8833",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "none",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: isExporting || panels.length === 0 ? "not-allowed" : "pointer",
                      transition: "background-color 0.2s",
                      fontFamily: "inherit",
                    }}
                  >
                    {isExporting ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <div 
                          style={{
                            width: "12px",
                            height: "12px",
                            border: "2px solid white",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        ...
                      </span>
                    ) : (
                      ''
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress display (only during generation) */}
      {isExporting && exportProgress && (
        <div 
          style={{
            marginTop: "12px",
            background: isDarkMode ? "#404040" : "#f5f5f5",
            padding: "12px",
            borderRadius: "4px",
          }}
        >
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              marginBottom: "6px",
              color: isDarkMode ? "#ffffff" : "#333333",
            }}
          >
            <span>{exportProgress.message}</span>
            <span style={{ fontWeight: "bold" }}>
              {Math.round(exportProgress.progress)}%
            </span>
          </div>
          <div 
            style={{
              width: "100%",
              height: "4px",
              background: isDarkMode ? "#666666" : "#e0e0e0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#ff8833",
                borderRadius: "2px",
                transition: "width 0.3s",
                width: `${exportProgress.progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/*  */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};