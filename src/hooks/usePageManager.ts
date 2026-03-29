// src/hooks/usePageManager.ts - Hook

import { useState, useCallback, useMemo } from 'react';
import { 
  Page, 
  Panel, 
  Character, 
  SpeechBubble, 
  BackgroundElement, 
  EffectElement, 
  ToneElement,
  UsePageManagerReturn 
} from '../types';
import { BetaUtils } from '../config/betaConfig';

interface UsePageManagerProps {
  // Current single page data (from existing system)
  panels: Panel[];
  characters: Character[];
  bubbles: SpeechBubble[];
  backgrounds: BackgroundElement[];
  effects: EffectElement[];
  tones: ToneElement[];
  
  // Data update callback (to existing system)
  onDataUpdate: (pageData: {
    panels: Panel[];
    characters: Character[];
    bubbles: SpeechBubble[];
    backgrounds: BackgroundElement[];
    effects: EffectElement[];
    tones: ToneElement[];
  }) => void;
}

export const usePageManager = (props: UsePageManagerProps): UsePageManagerReturn => {
  const { panels, characters, bubbles, backgrounds, effects, tones, onDataUpdate } = props;

  // 
  const [pages, setPages] = useState<Page[]>(() => [
    {
      id: generatePageId(),
      title: ' 1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      panels: [],
      characters: [],
      bubbles: [],
      backgrounds: [],
      effects: [],
      tones: []
    }
  ]);

  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Current page data (using data from an existing system)
  const currentPage = useMemo((): Page => ({
    id: pages[currentPageIndex]?.id || generatePageId(),
    title: pages[currentPageIndex]?.title || ` ${currentPageIndex + 1}`,
    note: pages[currentPageIndex]?.note,
    createdAt: pages[currentPageIndex]?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    panels,
    characters,
    bubbles,
    backgrounds,
    effects,
    tones
  }), [pages, currentPageIndex, panels, characters, bubbles, backgrounds, effects, tones]);

  // 
  const addPage = useCallback(() => {
    // 🔒 : 
    if (!BetaUtils.canAddPage(pages.length)) {
      alert('1\nMultiple pages available in full version!');
      return;
    }

    const newPage: Page = {
      id: generatePageId(),
      title: ` ${pages.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      panels: [],
      characters: [],
      bubbles: [],
      backgrounds: [],
      effects: [],
      tones: []
    };

    setPages(prev => [...prev, newPage]);
    
    // 
    const newIndex = pages.length;
    setCurrentPageIndex(newIndex);
    
    // Update existing system to empty data
    onDataUpdate({
      panels: [],
      characters: [],
      bubbles: [],
      backgrounds: [],
      effects: [],
      tones: []
    });

    console.log(`📄 : ${newPage.title}`);
  }, [pages.length, onDataUpdate]);

  // 
  const deletePage = useCallback((pageIndex: number) => {
    if (pages.length <= 1) {
      console.warn('⚠️ The last page cannot be deleted');
      return;
    }

    const pageToDelete = pages[pageIndex];
    if (!pageToDelete) return;

    if (window.confirm(`${pageToDelete.title}`)) {
      const newPages = pages.filter((_, index) => index !== pageIndex);
      setPages(newPages);

      // Adjust current page index
      const newCurrentIndex = Math.min(currentPageIndex, newPages.length - 1);
      setCurrentPageIndex(newCurrentIndex);

      // Update existing system with adjusted page data
      const targetPage = newPages[newCurrentIndex];
      if (targetPage) {
        onDataUpdate({
          panels: targetPage.panels,
          characters: targetPage.characters,
          bubbles: targetPage.bubbles,
          backgrounds: targetPage.backgrounds,
          effects: targetPage.effects,
          tones: targetPage.tones
        });
      }

      console.log(`🗑️ : ${pageToDelete.title}`);
    }
  }, [pages, currentPageIndex, onDataUpdate]);

  // 
  const duplicatePage = useCallback((pageIndex: number) => {
    const pageToClone = pages[pageIndex];
    if (!pageToClone) return;

    const clonedPage: Page = {
      id: generatePageId(),
      title: `${pageToClone.title} `,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      panels: JSON.parse(JSON.stringify(pageToClone.panels)),
      characters: JSON.parse(JSON.stringify(pageToClone.characters)),
      bubbles: JSON.parse(JSON.stringify(pageToClone.bubbles)),
      backgrounds: JSON.parse(JSON.stringify(pageToClone.backgrounds)),
      effects: JSON.parse(JSON.stringify(pageToClone.effects)),
      tones: JSON.parse(JSON.stringify(pageToClone.tones))
    };

    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, clonedPage);
    setPages(newPages);

    // 
    const newIndex = pageIndex + 1;
    setCurrentPageIndex(newIndex);
    
    // Update existing system with duplicate data
    onDataUpdate({
      panels: clonedPage.panels,
      characters: clonedPage.characters,
      bubbles: clonedPage.bubbles,
      backgrounds: clonedPage.backgrounds,
      effects: clonedPage.effects,
      tones: clonedPage.tones
    });

    console.log(`📋 : ${pageToClone.title} → ${clonedPage.title}`);
  }, [pages, onDataUpdate]);

  // 
  const renamePage = useCallback((pageIndex: number, newTitle: string) => {
    if (!newTitle.trim()) return;

    setPages(prev => prev.map((page, index) => 
      index === pageIndex 
        ? { ...page, title: newTitle.trim(), updatedAt: new Date().toISOString() }
        : page
    ));

    console.log(`✏️ : ${pages[pageIndex]?.title} → ${newTitle}`);
  }, [pages]);

  // 
  const switchToPage = useCallback((pageIndex: number) => {
    if (pageIndex < 0 || pageIndex >= pages.length) return;

    // 
    const updatedCurrentPage = { ...currentPage };
    setPages(prev => prev.map((page, index) => 
      index === currentPageIndex ? updatedCurrentPage : page
    ));

    // 
    setCurrentPageIndex(pageIndex);
    
    // Update existing system with switching page data
    const targetPage = pages[pageIndex];
    onDataUpdate({
      panels: targetPage.panels,
      characters: targetPage.characters,
      bubbles: targetPage.bubbles,
      backgrounds: targetPage.backgrounds,
      effects: targetPage.effects,
      tones: targetPage.tones
    });

    console.log(`📄 : ${targetPage.title} (${pageIndex + 1}/${pages.length})`);
  }, [currentPage, currentPageIndex, pages, onDataUpdate]);

  // 
  const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newPages = [...pages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);
    
    setPages(newPages);

    // Adjust current page index
    let newCurrentIndex = currentPageIndex;
    if (currentPageIndex === fromIndex) {
      newCurrentIndex = toIndex;
    } else if (fromIndex < currentPageIndex && toIndex >= currentPageIndex) {
      newCurrentIndex = currentPageIndex - 1;
    } else if (fromIndex > currentPageIndex && toIndex <= currentPageIndex) {
      newCurrentIndex = currentPageIndex + 1;
    }
    
    setCurrentPageIndex(newCurrentIndex);

    console.log(`🔄 : ${fromIndex} → ${toIndex}`);
  }, [pages, currentPageIndex]);

  // Current page data update (called from an existing system)
  const updateCurrentPageData = useCallback((data: Partial<Page>) => {
    // pages
    setPages(prev => prev.map((page, index) => 
      index === currentPageIndex 
        ? { ...page, ...data, updatedAt: new Date().toISOString() }
        : page
    ));
  }, [currentPageIndex]);

  // 
  const canDeletePage = useMemo(() => pages.length > 1, [pages.length]);

  // 
  const hasUnsavedChanges = useMemo(() => {
    const savedPage = pages[currentPageIndex];
    if (!savedPage) return false;

    // Compare current data with saved data
    return (
      JSON.stringify(savedPage.panels) !== JSON.stringify(panels) ||
      JSON.stringify(savedPage.characters) !== JSON.stringify(characters) ||
      JSON.stringify(savedPage.bubbles) !== JSON.stringify(bubbles) ||
      JSON.stringify(savedPage.backgrounds) !== JSON.stringify(backgrounds) ||
      JSON.stringify(savedPage.effects) !== JSON.stringify(effects) ||
      JSON.stringify(savedPage.tones) !== JSON.stringify(tones)
    );
  }, [pages, currentPageIndex, panels, characters, bubbles, backgrounds, effects, tones]);

  return {
    pages,
    currentPageIndex,
    currentPage,
    addPage,
    deletePage,
    duplicatePage,
    renamePage,
    switchToPage,
    reorderPages,
    updateCurrentPageData,
    canDeletePage,
    hasUnsavedChanges
  };
};

// ID
const generatePageId = (): string => {
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default usePageManager;