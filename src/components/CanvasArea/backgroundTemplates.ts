// src/components/CanvasArea/backgroundTemplates.ts - 
import { BackgroundTemplate } from '../../types';

// 
export const backgroundCategories = [
  { id: 'nature', icon: '🌲', name: '' },
  { id: 'indoor', icon: '🏠', name: '' },
  { id: 'school', icon: '🏫', name: '' },
  { id: 'city', icon: '🏙️', name: '' },
  { id: 'abstract', icon: '🎨', name: '' },
  { id: 'emotion', icon: '💭', name: '' },
];

// 🆕 Actual Background Drawing Supported Version Template Definition
// Each template is made up of multiple elements.UI1
export const backgroundTemplates: BackgroundTemplate[] = [
  // ==========================================
  // 
  // ==========================================
  {
    id: 'sky_blue',
    name: '',
    category: 'nature',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#87CEEB', '#E0F6FF'],
        gradientDirection: 180
      },
      // Cloud pattern (white circular pattern)
      {
        type: 'pattern',
        x: 0, y: 0, width: 1, height: 0.4,
        rotation: 0, zIndex: 1, opacity: 0.8,
        patternType: 'dots',
        patternColor: '#FFFFFF',
        patternSize: 12,
        patternSpacing: 40
      },
      // 
      {
        type: 'pattern',
        x: 0.2, y: 0.1, width: 0.8, height: 0.3,
        rotation: 0, zIndex: 2, opacity: 0.6,
        patternType: 'dots',
        patternColor: '#F0F8FF',
        patternSize: 8,
        patternSpacing: 60
      }
    ]
  },
  {
    id: 'sunset',
    name: '',
    category: 'nature',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#FF6B6B', '#FFE66D', '#FF8E53'],
        gradientDirection: 180
      },
      // 
      {
        type: 'solid',
        x: 0.7, y: 0.15, width: 0.15, height: 0.15,
        rotation: 0, zIndex: 1, opacity: 0.9,
        solidColor: '#FFF700'
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0.2, width: 1, height: 0.3,
        rotation: 0, zIndex: 2, opacity: 0.4,
        patternType: 'dots',
        patternColor: '#8B4513',
        patternSize: 20,
        patternSpacing: 80
      }
    ]
  },
  {
    id: 'forest',
    name: '',
    category: 'nature',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 0.4,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#87CEEB', '#98FB98'],
        gradientDirection: 180
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.25, width: 1, height: 0.35,
        rotation: 0, zIndex: 1, opacity: 0.7,
        solidColor: '#228B22'
      },
      // Forest silhouette (vertical pattern)
      {
        type: 'pattern',
        x: 0, y: 0.4, width: 1, height: 0.6,
        rotation: 0, zIndex: 2, opacity: 0.8,
        patternType: 'lines',
        patternColor: '#2D5016',
        patternSize: 3,
        patternSpacing: 15
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.85, width: 1, height: 0.15,
        rotation: 0, zIndex: 3, opacity: 1,
        solidColor: '#8B4513'
      }
    ]
  },

  // ==========================================
  // Indoor background (specific elements added)
  // ==========================================
  {
    id: 'living_room',
    name: '',
    category: 'indoor',
    elements: [
      // 
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 0.7,
        rotation: 0, zIndex: 0, opacity: 1,
        solidColor: '#F5F5DC'
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#DEB887'
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 2, opacity: 0.3,
        patternType: 'lines',
        patternColor: '#8B7355',
        patternSize: 2,
        patternSpacing: 12
      },
      // 
      {
        type: 'pattern',
        x: 0.2, y: 0.2, width: 0.6, height: 0.3,
        rotation: 0, zIndex: 3, opacity: 0.4,
        patternType: 'grid',
        patternColor: '#D2691E',
        patternSize: 1,
        patternSpacing: 20
      }
    ]
  },
  {
    id: 'bedroom',
    name: '',
    category: 'indoor',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 0.7,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#FFB6C1', '#FFF0F5'],
        gradientDirection: 180
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#F0E68C'
      },
      // 
      {
        type: 'solid',
        x: 0.1, y: 0.5, width: 0.8, height: 0.2,
        rotation: 0, zIndex: 2, opacity: 0.8,
        solidColor: '#FFFFFF'
      },
      // 
      {
        type: 'pattern',
        x: 0.7, y: 0.1, width: 0.25, height: 0.5,
        rotation: 0, zIndex: 3, opacity: 0.6,
        patternType: 'lines',
        patternColor: '#FF69B4',
        patternSize: 2,
        patternSpacing: 8
      }
    ]
  },
  {
    id: 'kitchen',
    name: '',
    category: 'indoor',
    elements: [
      // 
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 0.7,
        rotation: 0, zIndex: 0, opacity: 1,
        solidColor: '#FFFAF0'
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#F0F0F0'
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 2, opacity: 0.3,
        patternType: 'grid',
        patternColor: '#C0C0C0',
        patternSize: 1,
        patternSpacing: 20
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.5, width: 1, height: 0.15,
        rotation: 0, zIndex: 3, opacity: 0.7,
        solidColor: '#8B4513'
      }
    ]
  },

  // ==========================================
  // School background (specific elements added)
  // ==========================================
  {
    id: 'classroom',
    name: '',
    category: 'school',
    elements: [
      // 
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 0.7,
        rotation: 0, zIndex: 0, opacity: 1,
        solidColor: '#F0F8FF'
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#DEB887'
      },
      // 
      {
        type: 'solid',
        x: 0.1, y: 0.15, width: 0.8, height: 0.35,
        rotation: 0, zIndex: 2, opacity: 1,
        solidColor: '#2F4F2F'
      },
      // Desk placement (expressed in a dot pattern)
      {
        type: 'pattern',
        x: 0.1, y: 0.55, width: 0.8, height: 0.2,
        rotation: 0, zIndex: 3, opacity: 0.6,
        patternType: 'dots',
        patternColor: '#8B4513',
        patternSize: 6,
        patternSpacing: 25
      }
    ]
  },
  {
    id: 'hallway',
    name: '',
    category: 'school',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#E6E6FA', '#F8F8FF'],
        gradientDirection: 90
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#D2B48C'
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0.4, width: 1, height: 0.3,
        rotation: 0, zIndex: 2, opacity: 0.4,
        patternType: 'lines',
        patternColor: '#CCCCCC',
        patternSize: 1,
        patternSpacing: 30
      }
    ]
  },
  {
    id: 'library',
    name: '',
    category: 'school',
    elements: [
      // 
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 0.7,
        rotation: 0, zIndex: 0, opacity: 1,
        solidColor: '#FDF5E6'
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#8B4513'
      },
      // 
      {
        type: 'pattern',
        x: 0.05, y: 0.1, width: 0.9, height: 0.6,
        rotation: 0, zIndex: 2, opacity: 0.5,
        patternType: 'lines',
        patternColor: '#654321',
        patternSize: 3,
        patternSpacing: 20
      },
      // 
      {
        type: 'pattern',
        x: 0.05, y: 0.1, width: 0.9, height: 0.6,
        rotation: 90, zIndex: 3, opacity: 0.3,
        patternType: 'lines',
        patternColor: '#CD853F',
        patternSize: 1,
        patternSpacing: 8
      }
    ]
  },

  // ==========================================
  // Urban background (specific elements added)
  // ==========================================
  {
    id: 'street',
    name: '',
    category: 'city',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 0.4,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#87CEEB', '#B0C4DE'],
        gradientDirection: 180
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.25, width: 1, height: 0.5,
        rotation: 0, zIndex: 1, opacity: 0.8,
        solidColor: '#696969'
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 2, opacity: 1,
        solidColor: '#2F2F2F'
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0.25, width: 1, height: 0.45,
        rotation: 0, zIndex: 3, opacity: 0.6,
        patternType: 'grid',
        patternColor: '#FFFF99',
        patternSize: 2,
        patternSpacing: 15
      }
    ]
  },
  {
    id: 'park',
    name: '',
    category: 'city',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 0.4,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#87CEEB', '#98FB98'],
        gradientDirection: 180
      },
      // 
      {
        type: 'solid',
        x: 0, y: 0.4, width: 1, height: 0.6,
        rotation: 0, zIndex: 1, opacity: 1,
        solidColor: '#90EE90'
      },
      // Wooden silhouette (dot pattern)
      {
        type: 'pattern',
        x: 0.1, y: 0.2, width: 0.8, height: 0.4,
        rotation: 0, zIndex: 2, opacity: 0.7,
        patternType: 'dots',
        patternColor: '#228B22',
        patternSize: 15,
        patternSpacing: 50
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0.7, width: 1, height: 0.3,
        rotation: 0, zIndex: 3, opacity: 0.3,
        patternType: 'lines',
        patternColor: '#32CD32',
        patternSize: 1,
        patternSpacing: 8
      }
    ]
  },

  // ==========================================
  // Abstract background (keep it simple)
  // ==========================================
  {
    id: 'white',
    name: '',
    category: 'abstract',
    elements: [{
      type: 'solid',
      x: 0, y: 0, width: 1, height: 1,
      rotation: 0, zIndex: 0, opacity: 1,
      solidColor: '#FFFFFF'
    }]
  },
  {
    id: 'black',
    name: '',
    category: 'abstract',
    elements: [{
      type: 'solid',
      x: 0, y: 0, width: 1, height: 1,
      rotation: 0, zIndex: 0, opacity: 1,
      solidColor: '#000000'
    }]
  },

  // ==========================================
  // Emotional Background (Effective Expression)
  // ==========================================
  {
    id: 'happy',
    name: '',
    category: 'emotion',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'radial',
        gradientColors: ['#FFD700', '#FFF8DC'],
        gradientDirection: 0
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 45, zIndex: 1, opacity: 0.3,
        patternType: 'lines',
        patternColor: '#FFFFFF',
        patternSize: 2,
        patternSpacing: 30
      },
      {
        type: 'pattern',
        x: 0, y: 0, width: 1, height: 1,
        rotation: -45, zIndex: 2, opacity: 0.2,
        patternType: 'lines',
        patternColor: '#FFFFFF',
        patternSize: 1,
        patternSpacing: 40
      }
    ]
  },
  {
    id: 'sad',
    name: '',
    category: 'emotion',
    elements: [
      // 
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 1,
        gradientType: 'linear',
        gradientColors: ['#2F4F4F', '#708090'],
        gradientDirection: 180
      },
      // 
      {
        type: 'pattern',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 15, zIndex: 1, opacity: 0.4,
        patternType: 'lines',
        patternColor: '#4682B4',
        patternSize: 1,
        patternSpacing: 25
      }
    ]
  },
  
  // ==========================================
  // 🏠 Location/environment background (for comic names)
  // ==========================================
  {
    id: 'home',
    name: '',
    category: 'indoor',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#FFF8DC', '#F5F5DC'],
        gradientDirection: 135
      }
    ]
  },
  {
    id: 'school',
    name: '',
    category: 'school',
    elements: [
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.3,
        solidColor: '#F0F8FF'
      }
    ]
  },
  {
    id: 'office',
    name: '',
    category: 'indoor',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#F8F8FF', '#E6E6FA'],
        gradientDirection: 90
      }
    ]
  },
  {
    id: 'hospital',
    name: '',
    category: 'indoor',
    elements: [
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.5,
        solidColor: '#F0FFFF'
      }
    ]
  },
  {
    id: 'park',
    name: '',
    category: 'nature',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.3,
        gradientType: 'radial',
        gradientColors: ['#90EE90', '#98FB98']
      }
    ]
  },
  {
    id: 'city',
    name: '',
    category: 'city',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#D3D3D3', '#A9A9A9'],
        gradientDirection: 45
      }
    ]
  },
  {
    id: 'beach',
    name: '',
    category: 'nature',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.3,
        gradientType: 'linear',
        gradientColors: ['#87CEEB', '#B0E0E6'],
        gradientDirection: 180
      }
    ]
  },
  {
    id: 'mountain',
    name: '',
    category: 'nature',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#D2B48C', '#DEB887'],
        gradientDirection: 90
      }
    ]
  },
  
  // ==========================================
  // ⏰ Time zone/weather background (for comic names)
  // ==========================================
  {
    id: 'morning',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#FFE4B5', '#FFF8DC'],
        gradientDirection: 45
      }
    ]
  },
  {
    id: 'afternoon',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.3,
        gradientType: 'radial',
        gradientColors: ['#FFD700', '#FFA500']
      }
    ]
  },
  {
    id: 'evening',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#FF6347', '#FF4500'],
        gradientDirection: 180
      }
    ]
  },
  {
    id: 'night',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.6,
        gradientType: 'linear',
        gradientColors: ['#191970', '#000080'],
        gradientDirection: 90
      }
    ]
  },
  {
    id: 'rainy',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.5,
        gradientType: 'linear',
        gradientColors: ['#B0C4DE', '#87CEEB'],
        gradientDirection: 135
      }
    ]
  },
  {
    id: 'cloudy',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        solidColor: '#D3D3D3'
      }
    ]
  },
  {
    id: 'snowy',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.5,
        gradientType: 'linear',
        gradientColors: ['#F0F8FF', '#E6E6FA'],
        gradientDirection: 45
      }
    ]
  },
  
  // ==========================================
  // 💫 Emotional/mood-based background (for comic names)
  // ==========================================
  {
    id: 'tension',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#FFB6C1', '#FF69B4'],
        gradientDirection: 45
      }
    ]
  },
  {
    id: 'anxiety',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.5,
        gradientType: 'radial',
        gradientColors: ['#DDA0DD', '#DA70D6']
      }
    ]
  },
  {
    id: 'excitement',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#FFD700', '#FFA500'],
        gradientDirection: 90
      }
    ]
  },
  {
    id: 'romantic',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.3,
        gradientType: 'radial',
        gradientColors: ['#FFB6C1', '#FFC0CB']
      }
    ]
  },
  {
    id: 'nostalgic',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#F5DEB3', '#DEB887'],
        gradientDirection: 135
      }
    ]
  },
  
  // ==========================================
  // ✨ Special Effects Background (for Comic Names)
  // ==========================================
  {
    id: 'flash',
    name: '',
    category: 'abstract',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.7,
        gradientType: 'radial',
        gradientColors: ['#FFFFFF', '#FFFF00']
      }
    ]
  },
  {
    id: 'explosion',
    name: '',
    category: 'abstract',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.6,
        gradientType: 'radial',
        gradientColors: ['#FF4500', '#FF6347']
      }
    ]
  },
  {
    id: 'magic',
    name: '',
    category: 'abstract',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.5,
        gradientType: 'linear',
        gradientColors: ['#9370DB', '#8A2BE2'],
        gradientDirection: 45
      }
    ]
  },
  {
    id: 'memory',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.6,
        gradientType: 'linear',
        gradientColors: ['#D3D3D3', '#A9A9A9'],
        gradientDirection: 90
      }
    ]
  },
  {
    id: 'dream',
    name: '',
    category: 'emotion',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.5,
        gradientType: 'radial',
        gradientColors: ['#E6E6FA', '#DDA0DD']
      }
    ]
  },
  
  // ==========================================
  // 🚗 Transportation background (for comic names)
  // ==========================================
  {
    id: 'train',
    name: '',
    category: 'city',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        gradientType: 'linear',
        gradientColors: ['#F5F5F5', '#DCDCDC'],
        gradientDirection: 0
      }
    ]
  },
  {
    id: 'car',
    name: '',
    category: 'city',
    elements: [
      {
        type: 'gradient',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.3,
        gradientType: 'linear',
        gradientColors: ['#E0E0E0', '#C0C0C0'],
        gradientDirection: 90
      }
    ]
  },
  {
    id: 'bus',
    name: '',
    category: 'city',
    elements: [
      {
        type: 'solid',
        x: 0, y: 0, width: 1, height: 1,
        rotation: 0, zIndex: 0, opacity: 0.4,
        solidColor: '#F8F8FF'
      }
    ]
  }
];

// 
export const getBackgroundsByCategory = (category: string): BackgroundTemplate[] => {
  return backgroundTemplates.filter(template => template.category === category);
};

export const getTemplatePreviewColor = (template: BackgroundTemplate): string => {
  const firstElement = template.elements[0];
  if (!firstElement) return '#CCCCCC';
  
  if (firstElement.type === 'solid') {
    return firstElement.solidColor || '#CCCCCC';
  } else if (firstElement.type === 'gradient') {
    return firstElement.gradientColors?.[0] || '#CCCCCC';
  } else if (firstElement.type === 'pattern') {
    return firstElement.patternColor || '#CCCCCC';
  }
  return '#CCCCCC';
};

export const getBackgroundTypeIcon = (type: string): string => {
  switch (type) {
    case 'solid': return '🎨';
    case 'gradient': return '🌈';
    case 'pattern': return '🔳';
    case 'image': return '🖼️';
    default: return '❓';
  }
};

export const getBackgroundTypeName = (type: string): string => {
  switch (type) {
    case 'solid': return '';
    case 'gradient': return '';
    case 'pattern': return '';
    case 'image': return '';
    default: return '';
  }
};