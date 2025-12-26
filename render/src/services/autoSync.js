import { syncService } from './syncService';

/**
 * Database change notifier - triggers debounced sync when data changes
 * This creates Notion-like auto-sync experience
 */

/**
 * Notify sync service that data has changed
 * Call this after any database write operation
 */
export function notifyDataChange() {
  syncService.triggerDebouncedSync();
}

/**
 * Wrap a database operation to auto-sync after completion
 * Usage: await withAutoSync(() => calendarService.updateCalendar(data))
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
 * Create a proxy for a service that automatically triggers sync on write operations
 * Usage: const autoSyncCalendar = createAutoSyncProxy(calendarService)
 */
export function createAutoSyncProxy(service) {
  return new Proxy(service, {
    get(target, prop) {
      const original = target[prop];
      
      if (typeof original !== 'function') {
        return original;
      }

      // Check if this is a write operation (update, add, delete, etc.)
      const isWriteOperation = /^(update|add|delete|create|set|save|put|remove|clear)/i.test(
        prop.toString(),
      );

      if (!isWriteOperation) {
        return original;
      }

      // Return wrapped function that triggers sync after completion
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
