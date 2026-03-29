// src/components/UI/PanelTemplateSelector.tsx - v1.1.5 
import React, { useState } from 'react';
import { templates, templateDescriptions, templateCategories, popularTemplates } from '../CanvasArea/templates';

interface PanelTemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  onClose?: () => void;
  isDarkMode: boolean;
  isVisible: boolean;
}

export const PanelTemplateSelector: React.FC<PanelTemplateSelectorProps> = ({
  onTemplateSelect,
  onClose,
  isDarkMode,
  isVisible
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('');

  if (!isVisible) return null;

  const categories = ['', ...Object.keys(templateCategories)];

  const getCurrentTemplates = (): string[] => {
    if (activeCategory === '') {
      return popularTemplates;
    }
    return templateCategories[activeCategory] || [];
  };

  // 🎨 SVG - 
  const generatePreview = (templateId: string): string => {
    const template = templates[templateId];
    if (!template || !template.panels) return '<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="10" y="10" width="100" height="60" fill="transparent" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5"/></svg>';

    const strokeColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const textColor = isDarkMode ? '#d1d5db' : '#374151';
    const fillColor = isDarkMode ? '#374151' : '#f3f4f6';
    const highlightColor = isDarkMode ? '#3b82f6' : '#2563eb';
    
    // 🎨 Accurately calculate panel range (including margin)
    const allX = template.panels.map(p => [p.x, p.x + p.width]).flat();
    const allY = template.panels.map(p => [p.y, p.y + p.height]).flat();
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    // 🔧 Calculate the actual aspect ratio of your content
    const contentAspectRatio = contentWidth / contentHeight;
    
    // 🔧 Size of preview area (adjust to portrait)
    const previewWidth = 80;
    const previewHeight = 110; // 
    const margin = 6;
    
    let scaledWidth, scaledHeight, offsetX, offsetY;
    
    if (contentAspectRatio > 1) {
      // 🔧 For landscape: Scale to fit width
      scaledWidth = previewWidth - (margin * 2);
      scaledHeight = scaledWidth / contentAspectRatio;
      offsetX = margin;
      offsetY = (previewHeight - scaledHeight) / 2;
    } else {
      // 🔧 For portrait: Scale to Height
      scaledHeight = previewHeight - (margin * 2);
      scaledWidth = scaledHeight * contentAspectRatio;
      offsetY = margin;
      offsetX = (previewWidth - scaledWidth) / 2;
    }
    
    // 🔧 
    const scale = scaledWidth / contentWidth;
    
    // 🔧 minX, minY
    const finalOffsetX = offsetX - (minX * scale);
    const finalOffsetY = offsetY - (minY * scale);
    
    // 🎨 Panel Drawing (Beautiful Styling)
    const panels = template.panels.map((panel, index) => {
      const x = panel.x * scale + finalOffsetX;
      const y = panel.y * scale + finalOffsetY;
      const width = panel.width * scale;
      const height = panel.height * scale;
      
      // 🔧 Adjust font size (out-of-box)
      const fontSize = Math.max(10, Math.min(width, height) * 0.2);
      const textX = x + width / 2;
      const textY = y + height / 2;
      
      // 🔧 Simple panel (gradient removal, rounded corners)
      const radius = Math.min(3, Math.min(width, height) * 0.08);
      
      return `
        <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" 
              width="${width.toFixed(1)}" height="${height.toFixed(1)}" 
              rx="${radius.toFixed(1)}" ry="${radius.toFixed(1)}"
              fill="${fillColor}" 
              stroke="${strokeColor}" 
              stroke-width="2"/>
        <text x="${textX.toFixed(1)}" y="${textY.toFixed(1)}" 
              text-anchor="middle" dominant-baseline="middle" 
              fill="${textColor}" 
              font-size="${fontSize.toFixed(1)}" 
              font-family="system-ui, sans-serif" 
              font-weight="bold">${panel.id}</text>`;
    }).join('');

    // 🔧 SVG
    const background = `<rect x="0" y="0" width="${previewWidth}" height="${previewHeight}" 
                               fill="${isDarkMode ? '#1f2937' : '#ffffff'}"/>`;

    return `<svg viewBox="0 0 ${previewWidth} ${previewHeight}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">${background}${panels}</svg>`;
  };

  const getTabStyle = (category: string) => ({
    padding: '8px 16px',
    margin: '0 4px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: activeCategory === category ? '600' : '400',
    backgroundColor: activeCategory === category 
      ? (isDarkMode ? '#3b82f6' : '#3b82f6')
      : 'transparent',
    color: activeCategory === category 
      ? '#ffffff'
      : (isDarkMode ? '#d1d5db' : '#374151'),
    border: `1px solid ${activeCategory === category ? '#3b82f6' : (isDarkMode ? '#374151' : '#d1d5db')}`,
    transition: 'all 0.2s ease'
  });

  // 🎨  - 
  const getCardStyle = (templateId: string) => ({
    width: '140px',   // 
    height: '150px',  // Enlarge to fit portrait preview
    margin: '8px',
    borderRadius: '12px', // 
    cursor: 'pointer',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    boxShadow: isDarkMode 
      ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 
    overflow: 'hidden', // 
    position: 'relative' as const
  });

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '850px',    // 800px → 850px
      maxHeight: '650px', // 600px → 650px
      backgroundColor: isDarkMode ? '#111827' : '#ffffff',
      border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/*  */}
      <div style={{
        padding: '20px 24px 16px',
        borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: isDarkMode ? '#f9fafb' : '#111827'
        }}>
          📐 
        </h3>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          {categories.map(category => (
            <div
              key={category}
              style={getTabStyle(category)}
              onClick={() => setActiveCategory(category)}
            >
              {category}
              {category === '' && ' ⭐'}
              {category !== '' && ` (${templateCategories[category]?.length || 0})`}
            </div>
          ))}
        </div>
      </div>

      {/*  */}
      <div style={{
        padding: '20px',
        maxHeight: '450px',  // 400px → 450px
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', // 120px → 130px
          gap: '16px',
          justifyContent: 'center'
        }}>
          {getCurrentTemplates().map(templateId => (
            <div
              key={templateId}
              style={getCardStyle(templateId)}
              onClick={() => onTemplateSelect(templateId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 8px 25px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(59, 130, 246, 0.3)' 
                  : '0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = isDarkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = isDarkMode ? '#374151' : '#e5e7eb';
              }}
            >
              {/* 🔧  */}
              <div style={{
                width: '100%',
                height: '110px', // 
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent'
              }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  dangerouslySetInnerHTML={{ __html: generatePreview(templateId) }}
                />
              </div>
              
              <div style={{
                padding: '6px 8px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  marginBottom: '2px'
                }}>
                  {templateDescriptions[templateId]?.split(' - ')[0] || templateId}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                }}>
                  {templates[templateId]?.panels.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  */}
      <div style={{
        padding: '12px 24px',
        borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '12px',
          color: isDarkMode ? '#6b7280' : '#9ca3af'
        }}>
          💡 Click on a template to apply it • {Object.keys(templates).length}
        </div>
      </div>

      {/*  */}
      <button
        onClick={() => {
          setActiveCategory('');
          if (onClose) {
            onClose();
          } else {
            onTemplateSelect('');
          }
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
          color: isDarkMode ? '#d1d5db' : '#6b7280',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title=""
      >
        ×
      </button>
    </div>
  );
};

export default PanelTemplateSelector;