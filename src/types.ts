// src/types.ts - CanvasComponentProps + 

export interface Panel {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  prompt?: string;  // AI Prompt Maker Pro
  note?: string;    // Japanese notes on the frame (composition, movement, scene description)
  importance?: 'normal' | 'important' | 'climax';  // 
  // 🆕 
  characterPrompt?: string;  // AI Prompt Maker Pro
  actionPrompt?: string;     // Operation/Situation Prompt (Ollama / Llama 
  actionPromptJa?: string;   // 
  selectedCharacterId?: string; // IDcharacter_1, character_2
}

export interface Character {
  id: string;
  panelId: number;
  characterId: string;    // 
  
  // 
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale: number;
  rotation?: number;
  isGlobalPosition: boolean;
  
  // 
  name: string;           // 
  type: string;          //   
  expression: string;     // 
  action: string;        // pose
  facing: string;        // gaze/bodyDirection
  viewType: "face" | "upper_body" | "full_body" | "close_up_face" | "chest_up" | "three_quarters";
  eyeState?: string;
  mouthState?: string; 
  handGesture?: string;
  // 🆕 8
  poses?: string;         // 
  gaze?: string;         // 
  emotionPrimary?: string; // 
  physicalState?: string; // 
}

// 
export interface CharacterSettings {
  id: string;
  name: string;
  role: string;
  gender: 'male' | 'female' | 'other';
  basePrompt: string;
}

// 
export interface DictionaryEntry {
  key: string;
  japanese: string;
  english: string;
}

// 
export interface Dictionary {
  expressions: DictionaryEntry[];
  actions: DictionaryEntry[];
  facings: DictionaryEntry[];
}

// 🆕 
export interface CharacterBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface RotationHandle {
  type: "rotation";
  x: number;
  y: number;
  radius: number;
}

export type CharacterInteractionMode = "none" | "move" | "resize" | "rotate";

export interface CharacterInteractionState {
  mode: CharacterInteractionMode;
  resizeDirection?: string;
  rotationStartAngle?: number;
  originalRotation?: number;
}

// EditBubbleModalPropsType definition (serial input related deletion)
export interface EditBubbleModalProps {
  editingBubble: SpeechBubble | null;
  onComplete: () => void;
  onCancel: () => void;
  // 🔧 : editText, setEditText
}

// SpeechBubble
export interface SpeechBubble {
  id: string;
  panelId: number;
  type: string;
  text: string;  // Keep dialogue text (for display)
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
  vertical: boolean;
  isGlobalPosition: boolean;
  fontSize?: number;  // Font size (default if not specified)32
}

// 🆕 Type Definition for Text Drawing Settings (Add New)
export interface BubbleTextSettings {
  fontSize?: number;           // 
  fontFamily?: string;         // 
  lineHeight?: number;         // 
  padding?: number;           // 
  alignment?: 'center' | 'left' | 'right' | 'justify'; // 
  verticalAlignment?: 'top' | 'middle' | 'bottom';     // 
  autoResize?: boolean;        // 
  minFontSize?: number;        // 
  maxFontSize?: number;        // 
  wordWrap?: 'character' | 'word' | 'smart';           // 
}

// 🆕 Text Segmentation Settings
export interface TextSegmentationOptions {
  enableJapaneseSegmentation?: boolean; // 
  respectPunctuation?: boolean;         // 
  preserveSpaces?: boolean;            // 
  breakOnLanguageChange?: boolean;     // 
}

// 🆕 
export interface TextLayoutInfo {
  lines: string[];             // 
  actualFontSize: number;      // 
  totalHeight: number;         // 
  lineHeight: number;          // 
  overflow: boolean;           // 
}

// EditBubbleModal
export interface BubbleEditState {
  isEditing: boolean;
  editingBubbleId: string | null;
  modalPosition?: { x: number; y: number };
}

// src/types.ts - CanvasComponentProps
export interface CanvasComponentProps {
  selectedTemplate: string;
  panels: Panel[];
  setPanels: (panels: Panel[]) => void;
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  speechBubbles: SpeechBubble[];
  setSpeechBubbles: (speechBubbles: SpeechBubble[]) => void;
  
  // 
  backgrounds: BackgroundElement[];
  setBackgrounds: (backgrounds: BackgroundElement[]) => void;
  
  // 
  effects: EffectElement[];
  setEffects: (effects: EffectElement[]) => void;
  selectedEffect?: EffectElement | null;
  onEffectSelect?: (effect: EffectElement | null) => void;
  onEffectRightClick?: (effect: EffectElement) => void;
  showEffectPanel?: boolean;
  onEffectPanelToggle?: () => void;
  
