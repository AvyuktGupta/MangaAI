// src/components/UI/OllamaSettingsModal.tsx
import React, { useState, useEffect } from 'react';
import { ollamaService } from '../../services/OllamaService';

interface OllamaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const OllamaSettingsModal: React.FC<OllamaSettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode = false,
}) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [chatModel, setChatModel] = useState('');
  const [imageModel, setImageModel] = useState('');
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('ollama_base_url') : null;
      setBaseUrl(saved || '');
      setChatModel(ollamaService.getChatModel());
      setImageModel(ollamaService.getImageModel());
      setTestMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    ollamaService.setBaseUrl(baseUrl);
    ollamaService.setChatModel(chatModel.trim() || 'llama3.2:1b');
    ollamaService.setImageModel(imageModel.trim() || 'flux2-klein:4b');
    alert('Ollama connection settings saved.');
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestMessage(null);
    try {
      ollamaService.setBaseUrl(baseUrl);
      const ok = await ollamaService.ping();
      setTestMessage(
        ok
          ? 'Connection OK (/api/tags).'
          : 'Connection failed. Check that Ollama is running and the URL is correct.'
      );
    } catch (e) {
      setTestMessage(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setTesting(false);
    }
  };

  const defaultsHint =
    process.env.NODE_ENV === 'development'
      ? 'Development: leave URL empty to use the create-react-app proxy (127.0.0.1:11434).'
      : 'Production: enter your Ollama URL (e.g. http://127.0.0.1:11434).';

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
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
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
          minWidth: '480px',
          maxWidth: '90vw',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            marginBottom: '20px',
            fontWeight: 'bold',
            fontSize: '18px',
            color: isDarkMode ? '#fff' : '#333',
          }}
        >
          ⚙️ Ollama connection
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '13px',
              color: isDarkMode ? '#fff' : '#333',
            }}
          >
            Ollama URL (empty = default)
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="e.g. http://127.0.0.1:11434"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
              borderRadius: '6px',
              background: isDarkMode ? '#404040' : 'white',
              color: isDarkMode ? '#fff' : '#333',
              fontSize: '13px',
            }}
          />
          <div
            style={{
              marginTop: '6px',
              fontSize: '11px',
              color: isDarkMode ? '#aaa' : '#666',
            }}
          >
            {defaultsHint}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '13px',
              color: isDarkMode ? '#fff' : '#333',
            }}
          >
            Text model (story / prompt conversion)
          </label>
          <input
            type="text"
            value={chatModel}
            onChange={(e) => setChatModel(e.target.value)}
            placeholder="llama3.2:1b"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
              borderRadius: '6px',
              background: isDarkMode ? '#404040' : 'white',
              color: isDarkMode ? '#fff' : '#333',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontWeight: 'bold',
              fontSize: '13px',
              color: isDarkMode ? '#fff' : '#333',
            }}
          >
            Image model (Flux preview)
          </label>
          <input
            type="text"
            value={imageModel}
            onChange={(e) => setImageModel(e.target.value)}
            placeholder="flux2-klein:4b"
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
              borderRadius: '6px',
              background: isDarkMode ? '#404040' : 'white',
              color: isDarkMode ? '#fff' : '#333',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          />
        </div>

        <div
          style={{
            marginBottom: '16px',
            padding: '12px',
            background: isDarkMode ? '#3d2a2a' : '#fff3cd',
            border: `1px solid ${isDarkMode ? '#665' : '#ffc107'}`,
            borderRadius: '6px',
            fontSize: '11px',
            color: isDarkMode ? '#fbbf24' : '#856404',
          }}
        >
          <strong>Setup:</strong> in a terminal run{' '}
          <code style={{ fontSize: '10px' }}>ollama pull llama3.2:1b</code> and{' '}
          <code style={{ fontSize: '10px' }}>ollama pull flux2-klein:4b</code>. Names may differ by registry (e.g.{' '}
          <code>x/flux2-klein:4b</code>).
        </div>

        {testMessage && (
          <div
            style={{
              marginBottom: '12px',
              fontSize: '12px',
              color: isDarkMode ? '#93c5fd' : '#1d4ed8',
            }}
          >
            {testMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            style={{
              padding: '10px 16px',
              border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
              borderRadius: '6px',
              background: isDarkMode ? '#404040' : '#f3f4f6',
              color: isDarkMode ? '#fff' : '#333',
              cursor: testing ? 'wait' : 'pointer',
              fontSize: '13px',
            }}
          >
            {testing ? 'Testing…' : '🔌 Test connection'}
          </button>

          <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: `1px solid ${isDarkMode ? '#555' : '#ccc'}`,
                borderRadius: '6px',
                background: isDarkMode ? '#404040' : 'white',
                color: isDarkMode ? '#fff' : '#333',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: '#10b981',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
