import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, Check, X, Wifi, WifiOff } from 'lucide-react';
import { syncService } from '../../../../services/syncService';

export default function SyncSection() {
  const [syncConfig, setSyncConfig] = useState({
    enabled: false,
    serverUrl: 'http://localhost:3001',
    secretKey: '',
    autoSync: true,
    syncInterval: 300000,
  });

  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    loadSyncConfig();
    updateSyncStatus();
  }, []);

  const loadSyncConfig = async () => {
    const config = await syncService.getSyncConfig();
    if (config) {
      setSyncConfig({
        enabled: config.enabled || false,
        serverUrl: config.serverUrl || 'http://localhost:3001',
        secretKey: config.secretKey || '',
        autoSync: config.autoSync !== false,
        syncInterval: config.syncInterval || 300000,
      });
    }
  };

  const updateSyncStatus = () => {
    const status = syncService.getStatus();
    setSyncStatus(status);
  };

  const handleSave = async () => {
    const result = await syncService.saveSyncConfig(syncConfig);
    if (result.status === 'success') {
      if (syncConfig.enabled) {
        await syncService.initialize();
      } else {
        syncService.stopAutoSync();
      }
      updateSyncStatus();
      alert('Sync configuration saved!');
    } else {
      alert('Error saving configuration: ' + result.message);
    }
  };

  const handleTestConnection = async () => {
    if (!syncConfig.serverUrl || !syncConfig.secretKey) {
      setTestResult({
        status: 'error',
        message: 'Please enter server URL and secret key',
      });
      return;
    }

    setTestResult({ status: 'testing', message: 'Testing connection...' });
    const result = await syncService.testConnection(
      syncConfig.serverUrl,
      syncConfig.secretKey,
    );
    setTestResult(result);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncService.sync(true);
    setIsSyncing(false);
    updateSyncStatus();

    if (result.status === 'success') {
      alert(`Sync completed!\nVersion: ${result.version}`);
    } else {
      alert(`Sync failed: ${result.message}`);
    }
  };

  const generateSecretKey = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSyncConfig({ ...syncConfig, secretKey: key });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Cloud size={24} />
        <h2 className="text-2xl font-semibold">Sync Settings</h2>
      </div>

      {/* Enable Sync */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Enable Sync</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Synchronize your data across devices
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={syncConfig.enabled}
            onChange={(e) =>
              setSyncConfig({ ...syncConfig, enabled: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Server URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Server URL</label>
        <input
          type="text"
          value={syncConfig.serverUrl}
          onChange={(e) =>
            setSyncConfig({ ...syncConfig, serverUrl: e.target.value })
          }
          placeholder="http://localhost:3001"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
        <p className="text-xs text-gray-500">
          Default: http://localhost:3001 (for local testing)
        </p>
      </div>

      {/* Secret Key */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Secret Key</label>
        <div className="flex gap-2">
          <input
            type={showSecretKey ? 'text' : 'password'}
            value={syncConfig.secretKey}
            onChange={(e) =>
              setSyncConfig({ ...syncConfig, secretKey: e.target.value })
            }
            placeholder="Enter at least 8 characters"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showSecretKey ? '🙈' : '👁️'}
          </button>
          <button
            onClick={generateSecretKey}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Generate
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Use the same key on all devices to sync data. Keep it secret!
        </p>
      </div>

      {/* Auto Sync */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h3 className="font-medium">Auto Sync</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automatically sync in background every 5 minutes
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={syncConfig.autoSync}
            onChange={(e) =>
              setSyncConfig({ ...syncConfig, autoSync: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Test Connection */}
      <div className="space-y-2">
        <button
          onClick={handleTestConnection}
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
        >
          {testResult?.status === 'testing' ? (
            <RefreshCw size={18} className="animate-spin" />
          ) : (
            <Wifi size={18} />
          )}
          Test Connection
        </button>
        {testResult && testResult.status !== 'testing' && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 ${
              testResult.status === 'success'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}
          >
            {testResult.status === 'success' ? (
              <Check size={18} />
            ) : (
              <X size={18} />
            )}
            <span className="text-sm">{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Sync Status */}
      {syncStatus && syncStatus.enabled && (
        <div className="p-4 border rounded-lg space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            {syncStatus.autoSyncActive ? (
              <Wifi size={18} className="text-green-500" />
            ) : (
              <WifiOff size={18} className="text-gray-400" />
            )}
            Sync Status
          </h3>
          <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <p>Version: {syncStatus.version}</p>
            <p>
              Last Sync:{' '}
              {syncStatus.lastSync
                ? new Date(syncStatus.lastSync).toLocaleString()
                : 'Never'}
            </p>
            <p>
              Auto Sync: {syncStatus.autoSyncActive ? 'Active ✓' : 'Inactive'}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Save Configuration
        </button>
        <button
          onClick={handleSync}
          disabled={!syncConfig.enabled || isSyncing}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
          💡 How to use sync
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Generate or enter a secret key (share it with your devices)</li>
          <li>Enter your sync server URL</li>
          <li>Test the connection to make sure it works</li>
          <li>Enable sync and save configuration</li>
          <li>Your data will sync automatically every 5 minutes</li>
          <li>You can also manually sync anytime</li>
        </ul>
      </div>
    </div>
  );
}
