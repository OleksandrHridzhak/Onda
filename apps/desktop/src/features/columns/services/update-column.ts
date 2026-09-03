import { prisma } from '../../../core/lib/database';
import type { Column, DbResult } from '@onda/shared';

export async function updateColumnFields(
    id: string,
    fields: Partial<Column>,
): Promise<DbResult<{ updatedCount: number }>> {
    try {
        const dataToUpdate: any = {};
        if (fields.name !== undefined) dataToUpdate.name = fields.name;
        if (fields.isNameVisible !== undefined) dataToUpdate.isNameVisible = fields.isNameVisible;
        if (fields.description !== undefined) dataToUpdate.description = fields.description;
        if (fields.emojiIconName !== undefined) dataToUpdate.emojiIconName = fields.emojiIconName;
        if (fields.width !== undefined) dataToUpdate.width = fields.width;
        if (fields.uniqueProps !== undefined) dataToUpdate.uniqueProps = JSON.stringify(fields.uniqueProps);
        if (fields.lifecycle?.archivedAt !== undefined) {
            dataToUpdate.archivedAt = fields.lifecycle.archivedAt ? new Date(fields.lifecycle.archivedAt) : null;
        }

        await prisma.column.update({
            where: { id },
            data: dataToUpdate,
        });

        return { success: true, data: { updatedCount: 1 } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function updateColumnUniqueProps(
    id: string,
    uniqueProps: unknown,
): Promise<DbResult<{ columnId: string }>> {
    try {
        await prisma.column.update({
            where: { id },
            data: { uniqueProps: JSON.stringify(uniqueProps || {}) },
        });
        return { success: true, data: { columnId: id } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function archiveColumn(id: string, archivedAt: string): Promise<DbResult<{ columnId: string }>> {
    try {
        await prisma.column.update({
            where: { id },
            data: { archivedAt: new Date(archivedAt) },
        });
        return { success: true, data: { columnId: id } };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
