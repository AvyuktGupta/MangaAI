// src/components/UI/ProjectPanel.tsx - 
import React, { useState, useRef } from 'react';
import SaveService, { ProjectMetadata } from '../../services/SaveService';
import { BackgroundElement, EffectElement, ToneElement } from '../../types'; // 🆕 ToneElement

interface ProjectPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (projectId: string) => void;
  onNewProject: () => void;
  currentProjectId: string | null;
  saveStatus: {
    isAutoSaving: boolean;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
    error: string | null;
  };
  onSaveProject: (name?: string) => Promise<string | null>;
  className?: string;
  isDarkMode?: boolean;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  onNewProject,
  currentProjectId,
  saveStatus,
  onSaveProject,
  isDarkMode = false
}) => {
  const [projects, setProjects] = useState<ProjectMetadata[]>(() => 
    SaveService.getProjectList()
  );
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 
  const refreshProjects = () => {
    setProjects(SaveService.getProjectList());
  };

  // 
  const handleNewProject = () => {
    onNewProject();
    onClose();
  };

  // 
  const handleLoadProject = (projectId: string) => {
    onLoadProject(projectId);
    onClose();
  };

  // 
  const handleSaveAsNew = async () => {
    const name = prompt('Enter a project name:', '');
    if (name && name.trim()) {
      try {
        console.log('🎯 :', name.trim());
        
        // 
        const projectId = await onSaveProject(name.trim());
        
        console.log('📊 :', projectId);
        
        if (projectId) {
          // 
          setTimeout(() => {
            console.log('🔄 ');
            const newList = SaveService.getProjectList();
            console.log('📋 :', newList);
            setProjects(newList);
          }, 100);
          
          alert(`${name.trim()}`);
        } else {
          console.error('❌ : projectIdnull');
          alert('Failed to save project');
        }
      } catch (error) {
        console.error('❌ :', error);
        alert('An error occurred while saving the project');
      }
    }
  };

  // 🔧 Rename Project (Tone Corrected)
  const handleRename = async (projectId: string) => {
    if (newName.trim()) {
      const project = SaveService.loadProject(projectId);
      if (project) {
        // 🔧 Backwards Compatibility: Supports old project data
        const backgrounds: BackgroundElement[] = (project.data as any).backgrounds || [];
        const effects: EffectElement[] = (project.data as any).effects || [];
        const tones: ToneElement[] = (project.data as any).tones || []; // 🆕 
        
        // 🔧 characterNames, characterSettings
        SaveService.saveProject(
          newName.trim(),           // 
          project.data.panels,      // 
          project.data.characters,  // 
          project.data.bubbles,     // 
          backgrounds,              // 
          effects,                  // 
          tones,                    // 🆕 
          project.data.canvasSize,  // 
          project.data.settings,    // 
          projectId,                // ID
          project.data.characterNames,    // 
          project.data.characterSettings, // 
          project.data.pages,       // 
          project.data.currentPageIndex, // 
          project.data.canvasSettings    // 
        );
        refreshProjects();
      }
    }
    setIsRenaming(null);
    setNewName('');
  };

  // 
  const handleDelete = (projectId: string) => {
    if (SaveService.deleteProject(projectId)) {
      refreshProjects();
      if (currentProjectId === projectId) {
        onNewProject();
      }
    }
    setShowConfirmDelete(null);
  };

  // 
  const handleDuplicate = (projectId: string) => {
    const newId = SaveService.duplicateProject(projectId);
    if (newId) {
      refreshProjects();
    }
  };

  // 
  const handleExport = (projectId: string) => {
    try {
      SaveService.exportProject(projectId);
    } catch (error) {
      alert('');
    }
  };

  // 
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const projectId = await SaveService.importProject(file);
      if (projectId) {
        refreshProjects();
        alert('Project imported');
      } else {
        alert('');
      }
    }
    event.target.value = '';
  };

  // 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 
  const storageInfo = SaveService.getStorageInfo();

  // 
  const buttonStyles = {
    base: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '4px',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500' as const,
      border: 'none',
      cursor: 'pointer' as const,
      color: 'white',
      whiteSpace: 'nowrap' as const
    },
    blue: { backgroundColor: '#3b82f6' },
    green: { backgroundColor: '#10b981' },
    purple: { backgroundColor: '#8b5cf6' },
    red: { backgroundColor: '#ef4444' }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div 
        style={{
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/*  */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`,
          background: isDarkMode ? 'linear-gradient(to right, #1e3a8a, #1e40af)' : 'linear-gradient(to right, #eff6ff, #e0e7ff)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: 'bold' }}>💾</span>
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: isDarkMode ? '#f9fafb' : '#111827',
              margin: 0
            }}>
              
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? '#d1d5db' : '#6b7280',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>

        {/*  */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
          borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: saveStatus.isAutoSaving ? '#3b82f6' : 
                             saveStatus.hasUnsavedChanges ? '#f59e0b' : '#10b981'
            }}></div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDarkMode ? '#d1d5db' : '#374151'
            }}>
              {saveStatus.isAutoSaving ? '...' :
               saveStatus.hasUnsavedChanges ? '' : ''}
            </span>
          </div>
          
          {saveStatus.error && (
            <div style={{
              fontSize: '12px',
              color: '#dc2626',
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#fef2f2',
              borderRadius: '6px'
            }}>
              : {saveStatus.error}
            </div>
          )}
        </div>

        {/*  */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={handleNewProject}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#059669',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <span>📄</span>
              
            </button>
            <button
              onClick={handleSaveAsNew}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <span>💾</span>
              
            </button>
            <button
              onClick={handleImport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#7c3aed',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <span>📥</span>
              
            </button>
          </div>
        </div>

        {/*  */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px',
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff'
        }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
              <div style={{ color: '#6b7280', fontSize: '16px' }}>
                <br/>
                <span style={{ fontSize: '14px' }}>Create a new project</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: '16px',
                    border: currentProjectId === project.id ? '2px solid #3b82f6' : `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: currentProjectId === project.id ? 
                      (isDarkMode ? '#1e40af' : '#eff6ff') : 
                      (isDarkMode ? '#374151' : 'white'),
                    boxShadow: currentProjectId === project.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  onClick={() => handleLoadProject(project.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {isRenaming === project.id ? (
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          onBlur={() => handleRename(project.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(project.id);
                            if (e.key === 'Escape') setIsRenaming(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '4px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '16px',
                            backgroundColor: isDarkMode ? '#4b5563' : '#ffffff',
                            color: isDarkMode ? '#f9fafb' : '#111827'
                          }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div>
                          <h3 style={{ 
                            fontWeight: '600', 
                            color: isDarkMode ? '#f9fafb' : '#111827',
                            fontSize: '16px',
                            margin: 0,
                            padding: 0
                          }}>
                            {project.name}
                          </h3>
                          {currentProjectId === project.id && (
                            <div style={{
                              marginTop: '8px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              borderRadius: '9999px',
                              display: 'inline-block'
                            }}>
                              
                            </div>
                          )}
                          <div style={{ 
                            fontSize: '14px', 
                            color: isDarkMode ? '#9ca3af' : '#6b7280',
                            marginTop: '8px' 
                          }}>
                            : {formatDate(project.createdAt)}<br/>
                            : {formatDate(project.updatedAt)}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginLeft: '16px', 
                      flexWrap: 'wrap' 
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenaming(project.id);
                          setNewName(project.name);
                        }}
                        style={{...buttonStyles.base, ...buttonStyles.blue}}
                        title=""
                      >
                        ✏️ 
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(project.id);
                        }}
                        style={{...buttonStyles.base, ...buttonStyles.green}}
                        title=""
                      >
                        📋 
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport(project.id);
                        }}
                        style={{...buttonStyles.base, ...buttonStyles.purple}}
                        title=""
                      >
                        📥 
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowConfirmDelete(project.id);
                        }}
                        style={{...buttonStyles.base, ...buttonStyles.red}}
                        title=""
                      >
                        🗑️ 
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*  */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px'
          }}>
            <span style={{ color: isDarkMode ? '#9ca3af' : '#4b5563' }}>
              : {Math.round(storageInfo.percentage)}%
            </span>
            <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
              {(storageInfo.used / 1024).toFixed(1)}KB / {(storageInfo.available / 1024).toFixed(0)}KB
            </span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
            borderRadius: '9999px',
            height: '8px',
            marginTop: '8px'
          }}>
            <div 
              style={{
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: storageInfo.percentage > 80 ? '#ef4444' :
                                storageInfo.percentage > 60 ? '#f59e0b' : '#3b82f6',
                width: `${Math.min(storageInfo.percentage, 100)}%`,
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>

        {/*  */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/*  */}
        {showConfirmDelete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              margin: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: '#111827',
                  margin: '0 0 16px 0'
                }}>
                  
                </h3>
                <p style={{
                  color: '#4b5563',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>
                  Are you sure you want to delete this project?<br/>
                  This action cannot be undone
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowConfirmDelete(null)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      color: '#374151',
                      cursor: 'pointer'
                    }}
                  >
                    
                  </button>
                  <button
                    onClick={() => handleDelete(showConfirmDelete)}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;