  // 🔧 ?
  tones: ToneElement[];
  setTones: (tones: ToneElement[]) => void;
  selectedTone: ToneElement | null;
  onToneSelect: (tone: ToneElement | null) => void;
  showTonePanel: boolean;
  onTonePanelToggle: () => void;
  
  // 
  onCharacterAdd: (func: (type: string) => void) => void;
  onBubbleAdd: (func: (type: string, text: string) => void) => void;
  onPanelSelect?: (panel: Panel | null) => void;
  onCharacterSelect?: (character: Character | null) => void;
  onCharacterRightClick?: (character: Character) => void;
  isPanelEditMode?: boolean;
  onPanelSplit?: (panelId: number, direction: "horizontal" | "vertical") => void;
  onPanelEditModeToggle?: (enabled: boolean) => void;
  onPanelAdd?: (targetPanelId: string, position: 'above' | 'below' | 'left' | 'right') => void;
  onPanelDelete?: (panelId: string) => void;
  snapSettings?: SnapSettings;
  
  // 🆕 
  swapPanel1?: number | null;
  swapPanel2?: number | null;
  
  // 🆕 
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

// 
export interface Template {
  panels: Panel[];
}

export type Templates = Record<string, Template>;

// 
export interface SceneInfo {
  id: string;
  icon: string;
  name: string;
}

// 
export interface CharacterInfo {
  id: string;
  icon: string;
  name: string;
}

// 
export interface BubbleInfo {
  id: string;
  icon: string;
  name: string;
}

// 
export interface TemplateInfo {
  id: string;
  title: string;
  desc: string;
}

// 
export interface PanelHandle {
  type: "resize" | "move" | "split" | "delete";
  direction?: "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
  x: number;
  y: number;
}

export interface PanelOperation {
  type: "move" | "resize" | "split";
  panelId: number;
  data: any;
}

// 
export interface OperationHistory {
  characters: Character[][];
  speechBubbles: SpeechBubble[][];
  panels: Panel[][];
  currentIndex: number;
}

// 
export interface SnapSettings {
  enabled: boolean;
  gridSize: number;
  sensitivity: 'weak' | 'medium' | 'strong';
  gridDisplay: 'always' | 'edit-only' | 'hidden';
}

// ==========================================
// 
// ==========================================

// src/types.ts - BackgroundElementname

export interface BackgroundElement {
  id: string;
  panelId: number;  // Panel.idnumber
  type: 'solid' | 'gradient' | 'pattern' | 'image';
  name?: string;    // 🔧 Change to optional (maintain compatibility with existing systems)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  
  // 
  solidColor?: string;
  
  // 
  gradientType?: 'linear' | 'radial';
  gradientColors?: string[];
  gradientDirection?: number; // 
  
  // 
  patternType?: 'dots' | 'lines' | 'grid' | 'diagonal' | 'crosshatch';
  patternColor?: string;
  patternSize?: number;
  patternSpacing?: number;
  
  // 
  imageUrl?: string;
  imageMode?: 'fit' | 'fill' | 'stretch' | 'tile';
  imageBrightness?: number;
  imageContrast?: number;
  
  // Background preset name (for integrated templates)
  preset?: string;
  
