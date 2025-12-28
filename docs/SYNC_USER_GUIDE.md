# Onda Sync - User Guide

## What is Onda Sync?

Onda Sync allows you to synchronize your data across multiple devices (computers, tablets) using a secure secret key. Your data is stored locally first for fast access, and syncs automatically in the background.

## Key Features

- **Local-First**: Always work with local data, even offline
- **Automatic Sync**: Background sync every 5 minutes
- **Secure**: Your data is protected by a secret key
- **Simple Setup**: Easy configuration in settings
- **Cross-Device**: Use same data on all your devices

## Setup Guide

### Step 1: Deploy Sync Server (One-Time Setup)

Choose one option:

#### Option A: Use Local Server (Testing Only)
1. Open terminal/command prompt
2. Navigate to: `Onda/sync-server`
3. Run: `npm install`
4. Run: `npm start`
5. Server runs on: `http://localhost:3001`

**Note**: Only works while your computer is on and server is running.

#### Option B: Deploy to Cloud (Recommended)
See [SYNC_DEPLOYMENT.md](./SYNC_DEPLOYMENT.md) for detailed instructions.

Recommended services:
- **Render.com** (easiest, has free tier)
- **Railway.app**
- **Fly.io**

### Step 2: Configure Onda App

1. **Open Settings**
   - Click Settings icon in sidebar
   - Go to "Sync" section

2. **Generate Secret Key**
   - Click "Generate" button
   - OR enter your own (minimum 8 characters)
   - **Important**: Save this key! You'll need it for other devices.

3. **Enter Server URL**
   - For local: `http://localhost:3001`
   - For cloud: Your deployment URL (e.g., `https://onda-sync.onrender.com`)

4. **Test Connection**
   - Click "Test Connection" button
   - Should see "Connection successful ✓"

5. **Save Configuration**
   - Click "Save Configuration"
   - Sync is now enabled!

6. **Initial Sync**
   - Click "Sync Now" to push your current data
   - Wait for confirmation

### Step 3: Setup Other Devices

Repeat Step 2 on each device with these differences:
- Use the **same secret key**
- Use the **same server URL**
- First sync will pull data from server

## Using Sync

### Automatic Sync

Once configured, sync happens automatically:
- Every 5 minutes in background
- When you make changes (debounced)
- When app starts

You'll see sync status in Settings → Sync:
- Version number
- Last sync time
- Auto-sync status

### Manual Sync

Force an immediate sync:
1. Go to Settings → Sync
2. Click "Sync Now"
3. Wait for completion

Use manual sync when:
- You made important changes
- Switching between devices
- Testing sync setup

### Sync Status Indicators

In Settings → Sync section:
- **🟢 Wifi icon**: Auto-sync active
- **⚫ Wifi-off icon**: Auto-sync inactive
- **🔄 Spinning icon**: Sync in progress

## Understanding Sync Behavior

### Local-First Approach

Onda uses a "local-first" strategy:
1. **All changes saved locally immediately**
2. **Sync happens in background**
3. **Works offline** - syncs when reconnected
4. **Fast performance** - no waiting for server

### Conflict Resolution

If same data changes on multiple devices:
- **Last write wins** - most recent change is kept
- Server version number increases
- All devices eventually get latest version

To avoid conflicts:
- Work on one device at a time when possible
- Always sync before switching devices
- Wait a few seconds after making changes

## Troubleshooting

### Sync Not Working

**Check Server Connection**
1. Go to Settings → Sync
2. Click "Test Connection"
3. If fails, verify:
   - Server URL is correct
   - Server is running (for local server)
   - Internet connection is active

**Check Secret Key**
- Must be identical on all devices
- Minimum 8 characters
- Case-sensitive

**Check Auto-Sync Status**
- Should show "Auto Sync: Active ✓"
- If inactive, toggle auto-sync off and on

### Data Not Syncing Between Devices

1. **Device A**: Make a change and click "Sync Now"
2. Wait 10 seconds
3. **Device B**: Click "Sync Now"
4. Check if change appears

