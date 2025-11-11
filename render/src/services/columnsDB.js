import { dbPromise } from './indexedDB';

// Нові функції для роботи з окремими колонками

/**
 * Отримати всі колонки
 */
export async function getAllColumns() {
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
export async function getColumnById(columnId) {
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
export async function addColumn(columnData) {
  try {
    const db = await dbPromise;

    // Генеруємо id якщо його немає
    if (!columnData.id) {
      columnData.id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
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
export async function updateColumn(columnData) {
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
export async function deleteColumn(columnId) {
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
export async function clearAllColumns() {
  try {
    const db = await dbPromise;
    const tx = db.transaction('columns', 'readwrite');
    await tx.objectStore('columns').clear();
    await tx.done;
    console.log('Всі колонки видалено');
    return { status: 'All columns cleared' };
  } catch (error) {
    console.error('Помилка при очищенні колонок:', error);
    return { status: 'Error', message: error.message };
  }
}

/**
 * Міграція старих даних з weeks.body до окремих колонок
 */
export async function migrateColumnsFromWeeks() {
  try {
    const db = await dbPromise;

    // Перевіряємо чи вже є колонки
    const existingColumns = await db.getAll('columns');
    if (existingColumns.length > 0) {
      console.log('Колонки вже мігровані, кількість:', existingColumns.length);
      return { status: 'Already migrated', count: existingColumns.length };
    }

    // Отримуємо старі дані з weeks
    const tx = db.transaction('weeks', 'readonly');
    const week = await tx.objectStore('weeks').get(1);
    await tx.done;

    if (!week || !week.body || week.body.length === 0) {
      console.log('Немає даних для міграції');
      return { status: 'No data to migrate' };
    }

    // Мігруємо кожну колонку
    let migratedCount = 0;

    for (const oldColumn of week.body) {
      // Конвертуємо старі поля у нові
      const newColumn = {
        id:
          oldColumn.ColumnId ||
          Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: oldColumn.Type,
        emojiIcon: oldColumn.EmojiIcon,
        width: oldColumn.Width,
        nameVisible:
          oldColumn.NameVisible !== undefined ? oldColumn.NameVisible : true,
        description: oldColumn.Description || '',
      };

      // Конвертуємо Chosen у days або tasks залежно від типу
      if (oldColumn.Chosen) {
        if (oldColumn.Type === 'todo' || oldColumn.Type === 'tasktable') {
          // Для todo/tasktable: Chosen.global -> tasks
          if (oldColumn.Chosen.global) {
            newColumn.tasks = oldColumn.Chosen.global;
          }
        } else {
          // Для day-based колонок: Chosen -> days
          newColumn.days = oldColumn.Chosen;
        }
      }

      // Додаткові поля
      if (oldColumn.Options) newColumn.options = oldColumn.Options;
      if (oldColumn.TagColors) newColumn.tagColors = oldColumn.TagColors;
      if (oldColumn.CheckboxColor)
        newColumn.checkboxColor = oldColumn.CheckboxColor;
      if (oldColumn.DoneTags) newColumn.doneTags = oldColumn.DoneTags;

      await db.put('columns', newColumn);
      migratedCount++;
    }

    console.log('Міграцію завершено:', migratedCount, 'колонок');
    return { status: 'Migration completed', count: migratedCount };
  } catch (error) {
    console.error('Помилка при міграції:', error);
    return { status: 'Error', message: error.message };
  }
}

/**
 * Оновити порядок колонок (зберегти масив id у правильному порядку)
 */
export async function updateColumnsOrder(columnIds) {
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
export async function getColumnsOrder() {
  try {
    const db = await dbPromise;
    const orderRecord = await db.get('settings', 'columnsOrder');
    return orderRecord?.columnIds || null;
  } catch (error) {
    console.error('Помилка при отриманні порядку:', error);
    return null;
  }
}
