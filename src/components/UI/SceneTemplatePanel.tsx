// src/components/UI/SceneTemplatePanel.tsx - 
import React, { useState, useCallback } from 'react';
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement } from '../../types';
import { getAllSceneTemplates, getTemplatesByCategory, applyEnhancedSceneTemplate } from '../CanvasArea/sceneTemplates';

interface SceneTemplatePanelProps {
  panels: Panel[];
  selectedPanel: Panel | null;
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  speechBubbles: SpeechBubble[];
  setSpeechBubbles: (bubbles: SpeechBubble[]) => void;
  backgrounds: BackgroundElement[];
  setBackgrounds: (backgrounds: BackgroundElement[]) => void;
  effects: EffectElement[];
  setEffects: (effects: EffectElement[]) => void;
  tones: ToneElement[];
  setTones: (tones: ToneElement[]) => void;
  isDarkMode?: boolean;
  onCreateCharacter?: () => void;
  selectedCharacter: Character | null;
  setSelectedCharacter: (character: Character | null) => void;
}

export const SceneTemplatePanel: React.FC<SceneTemplatePanelProps> = ({
  panels,
  selectedPanel,
  characters,
  setCharacters,
  speechBubbles,
  setSpeechBubbles,
  backgrounds,
  setBackgrounds,
  effects,
  setEffects,
  tones,
  setTones,
  isDarkMode = true,
  onCreateCharacter,
  selectedCharacter,
  setSelectedCharacter,
}) => {
  // 
  const [selectedCategory, setSelectedCategory] = useState<'emotion' | 'action' | 'daily' | 'special'>('emotion');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  // Temporarily disable preview
  // const [showPreview, setShowPreview] = useState<boolean>(false);

  // 
  const currentTemplates = getTemplatesByCategory(selectedCategory);
  
  // : 
  console.log('🔍 SceneTemplatePanel - :', {
    charactersCount: characters.length,
    characters: characters.map(char => ({ id: char.id, name: char.name, characterId: char.characterId }))
  });

  // Template application function to receive character information directly
  const handleApplyTemplateWithCharacter = useCallback((templateKey: string, character: any) => {
    console.log('🔍 handleApplyTemplateWithCharacter called:', {
      templateKey,
      character: character ? character.name : 'null',
      selectedPanel: selectedPanel ? selectedPanel.id : 'null'
    });

    if (!panels || panels.length === 0) {
      alert('❌ Please select a panel template first');
      return;
    }

    if (!character) {
      console.log('❌ character is null:', character);
      alert('❌ Please select a character first');
      return;
    }

    const template = getAllSceneTemplates()[templateKey];
    if (!template) {
      alert('❌ template not found');
      return;
    }

    // 🔧 Force Review/Retrieve Selected Panels
    let targetPanel = selectedPanel;
    
    // selectedPanelnull
    if (!targetPanel) {
      // Find the last panel clicked (check the selection status of the panel)
      const lastSelectedPanel = panels.find(panel => {
        // If the panel holds the selection in some way
        return (panel as any).isSelected || (panel as any).selected;
      });
      
      if (lastSelectedPanel) {
        targetPanel = lastSelectedPanel;
        console.log(`🔧 Restore target panel from selected state: ${targetPanel.id}`);
      } else {
        // Confirmation dialog if not yet
        const panelId = prompt(
          `\n: ${panels.map(p => p.id).join(', ')}`,
          panels[0].id.toString()
        );
        
        if (panelId) {
          const specifiedPanel = panels.find(p => p.id.toString() === panelId);
          if (specifiedPanel) {
            targetPanel = specifiedPanel;
            console.log(`🔧 ${targetPanel.id}`);
          }
        }
        
        // If not, go to the first panel
        if (!targetPanel) {
          targetPanel = panels[0];
          console.log(`⚠️ ${targetPanel.id}`);
        }
      }
    }

    console.log(`🎭 : ${template.name} → ${targetPanel.id}`);
    console.log(`📊 : selectedPanel=${selectedPanel?.id || 'null'}, targetPanel=${targetPanel.id}`);
    console.log(`👤 : ${character.name} (ID: ${character.id})`);

    // 🔧 Clear existing in-panel elements (before applying the integration template)
    if (!targetPanel) {
      console.error('❌ targetPanel is null');
      return;
    }
    
    // TypeScript: targetPanelnull
    const panelId = targetPanel.id;
    
    const filteredCharacters = characters.filter(char => char.panelId !== panelId);
    const filteredBubbles = speechBubbles.filter(bubble => bubble.panelId !== panelId);
    const filteredBackgrounds = backgrounds.filter(bg => bg.panelId !== panelId);
    const filteredEffects = effects.filter(effect => effect.panelId !== panelId);
    const filteredTones = tones.filter(tone => tone.panelId !== panelId);
    
    console.log(`🧹 ${panelId}:`, {
      characters: characters.length - filteredCharacters.length,
      bubbles: speechBubbles.length - filteredBubbles.length,
      backgrounds: backgrounds.length - filteredBackgrounds.length,
      effects: effects.length - filteredEffects.length,
      tones: tones.length - filteredTones.length
    });


    // Apply unified template (pass selected character information)
    const result = applyEnhancedSceneTemplate(
      templateKey,
      panels,
      filteredCharacters,  // 🔧 Use Cleared Character Array
      filteredBubbles,    // 🔧 Use cleared callout arrays
      filteredBackgrounds, // 🔧 
      filteredEffects,    // 🔧 
      filteredTones,      // 🔧 Use Cleared Tone Array
      targetPanel,  // 🔧 
      character  // 🔧 Pass selected character information
    );


    // 
    setCharacters(result.characters);
    setSpeechBubbles(result.speechBubbles);
    setBackgrounds(result.backgrounds);
    setEffects(result.effects);
    setTones(result.tones);

    setSelectedTemplate(templateKey);
    
    // 
    console.log(`🎭 ${template.name}${targetPanel.id}`);
    
    // Toast notification (if implemented)
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(`🎭 ${template.name}${targetPanel.id}`, 'success');
    }
    
    // Select the target panel after applying
    // This part is the parent component'sonPanelSelect
  }, [panels, characters, speechBubbles, backgrounds, effects, tones, selectedPanel, setCharacters, setSpeechBubbles, setBackgrounds, setEffects, setTones, setSelectedTemplate]);

  // 
  // handleApplyTemplate
  const handleApplyTemplate = useCallback((templateKey: string) => {
    console.log('🔍 handleApplyTemplate called:', {
      templateKey,
      selectedCharacter: selectedCharacter ? selectedCharacter.name : 'null',
      selectedPanel: selectedPanel ? selectedPanel.id : 'null'
    });

    if (!panels || panels.length === 0) {
      alert('❌ Please select a panel template first');
      return;
    }

    if (!selectedCharacter) {
      console.log('❌ selectedCharacter is null:', selectedCharacter);
      alert('❌ Please select a character first');
      return;
    }

    const template = getAllSceneTemplates()[templateKey];
    if (!template) {
      alert('❌ template not found');
      return;
    }

    // 🔧 Force Review/Retrieve Selected Panels
    let targetPanel = selectedPanel;
    
    // selectedPanelnull
    if (!targetPanel) {
      // Find the last panel clicked (check the selection status of the panel)
      const lastSelectedPanel = panels.find(panel => {
        // If the panel holds the selection in some way
        return (panel as any).isSelected || (panel as any).selected;
      });
      
      if (lastSelectedPanel) {
        targetPanel = lastSelectedPanel;
        console.log(`🔧 Restore target panel from selected state: ${targetPanel.id}`);
      } else {
        // Confirmation dialog if not yet
        const panelId = prompt(
          `\n: ${panels.map(p => p.id).join(', ')}`,
          panels[0].id.toString()
        );
        
        if (panelId) {
          const specifiedPanel = panels.find(p => p.id.toString() === panelId);
          if (specifiedPanel) {
            targetPanel = specifiedPanel;
            console.log(`🔧 ${targetPanel.id}`);
          }
        }
        
        // If not, go to the first panel
        if (!targetPanel) {
          targetPanel = panels[0];
          console.log(`⚠️ ${targetPanel.id}`);
        }
      }
    }

    console.log(`🎭 : ${template.name} → ${targetPanel.id}`);
    console.log(`📊 : selectedPanel=${selectedPanel?.id || 'null'}, targetPanel=${targetPanel.id}`);
    console.log(`👤 : ${selectedCharacter.name} (ID: ${selectedCharacter.id})`);

    // Apply unified template (pass selected character information)
    const result = applyEnhancedSceneTemplate(
      templateKey,
      panels,
      characters,
      speechBubbles,
      backgrounds,
      effects,
      tones,
      targetPanel,  // 🔧 
      selectedCharacter  // 🔧 Pass selected character information
    );

    // 
    setCharacters(result.characters);
    setSpeechBubbles(result.speechBubbles);
    setBackgrounds(result.backgrounds);
    setEffects(result.effects);
    setTones(result.tones);

    setSelectedTemplate(templateKey);
    
    // 
    console.log(`🎭 ${template.name}${targetPanel.id}`);
    
    // Toast notification (if implemented)
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast(`🎭 ${template.name}${targetPanel.id}`, 'success');
    }
    
    // Select the target panel after applying
    // This part is the parent component'sonPanelSelect
    // onPanelSelect?.(targetPanel);
    
  }, [panels, selectedPanel, characters, speechBubbles, backgrounds, effects, tones, setCharacters, setSpeechBubbles, setBackgrounds, setEffects, setTones]);

  // Temporarily disable preview display
  const handlePreview = useCallback((templateKey: string) => {
    setSelectedTemplate(templateKey);
    // setShowPreview(true); // 
  }, []);

  // 
  const categoryInfo = {
    emotion: { icon: '😢', name: '', description: '', color: '#ff6b6b' },
    action: { icon: '💨', name: '', description: '', color: '#4ecdc4' },
    daily: { icon: '💬', name: '', description: '', color: '#45b7d1' },
    special: { icon: '✨', name: '', description: '', color: '#9b59b6' }
  };

  const currentCategory = categoryInfo[selectedCategory];

  return (
    <div className="scene-template-panel">
      <div className="section-header">
        <h3>🎭 </h3>
        <div className="template-info" style={{
          fontSize: '12px',
          color: isDarkMode ? '#aaa' : '#666',
          marginTop: '4px',
          lineHeight: '1.4'
        }}>
           +  +  + 
        </div>
      </div>

      {/*  */}
      <div className="character-selection" style={{
        marginBottom: '12px',
        padding: '8px',
        background: isDarkMode ? '#2a2a2a' : '#f5f5f5',
        borderRadius: '8px',
        border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: isDarkMode ? '#fff' : '#333'
        }}>
          👤 
        </div>
        
        <div style={{
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              if (!selectedPanel) {
                alert('');
                return;
              }
              // 
              const protagonistChar = {
                id: `char_${Date.now()}_protagonist`,
                characterId: 'protagonist',
                name: '',
                x: selectedPanel.x + selectedPanel.width * 0.5,
                y: selectedPanel.y + selectedPanel.height * 0.7,
                panelId: selectedPanel.id,
                isGlobalPosition: true,
                scale: 2.0,
                type: 'character_1',  // 🔧 : character → character_1
                expression: 'neutral',
                action: 'standing',
                facing: 'at_viewer',
                eyeState: 'normal',
                mouthState: 'closed',
                handGesture: 'none',
                viewType: 'upper_body' as const
              };
              // 🔧 Character selection only (do not draw)
              setSelectedCharacter(protagonistChar);
              console.log('👤 :', protagonistChar);
            }}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: selectedCharacter?.characterId === 'protagonist' ? (isDarkMode ? '#4ecdc4' : '#45b7d1') : (isDarkMode ? '#333' : '#f0f0f0'),
              color: selectedCharacter?.characterId === 'protagonist' ? '#fff' : (isDarkMode ? '#fff' : '#333'),
              transition: 'all 0.2s ease'
            }}
          >
            👤 
          </button>
          <button
            onClick={() => {
              if (!selectedPanel) {
                alert('');
                return;
              }
              // 
              const heroineChar = {
                id: `char_${Date.now()}_heroine`,
                characterId: 'heroine',
                name: '',
                x: selectedPanel.x + selectedPanel.width * 0.5,
                y: selectedPanel.y + selectedPanel.height * 0.7,
                panelId: selectedPanel.id,
                isGlobalPosition: true,
                scale: 2.0,
                type: 'character_2',  // 🔧 : character → character_2
                expression: 'neutral',
                action: 'standing',
                facing: 'at_viewer',
                eyeState: 'normal',
                mouthState: 'closed',
                handGesture: 'none',
                viewType: 'upper_body' as const
              };
              // 🔧 Character selection only (do not draw)
              setSelectedCharacter(heroineChar);
              console.log('👩 :', heroineChar);
            }}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: selectedCharacter?.characterId === 'heroine' ? (isDarkMode ? '#4ecdc4' : '#45b7d1') : (isDarkMode ? '#333' : '#f0f0f0'),
              color: selectedCharacter?.characterId === 'heroine' ? '#fff' : (isDarkMode ? '#fff' : '#333'),
              transition: 'all 0.2s ease'
            }}
          >
            👩 
          </button>
          <button
            onClick={() => {
              if (!selectedPanel) {
                alert('');
                return;
              }
              // 
              const rivalChar = {
                id: `char_${Date.now()}_rival`,
                characterId: 'rival',
                name: '',
                x: selectedPanel.x + selectedPanel.width * 0.5,
                y: selectedPanel.y + selectedPanel.height * 0.7,
                panelId: selectedPanel.id,
                isGlobalPosition: true,
                scale: 2.0,
                type: 'character_3',  // 🔧 : character → character_3
                expression: 'neutral',
                action: 'standing',
                facing: 'at_viewer',
                eyeState: 'normal',
                mouthState: 'closed',
                handGesture: 'none',
                viewType: 'upper_body' as const
              };
              // 🔧 Character selection only (do not draw)
              setSelectedCharacter(rivalChar);
              console.log('👨 :', rivalChar);
            }}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: selectedCharacter?.characterId === 'rival' ? (isDarkMode ? '#4ecdc4' : '#45b7d1') : (isDarkMode ? '#333' : '#f0f0f0'),
              color: selectedCharacter?.characterId === 'rival' ? '#fff' : (isDarkMode ? '#fff' : '#333'),
              transition: 'all 0.2s ease'
            }}
          >
            👨 
          </button>
          <button
            onClick={() => {
              if (!selectedPanel) {
                alert('');
                return;
              }
              // 
              const friendChar = {
                id: `char_${Date.now()}_friend`,
                characterId: 'friend',
                name: '',
                x: selectedPanel.x + selectedPanel.width * 0.5,
                y: selectedPanel.y + selectedPanel.height * 0.7,
                panelId: selectedPanel.id,
                isGlobalPosition: true,
                scale: 2.0,
                type: 'character_4',  // 🔧 : character_3 → character_4
                expression: 'neutral',
                action: 'standing',
                facing: 'at_viewer',
                eyeState: 'normal',
                mouthState: 'closed',
                handGesture: 'none',
                viewType: 'upper_body' as const
              };
              // 🔧 Character selection only (do not draw)
              setSelectedCharacter(friendChar);
              console.log('👫 :', friendChar);
            }}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: selectedCharacter?.characterId === 'friend' ? (isDarkMode ? '#4ecdc4' : '#45b7d1') : (isDarkMode ? '#333' : '#f0f0f0'),
              color: selectedCharacter?.characterId === 'friend' ? '#fff' : (isDarkMode ? '#fff' : '#333'),
              transition: 'all 0.2s ease'
            }}
          >
            👫 
          </button>
        </div>
      </div>

      {/*  */}
      <div className="category-tabs" style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '12px',
        background: isDarkMode ? '#2a2a2a' : '#f5f5f5',
        borderRadius: '8px',
        padding: '4px'
      }}>
        {Object.entries(categoryInfo).map(([key, info]) => (
          <button
            key={key}
            className={`category-tab ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key as 'emotion' | 'action' | 'daily' | 'special')}
            style={{
              flex: 1,
              padding: '8px 4px',
              border: 'none',
              borderRadius: '6px',
              background: selectedCategory === key ? info.color : 'transparent',
              color: selectedCategory === key ? 'white' : (isDarkMode ? '#ccc' : '#666'),
              fontSize: '12px',
              fontWeight: selectedCategory === key ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '14px' }}>{info.icon}</span>
            <span>{info.name}</span>
          </button>
        ))}
      </div>

      {/*  */}
      <div style={{
        background: isDarkMode ? '#333' : '#f9f9f9',
        border: `1px solid ${currentCategory.color}`,
        borderRadius: '6px',
        padding: '8px',
        marginBottom: '12px',
        fontSize: '11px',
        color: isDarkMode ? '#ccc' : '#555'
      }}>
        <strong style={{ color: currentCategory.color }}>
          {currentCategory.icon} {currentCategory.name}
        </strong>
        <br />
        {currentCategory.description}
      </div>

      {/*  */}
      <div className="template-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginBottom: '12px'
      }}>
        {Object.entries(currentTemplates).map(([key, template]) => (
          <div
            key={key}
            className={`template-card ${selectedTemplate === key ? 'selected' : ''}`}
            style={{
              border: `2px solid ${selectedTemplate === key ? currentCategory.color : (isDarkMode ? '#444' : '#ddd')}`,
              borderRadius: '8px',
              padding: '8px',
              background: selectedTemplate === key 
                ? `${currentCategory.color}15` 
                : (isDarkMode ? '#2a2a2a' : '#fafafa'),
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onClick={() => {
              if (!selectedCharacter) {
                alert('Please select a character first');
                return;
              }
              handleApplyTemplateWithCharacter(key, selectedCharacter);
            }}
            // Prevent chikachika by temporarily deactivating the preview
            // onMouseEnter={() => handlePreview(key)}
            // onMouseLeave={() => setShowPreview(false)}
          >
            {/*  */}
            <div style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: isDarkMode ? '#fff' : '#333',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {template.name}
            </div>

            {/*  */}
            <div style={{
              fontSize: '10px',
              color: isDarkMode ? '#aaa' : '#666',
              lineHeight: '1.3',
              marginBottom: '6px'
            }}>
              {template.description}
            </div>

            {/*  */}
            <div style={{
              display: 'flex',
              gap: '6px',
              fontSize: '9px',
              color: isDarkMode ? '#888' : '#777'
            }}>
              <span>👥{template.characters.length}</span>
              <span>💬{template.speechBubbles.length}</span>
              {template.backgrounds && template.backgrounds.length > 0 && <span>🎨{template.backgrounds.length}</span>}
              {template.effects && template.effects.length > 0 && <span>⚡{template.effects.length}</span>}
              {template.tones && template.tones.length > 0 && <span>🎯{template.tones.length}</span>}
            </div>

            {/*  */}
            {selectedTemplate === key && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentCategory.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: 'white'
              }}>
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/*  */}
      <div style={{
        background: isDarkMode ? '#333' : '#f0f0f0',
        border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
        borderRadius: '6px',
        padding: '8px',
        fontSize: '11px',
        color: isDarkMode ? '#ccc' : '#666'
      }}>
        <div style={{ marginBottom: '4px' }}>
          <strong>📍 : </strong>
          {selectedPanel ? `${selectedPanel.id}` : ''}
        </div>
        <div style={{ marginBottom: '4px' }}>
          <strong>📊 : </strong>
          👥{characters.length} 💬{speechBubbles.length} 🎨{backgrounds.length} ⚡{effects.length} 🎯{tones.length}
        </div>
        {panels.length === 0 && (
          <div style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            ⚠️ Please select a panel template first
          </div>
        )}
      </div>

      {/* Prevent Chikachika by temporarily disabling the preview modal */}
      {/*
      {showPreview && selectedTemplate && getAllSceneTemplates()[selectedTemplate] && (
        <div 
          className="preview-modal"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: isDarkMode ? '#2a2a2a' : '#ffffff',
            border: `2px solid ${currentCategory.color}`,
            borderRadius: '12px',
            padding: '16px',
            maxWidth: '300px',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={() => setShowPreview(false)}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: currentCategory.color,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {getAllSceneTemplates()[selectedTemplate].name}
            <span style={{ fontSize: '10px', color: isDarkMode ? '#888' : '#666' }}></span>
          </div>
          
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? '#ccc' : '#666',
            marginBottom: '12px',
            lineHeight: '1.4'
          }}>
            {getAllSceneTemplates()[selectedTemplate].description}
          </div>

          <div style={{
            background: isDarkMode ? '#333' : '#f5f5f5',
            borderRadius: '6px',
            padding: '8px',
            fontSize: '10px',
            color: isDarkMode ? '#aaa' : '#777'
          }}>
            <div><strong>:</strong></div>
            <div>👥 : {getAllSceneTemplates()[selectedTemplate].characters.length}</div>
            <div>💬 : {getAllSceneTemplates()[selectedTemplate].speechBubbles.length}</div>
            {getAllSceneTemplates()[selectedTemplate].backgrounds && (
              <div>🎨 : {getAllSceneTemplates()[selectedTemplate].backgrounds!.length}</div>
            )}
            {getAllSceneTemplates()[selectedTemplate].effects && (
              <div>⚡ : {getAllSceneTemplates()[selectedTemplate].effects!.length}</div>
            )}
            {getAllSceneTemplates()[selectedTemplate].tones && (
              <div>🎯 : {getAllSceneTemplates()[selectedTemplate].tones!.length}</div>
            )}
          </div>

          <button
            onClick={() => handleApplyTemplate(selectedTemplate)}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '8px',
              background: currentCategory.color,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🎭 
          </button>
        </div>
      )}
      */}

      {/* Background overlays are also temporarily disabled */}
      {/*
      {showPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
          onClick={() => setShowPreview(false)}
        />
      )}
      */}
    </div>
  );
};