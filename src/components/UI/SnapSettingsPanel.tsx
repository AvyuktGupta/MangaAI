import React from 'react';
import { SnapSettings } from '../../types';

interface SnapSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  snapSettings: SnapSettings;
  onSnapSettingsUpdate: (settings: SnapSettings) => void;
  isDarkMode?: boolean;
}

const SnapSettingsPanel: React.FC<SnapSettingsPanelProps> = ({
  isOpen,
  onClose,
  snapSettings,
  onSnapSettingsUpdate,
  isDarkMode = true
}) => {
  if (!isOpen) return null;

  const handleToggle = () => {
    onSnapSettingsUpdate({
      ...snapSettings,
      enabled: !snapSettings.enabled
    });
  };

  const handleGridSizeChange = (size: number) => {
    onSnapSettingsUpdate({
      ...snapSettings,
      gridSize: size
    });
  };

  const handleSensitivityChange = (sensitivity: 'weak' | 'medium' | 'strong') => {
    onSnapSettingsUpdate({
      ...snapSettings,
      sensitivity
    });
  };

  const handleGridDisplayChange = (gridDisplay: 'always' | 'edit-only' | 'hidden') => {
    onSnapSettingsUpdate({
      ...snapSettings,
      gridDisplay
    });
  };

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
        className="modal-content snap-settings-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-primary)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto',
          color: 'var(--text-primary)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/*  */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
            ⚙️ 
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/*  */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ON/OFF */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: `2px solid ${snapSettings.enabled ? '#4CAF50' : 'var(--border-color)'}`
          }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                ✅ 
              </h3>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                Align elements to grid
              </p>
            </div>
            <button
              onClick={handleToggle}
              style={{
                background: snapSettings.enabled ? '#4CAF50' : '#666',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {snapSettings.enabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* ON */}
          {snapSettings.enabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/*  */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  📏 
                </label>
                <select 
                  value={snapSettings.gridSize}
                  onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                >
                  <option value={10}>10px - </option>
                  <option value={20}>20px - </option>
                  <option value={40}>40px - </option>
                </select>
              </div>

              {/*  */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  🎯 
                </label>
                <select 
                  value={snapSettings.sensitivity}
                  onChange={(e) => handleSensitivityChange(e.target.value as 'weak' | 'medium' | 'strong')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                >
                  <option value="weak"> - </option>
                  <option value="medium"> - </option>
                  <option value="strong"> - </option>
                </select>
              </div>

              {/*  */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: '600' 
                }}>
                  📐 
                </label>
                <select 
                  value={snapSettings.gridDisplay}
                  onChange={(e) => handleGridDisplayChange(e.target.value as 'always' | 'edit-only' | 'hidden')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                >
                  <option value="always"> - </option>
                  <option value="edit-only"> - </option>
                  <option value="hidden"> - </option>
                </select>
              </div>

              {/*  */}
              <div style={{
                padding: '12px',
                background: 'var(--bg-tertiary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
                  📊 
                </h4>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  <div>: {snapSettings.gridSize}px</div>
                  <div>: {snapSettings.sensitivity === 'weak' ? '' : snapSettings.sensitivity === 'medium' ? '' : ''}</div>
                  <div>: {
                    snapSettings.gridDisplay === 'always' ? '' : 
                    snapSettings.gridDisplay === 'edit-only' ? '' : 
                    ''
                  }</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/*  */}
        <div style={{ 
          marginTop: '24px', 
          paddingTop: '16px', 
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnapSettingsPanel;
