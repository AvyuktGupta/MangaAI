// ===== 1: import =====
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement, Page, CanvasSettings } from '../types';


// 🔧 ProjectData interface 
// ===== 2: ProjectData interface5 =====
export interface ProjectData {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  data: {
    // 🆕 Pageable Properties (Added)
    pages?: Page[];
    currentPageIndex?: number;
    
    // Existing properties (maintained for backward compatibility)
    panels: Panel[];
    characters: Character[];
    bubbles: SpeechBubble[];
    backgrounds: BackgroundElement[];
    effects: EffectElement[];
    tones: ToneElement[];
    canvasSize: { width: number; height: number };
    settings: {
      snapEnabled: boolean;
      snapSize: number;
      darkMode: boolean;
    };
    characterNames?: Record<string, string>;
    characterSettings?: Record<string, any>;
    canvasSettings?: CanvasSettings;  // ← 
  };
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export class SaveService {
  private static readonly STORAGE_KEY = 'name_tool_projects';
  private static readonly CURRENT_PROJECT_KEY = 'name_tool_current_project';
  private static readonly VERSION = '1.0.0';

  // SaveService.ts  saveProject 
  static saveProject(
    name: string,
    panels: Panel[],
    characters: Character[],
    bubbles: SpeechBubble[],
    backgrounds: BackgroundElement[],
    effects: EffectElement[],
    tones: ToneElement[],
    canvasSize: { width: number; height: number },
    settings: { snapEnabled: boolean; snapSize: number; darkMode: boolean },
    projectId?: string,
    characterNames?: Record<string, string>,
    characterSettings?: Record<string, any>,
    pages?: Page[],
    currentPageIndex?: number,
    canvasSettings?: CanvasSettings  // ← 
  ): string {
    try {
      // 
      // 

      const id = projectId || this.generateId();
      const now = new Date().toISOString();
      
      // 
      
      const projectData: ProjectData = {
        id,
        name,
        version: this.VERSION,
        createdAt: projectId ? this.getProject(projectId)?.createdAt || now : now,
        updatedAt: now,
        data: {
          // 🆕 Save page data (only if present)
          ...(pages && { pages: JSON.parse(JSON.stringify(pages)) }),
          ...(currentPageIndex !== undefined && { currentPageIndex }),
          
          // Existing data (backwards compatibility maintained)
          panels: JSON.parse(JSON.stringify(panels)),
          characters: JSON.parse(JSON.stringify(characters)),
          bubbles: JSON.parse(JSON.stringify(bubbles)),
          backgrounds: JSON.parse(JSON.stringify(backgrounds)),
          effects: JSON.parse(JSON.stringify(effects)),
          tones: JSON.parse(JSON.stringify(tones)),
          canvasSize,
          settings,
          characterNames,
          characterSettings,
          canvasSettings  // ← 
        }
      };

      // 

      // 
      const projects = this.getAllProjects();
      // 
      
      const existingIndex = projects.findIndex(p => p.id === id);
      // 
      
      if (existingIndex >= 0) {
        // 
        projects[existingIndex] = projectData;
      } else {
        // 
        projects.push(projectData);
      }

      // 

      const dataToSave = JSON.stringify(projects);
      // 
      
      localStorage.setItem(this.STORAGE_KEY, dataToSave);
      localStorage.setItem(this.CURRENT_PROJECT_KEY, id);
      
      // 

      // 
      const verification = localStorage.getItem(this.STORAGE_KEY);
      // 

      // 
      return id;

        } catch (error) {
      console.error('❌ Project save error:', error);
      
      // 🔧 TypeScripterror
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error('❌ Error detail:', errorMessage);
      if (errorStack) {
        console.error('❌ Stack trace:', errorStack);
      }
      
      throw new Error('Failed to save project');
    }
  }

  // SaveService.ts loadProject

  /**
   * Load Project (Pageable Version)
   */
  static loadProject(projectId: string): ProjectData | null {
    try {
      const projects = this.getAllProjects();
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        // 🔧 Backward compatibility: Initialize with empty array if various data is not available
        if (!project.data.effects) {
          project.data.effects = [];
        }
        if (!project.data.tones) {
          project.data.tones = [];
        }
        if (!project.data.characterNames) {
          project.data.characterNames = {
            hero: 'Hero',
            heroine: 'Heroine',
            rival: 'Rival',
            friend: 'Friend'
          };
        }
        if (!project.data.characterSettings) {
          project.data.characterSettings = {
            hero: { appearance: null, role: 'Hero' },
            heroine: { appearance: null, role: 'Heroine' },
            rival: { appearance: null, role: 'Rival' },
            friend: { appearance: null, role: 'Friend' }
          };
        }
        
        // 🆕 Backward compatibility of page data: Generated from existing data if none
        if (!project.data.pages) {
          project.data.pages = [{
            id: `page_${Date.now()}`,
            title: 'Page 1',
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            panels: project.data.panels,
            characters: project.data.characters,
            bubbles: project.data.bubbles,
            backgrounds: project.data.backgrounds,
            effects: project.data.effects,
            tones: project.data.tones
          }];
          project.data.currentPageIndex = 0;
        }
        
        // 🆕 canvasSettingsBackward compatibility: initialize with default value if none
        if (!project.data.canvasSettings) {
          project.data.canvasSettings = {
            paperSize: {
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
            dpi: 300,
            showMargins: false,
            marginSize: 10,
            gridVisible: false,
            gridSize: 5
          };
        }
        
        localStorage.setItem(this.CURRENT_PROJECT_KEY, projectId);
        // 
        return project;
      }
      
      return null;
    } catch (error) {
      console.error('Project load error:', error);
      return null;
    }
  }

  /**
   * ID
   */
  static getCurrentProjectId(): string | null {
    return localStorage.getItem(this.CURRENT_PROJECT_KEY);
  }

  /**
   * 
   */
  static getCurrentProject(): ProjectData | null {
    const currentId = this.getCurrentProjectId();
    return currentId ? this.loadProject(currentId) : null;
  }

  // SaveService.ts  getAllProjects 

  /**
   * Get a list of projects (tone-enabled version) + 
   */
  static getAllProjects(): ProjectData[] {
    try {
      // 
      
      const data = localStorage.getItem(this.STORAGE_KEY);
      // 
      
      if (!data) {
        // 
        return [];
      }
      
      const projects = JSON.parse(data);
      // 
      
      if (Array.isArray(projects) && projects.length > 0) {
        projects.forEach((project, index) => {
          // 
        });
      }
      
      // 🔧 Backward compatibility: add effect line, tone, character name data to existing projects
      const processedProjects = projects.map((project: ProjectData) => {
        if (!project.data.effects) {
          project.data.effects = [];
        }
        if (!project.data.tones) {
          project.data.tones = [];
        }
        // 🆕 Character Name/Setting Data Backward Compatibility
        if (!project.data.characterNames) {
          project.data.characterNames = {
            hero: 'Hero',
            heroine: 'Heroine',
            rival: 'Rival',
            friend: 'Friend'
          };
        }
        if (!project.data.characterSettings) {
          project.data.characterSettings = {
            hero: { appearance: null, role: 'Hero' },
            heroine: { appearance: null, role: 'Heroine' },
            rival: { appearance: null, role: 'Rival' },
            friend: { appearance: null, role: 'Friend' }
          };
        }
        // 🆕 canvasSettings
        if (!project.data.canvasSettings) {
          project.data.canvasSettings = {
            paperSize: {
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
            dpi: 300,
            showMargins: false,
            marginSize: 10,
            gridVisible: false,
            gridSize: 5
          };
        }
        return project;
      });
      
      // 
      return Array.isArray(processedProjects) ? processedProjects : [];
      
    } catch (error) {
      console.error('❌ Failed to list projects:', error);
      return [];
    }
  }

  // SaveService.ts  getProjectList 

  /**
   * Get project metadata list (debug version)
   */
  static getProjectList(): ProjectMetadata[] {
    // 
    
    const allProjects = this.getAllProjects();
    // 
    
    if (allProjects.length > 0) {
      allProjects.forEach((project, index) => {
        // 
      });
    }
    
    const projectList = allProjects.map(project => ({
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    
    // 
    
    return projectList;
  }
  /**
   * 
   */
  static deleteProject(projectId: string): boolean {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      
      if (filteredProjects.length === projects.length) {
        return false;
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));
      
      if (this.getCurrentProjectId() === projectId) {
        localStorage.removeItem(this.CURRENT_PROJECT_KEY);
      }

      console.log(`Project deleted (ID: ${projectId})`);
      return true;
    } catch (error) {
      console.error('Project delete error:', error);
      return false;
    }
  }

  /**
   * 
   */
  static duplicateProject(projectId: string, newName?: string): string | null {
    try {
      const original = this.getProject(projectId);
      if (!original) return null;

      // saveProjectDuplicate correctly using the method (characterNames, characterSettings
      const newProjectId = this.saveProject(
        newName || `${original.name} (copy)`,
        original.data.panels,
        original.data.characters,
        original.data.bubbles,
        original.data.backgrounds,
        original.data.effects,
        original.data.tones,
        original.data.canvasSize,
        original.data.settings,
        undefined, // ID
        original.data.characterNames,
        original.data.characterSettings,
        original.data.pages,
        original.data.currentPageIndex,
        original.data.canvasSettings
      );

      console.log(`Project duplicated: "${original.name}"`);
      return newProjectId;
    } catch (error) {
      console.error('Project duplicate error:', error);
      return null;
    }
  }

  /**
   * EXPORT PROJECTJSON
   */
  static exportProject(projectId: string): void {
    try {
      const project = this.getProject(projectId);
      if (!project) throw new Error('Project not found');

      const dataStr = JSON.stringify(project, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`Project exported: "${project.name}"`);
    } catch (error) {
      console.error('Project export error:', error);
      throw new Error('Failed to export project');
    }
  }

  /**
   * JSON
   */
  static async importProject(file: File): Promise<string | null> {
    try {
      const text = await file.text();
      const projectData: ProjectData = JSON.parse(text);
      
      if (!this.validateProjectData(projectData)) {
        throw new Error('Invalid project file');
      }

      // 🔧 Backward compatibility: initialization if various data is not available
      if (!projectData.data.effects) {
        projectData.data.effects = [];
      }
      if (!projectData.data.tones) {
        projectData.data.tones = [];
      }
      if (!projectData.data.characterNames) {
        projectData.data.characterNames = {
          hero: 'Hero',
          heroine: 'Heroine',
          rival: 'Rival',
          friend: 'Friend'
        };
      }
      if (!projectData.data.characterSettings) {
        projectData.data.characterSettings = {
          hero: { appearance: null, role: 'Hero' },
          heroine: { appearance: null, role: 'Heroine' },
          rival: { appearance: null, role: 'Rival' },
          friend: { appearance: null, role: 'Friend' }
        };
      }

      const newId = this.generateId();
      const now = new Date().toISOString();
      
      projectData.id = newId;
      projectData.updatedAt = now;

      const projects = this.getAllProjects();
      projects.push(projectData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));

      console.log(`Project imported: "${projectData.name}"`);
      return newId;
    } catch (error) {
      console.error('Project import error:', error);
      return null;
    }
  }

  /**
   * 
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || '';
      const used = new Blob([data]).size;
      const available = 5 * 1024 * 1024;
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch (error) {
      console.error('Storage info error:', error);
      return { used: 0, available: 5 * 1024 * 1024, percentage: 0 };
    }
  }

  // Private methods
  private static getProject(projectId: string): ProjectData | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === projectId) || null;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 🔧 characterNames, characterSettings
  private static validateProjectData(data: any): data is ProjectData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.version === 'string' &&
      data.data &&
      Array.isArray(data.data.panels) &&
      Array.isArray(data.data.characters) &&
      Array.isArray(data.data.bubbles) &&
      Array.isArray(data.data.backgrounds) &&
      // effectstonesis not required for backwards compatibility
      (data.data.effects === undefined || Array.isArray(data.data.effects)) &&
      (data.data.tones === undefined || Array.isArray(data.data.tones)) &&
      // characterNames, characterSettingsis not required for backwards compatibility
      (data.data.characterNames === undefined || typeof data.data.characterNames === 'object') &&
      (data.data.characterSettings === undefined || typeof data.data.characterSettings === 'object') &&
      // pages, currentPageIndex, canvasSettingsis not required for backwards compatibility
      (data.data.pages === undefined || Array.isArray(data.data.pages)) &&
      (data.data.currentPageIndex === undefined || typeof data.data.currentPageIndex === 'number')
    );
  }
}

export default SaveService;