/**
 * Auto-Sync Helper (compat)
 *
 * This module re-exports `notifyDataChange()` from `syncService` for
 * backward compatibility. The helper wrappers `withAutoSync` and
 * `createAutoSyncProxy` are no longer provided by this module.
 *
 * Import:
 *   import { notifyDataChange } from './autoSync';
 */
export { notifyDataChange } from './syncService';
