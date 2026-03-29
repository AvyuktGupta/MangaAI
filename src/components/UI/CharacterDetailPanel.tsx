// src/components/UI/CharacterDetailPanel.tsx - 8Fully compatible with categories (in order of popularity)
import React, { useEffect, useState } from "react";
import { Character } from "../../types";

// 
declare global {
  interface Window {
    DEFAULT_SFW_DICT: {
      SFW: {
        expressions: Array<{ tag: string; label: string }>;
        pose_manga: Array<{ tag: string; label: string }>;
        gaze: Array<{ tag: string; label: string }>;
        eye_state: Array<{ tag: string; label: string }>;
        mouth_state: Array<{ tag: string; label: string }>;
        hand_gesture: Array<{ tag: string; label: string }>;
        emotion_primary: Array<{ tag: string; label: string }>;
        physical_state: Array<{ tag: string; label: string }>;
      };
    };
  }
}

interface CharacterDetailPanelProps {
  selectedCharacter: Character | null;
  onCharacterUpdate: (character: Character) => void;
  onCharacterDelete?: (character: Character) => void;
  onClose?: () => void;
  characterNames?: Record<string, string>;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  options: Array<{ tag: string; label: string }>;
  onChange: (value: string) => void;
  placeholder: string;
  isDarkMode: boolean;
  icon?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  isDarkMode,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  // 🆕 
  const getPopularTagsByCategory = (cat: string): string[] => {
    const popularTagsMap: Record<string, string[]> = {
      expressions: ['smiling', 'happy', 'neutral_expression', 'surprised', 'sad', 'angry'],
      poses: ['standing', 'sitting', 'pointing', 'waving', 'arms_crossed', 'hands_on_hips'],
      gazes: ['at_viewer', 'to_side', 'looking_back', 'away', 'down', 'up'],
      eyeStates: ['eyes_open', 'eyes_closed', 'wink_left', 'wink_right', 'wide_eyes'],
      mouthStates: ['mouth_closed', 'slight_smile', 'open_mouth', 'grin', 'frown'],
      handGestures: ['peace_sign', 'pointing', 'waving', 'thumbs_up', 'open_palm'],
      emotionsPrimary: ['joy', 'surprise', 'love', 'anger', 'sadness', 'fear'],
      physicalStates: ['healthy', 'energetic', 'tired', 'sleepy', 'sweating'],
      general: ['smiling', 'at_viewer', 'peace_sign', 'pointing', 'waving', 'standing']
    };
    return popularTagsMap[cat] || popularTagsMap.general;
  };