  // Background template name (for user-friendly display)
  templateName?: string;
}

// 
export interface BackgroundTemplate {
  id: string;
  name: string;
  category: 'nature' | 'indoor' | 'school' | 'city' | 'abstract' | 'emotion';
  thumbnail?: string;
  elements: Omit<BackgroundElement, 'id' | 'panelId'>[];
}

// 
export interface BackgroundManager {
  backgrounds: BackgroundElement[];
  selectedBackground: BackgroundElement | null;
  isDragging: boolean;
  isResizing: boolean;
  resizeDirection: string;
}

// Background Component Properties
export interface BackgroundPanelProps {
  isOpen: boolean;
  onClose: () => void;
  backgrounds: BackgroundElement[];
  setBackgrounds: (backgrounds: BackgroundElement[]) => void;
  selectedPanel: Panel | null;
  onBackgroundAdd: (template: BackgroundTemplate) => void;
}

// 
export interface BackgroundRendererProps {
  backgrounds: BackgroundElement[];
  panelId: number;
  panelBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  ctx: CanvasRenderingContext2D;
  isSelected?: boolean;
  selectedBackground?: BackgroundElement | null;
}

// 
export interface BackgroundHandle {
  type: "move" | "resize" | "rotate";
  direction?: "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
  x: number;
  y: number;
  radius?: number;
}

// ==========================================
// Effect line function type definition (add new)
// ==========================================

// 
export type EffectType = 'speed' | 'focus' | 'explosion' | 'flash';

// 
export type EffectDirection = 'horizontal' | 'vertical' | 'radial' | 'custom';

// 
export interface EffectElement {
  id: string;
  panelId: number;  // Panel.id
  type: EffectType;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: EffectDirection;
  intensity: number;        //  (0.1-1.0)
  density: number;          //  (0.1-1.0)
  length: number;           //  (0.1-1.0)
  angle: number;            //  (0-360)
  color: string;            // 
  opacity: number;          //  (0-1)
  blur: number;             //  (0-10)
  centerX?: number;         // X (radial)
  centerY?: number;         // Y (radial)
  selected: boolean;        // 
  zIndex: number;           // 
  isGlobalPosition: boolean; // 
}

// 
export interface EffectTemplate {
  id: string;
  name: string;
  type: EffectType;
  direction: EffectDirection;
  intensity: number;
  density: number;
  length: number;
  angle: number;
  color: string;
  opacity: number;
  blur: number;
  description: string;
  category: 'action' | 'emotion' | 'environment' | 'special';
}

// 
export interface EffectPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEffect: (effect: EffectElement) => void;
  selectedEffect: EffectElement | null;
  onUpdateEffect: (effect: EffectElement) => void;
  isDarkMode: boolean;
}

// Effect Line Renderer Properties
export interface EffectRendererProps {
  effects: EffectElement[];
  canvasScale: number;
}

// 
export interface EffectHandle {
  type: "move" | "resize" | "rotate";
  direction?: "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
  x: number;
  y: number;
  radius?: number;
}

// ==========================================
// Tone System Type Definition (Add New)
// ==========================================

// 
export type ToneType = 'halftone' | 'gradient' | 'crosshatch' | 'dots' | 'lines' | 'noise';

// 
export type TonePattern = 
  // 
  | 'dots_60' | 'dots_85' | 'dots_100' | 'dots_120' | 'dots_150'
  // 
  | 'lines_horizontal' | 'lines_vertical' | 'lines_diagonal' | 'lines_cross'
  // 
  | 'gradient_linear' | 'gradient_radial' | 'gradient_diamond'
  // 
  | 'noise_fine' | 'noise_coarse' | 'noise_grain'
  // 
  | 'speed_lines' | 'focus_lines' | 'explosion';

// 
export type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' 
  | 'hard-light' | 'darken' | 'lighten' | 'difference' | 'exclusion';

// ToneElement - 
// ToneElementAdd the following properties to the interface

export interface ToneElement {
  id: string;
  panelId: number;  // Panel.id
  type: ToneType;
  pattern: TonePattern;
  x: number;        //  (0-1)
  y: number;        //  (0-1)
  width: number;    //  (0-1)
  height: number;   //  (0-1)
  
  // 
  density: number;          //  (0-1)
  opacity: number;          //  (0-1)
  rotation: number;         //  (0-360)
  scale: number;            //  (0.1-3.0)
  
  // 🆕 Add properties to be used in drawings
  color?: string;           // : '#000000'
  intensity?: number;       // : 0.5
  angle?: number;          // : 0
  direction?: 'horizontal' | 'vertical' | 'radial';  // : 'vertical'
  
  // 
  blendMode: BlendMode;     // 
  contrast: number;         //  (0-2)
  brightness: number;       //  (-1 to 1)
  invert: boolean;          // 
  
  // 
  maskEnabled: boolean;     // 
  maskShape: 'rectangle' | 'ellipse' | 'custom'; // 
  maskFeather: number;      //  (0-20)
  
  // 
  selected: boolean;        // 
  zIndex: number;           // 
  isGlobalPosition: boolean; // 
  visible: boolean;         // 
}

// 
export interface ToneTemplate {
  id: string;
  name: string;
  type: ToneType;
  pattern: TonePattern;
  density: number;
  opacity: number;
  rotation: number;
  scale: number;
  blendMode: BlendMode;
  contrast: number;
  brightness: number;
  description: string;
  category: 'shadow' | 'highlight' | 'texture' | 'background' | 'effect' | 'mood';
  thumbnail?: string;       // 
  preview: {                // 
    backgroundColor: string;
    showPattern: boolean;
  };
}

