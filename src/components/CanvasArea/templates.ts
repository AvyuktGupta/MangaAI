// src/components/CanvasArea/templates.ts - 
import { Templates } from "../../types";

// 🔧 : Unify the coordinates of all templates (800×600
// KDP
// : 20px: 35px(Space reserved for page numbers)
// : 16px 
const MARGIN_TOP = 20;
const MARGIN_SIDES = 20;
const MARGIN_BOTTOM = 35;
const GAP = 16;
const CANVAS_W = 800;
const CANVAS_H = 600;
const USABLE_W = CANVAS_W - MARGIN_SIDES * 2; // 760
const USABLE_H = CANVAS_H - MARGIN_TOP - MARGIN_BOTTOM; // 545

export const templates: Templates = {
  // === 1 ===
  "single_impact": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: USABLE_H },
    ],
  },

  // === 2 ===
  "split_horizontal": {
    panels: [
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP, width: (USABLE_W - GAP) / 2, height: USABLE_H },  // 2
      { id: 1, x: MARGIN_SIDES + (USABLE_W - GAP) / 2 + GAP, y: MARGIN_TOP, width: (USABLE_W - GAP) / 2, height: USABLE_H }, // 1
    ],
  },
  "split_vertical": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: (USABLE_H - GAP) / 2 },
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: USABLE_W, height: (USABLE_H - GAP) / 2 },
    ],
  },
  "dialogue_2": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: USABLE_H * 0.7 },
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.7 + GAP, width: USABLE_W, height: USABLE_H * 0.3 - GAP },
    ],
  },
  "main_sub": {
    panels: [
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W * 0.65, height: USABLE_H },  // 2
      { id: 1, x: MARGIN_SIDES + USABLE_W * 0.65 + GAP, y: MARGIN_TOP, width: USABLE_W * 0.35 - GAP, height: USABLE_H }, // 1
    ],
  },
  "custom": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: (USABLE_H - GAP) / 2 },
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: USABLE_W, height: (USABLE_H - GAP) / 2 },
    ],
  },

  // === 3 ===
  "three_vertical": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: (USABLE_H - GAP * 2) / 3 },
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 2) / 3 + GAP, width: USABLE_W, height: (USABLE_H - GAP * 2) / 3 },
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 2) / 3 * 2 + GAP * 2, width: USABLE_W, height: (USABLE_H - GAP * 2) / 3 },
    ],
  },
  "t_shape": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: USABLE_H * 0.3 },   // 1
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.3 + GAP, width: (USABLE_W - GAP) / 2, height: USABLE_H * 0.7 - GAP },  // 3
      { id: 2, x: MARGIN_SIDES + (USABLE_W - GAP) / 2 + GAP, y: MARGIN_TOP + USABLE_H * 0.3 + GAP, width: (USABLE_W - GAP) / 2, height: USABLE_H * 0.7 - GAP }, // 2
    ],
  },
  "reverse_t": {
    panels: [
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP, width: (USABLE_W - GAP) / 2, height: USABLE_H * 0.7 },  // 2
      { id: 1, x: MARGIN_SIDES + (USABLE_W - GAP) / 2 + GAP, y: MARGIN_TOP, width: (USABLE_W - GAP) / 2, height: USABLE_H * 0.7 }, // 1
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.7 + GAP, width: USABLE_W, height: USABLE_H * 0.3 - GAP }, // 3
    ],
  },

  // === 4 ===
  "4koma": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: (USABLE_H - GAP * 3) / 4 },
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 3) / 4 + GAP, width: USABLE_W, height: (USABLE_H - GAP * 3) / 4 },
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 3) / 4 * 2 + GAP * 2, width: USABLE_W, height: (USABLE_H - GAP * 3) / 4 },
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 3) / 4 * 3 + GAP * 3, width: USABLE_W, height: (USABLE_H - GAP * 3) / 4 },
    ],
  },
  "grid_2x2": {
    panels: [
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP, width: (USABLE_W - GAP) / 2, height: (USABLE_H - GAP) / 2 },  // 2
      { id: 1, x: MARGIN_SIDES + (USABLE_W - GAP) / 2 + GAP, y: MARGIN_TOP, width: (USABLE_W - GAP) / 2, height: (USABLE_H - GAP) / 2 }, // 1
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: (USABLE_W - GAP) / 2, height: (USABLE_H - GAP) / 2 }, // 4
      { id: 3, x: MARGIN_SIDES + (USABLE_W - GAP) / 2 + GAP, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: (USABLE_W - GAP) / 2, height: (USABLE_H - GAP) / 2 },// 3
    ],
  },
  "main_triple": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: (USABLE_H - GAP) / 2 },  // 1
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: (USABLE_W - GAP * 2) / 3, height: (USABLE_H - GAP) / 2 }, // 4
      { id: 3, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 + GAP, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: (USABLE_W - GAP * 2) / 3, height: (USABLE_H - GAP) / 2 },// 3
      { id: 2, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 * 2 + GAP * 2, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: (USABLE_W - GAP * 2) / 3, height: (USABLE_H - GAP) / 2 },// 2
    ],
  },
  "triple_main": {
    panels: [
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP, width: (USABLE_W - GAP * 2) / 3, height: (USABLE_H - GAP) / 2 },  // 3
      { id: 2, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 + GAP, y: MARGIN_TOP, width: (USABLE_W - GAP * 2) / 3, height: (USABLE_H - GAP) / 2 }, // 2
      { id: 1, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 * 2 + GAP * 2, y: MARGIN_TOP, width: (USABLE_W - GAP * 2) / 3, height: (USABLE_H - GAP) / 2 }, // 1
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP) / 2 + GAP, width: USABLE_W, height: (USABLE_H - GAP) / 2 }, // 4
    ],
  },
  "dialogue": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: USABLE_H * 0.3 },   // 1
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.3 + GAP, width: (USABLE_W - GAP) / 2, height: USABLE_H * 0.3 },  // 3
      { id: 2, x: MARGIN_SIDES + (USABLE_W - GAP) / 2 + GAP, y: MARGIN_TOP + USABLE_H * 0.3 + GAP, width: (USABLE_W - GAP) / 2, height: USABLE_H * 0.3 }, // 2
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.6 + GAP * 2, width: USABLE_W, height: USABLE_H * 0.4 - GAP * 2 },  // 4
    ],
  },
  "action": {
    panels: [
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W * 0.3, height: USABLE_H * 0.5 },  // 3
      { id: 1, x: MARGIN_SIDES + USABLE_W * 0.3 + GAP, y: MARGIN_TOP, width: USABLE_W * 0.7 - GAP, height: (USABLE_H * 0.5 - GAP) / 2 }, // 1
      { id: 2, x: MARGIN_SIDES + USABLE_W * 0.3 + GAP, y: MARGIN_TOP + (USABLE_H * 0.5 - GAP) / 2 + GAP, width: USABLE_W * 0.7 - GAP, height: (USABLE_H * 0.5 - GAP) / 2 },// 2
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.5 + GAP, width: USABLE_W, height: USABLE_H * 0.5 - GAP }, // 4
    ],
  },
  "emotional": {
    panels: [
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W * 0.6, height: USABLE_H * 0.5 },  // 3
      { id: 1, x: MARGIN_SIDES + USABLE_W * 0.6 + GAP, y: MARGIN_TOP, width: USABLE_W * 0.4 - GAP, height: (USABLE_H * 0.5 - GAP) / 2 }, // 1
      { id: 2, x: MARGIN_SIDES + USABLE_W * 0.6 + GAP, y: MARGIN_TOP + (USABLE_H * 0.5 - GAP) / 2 + GAP, width: USABLE_W * 0.4 - GAP, height: (USABLE_H * 0.5 - GAP) / 2 },// 2
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.5 + GAP, width: USABLE_W, height: USABLE_H * 0.5 - GAP }, // 4
    ],
  },

  // === 5 ===
  "gag": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: USABLE_H * 0.25 },  // 1
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.25 + GAP, width: (USABLE_W - GAP * 2) / 3, height: USABLE_H * 0.35 }, // 4
      { id: 3, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 + GAP, y: MARGIN_TOP + USABLE_H * 0.25 + GAP, width: (USABLE_W - GAP * 2) / 3, height: USABLE_H * 0.35 },// 3
      { id: 2, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 * 2 + GAP * 2, y: MARGIN_TOP + USABLE_H * 0.25 + GAP, width: (USABLE_W - GAP * 2) / 3, height: USABLE_H * 0.35 },// 2
      { id: 5, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.6 + GAP * 2, width: USABLE_W, height: USABLE_H * 0.4 - GAP * 2 }, // 5
    ],
  },
  "spread": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: USABLE_H * 0.35 },  // 1
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.35 + GAP, width: (USABLE_W - GAP * 2) / 3, height: USABLE_H * 0.3 }, // 4
      { id: 3, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 + GAP, y: MARGIN_TOP + USABLE_H * 0.35 + GAP, width: (USABLE_W - GAP * 2) / 3, height: USABLE_H * 0.3 },// 3
      { id: 2, x: MARGIN_SIDES + (USABLE_W - GAP * 2) / 3 * 2 + GAP * 2, y: MARGIN_TOP + USABLE_H * 0.35 + GAP, width: (USABLE_W - GAP * 2) / 3, height: USABLE_H * 0.3 },// 2
      { id: 5, x: MARGIN_SIDES, y: MARGIN_TOP + USABLE_H * 0.65 + GAP * 2, width: USABLE_W, height: USABLE_H * 0.35 - GAP * 2 }, // 5
    ],
  },
  "web_standard": {
    panels: [
      { id: 1, x: MARGIN_SIDES, y: MARGIN_TOP, width: USABLE_W, height: (USABLE_H - GAP * 4) / 5 },
      { id: 2, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 4) / 5 + GAP, width: USABLE_W, height: (USABLE_H - GAP * 4) / 5 },
      { id: 3, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 4) / 5 * 2 + GAP * 2, width: USABLE_W, height: (USABLE_H - GAP * 4) / 5 },
      { id: 4, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 4) / 5 * 3 + GAP * 3, width: USABLE_W, height: (USABLE_H - GAP * 4) / 5 },
      { id: 5, x: MARGIN_SIDES, y: MARGIN_TOP + (USABLE_H - GAP * 4) / 5 * 4 + GAP * 4, width: USABLE_W, height: (USABLE_H - GAP * 4) / 5 },
    ],
  },

  // === 6 ===
  "vertical": {
    panels: [
      { id: 1, x: 20, y: 20, width: 760, height: 90 },
      { id: 2, x: 20, y: 120, width: 760, height: 90 },
      { id: 3, x: 20, y: 220, width: 760, height: 90 },
      { id: 4, x: 20, y: 320, width: 760, height: 90 },
      { id: 5, x: 20, y: 420, width: 760, height: 90 },
      { id: 6, x: 20, y: 520, width: 760, height: 60 },
    ],
  },
  "oneshot": {
    panels: [
      { id: 1, x: 20, y: 20, width: 760, height: 80 },
      { id: 2, x: 20, y: 110, width: 370, height: 130 },
      { id: 3, x: 410, y: 110, width: 370, height: 130 },
      { id: 4, x: 20, y: 250, width: 760, height: 150 },
      { id: 5, x: 20, y: 410, width: 370, height: 170 },
      { id: 6, x: 410, y: 410, width: 370, height: 170 },
    ],
  },
  "manga_page": {
    panels: [
      { id: 1, x: 20, y: 20, width: 760, height: 90 },
      { id: 2, x: 20, y: 120, width: 370, height: 120 },
      { id: 3, x: 410, y: 120, width: 370, height: 120 },
      { id: 4, x: 20, y: 250, width: 240, height: 160 },
      { id: 5, x: 280, y: 250, width: 240, height: 160 },
      { id: 6, x: 540, y: 250, width: 240, height: 160 },
      { id: 7, x: 20, y: 420, width: 760, height: 160 },
    ],
  },
};

// UI
export const templateDescriptions: Record<string, string> = {
  // 1
  "single_impact": " - 1",
  
  // 2
  "split_horizontal": " - ",
  "split_vertical": " - ", 
  "dialogue_2": " - +",
  "main_sub": "+ - +",
  "custom": "2 - ",
  
  // 3
  "three_vertical": "3 - ",
  "t_shape": "T - +",
  "reverse_t": "T - +Climax (Standard)",
  
  // 4
  "4koma": "4 - 4",
  "grid_2x2": "2×2 - ",
  "main_triple": "1+3 - +", 
  "triple_main": "3+1 - +",
  "dialogue": " - ",
  "action": " - ",
  "emotional": " - ",
  
  // 5
  "gag": " - ",
  "spread": " - ",
  "web_standard": "Web - WebSNS",
  
  // 6
  "vertical": " - SNS",
  "oneshot": "1 - ",
  "manga_page": " - ",
};

// 
export const templateCategories: Record<string, string[]> = {
  "1": ["single_impact"],
  "2": ["split_horizontal", "split_vertical", "dialogue_2", "main_sub", "custom"],
  "3": ["three_vertical", "t_shape", "reverse_t"],
  "4": ["4koma", "grid_2x2", "main_triple", "triple_main", "dialogue", "action", "emotional"],
  "5": ["gag", "spread", "web_standard"],
  "6": ["vertical", "oneshot", "manga_page"],
};

// 
export const popularTemplates: string[] = [
  "single_impact",
  "split_horizontal", 
  "split_vertical",
  "dialogue_2",
  "main_sub",
  "three_vertical",
  "t_shape", 
  "reverse_t",
  "4koma",
  "grid_2x2",
  "main_triple",
  "triple_main",
  "manga_page",
  "web_standard",
  "vertical"
];