If still not working:
- Check server logs (if accessible)
- Try re-saving sync configuration
- Verify same secret key on both devices

### "Connection Failed" Error

Possible causes:
- Server not running (local server)
- Wrong server URL
- Network/firewall blocking connection
- Server deployment issue

Solutions:
- Test with `http://localhost:3001` first
- Check URL has `https://` (for cloud servers)
- Try from browser: `https://your-server-url.com/health`
- Contact server host support

### Secret Key Too Short

Error: "Invalid or missing secret key"

Solution:
- Use minimum 8 characters
- Click "Generate" for strong random key
- Avoid spaces or special characters

## Best Practices

### Security

✅ **DO:**
- Keep secret key private
- Use strong, random keys (click Generate)
- Use different keys for different users
- Use HTTPS server URLs in production

❌ **DON'T:**
- Share secret key publicly
- Use simple keys like "12345678"
- Use same key with untrusted people
- Use HTTP in production

### Sync Efficiency

✅ **DO:**
- Let auto-sync work in background
- Manual sync when switching devices
- Keep app open for a minute after changes
- Wait for "Sync completed" confirmation

❌ **DON'T:**
- Click "Sync Now" repeatedly (wait for completion)
- Close app immediately after changes
- Disable auto-sync unless needed

### Data Management

✅ **DO:**
- Export backup regularly (Settings → Data)
- Keep data size reasonable (< 10MB)
- Test sync with small changes first
- Monitor sync status occasionally

❌ **DON'T:**
- Rely only on sync (keep local backups)
- Sync extremely large datasets
- Ignore sync errors

## Advanced Settings

### Changing Sync Interval

Currently fixed at 5 minutes. To change:
1. Open browser console (F12)
2. Run: `syncService.stopAutoSync()`
3. Run: `syncService.startAutoSync(600000)` (10 minutes)

**Note**: Resets to 5 minutes on app restart.

### Disable Auto-Sync

1. Go to Settings → Sync
2. Toggle "Auto Sync" off
3. Click "Save Configuration"

Use manual "Sync Now" button when needed.

### Multiple Sync Accounts

Each secret key creates separate sync space:
- Device A: Uses key "abc123xyz"
- Device B: Uses key "def456uvw"
- No data shared between them

## FAQ

**Q: Is my data secure?**
A: Yes. Data is encrypted in transit (HTTPS) and protected by secret key. Only devices with the key can access data.

**Q: What if I lose my secret key?**
A: You'll need to generate a new key and perform initial sync again. Previous sync data becomes inaccessible.

**Q: Can I sync between Windows and Mac?**
A: Yes! Sync works across all platforms running Onda.

**Q: Does sync work with mobile version?**
A: If mobile version supports sync configuration, yes. Check mobile app settings.

**Q: How much does it cost?**
A: Server hosting costs $0-7/month depending on provider and plan. See SYNC_DEPLOYMENT.md.

**Q: What data is synced?**
A: Everything: weeks, calendar events, settings, columns, themes.

**Q: Can I sync to multiple servers?**
A: Currently only one server per app instance. Use different devices for different servers.

**Q: What happens if server goes down?**
A: App continues working locally. Sync resumes automatically when server returns.

## Getting Help

If you encounter issues:

1. **Check this guide** - Most common issues covered here
2. **Test with local server** - Isolate if issue is server or app
3. **Check server health**: `https://your-url.com/health`
4. **Export backup** - Settings → Data → Export
5. **Review logs** - Check server logs if accessible
6. **GitHub Issues** - Report bugs with details

## Changelog

### Version 1.0 (Initial Release)
- Secret key authentication
- Push/pull sync
- Auto-sync every 5 minutes
- Manual sync button
- Connection testing
- Settings UI

### Future Improvements
- Configurable sync interval UI
- Sync conflict viewer
- Detailed sync history
- Selective sync (choose what to sync)
- Sync status notifications
