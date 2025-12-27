/**
 * Auto-Sync Helper Functions
 * Notify sync service when data changes for automatic synchronization
 */

import { syncService } from './syncService';

/**
 * Notify sync service that data has changed
 * Call after any database write operation to trigger debounced sync
 * 
 * @example
 * await db.update(data);
 * notifyDataChange();
 */
export function notifyDataChange() {
  syncService.triggerDebouncedSync();
}

/**
 * Wrap a database operation to auto-sync after completion
 * 
 * @param {Function} operation - Async database operation
 * @returns {Promise} Result of the operation
 * @example
 * await withAutoSync(() => calendarDB.updateEvent(data));
 */
export async function withAutoSync(operation) {
  try {
    const result = await operation();
    notifyDataChange();
    return result;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

/**
 * Create a proxy for a service that auto-triggers sync on write operations
 * Automatically detects write methods (update, add, delete, create, set, save, put, remove, clear)
 * 
 * @param {Object} service - Database service to wrap
 * @returns {Proxy} Proxied service with auto-sync
 * @example
 * const autoSyncDB = createAutoSyncProxy(calendarDB);
 * await autoSyncDB.updateEvent(data); // Auto-syncs after update
 */
export function createAutoSyncProxy(service) {
  return new Proxy(service, {
    get(target, prop) {
      const original = target[prop];
      
      if (typeof original !== 'function') {
        return original;
      }

      // Detect write operations by method name
      const isWriteOperation = /^(update|add|delete|create|set|save|put|remove|clear)/i.test(
        prop.toString(),
      );

      if (!isWriteOperation) {
        return original;
      }

      // Wrap write operation with auto-sync
      return async function (...args) {
        try {
          const result = await original.apply(target, args);
          notifyDataChange();
          return result;
        } catch (error) {
          console.error(`Error in ${prop.toString()}:`, error);
          throw error;
        }
      };
    },
  });
}
