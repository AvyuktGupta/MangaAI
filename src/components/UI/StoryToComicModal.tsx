// src/components/UI/StoryToComicModal.tsx — two-step preview
import React, { useState } from 'react';
import { PanelContent } from '../../services/OllamaService';

const BUBBLE_LABEL: Record<string, string> = {
  normal: 'normal',
  shout: 'shout',
  whisper: 'whisper',
  thought: 'thought',
  '\u666e\u901a': 'normal',
  '\u53eb\u3073': 'shout',
  '\u5c0f\u58f0': 'whisper',
  '\u5fc3\u306e\u58f0': 'thought',
};

function bubbleLabel(t?: string) {
  if (!t) return 'normal';
  return BUBBLE_LABEL[t] || BUBBLE_LABEL[String(t).toLowerCase()] || t;
}

interface StoryToComicModalProps {
  isOpen: boolean;
  onClose: () => void;
  panelCount: number;
  onGeneratePreview: (story: string, tone: string) => Promise<PanelContent[]>;
  onGenerateSinglePanel: (story: string, tone: string, targetPanelId: number) => Promise<PanelContent | null>;
  onApply: (previewData: PanelContent[]) => void;
  onApplySinglePanel: (panelData: PanelContent) => void;
  isDarkMode?: boolean;
  characterNames?: Record<string, string>;
  selectedPanelId?: number | null;
  initialStory?: string;
  initialMode?: 'full' | 'single';
}

