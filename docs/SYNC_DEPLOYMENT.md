# Onda Sync - Deployment Guide

## Overview

Onda Sync is a lightweight backend service that enables cross-device synchronization using a local-first approach. Your data is stored locally first, and syncs in the background.

## Quick Start (Local Testing)

### 1. Install Dependencies

```bash
cd sync-server
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3001`

### 3. Configure the App

1. Open Onda app
2. Go to Settings → Sync
3. Enter:
   - Server URL: `http://localhost:3001`
   - Secret Key: Generate or enter your own (min 8 characters)
4. Click "Test Connection"
5. If successful, click "Save Configuration"
6. Click "Sync Now" to perform initial sync

## Production Deployment

### Option 1: Render.com (Recommended - Free Tier Available)

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `onda-sync-server`
   - **Region**: Choose closest to your location
   - **Branch**: `main` or your branch name
   - **Root Directory**: `sync-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)
5. Click "Create Web Service"
6. After deployment, copy your service URL (e.g., `https://onda-sync-server.onrender.com`)
7. Use this URL in the app's sync settings

**Note**: Free tier may spin down after 15 minutes of inactivity. First request after idle will be slower.

### Option 2: Railway.app

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `sync-server`
   - Railway will auto-detect Node.js
5. Add environment variables if needed
6. Deploy
7. Copy your service URL

### Option 3: Fly.io

1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Navigate to sync-server directory:
   ```bash
   cd sync-server
   ```
4. Create fly.toml:
   ```toml
   app = "onda-sync-server"
   
   [build]
     builder = "heroku/buildpacks:20"
   
   [env]
     PORT = "8080"
   
   [[services]]
     internal_port = 8080
     protocol = "tcp"
   
     [[services.ports]]
       handlers = ["http"]
       port = "80"
   
     [[services.ports]]
       handlers = ["tls", "http"]
       port = "443"
   ```
5. Deploy:
   ```bash
   fly launch
   fly deploy
   ```

### Option 4: Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app:
   ```bash
   cd sync-server
   heroku create onda-sync-server
   ```
4. Deploy:
   ```bash
   git subtree push --prefix sync-server heroku main
   ```
5. View logs: `heroku logs --tail`

## Environment Variables

The server uses minimal configuration. Optional environment variables:

- `PORT`: Server port (default: 3001, auto-set by most platforms)
- `NODE_ENV`: Environment mode (development/production)

## Security Considerations

### Secret Key Best Practices

1. **Generate Strong Keys**: Use at least 16 random characters
2. **Keep it Secret**: Never share your key publicly
3. **One Key Per User**: Each user should have their own unique key
4. **Change Regularly**: Consider rotating keys periodically

### HTTPS in Production

- Always use HTTPS in production (most platforms provide this automatically)
- Never send secret keys over HTTP
- Most hosting platforms (Render, Railway, Fly.io) provide free SSL certificates

## Data Storage

The server stores data in two ways:

1. **In-Memory Cache**: For fast access
2. **File System**: Persistent storage in `sync-server/data/` directory

Each secret key has its own data file: `{secret-key}.json`

## Monitoring and Maintenance

### Health Check

Check if server is running:
```bash
curl https://your-server-url.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs

Monitor logs for errors:

- **Render**: Dashboard → Logs tab
- **Railway**: Dashboard → Deployments → View Logs
- **Fly.io**: `fly logs`
- **Heroku**: `heroku logs --tail`

## API Endpoints

### GET /health
Health check endpoint

### GET /sync/data
Pull data from server
- Header: `x-secret-key: YOUR_KEY`

### POST /sync/push
Push data to server
- Header: `x-secret-key: YOUR_KEY`
- Body: `{ "data": {...}, "clientVersion": 1 }`

### POST /sync/pull
Pull with conflict detection
- Header: `x-secret-key: YOUR_KEY`
- Body: `{ "clientVersion": 1, "clientLastSync": "..." }`

### DELETE /sync/data
Delete all data for a key
- Header: `x-secret-key: YOUR_KEY`

## Troubleshooting

### Connection Failed

1. Check if server is running: `curl https://your-url.com/health`
2. Verify URL is correct (include `https://`)
3. Check firewall/network settings
4. Ensure secret key is at least 8 characters

### Sync Not Working

1. Check server logs for errors
2. Verify secret key matches on all devices
3. Try manual sync: Click "Sync Now"
4. Check if auto-sync is enabled

### Data Not Persisting

1. Check if hosting platform has persistent storage
2. Verify write permissions in data directory
3. Check server logs for file system errors

## Performance Tips

1. **Auto-Sync Interval**: Default is 5 minutes. Adjust based on your needs.
2. **Data Size**: Keep data reasonable (< 10MB recommended)
3. **Hosting**: Paid tiers offer better performance and reliability
4. **Region**: Choose server region closest to primary users

## Backup and Recovery

### Manual Backup

1. Open Onda app
2. Go to Settings → Data
3. Click "Export Data"
4. Save JSON file

### Server Backup

SSH into your server (if supported) and backup the `data/` directory:
```bash
tar -czf backup-$(date +%Y%m%d).tar.gz data/
```

## Cost Estimates

- **Render Free**: $0/month (with limitations)
- **Render Paid**: $7/month (always on, better performance)
- **Railway**: ~$5/month (pay for what you use)
- **Fly.io**: ~$5/month
- **Heroku**: Free tier removed, ~$7/month minimum

## Migration Guide

If you need to move to a different server:

1. Deploy to new server
2. Update server URL in app settings
3. Test connection
4. Perform manual sync to push data
5. Old server data remains intact (keep as backup)

## Support

For issues or questions:
- Check GitHub Issues
- Review server logs
- Test with local server first
- Verify all configuration steps

## License

Same as main Onda application - Non-commercial use only
