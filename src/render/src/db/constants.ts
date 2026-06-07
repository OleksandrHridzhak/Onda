import { Setting } from 'app/types/settings.types';

/**
 * Default settings that are used when initializing the database
 * or resetting all data
 */
export const DEFAULT_SETTINGS: Setting = {
    id: 'global',
    layout: {
        columnsOrder: [],
    },
};
