# TypeScript Migration Guide

## Overview

The Onda Sync Server has been fully migrated from JavaScript to TypeScript to provide better type safety, improved IDE support, and more maintainable code.

## What Changed

### File Structure

All `.js` files have been converted to `.ts` with proper type annotations:

```
sync-server/
├── src/
│   ├── types/
│   │   └── index.ts          # Type definitions
│   ├── config/
│   │   └── config.ts         # Typed configuration
│   ├── database/
│   │   └── mongodb.ts        # Typed MongoDB operations
│   ├── middleware/
│   │   ├── auth.ts           # Typed authentication
│   │   └── rateLimiter.ts    # Typed rate limiting
│   ├── controllers/
│   │   ├── healthController.ts
│   │   └── syncController.ts
│   ├── routes/
│   │   └── index.ts
│   ├── app.ts
│   └── index.ts
├── dist/                      # Compiled JavaScript (gitignored)
├── tsconfig.json             # TypeScript configuration
└── package.json              # Updated with TS scripts
```

### New Type Definitions

Created comprehensive interfaces for all data structures:

```typescript
// Sync document in MongoDB
interface SyncDocument {
  secretKey: string;
  content: any;
  version: number;
  lastSync: string;
  createdAt: Date;
  updatedAt: Date;
}

// Configuration
interface Config {
  PORT: number;
  MONGODB_URI: string | undefined;
  DB_NAME: string;
  COLLECTION_NAME: string;
  MIN_SECRET_KEY_LENGTH: number;
  RATE_LIMIT_WINDOW: number;
  MAX_REQUESTS: number;
}

// API Request/Response types
interface PushRequestBody {
  data: any;
  clientVersion?: number;
}

interface PullRequestBody {
  clientVersion?: number;
  clientLastSync?: string;
}
```

### TypeScript Configuration

`tsconfig.json` configured with strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": true
  }
}
```

## Development Workflow

### Install Dependencies

```bash
cd sync-server
npm install
```

### Development Mode (Hot Reload)

```bash
npm run dev
```

Runs the TypeScript code directly with `ts-node-dev`, automatically reloading on file changes.

### Build for Production

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Run Production Build

```bash
npm start
```

Runs the compiled JavaScript from `dist/`.

### Clean Build

```bash
npm run clean
```

Removes the `dist/` directory.

## Benefits

### 1. Type Safety

Catch errors at compile time instead of runtime:

```typescript
// Before (JS): Runtime error if clientVersion is not a number
function pushData(req, res) {
  const clientVersion = req.body.clientVersion;
  console.log(clientVersion.toFixed(2)); // Error if undefined!
}

// After (TS): Compile-time error
function pushData(req: AuthRequest, res: Response): Promise<void> {
  const { clientVersion } = req.body as PushRequestBody;
  console.log(clientVersion?.toFixed(2)); // Safe with optional chaining
}
```

### 2. Better IDE Support

- Autocomplete for all properties and methods
- Go-to-definition for types and functions
- Inline documentation via JSDoc
- Automatic refactoring tools

### 3. Self-Documenting Code

Types serve as inline documentation:

```typescript
// Function signature tells you everything
async function pushData(
  req: AuthRequest,      // Request with secretKey
  res: Response          // Express response
): Promise<void> {       // Returns nothing (void)
  const { data, clientVersion } = req.body as PushRequestBody;
  // ...
}
```

### 4. Easier Maintenance

- Explicit contracts between modules
- Easier to refactor with confidence
- Less prone to bugs
- Better onboarding for new developers

## Migration Notes

### Backward Compatibility

- All APIs remain unchanged
- Same runtime behavior
- Existing tests work without modification
- Deployment process is the same (just run `npm run build` first)

### Breaking Changes

**None** - This is a purely internal change. All external APIs, endpoints, and behaviors remain exactly the same.

### For Deployment

1. **Build the project first:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Or use existing deployment scripts** - they work the same way!

## Common TypeScript Patterns Used

### 1. Interface Definitions

```typescript
export interface SyncDocument {
  secretKey: string;
  content: any;
  version: number;
  lastSync: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Typed Function Parameters

```typescript
export async function pushData(
  req: AuthRequest, 
  res: Response
): Promise<void> {
  // Function body
}
```

### 3. Type Assertions

```typescript
const { data, clientVersion } = req.body as PushRequestBody;
```

### 4. Optional Properties

```typescript
interface PushRequestBody {
  data: any;
  clientVersion?: number;  // Optional
}
```

### 5. Union Types

```typescript
const key: string | undefined = process.env.MONGODB_URI || process.env.MONGO_URI;
```

## Troubleshooting

### TypeScript Compilation Errors

If you see TypeScript errors during `npm run build`:

1. Check the error message carefully
2. Fix type mismatches
3. Run `npm run build` again

### Module Resolution Issues

If imports fail:

1. Ensure all imports use `.js` extension (not `.ts`)
2. This is required for ES modules
3. Example: `import { config } from './config/config.js';`

### Hot Reload Not Working

If `npm run dev` doesn't reload:

1. Check `ts-node-dev` is installed
2. Try `npm install` again
3. Restart the dev server

## Resources

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Express TypeScript Guide](https://expressjs.com/en/advanced/typescript.html)

## Summary

The TypeScript migration provides:

- ✅ **Type Safety** - Catch errors before runtime
- ✅ **Better IDE Support** - Autocomplete, go-to-definition
- ✅ **Self-Documenting** - Types as documentation
- ✅ **Easier Maintenance** - Explicit contracts
- ✅ **No Breaking Changes** - Fully backward compatible

The codebase is now more robust, maintainable, and developer-friendly!