export const StoryToComicModal: React.FC<StoryToComicModalProps> = ({
  isOpen,
  onClose,
  panelCount,
  onGeneratePreview,
  onGenerateSinglePanel,
  onApply,
  onApplySinglePanel,
  isDarkMode = false,
  characterNames = {},
  selectedPanelId = null,
  initialStory = '',
  initialMode = 'full'
}) => {
  const [generationMode, setGenerationMode] = useState<'full' | 'single'>(initialMode);
  const [story, setStory] = useState(initialStory);
  const [tone, setTone] = useState('Comedy');
  const [previewData, setPreviewData] = useState<PanelContent[] | null>(null);
  const [singlePanelData, setSinglePanelData] = useState<PanelContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<'input' | 'preview'>('input');

  React.useEffect(() => {
    if (isOpen) {
      if (initialStory) {
        setStory(initialStory);
      }
      setGenerationMode(initialMode);
    }
  }, [isOpen, initialStory, initialMode]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!story.trim()) {
      alert('Enter a story summary');
      return;
    }

    if (generationMode === 'single' && !selectedPanelId) {
      alert('Select a panel to generate');
      return;
    }

    setIsGenerating(true);
    try {
      if (generationMode === 'full') {
        const result = await onGeneratePreview(story, tone);
        setPreviewData(result);
      } else {
        const result = await onGenerateSinglePanel(story, tone, selectedPanelId!);
        setSinglePanelData(result);
      }
      setStep('preview');
    } catch (error) {
      console.error('Preview generation error:', error);
      alert('Preview generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generationMode === 'full' && previewData) {
      onApply(previewData);
      handleClose();
    } else if (generationMode === 'single' && singlePanelData) {
      onApplySinglePanel(singlePanelData);
      handleClose();
    }
  };

  const handleClose = () => {
    setStory('');
    setTone('Comedy');
    setPreviewData(null);
    setSinglePanelData(null);
    setStep('input');
    onClose();
  };

  const handleBack = () => {
    setStep('input');
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }}
        onClick={handleClose}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: isDarkMode ? '#2d2d2d' : 'white',
          border: `2px solid ${isDarkMode ? '#555' : '#333'}`,
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 9999,
          minWidth: '600px',
          maxWidth: '700px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          marginBottom: '20px',
          fontWeight: 'bold',
          fontSize: '18px',
          color: isDarkMode ? '#fff' : '#333'
        }}>
          {generationMode === 'full'
            ? 'Generate full page'
            : `Generate panel ${selectedPanelId}`}
          {step === 'preview' && ' — preview'}
        </div>

        {step === 'input' ? (
          <>
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: isDarkMode ? '#404040' : '#f0f0f0',
              borderRadius: '6px',
              fontSize: '13px',
              color: isDarkMode ? '#ccc' : '#666'
            }}>
              Panel count: <strong>{panelCount}</strong>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                color: isDarkMode ? '#fff' : '#333'
              }}>
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
                  borderRadius: '4px',
                  background: isDarkMode ? '#404040' : 'white',
                  color: isDarkMode ? '#fff' : '#333',
                  fontSize: '13px'
                }}
              >
                <option value="Comedy">Comedy</option>
                <option value="Serious">Serious</option>
                <option value="Slice of life">Slice of life</option>
                <option value="Heartfelt">Heartfelt</option>
                <option value="Tense">Tense</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                color: isDarkMode ? '#fff' : '#333'
              }}>
                {generationMode === 'full' ? 'Per-panel beats' : 'This panel'}
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder={
                  generationMode === 'full'
                    ? "Example:\nPanel 1 — hero panics\nPanel 2 — hero says they can't draw\nPanel 3 — friend plugs this app"
                    : "Example:\nHero shocked, saying “No way — really?!”"
                }
                autoFocus
                style={{
                  width: '100%',
                  height: '150px',
                  padding: '12px',
                  border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
                  borderRadius: '6px',
                  resize: 'vertical',
                  fontFamily: "system-ui, sans-serif",
                  fontSize: '14px',
                  lineHeight: '1.6',
                  background: isDarkMode ? '#404040' : 'white',
                  color: isDarkMode ? '#fff' : '#333'
                }}
              />
              <div style={{
                fontSize: '11px',
                color: isDarkMode ? '#999' : '#666',
                marginTop: '6px'
              }}>
                {generationMode === 'full'
                  ? 'One line per panel: who acts, what happens, where if it matters'
                  : 'Who acts, dialogue, action, place if it matters'}
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={handleClose}
                disabled={isGenerating}
                style={{
                  padding: '10px 20px',
                  border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
                  borderRadius: '6px',
                  background: isDarkMode ? '#404040' : 'white',
                  color: isDarkMode ? '#fff' : '#333',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: isGenerating ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !story.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: isGenerating || !story.trim() ? '#999' : '#8b5cf6',
                  color: 'white',
                  cursor: isGenerating || !story.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {isGenerating ? 'Generating…' : 'Generate preview'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: isDarkMode ? '#1a4d1a' : '#d1fae5',
              border: `1px solid ${isDarkMode ? '#10b981' : '#059669'}`,
              borderRadius: '6px',
              fontSize: '12px',
              color: isDarkMode ? '#d1fae5' : '#065f46',
              fontWeight: 'bold'
            }}>
              Preview ready — review and click Apply.
            </div>

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '16px'
            }}>
              {generationMode === 'full' ? (
                previewData?.map((panel) => (
                  <div
                    key={panel.panelId}
                    style={{
                      marginBottom: '12px',
                      padding: '12px',
                      background: isDarkMode ? '#404040' : '#f9f9f9',
                      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '13px',
                      color: isDarkMode ? '#8b5cf6' : '#7c3aed',
                      marginBottom: '8px'
                    }}>
 Panel {panel.panelId}
                    </div>

                    {panel.characterId && (
                      <div style={{ fontSize: '12px', marginBottom: '4px', color: isDarkMode ? '#fbbf24' : '#d97706' }}>
                        Character: <strong>{characterNames[panel.characterId] || panel.characterId}</strong>
                      </div>
                    )}

                    <div style={{ fontSize: '12px', marginBottom: '4px', color: isDarkMode ? '#ccc' : '#666' }}>
                      Note: {panel.note}
                    </div>

                    <div style={{ fontSize: '12px', marginBottom: '4px', color: isDarkMode ? '#ccc' : '#666' }}>
                      Dialogue: “{panel.dialogue}” ({bubbleLabel(panel.bubbleType)})
                    </div>

                    <div style={{ fontSize: '11px', marginBottom: '4px', color: isDarkMode ? '#999' : '#888', fontFamily: 'monospace' }}>
                      Action (EN): {panel.actionPrompt}
                    </div>

                    {panel.actionPromptJa && (
                      <div style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#fbbf24' : '#d97706',
                        padding: '6px',
                        background: isDarkMode ? '#2d2520' : '#fef3c7',
                        borderRadius: '4px',
                        marginTop: '4px'
                      }}>
                        Notes: {panel.actionPromptJa}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                singlePanelData && (
                  <div
                    style={{
                      padding: '12px',
                      background: isDarkMode ? '#404040' : '#f9f9f9',
                      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '13px',
                      color: isDarkMode ? '#8b5cf6' : '#7c3aed',
                      marginBottom: '8px'
                    }}>
                      Panel {singlePanelData.panelId}
                    </div>

                    {singlePanelData.characterId && (
                      <div style={{ fontSize: '12px', marginBottom: '4px', color: isDarkMode ? '#fbbf24' : '#d97706' }}>
                        Character: <strong>{characterNames[singlePanelData.characterId] || singlePanelData.characterId}</strong>
                      </div>
                    )}

                    <div style={{ fontSize: '12px', marginBottom: '4px', color: isDarkMode ? '#ccc' : '#666' }}>
                      Note: {singlePanelData.note}
                    </div>

                    <div style={{ fontSize: '12px', marginBottom: '4px', color: isDarkMode ? '#ccc' : '#666' }}>
                      Dialogue: “{singlePanelData.dialogue}” ({bubbleLabel(singlePanelData.bubbleType)})
                    </div>

                    <div style={{ fontSize: '11px', marginBottom: '4px', color: isDarkMode ? '#999' : '#888', fontFamily: 'monospace' }}>
                      Action (EN): {singlePanelData.actionPrompt}
                    </div>

                    {singlePanelData.actionPromptJa && (
                      <div style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#fbbf24' : '#d97706',
                        padding: '6px',
                        background: isDarkMode ? '#2d2520' : '#fef3c7',
                        borderRadius: '4px',
                        marginTop: '4px'
                      }}>
                        Notes: {singlePanelData.actionPromptJa}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '10px 20px',
                  border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
                  borderRadius: '6px',
                  background: isDarkMode ? '#404040' : 'white',
                  color: isDarkMode ? '#fff' : '#333',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '10px 20px',
                    border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
                    borderRadius: '6px',
                    background: isDarkMode ? '#404040' : 'white',
                    color: isDarkMode ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'input' && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: isDarkMode ? '#404040' : '#fff3cd',
            border: `1px solid ${isDarkMode ? '#555' : '#ffc107'}`,
            borderRadius: '6px',
            fontSize: '11px',
            color: isDarkMode ? '#fbbf24' : '#856404'
          }}>
            Text is sent to your local Ollama (Llama). Start Ollama and pull a chat model first.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
