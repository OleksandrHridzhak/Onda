# Sync Server - MVC Architecture

The sync server has been refactored following MVC (Model-View-Controller) architecture for better code organization and maintainability.

## 📁 Project Structure

```
sync-server/
├── src/
│   ├── config/
│   │   └── config.js          # Configuration constants
│   ├── database/
│   │   └── mongodb.js          # MongoDB connection and helpers
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── rateLimiter.js      # Rate limiting middleware
│   ├── controllers/
│   │   ├── healthController.js # Health check endpoint
│   │   └── syncController.js   # Sync CRUD operations
│   ├── routes/
│   │   └── index.js            # Route definitions
│   ├── app.js                  # Express app configuration
│   └── index.js                # Server entry point
├── server.js                   # DEPRECATED (kept for compatibility)
├── test.js                     # Integration tests
├── package.json
└── README.md
```

## 🎯 Architecture Benefits

### Separation of Concerns
- **Config**: All configuration in one place
- **Database**: MongoDB connection logic isolated
- **Middleware**: Reusable auth and rate limiting
- **Controllers**: Business logic separated by domain
- **Routes**: Clean route definitions

### Maintainability
- Each file has a single responsibility
- Easy to find and modify code
- Clear dependencies between modules

### Testability
- Controllers can be tested independently
- Middleware can be tested in isolation
- Database layer can be mocked

## 🚀 Running the Server

```bash
# Start the server (uses src/index.js)
npm start

# Or run directly
node src/index.js
```

The old `server.js` file is deprecated but kept for backward compatibility. It will show a warning and redirect to the new entry point.

## 📝 Adding New Features

### Adding a New Route

1. Create controller in `src/controllers/`:
```javascript
// src/controllers/myController.js
export async function myHandler(req, res) {
  // Your logic here
}
```

2. Add route in `src/routes/index.js`:
```javascript
import { myHandler } from '../controllers/myController.js';
router.get('/my-route', authenticateKey, myHandler);
```

### Adding Configuration

Add to `src/config/config.js`:
```javascript
export const config = {
  MY_NEW_CONFIG: process.env.MY_CONFIG || 'default',
};
```

### Adding Middleware

Create in `src/middleware/` and import in `src/app.js`:
```javascript
// src/middleware/myMiddleware.js
export function myMiddleware(req, res, next) {
  // Your logic
  next();
}
```

## 🧪 Testing

The integration tests still work with the new structure:

```bash
npm test
```

## 📦 Environment Variables

Same as before:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/onda-sync
PORT=3001  # optional, defaults to 3001
```

## 🔄 Migration from Old Structure

If you're upgrading from the old `server.js`:

1. Update your start scripts to use `npm start` (already done in package.json)
2. If you have custom modifications to `server.js`, port them to the appropriate files:
   - Constants → `src/config/config.js`
   - Database code → `src/database/mongodb.js`
   - Routes → `src/routes/index.js`
   - Business logic → `src/controllers/`

## 📚 File Descriptions

### Core Files

- **src/index.js**: Server entry point, initializes DB and starts Express
- **src/app.js**: Express app configuration, middleware setup
- **src/config/config.js**: Centralized configuration constants

### Database

- **src/database/mongodb.js**: MongoDB connection, collection access, cleanup

### Middleware

- **src/middleware/auth.js**: Secret key authentication
- **src/middleware/rateLimiter.js**: Rate limiting (60 req/min)

### Controllers

- **src/controllers/healthController.js**: Health check endpoint
- **src/controllers/syncController.js**: All sync operations (push/pull/delete)

### Routes

- **src/routes/index.js**: All route definitions with middleware

## ✅ Code Quality

- Clean separation of concerns
- No code duplication
- Single responsibility principle
- Easy to test and maintain
- Clear module dependencies
