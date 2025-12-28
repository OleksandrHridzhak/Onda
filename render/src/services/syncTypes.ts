/**
 * Type definitions for sync service
 */

export interface SyncConfig {
  enabled: boolean;
  serverUrl: string;
  secretKey: string;
  version?: number;
  lastSync?: string | null;
  autoSync?: boolean;
  syncInterval?: number;
}

export interface SyncResult {
  status: 'success' | 'error' | 'skipped';
  message: string;
  pulled?: boolean;
  pushed?: boolean;
  version?: number;
  timestamp?: string;
}

export interface PullResult {
  status: 'success' | 'error';
  hasNewData: boolean;
  data?: any;
  version?: number;
  hasConflict?: boolean;
  message?: string;
  exists?: boolean;
}

export interface PushResult {
  success: boolean;
  version?: number;
  message?: string;
}

export interface TestConnectionResult {
  status: 'success' | 'error';
  message: string;
  serverStatus?: string;
}

export interface SyncStatus {
  enabled: boolean;
  syncing: boolean;
  version: number;
  lastSync: string | null;
  autoSyncActive: boolean;
}

export interface SaveConfigResult {
  status: 'success' | 'error';
  message: string;
}
