/**
 * Type definitions for the sync server
 */

/**
 * Sync document structure in MongoDB
 */
export interface SyncDocument {
  secretKey: string;
  content: any;
  version: number;
  lastSync: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request with authenticated secret key
 */
export interface AuthRequest extends Request {
  secretKey?: string;
}

/**
 * Rate limit tracking data
 */
export interface RateLimitData {
  count: number;
  resetTime: number;
}

/**
 * Push request body
 */
export interface PushRequestBody {
  data: any;
  clientVersion?: number;
}

/**
 * Pull request body
 */
export interface PullRequestBody {
  clientVersion?: number;
  clientLastSync?: string;
}

/**
 * Generic API response
 */
export interface ApiResponse {
  success?: boolean;
  error?: string;
  message?: string;
  exists?: boolean;
  data?: any;
  version?: number;
  lastSync?: string;
  hasConflict?: boolean;
  retryAfter?: number;
  status?: string;
  mongodb?: string;
  timestamp?: string;
}
