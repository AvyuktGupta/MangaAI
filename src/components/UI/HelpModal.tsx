import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  if (!isOpen) return null;

  const bgColor = isDarkMode ? '#1a1a1a' : 'white';
  const textColor = isDarkMode ? '#e0e0e0' : '#333';
  const headerBg = isDarkMode ? '#2d2d2d' : '#f8f9fa';
  const sectionBorder = isDarkMode ? '#444' : '#e0e0e0';
  const infoBg = isDarkMode ? '#2a4a5a' : '#e8f4f8';
  const tipBg = isDarkMode ? '#4a3a2a' : '#fff3cd';
  const cardBg = isDarkMode ? '#2d2d2d' : '#ecf0f1';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: bgColor,
          borderRadius: '12px',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `2px solid ${sectionBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: headerBg,
          }}
        >
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: textColor }}>
            User guide
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '0 8px',
              color: isDarkMode ? '#aaa' : '#666',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            <section style={{ marginBottom: '32px', padding: '20px', backgroundColor: isDarkMode ? '#1e3a4a' : '#e8f4f8', borderRadius: '12px', border: `2px solid ${isDarkMode ? '#4fc3f7' : '#3498db'}` }}>
              <h3 style={{ fontSize: '22px', marginBottom: '16px', color: isDarkMode ? '#4fc3f7' : '#2c3e50', textAlign: 'center' }}>
                Full AI comic workflow
              </h3>
              <div style={{ fontSize: '16px', lineHeight: '2', color: textColor, textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>1. Build your layouts here</strong><br/>
                  <span style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666' }}>Panels, dialogue, and action prompts</span>
                </div>
                <div style={{ fontSize: '24px', margin: '8px 0' }}>↓</div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>2. Export (image + prompts)</strong><br/>
                  <span style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666' }}>prompts.txt lists English prompts per panel</span>
                </div>
                <div style={{ fontSize: '24px', margin: '8px 0' }}>↓</div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>3. Generate art in your AI tool</strong><br/>
                  <span style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666' }}>Ollama (Flux), Stable Diffusion, Midjourney, etc.</span>
                </div>
                <div style={{ fontSize: '24px', margin: '8px 0' }}>↓</div>
                <div>
                  <strong>4. Composite and finish</strong><br/>
                  <span style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666' }}>Drop dialogue and effects on your generated art</span>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '20px', color: isDarkMode ? '#4fc3f7' : '#2c3e50', borderBottom: `3px solid ${isDarkMode ? '#4fc3f7' : '#3498db'}`, paddingBottom: '8px' }}>
                In-app workflow
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { step: '1', icon: '👤', title: 'Register characters', desc: 'Left sidebar: Characters — set names for your main cast' },
                  { step: '2', icon: '📋', title: 'Pick a template', desc: 'New project: choose panel count (1, 2 side-by-side, 4-koma, etc.)' },
                  { step: '3', icon: '📝', title: 'Page notes', desc: 'Right sidebar: “AI page” — enter your story beats' },
                  { step: '4', icon: '🤖', title: 'Generate with AI', desc: '“Generate full page” opens the modal: preview, then Apply' },
                  { step: '5', icon: '🎨', title: 'Polish', desc: 'Resize bubbles, panel importance, backgrounds' },
                  { step: '6', icon: '💾', title: 'Save and export', desc: 'Save project and export PNG/JPEG' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    backgroundColor: cardBg,
                    borderRadius: '8px',
                    border: `2px solid ${idx === 0 ? (isDarkMode ? '#4fc3f7' : '#3498db') : 'transparent'}`
                  }}>
                    <div style={{
                      minWidth: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#3a3a3a' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      border: `2px solid ${sectionBorder}`
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: textColor, marginBottom: '8px' }}>
                        Step {item.step}: {item.title}
                      </div>
                      <div style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666', lineHeight: '1.6' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#ff6b9d' : '#e74c3c', borderBottom: `2px solid ${isDarkMode ? '#ff6b9d' : '#e74c3c'}`, paddingBottom: '8px' }}>
                AI generation
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px', color: isDarkMode ? '#ff6b9d' : '#e74c3c' }}>Full page</h4>
                <ol style={{ lineHeight: '1.8', color: textColor, marginLeft: '20px' }}>
                  <li>Open “AI page” in the right sidebar</li>
                  <li>Type story notes (structure, beats, intent)
                    <div style={{ backgroundColor: infoBg, padding: '12px', borderRadius: '6px', marginTop: '8px', fontSize: '14px' }}>
                      Example: The hero wakes up shocked. A giant robot outside the window. They dress fast and run outside.
                    </div>
                  </li>
                  <li>Click “Generate full page”</li>
                  <li>Preview → review → Apply</li>
                </ol>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px', color: isDarkMode ? '#ff6b9d' : '#e74c3c' }}>Single panel</h4>
                <ol style={{ lineHeight: '1.8', color: textColor, marginLeft: '20px' }}>
                  <li>Select a panel</li>
                  <li>Open “Panel settings” on the right</li>
                  <li>Click “Generate panel with AI”</li>
                  <li>Enter what happens in that panel → Preview → Apply</li>
                </ol>
              </div>

              <div style={{ backgroundColor: tipBg, padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${isDarkMode ? '#ffa726' : '#f39c12'}` }}>
                <strong>Tip:</strong> More specific story notes yield better results. Keep character names consistent with your registrations.
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#81c784' : '#27ae60', borderBottom: `2px solid ${isDarkMode ? '#81c784' : '#27ae60'}`, paddingBottom: '8px' }}>
                Basics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { title: 'New project', desc: 'Toolbar: template picker' },
                  { title: 'Save', desc: 'Save as new or overwrite' },
                  { title: 'Undo', desc: 'Ctrl + Z (redo: Ctrl + Y)' },
                  { title: 'Panels', desc: 'Edit mode: move, resize, split' },
                  { title: 'Bubbles', desc: 'Double-click a panel to add text' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px', backgroundColor: cardBg, borderRadius: '6px' }}>
                    <strong style={{ color: textColor }}>{item.title}:</strong>
                    <div style={{ fontSize: '14px', color: isDarkMode ? '#aaa' : '#666', marginTop: '4px' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#ba68c8' : '#8e44ad', borderBottom: `2px solid ${isDarkMode ? '#ba68c8' : '#8e44ad'}`, paddingBottom: '8px' }}>
                Export (image + prompts)
              </h3>
              <div style={{ backgroundColor: infoBg, padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px', color: textColor }}>Three output files</h4>
                <ol style={{ lineHeight: '1.8', color: textColor, marginLeft: '20px', fontSize: '14px' }}>
                  <li><strong>layout.png/jpg</strong>: layout with panels and bubbles</li>
                  <li><strong>prompts.txt</strong>: English image prompts per panel</li>
                  <li><strong>project.json</strong>: backup of project data</li>
                </ol>
              </div>

              <div style={{ backgroundColor: isDarkMode ? '#2a4a2a' : '#e8f5e9', padding: '16px', borderRadius: '8px', border: `2px solid ${isDarkMode ? '#66bb6a' : '#4caf50'}` }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px', color: isDarkMode ? '#66bb6a' : '#2e7d32' }}>Using prompts.txt</h4>
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: textColor }}>
                  <p style={{ marginBottom: '12px' }}>Copy each panel’s <strong>action prompt</strong> into your generator:</p>
                  <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
                    <li><strong>Ollama (Flux)</strong>: “Flux preview” in the app, or <code style={{ fontSize: '12px' }}>ollama run</code></li>
                    <li><strong>Stable Diffusion WebUI</strong>: paste into the prompt field</li>
                    <li><strong>Midjourney</strong>: after /imagine</li>
                  </ul>
                  <div style={{ backgroundColor: tipBg, padding: '12px', borderRadius: '6px', fontSize: '13px' }}>
                    <strong>Hint:</strong> Prompts are English by design so they paste cleanly into most tools.
                  </div>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#ffb74d' : '#f39c12', borderBottom: `2px solid ${isDarkMode ? '#ffb74d' : '#f39c12'}`, paddingBottom: '8px' }}>
                Characters
              </h3>
              <div style={{ backgroundColor: infoBg, padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '16px', marginBottom: '12px', color: textColor }}>Registration</h4>
                <ol style={{ lineHeight: '1.8', color: textColor, marginLeft: '20px', fontSize: '14px' }}>
                  <li>Open Characters in the left sidebar</li>
                  <li>Set names for leads (hero, rival, etc.)</li>
                  <li>The model uses those names when generating</li>
                </ol>
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: tipBg, borderRadius: '6px', fontSize: '14px' }}>
                  <strong>Note:</strong> AI generation places dialogue and panel content automatically; you usually do not need to place character sprites by hand.
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#4dd0e1' : '#16a085', borderBottom: `2px solid ${isDarkMode ? '#4dd0e1' : '#16a085'}`, paddingBottom: '8px' }}>
                Speech bubbles
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: isDarkMode ? '#4dd0e1' : '#16a085' }}>Controls</h4>
                  <ul style={{ fontSize: '14px', lineHeight: '1.6', color: textColor }}>
                    <li>Add: double-click a panel</li>
                    <li>Edit: double-click the bubble</li>
                    <li>Commit: Ctrl + Enter</li>
                    <li>Cancel: Esc</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: isDarkMode ? '#4dd0e1' : '#16a085' }}>Types</h4>
                  <ul style={{ fontSize: '14px', lineHeight: '1.6', color: textColor }}>
                    <li>Normal: standard tail</li>
                    <li>Thought: cloud</li>
                    <li>Shout: jagged</li>
                    <li>Whisper: dashed</li>
                  </ul>
                </div>
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#e57373' : '#c0392b', borderBottom: `2px solid ${isDarkMode ? '#e57373' : '#c0392b'}`, paddingBottom: '8px' }}>
                Shortcuts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { key: 'Ctrl + Z', desc: 'Undo' },
                  { key: 'Ctrl + Y', desc: 'Redo' },
                  { key: 'Delete', desc: 'Delete' },
                  { key: 'Ctrl + Enter', desc: 'Commit edit' },
                  { key: 'Esc', desc: 'Cancel' },
                  { key: 'Double-click', desc: 'Edit bubble' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '10px', backgroundColor: cardBg, borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: textColor, marginBottom: '4px' }}>{item.key}</div>
                    <div style={{ fontSize: '12px', color: isDarkMode ? '#aaa' : '#666' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: isDarkMode ? '#9575cd' : '#8e44ad', borderBottom: `2px solid ${isDarkMode ? '#9575cd' : '#8e44ad'}`, paddingBottom: '8px' }}>
                FAQ
              </h3>
              {[
                { q: 'AI output is weak', a: 'Add more concrete beats per panel. Use the same registered names you set in Characters.' },
                { q: 'I want to move or resize a bubble', a: 'Select it — handles appear at the corners. Drag to move or resize.' },
                { q: 'My project disappeared', a: 'Data lives in this browser’s storage. Open Project manager from the toolbar on the same browser.' },
                { q: 'I want to change one panel', a: 'Use single-panel generation for that panel only, or double-click a bubble to edit text.' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <strong style={{ color: isDarkMode ? '#9575cd' : '#8e44ad', fontSize: '14px' }}>Q: {item.q}</strong>
                  <p style={{ marginTop: '6px', marginBottom: '0', color: textColor, marginLeft: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                    A: {item.a}
                  </p>
                </div>
              ))}
            </section>

          </div>
        </div>

        <div
          style={{
            padding: '16px 24px',
            borderTop: `2px solid ${sectionBorder}`,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: headerBg,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