  // 🆕 Sort by popularity and recommendation (category-compatible version)
  useEffect(() => {
    console.log(`🔍  - : ${label}, : "${searchTerm}"`);
    
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // 
    let category = 'general';
    if (label.includes('')) category = 'expressions';
    else if (label.includes('') || label.includes('')) category = 'poses';
    else if (label.includes('') || label.includes('')) category = 'gazes';
    else if (label.includes('')) category = 'eyeStates';
    else if (label.includes('')) category = 'mouthStates';
    else if (label.includes('')) category = 'handGestures';
    else if (label.includes('')) category = 'emotionsPrimary';
    else if (label.includes('') || label.includes('')) category = 'physicalStates';
    
    const popularTags = getPopularTagsByCategory(category);
    console.log(`⭐ ${category}:`, popularTags);
    
    // 
    const sortedFiltered = filtered.sort((a, b) => {
      const aIndex = popularTags.indexOf(a.tag);
      const bIndex = popularTags.indexOf(b.tag);
      
      // 
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // Popular tags above if one is a popular tag
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      // If both are not popular tags, sort by Japanese label
      return a.label.localeCompare(b.label, 'ja');
    });
    
    console.log(`✅ : 3`, sortedFiltered.slice(0, 3).map(o => `${o.tag}(${o.label})`));
    
    setFilteredOptions(sortedFiltered);
  }, [searchTerm, options, label]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getCurrentLabel = () => {
    const isUnselected = !value || value.trim() === '' || 
      ['', '', '', 'none', 'null', 'undefined', 
       'default', 'normal', 'front', 'basic'].includes(value.toLowerCase());
    
    if (isUnselected) {
      return placeholder;
    }
    
    const current = options.find(opt => opt.tag === value);
    return current ? `${current.tag} (${current.label})` : value;
  };

  const containerStyle = {
    position: 'relative' as const,
    marginBottom: '8px',
  };

  const selectButtonStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${isDarkMode ? "#555" : "#ccc"}`,
    background: isDarkMode ? "#3d3d3d" : "white",
    color: isDarkMode ? "#fff" : "#333",
    fontSize: '12px',
    textAlign: 'left' as const,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const dropdownStyle = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    background: isDarkMode ? "#2d2d2d" : "white",
    border: `1px solid ${isDarkMode ? "#555" : "#ccc"}`,
    borderRadius: '6px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  };

  const searchInputStyle = {
    width: '100%',
    padding: '8px',
    border: 'none',
    borderBottom: `1px solid ${isDarkMode ? "#555" : "#ccc"}`,
    background: 'transparent',
    color: isDarkMode ? "#fff" : "#333",
    fontSize: '12px',
    outline: 'none',
  };

  const optionStyle = (isHovered: boolean) => ({
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    background: isHovered ? (isDarkMode ? "#4d4d4d" : "#f0f0f0") : 'transparent',
    color: isDarkMode ? "#fff" : "#333",
  });

  const unselectedOptionStyle = (isHovered: boolean) => ({
    ...optionStyle(isHovered),
    borderBottom: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
    fontStyle: 'italic' as const,
    color: isDarkMode ? "#888" : "#666",
  });

  // 🔧 Added search box key event handling
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop propagating events (prevents key handlers for parent components)
    e.stopPropagation();
    
    // Escape
    if (e.key === 'Escape') {
      setSearchTerm('');
      e.preventDefault();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={containerStyle}>
      <button
        style={selectButtonStyle}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {icon && <span>{icon}</span>}
          {getCurrentLabel()}
        </span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <input
            type="text"
            placeholder={`${label}...`}
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}  // 🔧 
            style={searchInputStyle}
            autoFocus
          />
          <div>
            {/* Stick unselected options to the top */}
            <div
              style={unselectedOptionStyle(false)}
              onClick={() => handleSelect('')}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = isDarkMode ? "#444" : "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {icon && <span>{icon}</span>}
                
              </div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}></div>
            </div>
            
            {/* 🆕 20 */}
            {filteredOptions.slice(0, 20).map((option) => {
              // 
              let popularTags: string[] = [];
              if (label.includes('')) {
                popularTags = ['smiling', 'happy', 'surprised', 'angry_look', 'blushing', 'sad'];
              } else if (label.includes('') || label.includes('')) {  // 🔧 
                popularTags = ['standing', 'sitting', 'walking', 'running', 'arms_crossed', 'hands_on_hips'];
              } else if (label.includes('') || label.includes('')) {  // 🔧 
                popularTags = ['at_viewer', 'to_side', 'away', 'down', 'up', 'looking_back'];
              } else if (label.includes('')) {  // 🔧 
                popularTags = ['eyes_open', 'eyes_closed', 'eyes_half_closed', 'wink_left', 'wink_right'];
              } else if (label.includes('')) {
                popularTags = ['open_mouth', 'mouth_closed', 'slight_smile', 'grin', 'tongue_out_small', 'pouting_mouth'];
              } else if (label.includes('')) {
                popularTags = ['peace_sign', 'pointing', 'waving', 'thumbs_up', 'arms_crossed', 'hands_on_hips'];
              } else if (label.includes('')) {
                popularTags = ['joy', 'surprise', 'anger', 'sadness', 'embarrassment', 'calm'];
              } else if (label.includes('') || label.includes('')) {
                popularTags = ['healthy', 'energetic', 'tired', 'sleepy', 'sweating', 'sick'];
              } else {
                popularTags = ['smiling', 'peace_sign', 'open_mouth', 'joy', 'healthy'];
              }
              const isPopular = popularTags.includes(option.tag);
              
              return (
                <div
                  key={option.tag}
                  style={optionStyle(false)}
                  onClick={() => handleSelect(option.tag)}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = isDarkMode ? "#4d4d4d" : "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {icon && <span>{icon}</span>}
                    {isPopular && <span style={{ color: '#ff9800' }}>⭐</span>}
                    {option.label}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>{option.tag}</div>
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', opacity: 0.5 }}>
                No results found
              </div>
            )}
            {filteredOptions.length > 20 && (
              <div style={{ padding: '8px', textAlign: 'center', fontSize: '11px', opacity: 0.7 }}>
                ...⭐
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CharacterDetailPanel: React.FC<CharacterDetailPanelProps> = ({
  selectedCharacter,
  onCharacterUpdate,
  onCharacterDelete,
  onClose,
  characterNames = {}
}) => {
  const [dictData, setDictData] = useState<{
    expressions: Array<{ tag: string; label: string }>;
    poses: Array<{ tag: string; label: string }>;
    gazes: Array<{ tag: string; label: string }>;
    eyeStates: Array<{ tag: string; label: string }>;
    mouthStates: Array<{ tag: string; label: string }>;
    handGestures: Array<{ tag: string; label: string }>;
    emotionsPrimary: Array<{ tag: string; label: string }>;
    physicalStates: Array<{ tag: string; label: string }>;
  }>({
    expressions: [],
    poses: [],
    gazes: [],
    eyeStates: [],
    mouthStates: [],
    handGestures: [],
    emotionsPrimary: [],
    physicalStates: []
  });

  // 🔧 8Loading category-aware dictionary data
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DEFAULT_SFW_DICT) {
      const dict = window.DEFAULT_SFW_DICT.SFW;
      const loadedData = {
        expressions: dict.expressions || [],
        poses: dict.pose_manga || [],
        gazes: dict.gaze || [],
        eyeStates: dict.eye_state || [],
        mouthStates: dict.mouth_state || [],
        handGestures: dict.hand_gesture || [],
        emotionsPrimary: dict.emotion_primary || [],
        physicalStates: dict.physical_state || []
      };
      
      // 🔍 : 
      console.log('🎭 :', {
        expressions: loadedData.expressions.length,
        poses: loadedData.poses.length,
        gazes: loadedData.gazes.length,
        eyeStates: loadedData.eyeStates.length,
        mouthStates: loadedData.mouthStates.length,
        handGestures: loadedData.handGestures.length,
        emotionsPrimary: loadedData.emotionsPrimary.length,
        physicalStates: loadedData.physicalStates.length
      });
      
      setDictData(loadedData);
    } else {
      // 🆕 8Category-aware fallback dictionary
      setDictData({
        expressions: [
          { tag: "neutral_expression", label: "" },
          { tag: "smiling", label: "" },
          { tag: "happy", label: "" },
          { tag: "sad", label: "" },
          { tag: "angry", label: "" },
          { tag: "surprised", label: "" },
          { tag: "embarrassed", label: "" },
          { tag: "serious", label: "" },
          { tag: "worried", label: "" },
          { tag: "confused", label: "" }
        ],
        poses: [
          { tag: "standing", label: "" },
          { tag: "sitting", label: "" },
          { tag: "walking", label: "" },
          { tag: "running", label: "" },
          { tag: "arms_crossed", label: "" },
          { tag: "hands_on_hips", label: "" },
          { tag: "pointing", label: "" },
          { tag: "waving", label: "" },
          { tag: "leaning", label: "" },
          { tag: "kneeling", label: "" }
        ],
        gazes: [
          { tag: "at_viewer", label: "" },
          { tag: "to_side", label: "" },
          { tag: "away", label: "" },
          { tag: "down", label: "" },
          { tag: "up", label: "" },
          { tag: "looking_back", label: "" },
          { tag: "sideways_glance", label: "" },
          { tag: "distant_gaze", label: "" }
        ],
        eyeStates: [
          { tag: "eyes_open", label: "" },
          { tag: "eyes_closed", label: "" },
          { tag: "wink_left", label: "" },
          { tag: "wink_right", label: "" },
          { tag: "half_closed_eyes", label: "" },
          { tag: "wide_eyes", label: "" },
          { tag: "sleepy_eyes", label: "" },
          { tag: "sparkling_eyes", label: "" }
        ],
        mouthStates: [
          { tag: "mouth_closed", label: "" },
          { tag: "open_mouth", label: "" },
          { tag: "slight_smile", label: "" },
          { tag: "grin", label: "" },
          { tag: "frown", label: "" },
          { tag: "pouting", label: "" },
          { tag: "lips_pursed", label: "" },
          { tag: "tongue_out", label: "" }
        ],
        handGestures: [
          { tag: "peace_sign", label: "" },
          { tag: "pointing", label: "" },
          { tag: "waving", label: "" },
          { tag: "thumbs_up", label: "" },
          { tag: "clenched_fist", label: "" },
          { tag: "open_palm", label: "" },
          { tag: "covering_mouth", label: "" },
          { tag: "hands_clasped", label: "" }
        ],
        emotionsPrimary: [
          { tag: "joy", label: "" },
          { tag: "anger", label: "" },
          { tag: "sadness", label: "" },
          { tag: "fear", label: "" },
          { tag: "surprise", label: "" },
          { tag: "disgust", label: "" },
          { tag: "contempt", label: "" },
          { tag: "love", label: "" },
          { tag: "anticipation", label: "" },
          { tag: "trust", label: "" }
        ],
        physicalStates: [
          { tag: "healthy", label: "" },
          { tag: "tired", label: "" },
          { tag: "sick", label: "" },
          { tag: "energetic", label: "" },
          { tag: "exhausted", label: "" },
          { tag: "sleepy", label: "" },
          { tag: "dizzy", label: "" },
          { tag: "injured", label: "" },
          { tag: "sweating", label: "" },
          { tag: "trembling", label: "" }
        ]
      });
    }
  }, []);

  if (!selectedCharacter) return null;

  const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";

  const getCharacterDisplayName = (character: Character) => {
    return characterNames[character.type] || character.name || '';
  };

  const displayName = getCharacterDisplayName(selectedCharacter);

  const handleUpdate = (updates: Partial<Character>) => {
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).map(([key, value]) => [
        key,
        typeof value === 'string' && value.trim() === '' ? undefined : value
      ])
    );
    
    onCharacterUpdate({ ...selectedCharacter, ...cleanedUpdates });
  };

  const handleDelete = () => {
    if (window.confirm(`${displayName}`)) {
      if (onCharacterDelete) {
        onCharacterDelete(selectedCharacter);
      }
    }
  };

  const getDisplayValue = (value: any): string => {
    if (!value || value.toString().trim() === '') return '';
    
    const unselectedValues = ['', '', '', 'none', 'null', 'undefined', 'default', 'normal', 'front', 'basic'];
    if (unselectedValues.includes(value.toString().toLowerCase())) {
      return '';
    }
    
    return value.toString();
  };

  // 🆕 8
  const calculateCompletionRate = (): { count: number; total: number; percentage: number } => {
    const settings = [
      selectedCharacter.expression,
      selectedCharacter.action,
      selectedCharacter.facing,
      (selectedCharacter as any).eyeState,
      (selectedCharacter as any).mouthState,
      (selectedCharacter as any).handGesture,
      (selectedCharacter as any).emotion_primary,
      (selectedCharacter as any).physical_state
    ];
    
    const validSettings = settings.filter(s => 
      s && s.toString().trim() !== '' && 
      !['', 'none', 'null', 'undefined', 'default', 'normal', 'front'].includes(s.toString().toLowerCase())
    ).length;
    
    return {
      count: validSettings,
      total: 8,
      percentage: Math.round((validSettings / 8) * 100)
    };
  };

  // 
  const panelStyle = {
    position: "absolute" as const,
    top: "80px",
    right: "10px",
    background: isDarkMode ? "#2d2d2d" : "white",
    border: `2px solid ${isDarkMode ? "#555555" : "#0066ff"}`,
    borderRadius: "12px",
    padding: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    minWidth: "360px",
    maxWidth: "420px",
    zIndex: 1000,
    color: isDarkMode ? "#ffffff" : "#333333",
    maxHeight: "90vh",
    overflowY: "auto" as const,
  };

  // 🔧 Preventing key events across the panel
  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent propagation of dangerous key events
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') {
      e.stopPropagation();
    }
  };

  const buttonStyle = (isActive: boolean) => ({
    padding: "8px 12px",
    fontSize: "12px",
    border: "2px solid",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "center" as const,
    transition: "all 0.2s ease",
    fontWeight: isActive ? "bold" : "normal",
    minHeight: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    background: isActive 
      ? (isDarkMode ? "#ff8833" : "#0066ff")
      : (isDarkMode ? "#3d3d3d" : "white"),
    borderColor: isActive 
      ? (isDarkMode ? "#ff8833" : "#0066ff")
      : (isDarkMode ? "#666666" : "#cccccc"),
    color: isActive 
      ? "white" 
      : (isDarkMode ? "#ffffff" : "#333333"),
    transform: isActive ? "scale(1.02)" : "scale(1)",
  });

  const sectionStyle = {
    marginBottom: "16px",
    padding: "12px",
    background: isDarkMode ? "#1a1a1a" : "#f8f9fa",
    borderRadius: "8px",
    border: `1px solid ${isDarkMode ? "#444444" : "#e9ecef"}`,
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "bold" as const,
    color: isDarkMode ? "#ffffff" : "#333333",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const completion = calculateCompletionRate();

  return (
    <div style={panelStyle} onKeyDown={handlePanelKeyDown}>
      {/*  */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "16px",
        borderBottom: `2px solid ${isDarkMode ? "#ff8833" : "#0066ff"}`,
        paddingBottom: "8px",
      }}>
        <h4 style={{ 
          margin: "0", 
          color: isDarkMode ? "#ff8833" : "#0066ff",
          fontSize: "16px",
          fontWeight: "bold",
        }}>
          🎭 {displayName}
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: isDarkMode ? "#cccccc" : "#666",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            ✕
          </button>
        )}
      </div>


      {/* 📷 */}
      <div style={sectionStyle}>
        <label style={labelStyle}>📷 </label>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: "6px",
          width: "100%"
        }}>
          {[
            { value: "face", label: "", emoji: "👤" },
            { value: "close_up_face", label: "", emoji: "🔍" },
            { value: "upper_body", label: "", emoji: "👔" },
            { value: "chest_up", label: "", emoji: "👕" },
            { value: "three_quarters", label: "", emoji: "🦵" },
            { value: "full_body", label: "", emoji: "🧍" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleUpdate({ viewType: option.value as any })}
              style={{
                ...buttonStyle(selectedCharacter.viewType === option.value),
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                padding: "6px 8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🎭 4 */}
      <div style={sectionStyle}>
        <label style={labelStyle}>🎭 </label>
        
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>😊 </label>
          <SearchableSelect
            label=""
            value={selectedCharacter.expression || ''}
            options={dictData.expressions}
            onChange={(value) => handleUpdate({ expression: value })}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="👀"
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>🤸 </label>
          <SearchableSelect
            label=""
            value={selectedCharacter.action || ''}
            options={dictData.poses}
            onChange={(value) => handleUpdate({ action: value })}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="🤸"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>👁️ </label>
          <SearchableSelect
            label=""
            value={selectedCharacter.facing || ''}
            options={dictData.gazes}
            onChange={(value) => handleUpdate({ facing: value })}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="👁️"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>👀 </label>
          <SearchableSelect
            label=""
            value={(selectedCharacter as any).eyeState || ''}
            options={dictData.eyeStates}
            onChange={(value) => handleUpdate({ eyeState: value } as any)}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="👀"
          />
        </div>
      </div>

      {/* 🆕 4 */}
      <div style={sectionStyle}>
        <label style={labelStyle}>🆕 </label>
        
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>👄 </label>
          <SearchableSelect
            label=""
            value={(selectedCharacter as any).mouthState || ''}
            options={dictData.mouthStates}
            onChange={(value) => handleUpdate({ mouthState: value } as any)}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="👄"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>✋ </label>
          <SearchableSelect
            label=""
            value={(selectedCharacter as any).handGesture || ''}
            options={dictData.handGestures}
            onChange={(value) => handleUpdate({ handGesture: value } as any)}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="✋"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>💗 </label>
          <SearchableSelect
            label=""
            value={(selectedCharacter as any).emotion_primary || ''}
            options={dictData.emotionsPrimary}
            onChange={(value) => handleUpdate({ emotion_primary: value } as any)}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="💗"
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '11px', marginBottom: '4px', display: 'block' }}>🏃 </label>
          <SearchableSelect
            label=""
            value={(selectedCharacter as any).physical_state || ''}
            options={dictData.physicalStates}
            onChange={(value) => handleUpdate({ physical_state: value } as any)}
            placeholder=""
            isDarkMode={isDarkMode}
            icon="🏃"
          />
        </div>
      </div>

      {/* 📏  */}
      <div style={sectionStyle}>
        <label style={labelStyle}>📏 : {selectedCharacter.scale.toFixed(1)}</label>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.1"
          value={selectedCharacter.scale}
          onChange={(e) => handleUpdate({ scale: parseFloat(e.target.value) })}
          style={{
            width: "100%",
            height: "4px",
            background: isDarkMode ? "#3d3d3d" : "#e9ecef",
            borderRadius: "2px",
            outline: "none",
            cursor: "pointer",
          }}
        />
        <div style={{ 
          fontSize: "10px", 
          color: isDarkMode ? "#888" : "#666", 
          textAlign: "center",
          marginTop: "4px",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>0.5</span>
          <span></span>
          <span>3.0</span>
        </div>
      </div>

      {/* 📋  */}
      <div style={{
        ...sectionStyle,
        background: isDarkMode ? "#0d1117" : "#f0f8ff",
        border: `1px solid ${isDarkMode ? "#30363d" : "#b6e3ff"}`,
      }}>
        <label style={labelStyle}>📋 </label>
        
        {/*  */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ 
            fontSize: "11px", 
            fontWeight: "600", 
            color: isDarkMode ? "#f0f6fc" : "#24292f",
            marginBottom: "6px"
          }}>
            👤 
          </div>
          <div style={{ fontSize: "10px", color: isDarkMode ? "#8b949e" : "#666" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div>: {selectedCharacter.name}</div>
              <div>: {selectedCharacter.characterId === 'protagonist' ? '' : 
                           selectedCharacter.characterId === 'heroine' ? '' :
                           selectedCharacter.characterId === 'friend' ? '' : ''}</div>
              <div>: {selectedCharacter.characterId === 'protagonist' ? '' : 
                         selectedCharacter.characterId === 'heroine' ? '' : ''}</div>
              <div>: {getDisplayValue((selectedCharacter as any).hairColor) || ''}</div>
            </div>
          </div>
        </div>

        {/* 8 */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ 
            fontSize: "11px", 
            fontWeight: "600", 
            color: isDarkMode ? "#f0f6fc" : "#24292f",
            marginBottom: "6px"
          }}>
            🎭 8
          </div>
          <div style={{ fontSize: "10px", color: isDarkMode ? "#8b949e" : "#666" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue(selectedCharacter.expression)} 
                {selectedCharacter.expression ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue(selectedCharacter.action)}
                {selectedCharacter.action ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue(selectedCharacter.facing)}
                {selectedCharacter.facing ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue((selectedCharacter as any).eyeState)}
                {(selectedCharacter as any).eyeState ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue((selectedCharacter as any).mouthState)}
                {(selectedCharacter as any).mouthState ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue((selectedCharacter as any).handGesture)}
                {(selectedCharacter as any).handGesture ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue((selectedCharacter as any).emotion_primary)}
                {(selectedCharacter as any).emotion_primary ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                : {getDisplayValue((selectedCharacter as any).physical_state)}
                {(selectedCharacter as any).physical_state ? <span style={{ color: '#22c55e' }}>✓</span> : <span style={{ color: '#ef4444' }}>❌</span>}
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div>
          <div style={{ 
            fontSize: "11px", 
            fontWeight: "600", 
            color: isDarkMode ? "#f0f6fc" : "#24292f",
            marginBottom: "6px"
          }}>
            📐 
          </div>
          <div style={{ fontSize: "10px", color: isDarkMode ? "#8b949e" : "#666" }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div>: {selectedCharacter.viewType === "face" ? "" : 
                               selectedCharacter.viewType === "close_up_face" ? "" :
                               selectedCharacter.viewType === "upper_body" ? "" :
                               selectedCharacter.viewType === "chest_up" ? "" :
                               selectedCharacter.viewType === "three_quarters" ? "" :
                               selectedCharacter.viewType === "full_body" ? "" : ""}</div>
              <div>: ({Math.round(selectedCharacter.x || 0)}, {Math.round(selectedCharacter.y || 0)})</div>
              <div>: {Math.round(selectedCharacter.width || 0)}×{Math.round(selectedCharacter.height || 0)}px</div>
              <div>: {selectedCharacter.rotation ? `${Math.round(selectedCharacter.rotation)}°` : '0°'}</div>
            </div>
          </div>
        </div>
      </div>


      {/* 🆕  */}
      <div style={sectionStyle}>
        <label style={labelStyle}>📊 </label>
        <div style={{ fontSize: "10px", color: isDarkMode ? "#8b949e" : "#666" }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
            <div>😊 </div>
            <div style={{ color: (selectedCharacter.expression || (selectedCharacter as any).emotion_primary) ? "#22c55e" : "#ef4444" }}>
              {(selectedCharacter.expression || (selectedCharacter as any).emotion_primary) ? "✅" : "❌"}
            </div>
            
            <div>🤸 </div>
            <div style={{ color: (selectedCharacter.action || (selectedCharacter as any).handGesture) ? "#22c55e" : "#ef4444" }}>
              {(selectedCharacter.action || (selectedCharacter as any).handGesture) ? "✅" : "❌"}
            </div>
            
            <div>👀 </div>
            <div style={{ color: (selectedCharacter.facing || (selectedCharacter as any).eyeState || (selectedCharacter as any).mouthState) ? "#22c55e" : "#ef4444" }}>
              {(selectedCharacter.facing || (selectedCharacter as any).eyeState || (selectedCharacter as any).mouthState) ? "✅" : "❌"}
            </div>
            
            <div>🏃 </div>
            <div style={{ color: (selectedCharacter as any).physical_state ? "#22c55e" : "#ef4444" }}>
              {(selectedCharacter as any).physical_state ? "✅" : "❌"}
            </div>
          </div>
        </div>
      </div>


      {/* 🗑️  */}
      {onCharacterDelete && (
        <div style={{ 
          borderTop: `1px solid ${isDarkMode ? "#555" : "#eee"}`, 
          paddingTop: "12px",
        }}>
          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              padding: "8px",
              background: "#ff4444",
              color: "white",
              border: "2px solid #ff2222",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            🗑️ 
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterDetailPanel;