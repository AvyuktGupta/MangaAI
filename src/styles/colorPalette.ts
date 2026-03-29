/**
 * Unified color palette across applications
 * 
 * 🎨 Color coding rules (intuitive and easy to remember):
 * 
 * 💚  = File operations (save, create, read)
 * 🔵  = Output/Export (data out)
 * 🟠  = Edit/change (fix something)
 * 🔴  = Deletion/dangerous operation (irreversible operation)
 * 🟣  = ON/OFF
 * ⚫  = Management/list (display information, management screen)
 */

export const COLOR_PALETTE = {
  // ===  ===
  primary: {
    blue: '#3b82f6',      // Primary Blue (Save, Main Action)
    purple: '#8b5cf6',    // Primary Purple (Output, Export)
    green: '#10b981',     // Primary Green (Success, Active State)
    orange: '#ff8833',    // Primary Range (Accent, Edit Mode)
    red: '#ef4444',       // Primary Red (Delete, Warning)
  },

  // ===  ===
  status: {
    success: '#10b981',   // 
    warning: '#f59e0b',   // 
    error: '#ef4444',     // 
    info: '#3b82f6',      // 
    processing: '#8b5cf6', // 
  },

  // ===  ===
  background: {
    // 
    dark: {
      primary: '#1a1a1a',     // 
      secondary: '#2d2d2d',   // 
      tertiary: '#3a3a3a',    // 
      card: '#1e1e1e',        // 
      modal: '#1e1e1e',       // 
      input: '#4b5563',       // 
    },
    // 
    light: {
      primary: '#ffffff',     // 
      secondary: '#f8f9fa',   // 
      tertiary: '#e9ecef',    // 
      card: '#ffffff',        // 
      modal: '#ffffff',       // 
      input: '#ffffff',       // 
    }
  },

  // ===  ===
  text: {
    // 
    dark: {
      primary: '#ffffff',     // 
      secondary: '#cccccc',   // 
      muted: '#888888',       // 
      inverse: '#1a1a1a',     // 
    },
    // 
    light: {
      primary: '#333333',     // 
      secondary: '#555555',   // 
      muted: '#888888',       // 
      inverse: '#ffffff',     // 
    }
  },

  // ===  ===
  border: {
    // 
    dark: {
      primary: '#555555',     // 
      secondary: '#333333',   // 
      focus: '#3b82f6',       // 
    },
    // 
    light: {
      primary: '#dddddd',     // 
      secondary: '#e5e7eb',   // 
      focus: '#3b82f6',       // 
    }
  },

  // === Functional button colors (intuitive color coding rules) ===
  buttons: {
    // 
    save: {
      primary: '#16a34a',     // 💾  - 
      hover: '#15803d',       // 
    },
    // Output/export system (blue system)
    export: {
      primary: '#2563eb',     // 📤  - 
      hover: '#1d4ed8',       // 
    },
    // Editing/modification system (orange system)
    edit: {
      primary: '#ea580c',     // 🔧  - 
      hover: '#dc2626',       // 
    },
    // 
    delete: {
      primary: '#dc2626',     // 🗑️  - 
      hover: '#b91c1c',       // 
    },
    // 
    success: {
      primary: '#9333ea',     // ⚙️  - ON/OFF
      hover: '#7c3aed',       // 
    },
    // 
    manage: {
      primary: '#6b7280',     // 📁  - 
      hover: '#4b5563',       // 
    }
  },

  // ===  ===
  effects: {
    hover: {
      light: 'rgba(0, 0, 0, 0.1)',    // 
      dark: 'rgba(255, 255, 255, 0.1)', // 
    },
    shadow: {
      light: 'rgba(0, 0, 0, 0.1)',     // 
      dark: 'rgba(0, 0, 0, 0.3)',      // 
    },
    focus: {
      light: 'rgba(59, 130, 246, 0.2)', // 
      dark: 'rgba(59, 130, 246, 0.3)',  // 
    }
  }
} as const;

/**
 * Get feature-specific button styles
 */
export const getButtonStyle = (type: keyof typeof COLOR_PALETTE.buttons, isDarkMode: boolean) => ({
  backgroundColor: COLOR_PALETTE.buttons[type].primary,
  color: COLOR_PALETTE.text[isDarkMode ? 'dark' : 'light'].inverse,
  border: `1px solid ${COLOR_PALETTE.buttons[type].primary}`,
  fontWeight: 'bold' as const,
  transition: 'all 0.3s ease',
  cursor: 'pointer' as const,
  '&:hover': {
    backgroundColor: COLOR_PALETTE.buttons[type].hover,
    borderColor: COLOR_PALETTE.buttons[type].hover,
  }
});

/**
 * 
 */
export const getThemeColors = (isDarkMode: boolean) => ({
  background: COLOR_PALETTE.background[isDarkMode ? 'dark' : 'light'],
  text: COLOR_PALETTE.text[isDarkMode ? 'dark' : 'light'],
  border: COLOR_PALETTE.border[isDarkMode ? 'dark' : 'light'],
});

/**
 * 
 */
export const getFunctionalColors = () => ({
  save: COLOR_PALETTE.buttons.save,
  export: COLOR_PALETTE.buttons.export,
  edit: COLOR_PALETTE.buttons.edit,
  delete: COLOR_PALETTE.buttons.delete,
  success: COLOR_PALETTE.buttons.success,
  manage: COLOR_PALETTE.buttons.manage,
});