// 
export interface TonePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTone: (tone: ToneElement) => void;
  selectedTone: ToneElement | null;
  onUpdateTone: (tone: ToneElement) => void;
  isDarkMode: boolean;
  selectedPanel: Panel | null;
  tones: ToneElement[];
}

// Tone Renderer Properties
export interface ToneRendererProps {
  tones: ToneElement[];
  canvasScale: number;
}

// 
export interface ToneHandle {
  type: "move" | "resize" | "rotate" | "mask";
  direction?: "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
  x: number;
  y: number;
  radius?: number;
}

// Canvas
export type CanvasElementType = 'panel' | 'character' | 'bubble' | 'background' | 'effect' | 'tone';

// Canvas
export type CanvasElement = Panel | Character | SpeechBubble | BackgroundElement | EffectElement | ToneElement;

// 🆕 Character Appearance Settings Type Definition (Add New)
/*export interface CharacterAppearance {
  gender: 'male' | 'female' | 'other';
  hairColor: 'black' | 'brown' | 'blonde' | 'red' | 'blue' | 'green' | 'white' | 'silver';
  hairStyle: 'short' | 'medium' | 'long' | 'ponytail' | 'twintails' | 'bun';
  eyeColor: 'brown' | 'blue' | 'green' | 'gray' | 'black' | 'red' | 'purple';
  skinTone: 'light' | 'medium' | 'dark' | 'tan';
  clothing: 'school' | 'casual' | 'formal' | 'sports' | 'traditional' | 'fantasy';
  clothingColor: 'blue' | 'red' | 'green' | 'black' | 'white' | 'pink' | 'purple';
  accessories: string;
} */

// types.ts Type definition to add to (append to end of existing file)

// ==========================================
// Type definitions for page management systems (new)
// ==========================================

// 
export interface Page {
  id: string;
  title: string;
  note?: string;  // Full page notes (configuration, deployment, intent, etc.)
  createdAt: string;
  updatedAt: string;
  panels: Panel[];
  characters: Character[];
  bubbles: SpeechBubble[];
  backgrounds: BackgroundElement[];
  effects: EffectElement[];
  tones: ToneElement[];
}

// Project Data Structure (Pageable Version)
export interface ProjectDataWithPages {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  currentPageIndex: number;
  pages: Page[];
  globalSettings: {
    canvasSize: { width: number; height: number };
    snapSettings: SnapSettings;
    darkMode: boolean;
    characterNames: Record<string, string>;
    characterSettings: Record<string, any>;
  };
}

// Page Management Component Properties
export interface PageManagerProps {
  // 
  currentPage: Page;
  pages: Page[];
  currentPageIndex: number;
  
  // 
  onPageChange: (pageIndex: number) => void;
  onPageAdd: () => void;
  onPageDelete: (pageIndex: number) => void;
  onPageDuplicate: (pageIndex: number) => void;
  onPageRename: (pageIndex: number, newTitle: string) => void;
  onPageReorder: (fromIndex: number, toIndex: number) => void;
  
  // 
  onCurrentPageUpdate: (pageData: Partial<Page>) => void;
  
  // UI
  isDarkMode: boolean;
  isCompact?: boolean;
}

// 
export interface PageTabProps {
  page: Page;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isDarkMode: boolean;
}

// 
export type PageOperation = 
  | { type: 'ADD_PAGE' }
  | { type: 'DELETE_PAGE'; pageIndex: number }
  | { type: 'DUPLICATE_PAGE'; pageIndex: number }
  | { type: 'RENAME_PAGE'; pageIndex: number; title: string }
  | { type: 'REORDER_PAGE'; fromIndex: number; toIndex: number }
  | { type: 'SWITCH_PAGE'; pageIndex: number };

// hook
export interface UsePageManagerReturn {
  pages: Page[];
  currentPageIndex: number;
  currentPage: Page;
  
