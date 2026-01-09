import { exportData, importData } from '../../database/exportImport';
import type { PullResult, PushResult, TestConnectionResult, SaveConfigResult } from '../syncTypes';

/**
 * Sync Operations
 * Handles communication with sync server (push, pull, test connection)
 */
export class SyncOperations {
  /**
   * Pull data from server
   */
  async pullFromServer(
    syncUrl: string,
    secretKey: string,
    localVersion: number,
    lastSyncTime: string | null,
  ): Promise<PullResult> {
    try {
      const response = await fetch(`${syncUrl}/sync/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secretKey,
        },
        body: JSON.stringify({
          clientVersion: localVersion,
          clientLastSync: lastSyncTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.exists) {
        return { status: 'success', hasNewData: false };
      }

      // Check if server has newer data
      const hasNewData = result.version > localVersion;

      return {
        status: 'success',
        hasNewData,
        data: result.data,
        version: result.version,
        hasConflict: result.hasConflict,
      };
    } catch (error) {
      console.error('Pull error:', error);
      return { status: 'error', hasNewData: false, message: (error as Error).message };
    }
  }

  /**
   * Push local data to server
   */
  async pushToServer(
    syncUrl: string,
    secretKey: string,
    localVersion: number,
  ): Promise<PushResult> {
    try {
      // Export all local data
      const localData = await exportData();

      const response = await fetch(`${syncUrl}/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secretKey,
        },
        body: JSON.stringify({
          data: localData,
          clientVersion: localVersion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          version: result.version,
          lastSync: result.lastSync,
        };
      }

      return { success: false, message: result.message };
    } catch (error) {
      console.error('Push error:', error);
      return { success: false, message: (error as Error).message };
    }
  }

  /**
   * Merge server data with local data
   * Server data wins when versions differ (last write wins strategy)
   */
  async mergeServerData(serverData: any, serverVersion: number): Promise<SaveConfigResult> {
    try {
      // Import server data into local database
      await importData(serverData);

      return { status: 'success', message: 'Data merged successfully' };
    } catch (error) {
      console.error('Merge error:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }

  /**
   * Test connection to sync server
   */
  async testConnection(serverUrl: string, secretKey: string): Promise<TestConnectionResult> {
    try {
      const response = await fetch(`${serverUrl}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        return { status: 'error', message: 'Server not responding' };
      }

      const result = await response.json();

      // Test authentication
      const authTest = await fetch(`${serverUrl}/sync/data`, {
        method: 'GET',
        headers: {
          'x-secret-key': secretKey,
        },
      });

      if (authTest.status === 401) {
        return {
          status: 'error',
          message: 'Invalid secret key (must be at least 8 characters)',
        };
      }

      return {
        status: 'success',
        message: 'Connection successful',
        serverStatus: result.status,
      };
    } catch (error) {
      console.error('Connection test error:', error);
      return { status: 'error', message: (error as Error).message };
    }
  }
}
