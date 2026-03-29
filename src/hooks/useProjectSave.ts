// src/hooks/useProjectSave.ts - App.tsx
import { useEffect, useRef, useCallback, useState } from 'react';
import SaveService from '../services/SaveService';
import { Panel, Character, SpeechBubble, BackgroundElement, EffectElement, ToneElement, DEFAULT_CANVAS_SETTINGS } from '../types';

// 🔧 App.tsxFit to expected return type of
interface UseProjectSaveReturn {
  saveProject: (projectData: any, projectName?: string) => Promise<string | boolean>;
  loadProject: (projectKey?: string) => any | null;
  autoSave: (projectData: any) => Promise<void>;
  getProjectList: () => Array<{key: string, name: string, timestamp: string}>;
  deleteProject: (projectKey: string) => boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // 🆕 App.tsx
  hasUnsavedChanges: boolean;
  isAutoSaving: boolean;
  currentProjectId: string | null;
  currentProjectName: string | null;
  saveStatus: {
    isAutoSaving: boolean;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
    error: string | null;
  };
  newProject: () => void;
  checkForChanges: (currentData: any) => void;
}

// 🔧 Make it callable without arguments
export const useProjectSave = (): UseProjectSaveReturn => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SaveService
  const saveProject = useCallback(async (
    projectData: any,
    projectName: string = 'untitled'
  ): Promise<string | boolean> => {
    setIsSaving(true);
    setError(null);
    
    try {

      // 🆕 SaveService.ts 
      const projectId = SaveService.saveProject(
        projectName,                                    // name
        projectData.panels || [],                       // panels
        projectData.characters || [],                   // characters  
        projectData.bubbles || [],                      // bubbles
        projectData.backgrounds || [],                  // backgrounds
        projectData.effects || [],                      // effects
        projectData.tones || [],                        // tones
        projectData.canvasSize || { width: 800, height: 600 }, // canvasSize
        projectData.settings || { snapEnabled: true, snapSize: 20, darkMode: false }, // settings
        currentProjectId || undefined,                  // projectId (update existing)
        projectData.characterNames || {},               // characterNames
        projectData.characterSettings || {},            // characterSettings
        projectData.pages,                              // pages
        projectData.currentPageIndex,                   // currentPageIndex
        projectData.canvasSettings                      // canvasSettings
      );
      
      setCurrentProjectId(projectId);
      setCurrentProjectName(projectName);
      
      // SaveService
      const savedProject = SaveService.loadProject(projectId);
      if (savedProject) {
        setLastSaved(new Date(savedProject.updatedAt));
      } else {
        setLastSaved(new Date());
      }
      
      setHasUnsavedChanges(false);
      setLastSavedData(JSON.stringify(projectData));
      
      return projectId;
    } catch (error) {
      console.error('❌ :', error);
      setError(error instanceof Error ? error.message : '');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [currentProjectId]);

  // SaveService + 
  const loadProject = useCallback((projectKey?: string): any | null => {
    try {
      console.log('📂  - projectKey:', projectKey);
      
      const projectId = projectKey || SaveService.getCurrentProjectId();
      console.log('🆔 ID:', projectId);
      
      if (!projectId) {
        console.log('❌ ID');
        return null;
      }

      const projectData = SaveService.loadProject(projectId);
      console.log('📊 SaveService:', projectData ? '' : '');
      
      if (!projectData) {
        console.log('❌ Project data not found');
        return null;
      }
      
      console.log('📋 :', {
        id: projectData.id,
        name: projectData.name,
        dataKeys: Object.keys(projectData.data),
        panelsCount: projectData.data.panels?.length || 0,
        charactersCount: projectData.data.characters?.length || 0
      });

      // 🔧 App.tsxreturns data in the format expected by (data.Direct properties, not properties)
      const loadedData = {
        panels: projectData.data.panels || [],
        characters: projectData.data.characters || [],
        bubbles: projectData.data.bubbles || [],
        backgrounds: projectData.data.backgrounds || [],
        effects: projectData.data.effects || [],
        tones: projectData.data.tones || [],
        canvasSize: projectData.data.canvasSize || { width: 800, height: 600 },
        settings: projectData.data.settings || { snapEnabled: true, snapSize: 20, darkMode: false },
        characterNames: projectData.data.characterNames || {},
        characterSettings: projectData.data.characterSettings || {},
        pages: projectData.data.pages,
        currentPageIndex: projectData.data.currentPageIndex,
        canvasSettings: projectData.data.canvasSettings || DEFAULT_CANVAS_SETTINGS  // 1
      };


      setCurrentProjectId(projectId);
      setCurrentProjectName(projectData.name);
      setLastSaved(new Date(projectData.updatedAt));
      setHasUnsavedChanges(false);
      setError(null);

      return loadedData;
    } catch (error) {
      console.error('❌ :', error);
      setError(error instanceof Error ? error.message : '');
      return null;
    }
  }, []);

  // currentProjectId
  useEffect(() => {
    if (currentProjectId && (currentProjectName === null || currentProjectName === '')) {
      // If the project exists but has no name, delete the project and revert to a new state
      localStorage.removeItem('name_tool_current_project');
      setCurrentProjectId(null);
      setCurrentProjectName(null);
      setHasUnsavedChanges(false);
    }
  }, [currentProjectId, currentProjectName]);

  // 
  const autoSave = useCallback(async (projectData: any): Promise<void> => {
    if (isAutoSaving) return;
    
    setIsAutoSaving(true);
    try {
      const autoSaveKey = 'manga-project-autosave';
      const autoSaveData = {
        ...projectData,
        version: '2.0',
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(autoSaveKey, JSON.stringify(autoSaveData));
      console.log('💾 ');
    } catch (error) {
      console.error('❌ :', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [isAutoSaving]);

  // SaveService
  const getProjectList = useCallback((): Array<{key: string, name: string, timestamp: string}> => {
    try {
      const projects = SaveService.getProjectList();
      return projects.map(project => ({
        key: project.id,
        name: project.name,
        timestamp: project.updatedAt
      }));
    } catch (error) {
      console.error('❌ :', error);
      return [];
    }
  }, []);

  // SaveService
  const deleteProject = useCallback((projectKey: string): boolean => {
    try {
      const result = SaveService.deleteProject(projectKey);
      if (result && projectKey === currentProjectId) {
        setCurrentProjectId(null);
        setLastSaved(null);
        setHasUnsavedChanges(false);
      }
      return result;
    } catch (error) {
      console.error('❌ :', error);
      return false;
    }
  }, [currentProjectId]);

  // 
  const newProject = useCallback(() => {
    setCurrentProjectId(null);
    setLastSaved(null);
    setHasUnsavedChanges(false);
    setError(null);
    console.log('📄 ');
  }, []);

  // SaveService
  useEffect(() => {
    const currentId = SaveService.getCurrentProjectId();
    if (currentId) {
      const project = SaveService.loadProject(currentId);
      if (project) {
        setCurrentProjectId(currentId);
        setLastSaved(new Date(project.updatedAt));
      }
    }
  }, []);

  // saveStatus 
  const saveStatus = {
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges,
    error
  };

  // 
  const checkForChanges = useCallback((currentData: any) => {
    const currentDataString = JSON.stringify(currentData);
    const hasChanges = currentDataString !== lastSavedData;
    setHasUnsavedChanges(hasChanges);
  }, [lastSavedData]);

  return {
    saveProject,
    loadProject,
    autoSave,
    getProjectList,
    deleteProject,
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    isAutoSaving,
    currentProjectId,
    currentProjectName,
    saveStatus,
    newProject,
    checkForChanges
  };
};

export default useProjectSave;