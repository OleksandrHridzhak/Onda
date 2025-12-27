# Onda Sync Server

A lightweight synchronization server for the Onda app using MongoDB Atlas.

## Quick start

1. Install dependencies:

```bash
cd sync-server
npm install
```

2. Set your MongoDB connection string in an environment variable:

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/onda-sync?retryWrites=true&w=majority"
```

3. Run locally:

```bash
npm start
```

(The server defaults to port 3001; change with `PORT` in .env .)

## MongoDB Atlas (short)

- Create a free cluster on MongoDB Atlas, add a DB user, copy the connection string and set `MONGODB_URI`.
- See https://www.mongodb.com/cloud/atlas for details.

## API

- GET /health
- GET /sync/data (Headers: `x-secret-key`)
- POST /sync/push (Headers: `x-secret-key`, Body: `{ data, clientVersion }`)
- POST /sync/pull (Headers: `x-secret-key`, Body: `{ clientVersion, clientLastSync }`)
- DELETE /sync/data (Headers: `x-secret-key`)

## Deploy (Render)

Quick deploy: create a Web Service with root `sync-server`, set `MONGODB_URI` in Environment, build with `npm install` and start with `npm start`.

## Troubleshooting

- `401` from `/sync/data`: check your `x-secret-key` and ensure it is at least 8 characters.
- Connection errors: verify `MONGODB_URI` and network access in Atlas.
