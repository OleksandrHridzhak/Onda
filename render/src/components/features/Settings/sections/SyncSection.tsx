import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, Check, X, Wifi, WifiOff, Zap } from 'lucide-react';
import { syncService } from '../../../../services/syncService';
import SettingsTemplate from '../SettingsTemplate';
import { BubbleBtn } from '../../../shared/BubbleBtn';

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

    // Update status every 2 seconds
    const interval = setInterval(updateSyncStatus, 2000);
    return () => clearInterval(interval);
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
      alert('✅ Sync configuration saved!');
    } else {
      alert('❌ Error saving configuration: ' + result.message);
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
      alert(`✅ Sync completed!\nVersion: ${result.version}`);
    } else {
      alert(`❌ Sync failed: ${result.message}`);
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
    <SettingsTemplate title="Cloud Sync">
      {/* Enable Sync Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-cellBg border border-border">
        <div className="flex items-center gap-3">
          <Cloud className="w-5 h-5 text-primaryColor" />
          <div>
            <h4 className="font-medium text-text">Enable Sync</h4>
            <p className="text-sm text-textTableValues">
              Synchronize your data across devices
            </p>
          </div>
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
          <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primaryColor peer-focus:ring-2 peer-focus:ring-primaryColor peer-focus:ring-offset-2 peer-focus:ring-offset-background transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
        </label>
      </div>

      {/* Smart Sync Info */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-settingsSectionSelectorBg border border-border">
        <Zap className="w-5 h-5 text-primaryColor flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-text mb-1">Smart Sync</h4>
          <p className="text-sm text-textTableValues leading-relaxed">
            Changes sync automatically as you type (Notion-style). Data is also
            pulled when you open the app or return from tray. No manual saving
            needed!
          </p>
        </div>
      </div>

      {/* Server URL */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">
          Server URL
        </label>
        <input
          type="text"
          value={syncConfig.serverUrl}
          onChange={(e) =>
            setSyncConfig({ ...syncConfig, serverUrl: e.target.value })
          }
          placeholder="http://localhost:3001"
          className="w-full px-4 py-2.5 rounded-lg bg-cellBg border border-border text-text placeholder-textTableValues focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all"
        />
        <p className="text-xs text-textTableValues">
          Use localhost:3001 for local testing, or your cloud server URL
        </p>
      </div>

      {/* Secret Key */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">
          Secret Key
        </label>
        <div className="flex gap-2">
          <input
            type={showSecretKey ? 'text' : 'password'}
            value={syncConfig.secretKey}
            onChange={(e) =>
              setSyncConfig({ ...syncConfig, secretKey: e.target.value })
            }
            placeholder="Enter at least 8 characters"
            className="flex-1 px-4 py-2.5 rounded-lg bg-cellBg border border-border text-text placeholder-textTableValues focus:ring-2 focus:ring-primaryColor focus:border-transparent transition-all"
          />
          <button
            onClick={() => setShowSecretKey(!showSecretKey)}
            className="px-4 py-2.5 rounded-lg bg-cellBg border border-border text-text hover:bg-hoverBg transition-colors"
          >
            {showSecretKey ? '🙈' : '👁️'}
          </button>
          <BubbleBtn onClick={generateSecretKey} className="px-4">
            Generate
          </BubbleBtn>
        </div>
        <p className="text-xs text-textTableValues">
          Use the same key on all devices to sync data. Keep it secret!
        </p>
      </div>

      {/* Connection Test */}
      <div className="space-y-2">
        <BubbleBtn
          onClick={handleTestConnection}
          className="w-full justify-center"
          disabled={testResult?.status === 'testing'}
        >
          {testResult?.status === 'testing' ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Wifi size={18} />
              Test Connection
            </>
          )}
        </BubbleBtn>
        {testResult && testResult.status !== 'testing' && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 ${
              testResult.status === 'success'
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {testResult.status === 'success' ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <X size={18} className="text-red-500" />
            )}
            <span
              className={`text-sm ${testResult.status === 'success' ? 'text-green-500' : 'text-red-500'}`}
            >
              {testResult.message}
            </span>
          </div>
        )}
      </div>

      {/* Sync Status */}
      {syncStatus && syncStatus.enabled && (
        <div className="p-4 rounded-lg bg-cellBg border border-border space-y-3">
          <div className="flex items-center gap-2">
            {syncStatus.autoSyncActive ? (
              <Wifi size={18} className="text-green-500" />
            ) : (
              <WifiOff size={18} className="text-textTableValues" />
            )}
            <h4 className="font-medium text-text">Sync Status</h4>
          </div>
          <div className="space-y-1.5 text-sm text-textTableValues">
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-text">{syncStatus.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Sync:</span>
              <span className="text-text">
                {syncStatus.lastSync
                  ? new Date(syncStatus.lastSync).toLocaleString()
                  : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Smart Sync:</span>
              <span className={syncStatus.autoSyncActive ? 'text-green-500' : 'text-text'}>
                {syncStatus.autoSyncActive ? 'Active ✓' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <BubbleBtn onClick={handleSave} className="flex-1 justify-center">
          <Check size={18} />
          Save Configuration
        </BubbleBtn>
        <BubbleBtn
          onClick={handleSync}
          disabled={!syncConfig.enabled || isSyncing}
          className="flex-1 justify-center"
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </BubbleBtn>
      </div>
    </SettingsTemplate>
  );
}
