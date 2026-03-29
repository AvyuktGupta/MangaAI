// src/components/UI/TonePanel.tsx - React Hooks 
import React, { useState, useCallback, useMemo } from 'react';
import { ToneElement, ToneTemplate, Panel, BlendMode } from '../../types';
import { 
  allToneTemplates, 
  toneTemplatesByCategory, 
  createToneFromTemplate,
  getToneCategoryInfo,
  getDefaultToneSettings
} from '../CanvasArea/toneTemplates';

/**
 * BackgroundPanel/EffectPanel
 */
interface TonePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTone: (tone: ToneElement) => void;
  selectedTone?: ToneElement | null;
  onUpdateTone?: (tone: ToneElement) => void;
  isDarkMode?: boolean;
  selectedPanel?: Panel | null;
  tones?: ToneElement[];
  // 
  selectedPanelId?: number;
  darkMode?: boolean;
}

/**
 * React Hooks 
 */
const TonePanel: React.FC<TonePanelProps> = ({
  isOpen,
  onClose,
  onAddTone,
  selectedTone,
  onUpdateTone,
  isDarkMode = false,
  selectedPanel,
  tones = [],
  selectedPanelId,
  darkMode
}) => {
  // 🔧 React Hooks : useState
  // UI
  const [activeTab, setActiveTab] = useState<'shadow' | 'highlight' | 'texture' | 'background' | 'effect' | 'mood'>('shadow');
  const [selectedTemplate, setSelectedTemplate] = useState<ToneTemplate | null>(null);
  const [previewTone, setPreviewTone] = useState<ToneElement | null>(null);

  // 
  const isThemeDark = isDarkMode || darkMode || false;

  // 🔧 BackgroundPanel
  const getAvailablePanels = () => {
    if (selectedPanel) return [selectedPanel];
    
    const panelsWithTones = tones.map(tone => tone.panelId);
    const uniquePanelIds: number[] = [];
    panelsWithTones.forEach(id => {
      if (uniquePanelIds.indexOf(id) === -1) {
        uniquePanelIds.push(id);
      }
    });
    
    return uniquePanelIds.map(id => ({ id, x: 0, y: 0, width: 100, height: 100 }));
  };

  const availablePanels = getAvailablePanels();
  const currentPanel = selectedPanel || availablePanels[0] || null;

  // BackgroundPanelapplyBackgroundTemplate
  const applyToneTemplate = (template: ToneTemplate) => {
    if (!currentPanel) {
      alert('Select a panel or choose from a panel with existing tones');
      return;
    }

    // createToneFromTemplate
    if (createToneFromTemplate && typeof createToneFromTemplate === 'function') {
      try {
        // ✅ 
        const newTone = createToneFromTemplate(
          template,
          currentPanel.id,
          0,   // ← x
          0,   // ← y
          1,   // ← width100%
          1    // ← height100%
        );
        onAddTone(newTone);
        console.log(`✨ ${template.name}${currentPanel.id}`);
      } catch (error) {
        console.error(':', error);
        alert('');
      }
    } else {
      // : 
      const newTone: ToneElement = {
        id: `tone_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        panelId: currentPanel.id,
        type: template.type,
        pattern: template.pattern,
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8,
        density: template.density,
        opacity: template.opacity,
        rotation: template.rotation || 0,
        scale: template.scale || 1,
        blendMode: template.blendMode,
        contrast: template.contrast || 1,
        brightness: template.brightness || 0,
        invert: false,
        maskEnabled: false,
        maskShape: 'rectangle',
        maskFeather: 0,
        selected: false,
        zIndex: 0,
        isGlobalPosition: false,
        visible: true,
        // 
        color: '#000000',
        intensity: 0.5,
        angle: 0,
        direction: 'vertical'
      };
      onAddTone(newTone);
    }
  };

  // BackgroundPanel
  const deleteTone = (toneId: string) => {
    if (window.confirm('')) {
      // CanvasComponentWe don't do anything here because it's implemented in
      console.log(':', toneId);
      // contextMenuActions
    }
  };

  // BackgroundPanel
  const panelTones = currentPanel 
    ? tones.filter(tone => tone.panelId === currentPanel.id)
    : [];

  // 
  const categoryInfo = getToneCategoryInfo ? getToneCategoryInfo() : {
    shadow: { icon: '🌑', name: '', description: '' },
    highlight: { icon: '✨', name: '', description: '' },
    texture: { icon: '🎨', name: '', description: '' },
    background: { icon: '🖼️', name: '', description: '' },
    effect: { icon: '💫', name: '', description: '' },
    mood: { icon: '🌈', name: '', description: '' }
  };

  // 
  const getToneTypeIcon = (type: string) => {
    switch (type) {
      case 'halftone': return '⚫';
      case 'gradient': return '🌈';
      case 'crosshatch': return '❌';
      case 'dots': return '⚪';
      case 'lines': return '📏';
      case 'noise': return '🌪️';
      default: return '🎨';
    }
  };

  // 
  const getToneTypeName = (type: string) => {
    switch (type) {
      case 'halftone': return '';
      case 'gradient': return '';
      case 'crosshatch': return '';
      case 'dots': return '';
      case 'lines': return '';
      case 'noise': return '';
      default: return type;
    }
  };

  // 🔧 useState
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="modal-content tone-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-primary)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '80vh',
          overflow: 'auto',
          color: 'var(--text-primary)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* BackgroundPanel/EffectPanel */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '16px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            🎨 
            {currentPanel && (
              <span style={{ fontSize: '16px', fontWeight: 'normal', marginLeft: '12px', color: 'var(--text-muted)' }}>
                {currentPanel.id}
              </span>
            )}
          </h2>
          
          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕ 
          </button>
        </div>

        {/* BackgroundPanel */}
        {!currentPanel ? (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent-color)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'center',
            color: 'var(--accent-color)'
          }}>
            📢 Please select a panel to set the tone for first
            {availablePanels.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <small style={{ display: 'block', marginBottom: '8px' }}>
                  Or choose from a panel with existing tones:
                </small>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {availablePanels.map(panel => (
                    <button 
                      key={panel.id}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onClick={() => {
                        console.log(`${panel.id}`);
                      }}
                    >
                      {panel.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* BackgroundPanel */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                flexWrap: 'wrap',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '12px'
              }}>
                {Object.entries(categoryInfo).map(([category, info]) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category as any)}
                    style={{
                      background: activeTab === category ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                      color: activeTab === category ? 'white' : 'var(--text-primary)',
                      border: `1px solid ${activeTab === category ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      borderRadius: '6px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: activeTab === category ? 'bold' : 'normal'
                    }}
                  >
                    {info.icon} {info.name}
                  </button>
                ))}
              </div>
            </div>

            {/* BackgroundPanel */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '18px',
                color: 'var(--text-primary)'
              }}>
                📋  ({(toneTemplatesByCategory[activeTab as keyof typeof toneTemplatesByCategory] || []).length})
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px',
                padding: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                {(toneTemplatesByCategory[activeTab as keyof typeof toneTemplatesByCategory] || []).map((template: ToneTemplate) => (
                  <div
                    key={template.id}
                    onClick={() => applyToneTemplate(template)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '2px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      fontSize: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-color)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/*  */}
                    <div style={{
                      width: '100%',
                      height: '60px',
                      margin: '0 auto 8px',
                      background: template.preview?.backgroundColor || '#f0f0f0',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {getToneTypeIcon(template.type)}
                    </div>
                    
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {template.name}
                    </div>
                    
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      {template.description}
                    </div>
                    
                    {/*  */}
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'var(--bg-tertiary)',
                        padding: '2px 4px',
                        borderRadius: '8px',
                        fontSize: '9px',
                        color: 'var(--text-muted)'
                      }}>
                        : {Math.round(template.density * 100)}%
                      </span>
                      <span style={{
                        background: 'var(--bg-tertiary)',
                        padding: '2px 4px',
                        borderRadius: '8px',
                        fontSize: '9px',
                        color: 'var(--text-muted)'
                      }}>
                        : {Math.round(template.opacity * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BackgroundPanel */}
            {panelTones.length > 0 && (
              <div>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '18px',
                  color: 'var(--text-primary)'
                }}>
                  🎯  ({panelTones.length})
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  {panelTones.map(tone => (
                    <div
                      key={tone.id}
                      onClick={() => {
                        // CanvasComponent
                        console.log(':', tone.id);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: selectedTone?.id === tone.id ? 'var(--accent-color)' : 'var(--bg-primary)',
                        color: selectedTone?.id === tone.id ? 'white' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      <div>
                        <strong>{getToneTypeIcon(tone.type)} {getToneTypeName(tone.type)}</strong>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          : {Math.round(tone.density * 100)}% | : {Math.round(tone.opacity * 100)}% | {tone.pattern}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTone(tone.id);
                        }}
                        style={{
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EffectPanel */}
            {selectedTone && onUpdateTone && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  color: 'var(--text-primary)'
                }}>
                  🎯 : {getToneTypeIcon(selectedTone.type)} {getToneTypeName(selectedTone.type)}
                </h4>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginBottom: '4px'
                    }}>
                      : {Math.round(selectedTone.density * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={selectedTone.density}
                      onChange={(e) => {
                        const updatedTone = {
                          ...selectedTone,
                          density: parseFloat(e.target.value)
                        };
                        onUpdateTone(updatedTone);
                      }}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-color)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginBottom: '4px'
                    }}>
                      : {Math.round(selectedTone.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={selectedTone.opacity}
                      onChange={(e) => {
                        const updatedTone = {
                          ...selectedTone,
                          opacity: parseFloat(e.target.value)
                        };
                        onUpdateTone(updatedTone);
                      }}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-color)'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BackgroundPanel/EffectPanel */}
            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              color: 'var(--text-muted)'
            }}>
              <strong>💡 :</strong><br/>
              • Click on the template to apply the tone<br/>
              • Click on a tone element to select and edit it<br/>
              • Click to select a tone on the canvas<br/>
              • Select a panel and then open the Tone Settings panel<br/>
              • Ctrl+T <br/>
              • 🔧 BackgroundPanel/EffectPanelis integrated into the same modal implementation as
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TonePanel;