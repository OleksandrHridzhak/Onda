import { Setting } from '../types/settings.types';

/**
 * Default settings that are used when initializing the database
 * or resetting all data
 */
export const DEFAULT_SETTINGS: Setting = {
    id: 'global',
    layout: {
        columnsOrder: [],
    },
    sync: {
        serverUrl: 'https://onda-39t4.onrender.com',
        secretKey: '',
        enabled: false,
    },
};
