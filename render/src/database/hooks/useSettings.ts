/**
 * React Hook for Settings Data
 *
 * Provides reactive access to settings from RxDB.
 * Automatically updates when data changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { getDatabase, Settings } from '../index';
import { notifyDataChange } from '../../services/autoSync';

// Default settings
const DEFAULT_SETTINGS: Omit<Settings, 'id' | 'updatedAt'> = {
  theme: {
    darkMode: false,
    accentColor: 'blue',
    autoThemeSettings: {
      enabled: false,
      startTime: '08:00',
      endTime: '20:00',
    },
  },
  table: {
    showSummaryRow: false,
    compactMode: false,
    stickyHeader: true,
  },
  ui: {
    animations: true,
    tooltips: true,
    confirmDelete: true,
  },
  header: {
    layout: 'withWidget',
  },
  calendar: {
    notifications: true,
  },
};

export interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
}

export function useSettings() {
  const [state, setState] = useState<SettingsState>({
    settings: null,
    isLoading: true,
    error: null,
  });

  // Load data and subscribe to changes
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    let mounted = true;

    const init = async () => {
      try {
        const db = await getDatabase();

        // Check if settings exist, if not create default
        const existing = await db.settings.findOne('appSettings').exec();
        if (!existing) {
          await db.settings.insert({
            id: 'appSettings',
            ...DEFAULT_SETTINGS,
            updatedAt: Date.now(),
          });
        }

        // Subscribe to settings changes
        subscription = db.settings.findOne('appSettings').$.subscribe((doc) => {
          if (!mounted) return;
          const settings = doc ? doc.toJSON() : null;
          setState({
            settings,
            isLoading: false,
            error: null,
          });
        });
      } catch (error) {
        if (mounted) {
          setState({
            settings: null,
            isLoading: false,
            error: (error as Error).message,
          });
        }
      }
    };

    init();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('appSettings').exec();

      if (doc) {
        await doc.patch({
          ...newSettings,
          updatedAt: Date.now(),
        });
      } else {
        await db.settings.insert({
          id: 'appSettings',
          ...DEFAULT_SETTINGS,
          ...newSettings,
          updatedAt: Date.now(),
        });
      }

      notifyDataChange();
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }, []);

  // Update a specific section of settings
  const updateSettingsSection = useCallback(
    async <K extends keyof Settings>(
      section: K,
      newValues: Partial<Settings[K]>,
    ) => {
      try {
        const db = await getDatabase();
        const doc = await db.settings.findOne('appSettings').exec();

        if (doc) {
          const current = doc.toJSON();
          const currentSection = current[section] || {};
          await doc.patch({
            [section]: {
              ...currentSection,
              ...newValues,
            },
            updatedAt: Date.now(),
          });
        }

        notifyDataChange();
      } catch (error) {
        console.error('Error updating settings section:', error);
        throw error;
      }
    },
    [],
  );

  // Switch theme dark mode
  const switchTheme = useCallback(async (darkMode: boolean) => {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('appSettings').exec();

      if (doc) {
        const current = doc.toJSON();
        await doc.patch({
          theme: {
            ...current.theme,
            darkMode,
          },
          updatedAt: Date.now(),
        });
      }

      notifyDataChange();
    } catch (error) {
      console.error('Error switching theme:', error);
      throw error;
    }
  }, []);

  // Update sync config
  const updateSyncConfig = useCallback(
    async (syncConfig: Partial<Settings['sync']>) => {
      try {
        const db = await getDatabase();
        const doc = await db.settings.findOne('appSettings').exec();

        if (doc) {
          const current = doc.toJSON();
          await doc.patch({
            sync: {
              ...current.sync,
              ...syncConfig,
            },
            updatedAt: Date.now(),
          });
        }

        notifyDataChange();
      } catch (error) {
        console.error('Error updating sync config:', error);
        throw error;
      }
    },
    [],
  );

  // Get sync config
  const getSyncConfig = useCallback(async () => {
    try {
      const db = await getDatabase();
      const doc = await db.settings.findOne('appSettings').exec();
      return doc?.sync || null;
    } catch (error) {
      console.error('Error getting sync config:', error);
      return null;
    }
  }, []);

  return {
    ...state,
    updateSettings,
    updateSettingsSection,
    switchTheme,
    updateSyncConfig,
    getSyncConfig,
  };
}
