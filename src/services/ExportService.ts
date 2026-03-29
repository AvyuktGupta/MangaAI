import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// 🔧 : ToneElement
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement } from '../types';

export interface ExportOptions {
  format: 'pdf' | 'png' | 'psd';
  quality: 'high' | 'medium' | 'low';
  resolution: number; // DPI
  includeBackground: boolean;
  separatePages: boolean; // PDF, do you want each frame to be on a separate page?
}

export interface ExportProgress {
  step: string;
  progress: number; // 0-100
  message: string;
}

export class ExportService {
  private static instance: ExportService;
  
  private constructor() {}
  
  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * PDF
   */
  async exportToPDF(
    canvasElement: HTMLCanvasElement,
    panels: Panel[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    try {
      onProgress?.({ step: 'initialize', progress: 0, message: 'PDF...' });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      if (options.separatePages) {
        // 
        await this.exportPanelsSeparately(pdf, canvasElement, panels, options, onProgress);
      } else {
        // 1
        await this.exportCanvasAsSinglePage(pdf, canvasElement, options, onProgress);
      }

      onProgress?.({ step: 'saving', progress: 95, message: 'PDF...' });
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      pdf.save(`_${timestamp}.pdf`);

      onProgress?.({ step: 'complete', progress: 100, message: 'PDF' });
    } catch (error) {
      console.error('PDF:', error);
      throw new Error('PDF');
    }
  }

  /**
   * PNG
   */
  async exportToPNG(
    canvasElement: HTMLCanvasElement,
    panels: Panel[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    try {
      onProgress?.({ step: 'initialize', progress: 0, message: 'PNG...' });

      // 
      const fullCanvas = await this.captureCanvas(canvasElement, options);
      this.downloadImage(fullCanvas, '_.png');

      onProgress?.({ step: 'panels', progress: 30, message: '...' });

      // 
      for (let i = 0; i < panels.length; i++) {
        const panel = panels[i];
        const panelCanvas = await this.capturePanelArea(canvasElement, panel, options);
        this.downloadImage(panelCanvas, `_${i + 1}.png`);
        
        const progress = 30 + (60 * (i + 1) / panels.length);
        onProgress?.({ step: 'panels', progress, message: ` ${i + 1}/${panels.length} ` });
      }

      onProgress?.({ step: 'complete', progress: 100, message: 'PNG' });
    } catch (error) {
      console.error('PNG:', error);
      throw new Error('PNG');
    }
  }

  /**
   * PSDData output (tone-compatible version)
   */
  async exportToPSD(
    canvasElement: HTMLCanvasElement,
    panels: Panel[],
    characters: Character[],
    bubbles: SpeechBubble[],
    backgrounds: BackgroundElement[],
    effects: EffectElement[],
    tones: ToneElement[], // 🆕 
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    try {
      onProgress?.({ step: 'initialize', progress: 0, message: '...' });

      // PSDThe format is complex, so output structured data as an alternative
      const layerData = this.createLayerStructure(panels, characters, bubbles, backgrounds, effects, tones);
      
      onProgress?.({ step: 'layers', progress: 50, message: '...' });

      // JSONOutput as file (readable by Christa)
      const jsonData = JSON.stringify(layerData, null, 2);
      this.downloadJSON(jsonData, '_.json');

      // PNG
      await this.exportLayersAsPNG(canvasElement, layerData, options, onProgress);

      onProgress?.({ step: 'complete', progress: 100, message: '' });
    } catch (error) {
      console.error('PSD:', error);
      throw new Error('Failed to output data for Christa');
    }
  }

  /**
   * Export Settings Validation
   */
  validateExportOptions(options: ExportOptions): string[] {
    const errors: string[] = [];

    if (options.resolution < 72 || options.resolution > 600) {
      errors.push('72-600DPI');
    }

    if (!['pdf', 'png', 'psd'].includes(options.format)) {
      errors.push('Unsupported output format');
    }

    return errors;
  }

  // ============  ============

  private async exportPanelsSeparately(
    pdf: jsPDF,
    canvasElement: HTMLCanvasElement,
    panels: Panel[],
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      
      onProgress?.({ 
        step: 'panels', 
        progress: 10 + (80 * i / panels.length), 
        message: ` ${i + 1}/${panels.length} ...` 
      });

      const panelCanvas = await this.capturePanelArea(canvasElement, panel, options);
      
      if (i > 0) {
        pdf.addPage();
      }

      // A4
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (panelCanvas.height * imgWidth) / panelCanvas.width;

      pdf.addImage(
        panelCanvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        margin,
        margin,
        imgWidth,
        Math.min(imgHeight, pageHeight - (margin * 2))
      );
    }
  }

  private async exportCanvasAsSinglePage(
    pdf: jsPDF,
    canvasElement: HTMLCanvasElement,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    onProgress?.({ step: 'capture', progress: 20, message: '...' });

    const canvas = await this.captureCanvas(canvasElement, options);
    
    onProgress?.({ step: 'convert', progress: 60, message: 'PDF...' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      margin,
      margin,
      imgWidth,
      Math.min(imgHeight, pageHeight - (margin * 2))
    );
  }

  private async captureCanvas(
    canvasElement: HTMLCanvasElement,
    options: ExportOptions
  ): Promise<HTMLCanvasElement> {
    const scale = this.getScaleFromQuality(options.quality);
    
    return html2canvas(canvasElement, {
      scale: scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: options.includeBackground ? '#ffffff' : null
    });
  }

  private async capturePanelArea(
    canvasElement: HTMLCanvasElement,
    panel: Panel,
    options: ExportOptions
  ): Promise<HTMLCanvasElement> {
    const scale = this.getScaleFromQuality(options.quality);
    
    // 
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    tempCanvas.width = panel.width * scale;
    tempCanvas.height = panel.height * scale;
    
    if (options.includeBackground) {
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }

    // Copy the area from the canvas element
    tempCtx.drawImage(
      canvasElement,
      panel.x, panel.y, panel.width, panel.height,
      0, 0, tempCanvas.width, tempCanvas.height
    );

    return tempCanvas;
  }

  // 🔧 Create a tone-compatible version of the layer structure (types.ts
  private createLayerStructure(
    panels: Panel[],
    characters: Character[],
    bubbles: SpeechBubble[],
    backgrounds: BackgroundElement[],
    effects: EffectElement[],
    tones: ToneElement[] // 🆕 
  ): any {
    return {
      version: '1.0',
      createdAt: new Date().toISOString(),
      layers: {
        panels: panels.map((panel, index) => ({
          id: panel.id,
          name: `${index + 1}`,
          x: panel.x,
          y: panel.y,
          width: panel.width,
          height: panel.height,
          visible: true
        })),
        characters: characters.map((char, index) => ({
          id: char.id,
          name: `${index + 1}`,
          x: char.x,
          y: char.y,
          scale: char.scale,
          type: char.type,
          // 🔧 types.ts
          expression: char.expression || "normal",           // faceExpression → expression
          pose: char.action || "standing",                   // bodyPose → action  
          direction: char.facing || "front",                 // bodyDirection → facing
          gaze: char.eyeState || "front",                    // eyeDirection → eyeState
          visible: true
        })),
        bubbles: bubbles.map((bubble, index) => ({
          id: bubble.id,
          name: `${index + 1}`,
          x: bubble.x,
          y: bubble.y,
          width: bubble.width,
          height: bubble.height,
          text: bubble.text,
          type: bubble.type,
          visible: true
        })),
        backgrounds: backgrounds.map((bg, index) => ({
          id: bg.id,
          name: `${index + 1}`,
          x: bg.x,
          y: bg.y,
          width: bg.width,
          height: bg.height,
          type: bg.type,
          opacity: bg.opacity,
          zIndex: bg.zIndex,
          visible: true
        })),
        effects: effects.map((effect, index) => ({
          id: effect.id,
          name: `${index + 1}`,
          x: effect.x,
          y: effect.y,
          width: effect.width,
          height: effect.height,
          type: effect.type,
          direction: effect.direction,
          intensity: effect.intensity,
          density: effect.density,
          color: effect.color,
          opacity: effect.opacity,
          zIndex: effect.zIndex,
          visible: true
        })),
        // 🆕 
        tones: tones.map((tone, index) => ({
          id: tone.id,
          name: `${index + 1}`,
          x: tone.x,
          y: tone.y,
          width: tone.width,
          height: tone.height,
          type: tone.type,
          pattern: tone.pattern,
          density: tone.density,
          opacity: tone.opacity,
          rotation: tone.rotation,
          scale: tone.scale,
          blendMode: tone.blendMode,
          contrast: tone.contrast,
          brightness: tone.brightness,
          invert: tone.invert,
          zIndex: tone.zIndex,
          visible: tone.visible
        }))
      }
    };
  }

  private async exportLayersAsPNG(
    canvasElement: HTMLCanvasElement,
    layerData: any,
    options: ExportOptions,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<void> {
    // PNG
    const allLayers = [
      ...layerData.layers.panels,
      ...layerData.layers.characters,
      ...layerData.layers.bubbles,
      ...layerData.layers.backgrounds,
      ...layerData.layers.effects,
      ...layerData.layers.tones // 🆕 
    ];

    for (let i = 0; i < allLayers.length; i++) {
      const layer = allLayers[i];
      
      // Capture layer area (simplified implementation)
      const layerCanvas = await this.captureLayerArea(canvasElement, layer, options);
      this.downloadImage(layerCanvas, `_${layer.name}.png`);
      
      const progress = 60 + (35 * (i + 1) / allLayers.length);
      onProgress?.({ step: 'layers', progress, message: ` ${i + 1}/${allLayers.length} ` });
    }
  }

  private async captureLayerArea(
    canvasElement: HTMLCanvasElement,
    layer: any,
    options: ExportOptions
  ): Promise<HTMLCanvasElement> {
    // 
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    tempCanvas.width = layer.width;
    tempCanvas.height = layer.height;
    
    tempCtx.drawImage(
      canvasElement,
      layer.x, layer.y, layer.width, layer.height,
      0, 0, layer.width, layer.height
    );

    return tempCanvas;
  }

  private getScaleFromQuality(quality: string): number {
    switch (quality) {
      case 'high': return 3.0;
      case 'medium': return 2.0;
      case 'low': return 1.0;
      default: return 2.0;
    }
  }

  private downloadImage(canvas: HTMLCanvasElement, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private downloadJSON(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
}