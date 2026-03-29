// ElementLabelRenderer.tsx - Element Label Display Component (types.ts
import React from 'react';
import { BackgroundElement, EffectElement, ToneElement, Panel } from '../../../types';

interface ElementLabelRendererProps {
  backgrounds: BackgroundElement[];
  effects: EffectElement[];
  tones: ToneElement[];
  panels: Panel[];
  canvasScale: number;
}

const ElementLabelRenderer: React.FC<ElementLabelRendererProps> = ({
  backgrounds,
  effects,
  tones,
  panels,
  canvasScale
}) => {
  // 
  const getPanel = (panelId: number) => panels.find(p => p.id === panelId);

  // Get a Japanese name for the background type (user-friendly version)
  const getBackgroundLabel = (bg: BackgroundElement): string => {
    console.log(`🎨 :`, {
      name: bg.name,
      templateName: bg.templateName,
      preset: bg.preset,
      type: bg.type
    });
    
    // name
    if (bg.name) {
      console.log(`✅ name: ${bg.name}`);
      return bg.name;
    }
    
    // Displays the background template name for backgrounds generated from the integration template
    if (bg.templateName) {
      console.log(`✅ templateName: ${bg.templateName}`);
      return bg.templateName;
    }
    
    // Use background preset name if any
    if (bg.preset) {
      console.log(`✅ preset: ${bg.preset}`);
      const presetNames: { [key: string]: string } = {
        'excitement': '',
        'cloudy': '',
        'tension': '',
        'city': '',
        'explosion': '',
        'flash': '',
        'night': '',
        'home': '',
        'school': '',
        'office': '',
        'hospital': '',
        'park': '',
        'beach': '',
        'mountain': '',
        'morning': '',
        'afternoon': '',
        'evening': '',
        'rainy': '',
        'snowy': '',
        'anxiety': '',
        'romantic': '',
        'nostalgic': '',
        'memory': '',
        'dream': '',
        'train': '',
        'car': '',
        'bus': '',
        'neutral': '',
        'calm': '',
        'happy': '',
        'sad': '',
        'angry': '',
        'speed': '',
        'impact': '',
        'determination': '',
        'idea': '',
        'tired': '',
        'effort': ''
      };
      return presetNames[bg.preset] || bg.preset;
    }
    
    // : 
    console.log(`⚠️ : type=${bg.type}`);
    switch (bg.type) {
      case 'solid':
        return ``;
      case 'gradient':
        return ``;
      case 'pattern':
        return ``;
      case 'image':
        return ``;
      default:
        return '';
    }
  };

  // Obtained the Japanese name of the effect line type (types.ts
  const getEffectLabel = (effect: EffectElement): string => {
    const typeNames = {
      'speed': '',
      'focus': '',
      'explosion': '',
      'flash': ''
    };
    
    const directionNames = {
      'horizontal': '',
      'vertical': '',
      'radial': '',
      'custom': ''
    };
    
    const typeName = typeNames[effect.type] || effect.type;
    const directionName = directionNames[effect.direction] || effect.direction;
    
    return `${typeName} (${directionName})`;
  };

  // Acquisition of the Japanese name of the tone pattern (types.ts
  const getToneLabel = (tone: ToneElement): string => {
    const patternNames = {
      // 
      'dots_60': '60%',
      'dots_85': '85%',
      'dots_100': '100%',
      'dots_120': '120%',
      'dots_150': '150%',
      // 
      'lines_horizontal': '',
      'lines_vertical': '',
      'lines_diagonal': '',
      'lines_cross': '',
      // 
      'gradient_linear': '',
      'gradient_radial': '',
      'gradient_diamond': '',
      // 
      'noise_fine': '',
      'noise_coarse': '',
      'noise_grain': '',
      // 
      'speed_lines': '',
      'focus_lines': '',
      'explosion': ''
    };
    
    const patternName = patternNames[tone.pattern] || tone.pattern;
    return `${patternName}`;
  };

  // →
  const getAbsolutePosition = (element: BackgroundElement | EffectElement | ToneElement) => {
    const panel = getPanel(element.panelId);
    if (!panel) return { x: element.x, y: element.y, width: element.width, height: element.height };

    // 0-1) is converted to the absolute coordinates in the panel
    if (element.x <= 1 && element.y <= 1) {
      return {
        x: panel.x + (element.x * panel.width),
        y: panel.y + (element.y * panel.height),
        width: element.width <= 1 ? element.width * panel.width : element.width,
        height: element.height <= 1 ? element.height * panel.height : element.height
      };
    }
    
    // If it is already absolute coordinates, leave it as it is.
    return { x: element.x, y: element.y, width: element.width, height: element.height };
  };

  return (
    <g className="element-labels">
      {/*  */}
      {backgrounds.map((bg, index) => {
        const pos = getAbsolutePosition(bg);
        return (
          <g key={`bg-label-${bg.id || index}`}>
            <rect
              x={pos.x + 10}
              y={pos.y + 10}
              width={150}
              height={24}
              fill="rgba(0, 0, 0, 0.8)"
              stroke="#ffffff"
              strokeWidth={1}
              rx={4}
            />
            <text
              x={pos.x + 85}
              y={pos.y + 26}
              textAnchor="middle"
              fill="white"
              fontSize={12}
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              🎨 {getBackgroundLabel(bg)}
            </text>
          </g>
        );
      })}

      {/*  */}
      {effects.map((effect, index) => {
        const pos = getAbsolutePosition(effect);
        return (
          <g key={`effect-label-${effect.id || index}`}>
            <rect
              x={pos.x + 10}
              y={pos.y + pos.height - 34}
              width={120}
              height={24}
              fill="rgba(255, 0, 0, 0.8)"
              stroke="#ffffff"
              strokeWidth={1}
              rx={4}
            />
            <text
              x={pos.x + 70}
              y={pos.y + pos.height - 18}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              ⚡ {getEffectLabel(effect)}
            </text>
          </g>
        );
      })}

      {/*  */}
      {tones.filter(tone => tone.visible !== false).map((tone, index) => {
        const pos = getAbsolutePosition(tone);
        return (
          <g key={`tone-label-${tone.id || index}`}>
            <rect
              x={pos.x + pos.width - 140}
              y={pos.y + 10}
              width={130}
              height={24}
              fill="rgba(0, 128, 255, 0.8)"
              stroke="#ffffff"
              strokeWidth={1}
              rx={4}
            />
            <text
              x={pos.x + pos.width - 75}
              y={pos.y + 26}
              textAnchor="middle"
              fill="white"
              fontSize={11}
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
            >
              🎯 {getToneLabel(tone)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default ElementLabelRenderer;