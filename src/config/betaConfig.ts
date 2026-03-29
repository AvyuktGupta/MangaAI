/**
 * Beta vs full-app limits (pages, exports, UI hints).
 */

export interface BetaConfig {
  isBetaVersion: boolean;
  maxPages: number;
  allowProjectSave: boolean;
  allowCloudSave: boolean;

  allowedExportFormats: string[];
  allowHighQualityExport: boolean;
  allowPSDExport: boolean;
  allowNanoBananaExport: boolean;

  allowAdvancedCharacterSettings: boolean;
  allowDetailedStatistics: boolean;
  allowProjectSharing: boolean;

  showUpgradePrompts: boolean;
  betaVersionMessage: string;
}

export const BETA_CONFIG: BetaConfig = {
  isBetaVersion: true,
  maxPages: 1,
  allowProjectSave: true,
  allowCloudSave: true,

  allowedExportFormats: ['pdf', 'png', 'psd'],
  allowHighQualityExport: true,
  allowPSDExport: true,
  allowNanoBananaExport: true,

  allowAdvancedCharacterSettings: true,
  allowDetailedStatistics: true,
  allowProjectSharing: true,

  showUpgradePrompts: true,
  betaVersionMessage: 'Beta build — one page only (full version supports multiple pages)'
};

export const FULL_CONFIG: BetaConfig = {
  isBetaVersion: false,
  maxPages: 50,
  allowProjectSave: true,
  allowCloudSave: true,

  allowedExportFormats: ['pdf', 'png', 'psd'],
  allowHighQualityExport: true,
  allowPSDExport: true,
  allowNanoBananaExport: true,

  allowAdvancedCharacterSettings: true,
  allowDetailedStatistics: true,
  allowProjectSharing: true,

  showUpgradePrompts: false,
  betaVersionMessage: ''
};

export const CURRENT_CONFIG: BetaConfig = process.env.REACT_APP_BETA_VERSION === 'true'
  ? BETA_CONFIG
  : FULL_CONFIG;

export const BetaUtils = {
  canAddPage: (currentPageCount: number): boolean => {
    return currentPageCount < CURRENT_CONFIG.maxPages;
  },

  canExportFormat: (format: string): boolean => {
    return CURRENT_CONFIG.allowedExportFormats.includes(format);
  },

  canUseHighQuality: (): boolean => {
    return CURRENT_CONFIG.allowHighQualityExport;
  },

  canUseNanoBanana: (): boolean => {
    return CURRENT_CONFIG.allowNanoBananaExport;
  },

  canUseAdvancedCharacterSettings: (): boolean => {
    return CURRENT_CONFIG.allowAdvancedCharacterSettings;
  },

  getUpgradeMessage: (): string => {
    if (!CURRENT_CONFIG.showUpgradePrompts) return '';

    return '🚀 The full version unlocks multiple pages.';
  }
};
