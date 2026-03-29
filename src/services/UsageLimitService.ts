// src/services/UsageLimitService.ts
// Usage caps for AI generation (optional, env-driven)

export interface UsageLimit {
  dailyLimit: number;
  totalLimit: number;
  currentDailyUsage: number;
  currentTotalUsage: number;
  lastResetDate: string;
  isLimitEnabled: boolean;
}

class UsageLimitService {
  private readonly STORAGE_KEY = 'ai_usage_limit';
  private readonly DAILY_LIMIT = 10;
  private readonly TOTAL_LIMIT = 100;

  public async getUsageStatus(): Promise<UsageLimit> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const today = new Date().toISOString().split('T')[0];

    const fingerprint = await this.generateFingerprint();
    const ipKey = `${this.STORAGE_KEY}_${fingerprint}`;
    const ipStored = localStorage.getItem(ipKey);

    const dataSource = ipStored || stored;

    if (!dataSource) {
      const initialData: UsageLimit = {
        dailyLimit: this.DAILY_LIMIT,
        totalLimit: this.TOTAL_LIMIT,
        currentDailyUsage: 0,
        currentTotalUsage: 0,
        lastResetDate: today,
        isLimitEnabled: this.isLimitEnabled()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
      localStorage.setItem(ipKey, JSON.stringify(initialData));
      return initialData;
    }

    const data: UsageLimit = JSON.parse(dataSource);

    if (data.lastResetDate !== today) {
      data.currentDailyUsage = 0;
      data.lastResetDate = today;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(ipKey, JSON.stringify(data));
    }

    data.isLimitEnabled = this.isLimitEnabled();
    return data;
  }

  private async generateFingerprint(): Promise<string> {
    // eslint-disable-next-line no-restricted-globals
    const screenWidth = typeof window !== 'undefined' ? window.screen.width : 0;
    // eslint-disable-next-line no-restricted-globals
    const screenHeight = typeof window !== 'undefined' ? window.screen.height : 0;
    // eslint-disable-next-line no-restricted-globals
    const screenColorDepth = typeof window !== 'undefined' ? window.screen.colorDepth : 0;

    const components = [
      navigator.userAgent,
      navigator.language,
      screenWidth,
      screenHeight,
      screenColorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      navigator.platform
    ];

    const fingerprint = components.join('|');

    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(36);
  }

  private isLimitEnabled(): boolean {
    return process.env.REACT_APP_USE_ENV_API_KEY === 'true';
  }

  public async canUseAI(): Promise<{ allowed: boolean; reason?: string; remaining?: { daily: number; total: number } }> {
    const status = await this.getUsageStatus();

    if (!status.isLimitEnabled) {
      return { allowed: true };
    }

    if (status.currentTotalUsage >= status.totalLimit) {
      return {
        allowed: false,
        reason: `Total usage cap (${status.totalLimit} runs) reached.\n\nConsider upgrading if you need a higher limit.`
      };
    }

    if (status.currentDailyUsage >= status.dailyLimit) {
      return {
        allowed: false,
        reason: `Daily usage cap (${status.dailyLimit} runs) reached.\n\nTry again tomorrow.`
      };
    }

    return {
      allowed: true,
      remaining: {
        daily: status.dailyLimit - status.currentDailyUsage,
        total: status.totalLimit - status.currentTotalUsage
      }
    };
  }

  public async recordUsage(): Promise<void> {
    const status = await this.getUsageStatus();

    if (!status.isLimitEnabled) {
      return;
    }

    status.currentDailyUsage += 1;
    status.currentTotalUsage += 1;

    const fingerprint = await this.generateFingerprint();
    const ipKey = `${this.STORAGE_KEY}_${fingerprint}`;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));
    localStorage.setItem(ipKey, JSON.stringify(status));
  }

  public resetUsage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public async getUsageStatusText(): Promise<string> {
    const status = await this.getUsageStatus();

    if (!status.isLimitEnabled) {
      return 'No limit';
    }

    return `Today: ${status.currentDailyUsage}/${status.dailyLimit} | Total: ${status.currentTotalUsage}/${status.totalLimit}`;
  }

  public async getRemainingUsage(): Promise<{ daily: number; total: number }> {
    const status = await this.getUsageStatus();
    return {
      daily: Math.max(0, status.dailyLimit - status.currentDailyUsage),
      total: Math.max(0, status.totalLimit - status.currentTotalUsage)
    };
  }
}

export const usageLimitService = new UsageLimitService();
export default UsageLimitService;