  // 
  addPage: () => void;
  deletePage: (pageIndex: number) => void;
  duplicatePage: (pageIndex: number) => void;
  renamePage: (pageIndex: number, newTitle: string) => void;
  switchToPage: (pageIndex: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  
  // 
  updateCurrentPageData: (data: Partial<Page>) => void;
  
  // 
  canDeletePage: boolean;
  hasUnsavedChanges: boolean;
}

// 
export interface BatchPromptOptions {
  includePages: number[];
  outputFormat: 'individual' | 'combined' | 'structured';
  includeCharacterSettings: boolean;
  includePageTitles: boolean;
  customPrefix?: string;
  customSuffix?: string;
}

// ==========================================
// Paper Size System Type Definition (v1.1.3 
// ==========================================

// 
export interface PaperSize {
  id: string;
  name: string;
  displayName: string;
  width: number;        // mm
  height: number;       // mm
  pixelWidth: number;   // 300DPI
  pixelHeight: number;  // 300DPI
  aspectRatio: number;  // 
  category: 'standard' | 'manga' | 'web' | 'custom';
  description: string;
  isPortrait: boolean;
}

// Canvas
export interface CanvasSettings {
  paperSize: PaperSize;
  dpi: number;
  showMargins: boolean;
  marginSize: number;
  gridVisible: boolean;
  gridSize: number;
}

//  - 
export const PAPER_SIZES: Record<string, PaperSize> = {
  A4_PORTRAIT: {
    id: 'a4_portrait',
    name: 'A4_portrait',
    displayName: 'A4 portrait (210×297mm)',
    width: 210,
    height: 297,
    pixelWidth: 800,
    pixelHeight: 1131,
    aspectRatio: 297/210,
    category: 'standard',
    description: 'Common print size',
    isPortrait: true
  },
  B5_PORTRAIT: {
    id: 'b5_portrait',
    name: 'B5_portrait',
    displayName: 'B5 portrait (182×257mm)',
    width: 182,
    height: 257,
    pixelWidth: 700,
    pixelHeight: 990,
    aspectRatio: 257/182,
    category: 'standard',
    description: 'Standard doujin / magazine trim',
    isPortrait: true
  },
  A4_LANDSCAPE: {
    id: 'a4_landscape',
    name: 'A4_landscape',
    displayName: 'A4 landscape (297×210mm)',
    width: 297,
    height: 210,
    pixelWidth: 1131,
    pixelHeight: 800,
    aspectRatio: 210/297,
    category: 'standard',
    description: 'Wide horizontal layout',
    isPortrait: false
  },
  TWITTER_CARD: {
    id: 'twitter_card',
    name: 'Twitter',
    displayName: 'Twitter1200×675px',
    width: 101.6,  // 1200px ÷ 300DPI × 25.4mm ≈ 101.6mm
    height: 57.15, // 675px ÷ 300DPI × 25.4mm ≈ 57.15mm
    pixelWidth: 1200,
    pixelHeight: 675,
    aspectRatio: 675/1200,
    category: 'web',
    description: 'Optimized for Twitter / X cards',
    isPortrait: false
  },
  CUSTOM: {
    id: 'custom',
    name: 'custom',
    displayName: 'Custom size',
    width: 210,
    height: 297,
    pixelWidth: 800,
    pixelHeight: 1131,
    aspectRatio: 297/210,
    category: 'custom',
    description: 'Custom dimensions',
    isPortrait: true
  }
};

// 
export const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  paperSize: PAPER_SIZES.A4_PORTRAIT,
  dpi: 300,
  showMargins: false,
  marginSize: 10,
  gridVisible: false,
  gridSize: 5
};

// Utility function for debugging (development only)
export const debugPaperSizeCalculations = () => {
  console.group('📐 Paper Size Calculations Debug');
  
  Object.entries(PAPER_SIZES).forEach(([key, paperSize]) => {
    // mm  pixel : (mm ÷ 25.4) × DPI
    const expectedPixelWidth = Math.round((paperSize.width / 25.4) * 300);
    const expectedPixelHeight = Math.round((paperSize.height / 25.4) * 300);
    
    const isCorrect = 
      paperSize.pixelWidth === expectedPixelWidth && 
      paperSize.pixelHeight === expectedPixelHeight;
    
    console.log(`${key} (${paperSize.displayName}):`, {
      mm: `${paperSize.width}×${paperSize.height}`,
      currentPixels: `${paperSize.pixelWidth}×${paperSize.pixelHeight}`,
      expectedPixels: `${expectedPixelWidth}×${expectedPixelHeight}`,
      isCorrect: isCorrect ? '✅' : '❌'
    });
  });
  
  console.groupEnd();
};

