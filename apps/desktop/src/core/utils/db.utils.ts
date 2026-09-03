import type { DbResult } from '@onda/shared';
import { getPrismaClient } from '../lib/database';
import type { PrismaClient } from '@prisma/client';

export async function safeDbCall<T>(
    operation: (prisma: PrismaClient) => Promise<T>,
): Promise<DbResult<T>> {
    try {
        const prisma = getPrismaClient();
        const data = await operation(prisma);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export function safeJsonParse<T>(value: unknown, fallback: T): T {
    if (typeof value !== 'string') {
        return (value as T) ?? fallback;
    }
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}
