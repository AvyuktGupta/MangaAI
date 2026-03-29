// src/components/CanvasArea/EditBubbleModal.tsx - 
import React from "react";
import { SpeechBubble } from "../../types";

interface EditBubbleModalProps {
  editingBubble: SpeechBubble | null;
  editText: string;
  setEditText: (text: string) => void;
  onComplete: () => void;
  onCancel: () => void;
  onUpdateBubble?: (bubble: SpeechBubble) => void;
}

const EditBubbleModal: React.FC<EditBubbleModalProps> = ({
  editingBubble,
  editText,
  setEditText,
  onComplete,
  onCancel,
  onUpdateBubble,
}) => {
  if (!editingBubble) return null;

  const handleVerticalToggle = () => {
    if (onUpdateBubble) {
      onUpdateBubble({
        ...editingBubble,
        vertical: !editingBubble.vertical
      });
    }
  };

  const handleFontSizeChange = (size: number) => {
    if (onUpdateBubble) {
      onUpdateBubble({
        ...editingBubble,
        fontSize: size
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Do not propagate key events globally within the edit modal
    e.stopPropagation();
    
    if (e.key === "Enter" && e.ctrlKey) {
      // Ctrl+Enter
      e.preventDefault();
      onComplete();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
    // Backspace keys are processed as normal text editing (do nothing)
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        border: "2px solid #333",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 1000,
        minWidth: "300px",
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div style={{ marginBottom: "15px", fontWeight: "bold", fontSize: "16px" }}>
        💬 
      </div>

      {/* / */}
      <div style={{ 
        marginBottom: "12px",
        display: "flex",
        gap: "8px",
        alignItems: "center"
      }}>
        <button
          onClick={handleVerticalToggle}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: editingBubble.vertical ? "#007bff" : "white",
            color: editingBubble.vertical ? "white" : "#333",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {editingBubble.vertical ? "📖 " : "📄 "}
        </button>
        <span style={{ fontSize: "11px", color: "#666" }}>
          {editingBubble.vertical ? "→" : "→"}
        </span>
      </div>

      {/*  */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "6px" }}>
          📏 : {editingBubble.fontSize || 32}px
        </label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="range"
            min="16"
            max="72"
            value={editingBubble.fontSize || 32}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <div style={{ display: "flex", gap: "4px" }}>
            {[20, 32, 48].map(size => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                style={{
                  padding: "4px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: (editingBubble.fontSize || 32) === size ? "#007bff" : "white",
                  color: (editingBubble.fontSize || 32) === size ? "white" : "#333",
                  cursor: "pointer",
                  fontSize: "11px"
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/*  */}
      <div style={{ marginBottom: "8px", fontSize: "11px", color: "#666", textAlign: "right" }}>
        📝 : {editText.length}
        {editText.length > 50 && (
          <span style={{ color: "#ff6b6b", marginLeft: "8px" }}>
            ⚠️ 
          </span>
        )}
      </div>

      {/*  */}
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="..."
        autoFocus
        style={{
          width: "100%",
          height: "120px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          resize: "vertical",
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
          minHeight: "80px",
          maxHeight: "200px",
          writingMode: editingBubble.vertical ? "vertical-rl" : "horizontal-tb",
        }}
      />

      {/*  */}
      <div style={{ marginTop: "15px", textAlign: "right" }}>
        <button
          onClick={onCancel}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          
        </button>
        <button
          onClick={onComplete}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          
        </button>
      </div>

      {/*  */}
      <div style={{ 
        marginTop: "10px", 
        fontSize: "12px", 
        color: "#666",
        textAlign: "center",
        borderTop: "1px solid #eee",
        paddingTop: "8px"
      }}>
        💡 Ctrl+Enter:  / Escape: 
      </div>
    </div>
  );
};

export default EditBubbleModal;