// 
export const testPaperSizeScaling = () => {
  console.group('🔄 Paper Size Scale Transform Test');
  
  const testPairs = [
    ['A4_PORTRAIT', 'B5_PORTRAIT'],
    ['A4_PORTRAIT', 'A4_LANDSCAPE'],
    ['A4_PORTRAIT', 'TWITTER_CARD']
  ];
  
  testPairs.forEach(([from, to]) => {
    const fromSize = PAPER_SIZES[from];
    const toSize = PAPER_SIZES[to];
    
    if (fromSize && toSize) {
      const scaleX = toSize.pixelWidth / fromSize.pixelWidth;
      const scaleY = toSize.pixelHeight / fromSize.pixelHeight;
      
      console.log(`${from} → ${to}:`, {
        scaleX: `${(scaleX * 100).toFixed(1)}%`,
        scaleY: `${(scaleY * 100).toFixed(1)}%`,
        isNoChange: scaleX === 1.0 && scaleY === 1.0 ? '⚠️ No change!' : '✅ Will scale'
      });
    }
  });
  
  console.groupEnd();
};

// types.ts NanoBanana - v1.1.5

// ==========================================
// NanoBananav1.1.5
// ==========================================

// NanoBanana
export interface NanoBananaExportOptions {
  includeInstructions: boolean;     // 
  includeCharacterMapping: boolean; // Include character name correspondence table
  layoutImageFormat: 'png' | 'jpg'; // 
  layoutImageQuality: 'high' | 'medium' | 'low'; // 
  promptLanguage: 'english' | 'japanese' | 'both'; // 
  zipFilename?: string;            // ZIP File name (auto-generated if omitted)
}

// NanoBananaExport Package Configuration
export interface NanoBananaExportPackage {
  layoutImage: Blob;               // PNG/JPG
  promptText: string;              // 
  characterMapping: string;        // 
  instructions: string;            // 
  metadata: NanoBananaExportMetadata; // 
}

// 
export interface NanoBananaExportMetadata {
  exportedAt: string;              // 
  toolVersion: string;             // 
  pageCount: number;               // 
  panelCount: number;              // 
  characterCount: number;          // 
  paperSize: string;               // 
  totalElements: number;           // 
}

// Character Name Mapping Information
export interface CharacterNameMapping {
  originalName: string;            // 
  suggestedFilename: string;       // 
  characterId: string;             // ID
  description?: string;            // 
}

// NanoBanana
export interface NanoBananaPromptStructure {
  introduction: string;            // 
  characterMappingSection: string; // 
  panelDetailsSection: string;     // 
  styleSettingsSection: string;    // 
  instructionsSection: string;     // 
}

// Layout Image Generation Options
export interface LayoutImageOptions {
  showPanelNumbers: boolean;       // 
  showGrid: boolean;              // 
  backgroundColor: string;         // 
  borderColor: string;            // 
  borderWidth: number;            // 
  fontSize: number;               // 
  fontColor: string;              // 
  quality: number;                // 0.1-1.0
}

// NanoBanana
export interface NanoBananaExportProgress {
  step: 'initialize' | 'generate_layout' | 'generate_prompt' | 'create_mapping' | 'create_instructions' | 'package_files' | 'complete';
  progress: number;               // 0-100
  message: string;                // 
  currentFile?: string;           // 
}

// NanoBanana
export interface NanoBananaExportResult {
  success: boolean;               // 
  zipBlob?: Blob;                // ZIP
  filename: string;               // 
  size: number;                   // 
  metadata: NanoBananaExportMetadata; // 
  error?: string;                 // 
}

// 
export const DEFAULT_NANOBANANA_EXPORT_OPTIONS: NanoBananaExportOptions = {
  includeInstructions: true,
  includeCharacterMapping: true,
  layoutImageFormat: 'png',
  layoutImageQuality: 'high',
  promptLanguage: 'english',
};

export const DEFAULT_LAYOUT_IMAGE_OPTIONS: LayoutImageOptions = {
  showPanelNumbers: true,
  showGrid: false,
  backgroundColor: '#ffffff',
  borderColor: '#000000',
  borderWidth: 2,
  fontSize: 24,
  fontColor: '#000000',
  quality: 1.0,
};

// 🔧 v1.1.6Type definitions to be implemented later (currently unused)
// 
// export interface NanoBananaStylePreset {
//   id: string;
//   name: string;
//   description: string;
//   stylePrompt: string;
//   colorMode: 'color' | 'black_white' | 'sepia';
//   mangaStyle: 'shounen' | 'shoujo' | 'seinen' | 'josei' | 'general';
//   artStyle: 'anime' | 'realistic' | 'cartoon' | 'sketch';
// }
// 
// export const NANOBANANA_STYLE_PRESETS: NanoBananaStylePreset[] = [
//   // v1.1.6
// ];