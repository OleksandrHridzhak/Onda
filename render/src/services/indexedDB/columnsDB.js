/* global globalThis:readonly */
import { dbPromise } from './indexedDB';

/**
 * Getting all columns from Indexed
 *
 */
export async function getAllColumnsIDB() {
  try {
    const db = await dbPromise;
    const columns = await db.getAll('columns');
    console.log('Завантажено колонок:', columns.length);
    return columns;
  } catch (error) {
    console.error('Помилка при отриманні колонок:', error);
    return [];
  }
}

/**
 * Отримати колонку за id
 */
export async function getColumnByIdIDB(columnId) {
  try {
    const db = await dbPromise;
    const column = await db.get('columns', columnId);
    return column || null;
  } catch (error) {
    console.error('Помилка при отриманні колонки:', error);
    return null;
  }
}

/**
 * Додати нову колонку
 */
export async function addColumnIDB(columnData) {
  try {
    const db = await dbPromise;

    // Генеруємо id якщо його немає
    if (!columnData.id) {
      const hasCrypto = typeof globalThis !== 'undefined' && globalThis.crypto;
      const uuid =
        hasCrypto && globalThis.crypto.randomUUID
          ? globalThis.crypto.randomUUID()
          : null;
      const randPart =
        hasCrypto && globalThis.crypto.getRandomValues
          ? Array.from(globalThis.crypto.getRandomValues(new Uint8Array(6)))
              .map((b) => b.toString(16).padStart(2, '0'))
              .join('')
              .substr(0, 9)
          : Date.now().toString(36).slice(-9);
      columnData.id = uuid || `${Date.now().toString(36)}-${randPart}`;
    }

    await db.put('columns', columnData);
    console.log('Колонку додано:', columnData.id);
    return { status: true, data: columnData };
  } catch (error) {
    console.error('Помилка при додаванні колонки:', error);
    return { status: false, message: error.message };
  }
}

/**
 * Оновити колонку за id
 */
export async function updateColumnIDB(columnData) {
  try {
    if (!columnData.id) {
      throw new Error('Column ID is required');
    }

    const db = await dbPromise;
    await db.put('columns', columnData);
    console.log('Колонку оновлено:', columnData.id);
    return true;
  } catch (error) {
    console.error('Помилка при оновленні колонки:', error);
    return false;
  }
}

/**
 * Видалити колонку за id
 */
export async function deleteColumnIDB(columnId) {
  try {
    const db = await dbPromise;
    await db.delete('columns', columnId);
    console.log('Колонку видалено:', columnId);
    return { status: 'Column deleted', columnId };
  } catch (error) {
    console.error('Помилка при видаленні колонки:', error);
    return { status: 'Error', message: error.message, columnId };
  }
}

/**
 * Очистити всі колонки (для тестування)
 */
export async function clearAllColumnsIDB() {
  try {
    const db = await dbPromise;
    const tx = db.transaction(['columns', 'settings'], 'readwrite');
    await tx.objectStore('columns').clear();
    await tx.objectStore('settings').delete('columnsOrder');
    await tx.done;
    console.log('Всі колонки та порядок видалено');
    return { status: 'All columns cleared' };
  } catch (error) {
    console.error('Помилка при очищенні колонок:', error);
    return { status: 'Error', message: error.message };
  }
}

/**
 * Оновити порядок колонок (зберегти масив id у правильному порядку)
 */
export async function updateColumnsOrderIDB(columnIds) {
  try {
    const db = await dbPromise;

    // Зберігаємо порядок у settings або окремому записі
    const order = {
      id: 'columnsOrder',
      columnIds: columnIds,
      lastUpdated: new Date().toISOString(),
    };

    await db.put('settings', order);
    console.log('Порядок колонок оновлено');
    return { status: 'Order updated' };
  } catch (error) {
    console.error('Помилка при оновленні порядку:', error);
    return { status: 'Error', message: error.message };
  }
}

/**
 * Отримати порядок колонок
 */
export async function getColumnsOrderIDB() {
  try {
    const db = await dbPromise;
    const orderRecord = await db.get('settings', 'columnsOrder');
    return orderRecord?.columnIds || null;
  } catch (error) {
    console.error('Помилка при отриманні порядку:', error);
    return null;
  }
}
