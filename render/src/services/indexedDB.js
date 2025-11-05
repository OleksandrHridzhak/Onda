import { openDB } from 'idb';
import { getColumnTemplates } from '../components/utils/fileTemplates';

const initialWeekBody = [
  {
    "ColumnId": "1755000000005",
    "Type": "checkbox",
    "Name": "Daily Standup",
    "Description": "Attend team standup meeting",
    "EmojiIcon": "User",
    "NameVisible": false,
    "Chosen": {
      "Monday": true,
      "Tuesday": false,
      "Wednesday": true,
      "Thursday": true,
      "Friday": true,
      "Saturday": false,
      "Sunday": false
    },
    "Width": 50,
    "CheckboxColor": "orange"
  },
  {
    "ColumnId": "1755000000009",
    "Type": "numberbox",
    "Name": "Client Calls",
    "Description": "Hours spent on client calls",
    "EmojiIcon": "Zap",
    "NameVisible": false,
    "Chosen": {
      "Monday": "1",
      "Tuesday": "2",
      "Wednesday": "1.5",
      "Thursday": "1",
      "Friday": "0",
      "Saturday": "0",
      "Sunday": "0"
    },
    "Width": 60
  },
  {
    "ColumnId": "1755000000013",
    "Type": "multicheckbox",
    "Name": "Wellness Goals",
    "Description": "Track wellness activities",
    "EmojiIcon": "Leaf",
    "NameVisible": false,
    "Options": [
      "Yoga",
      "Running"
    ],
    "TagColors": {
      "Yoga": "blue",
      "Running": "green"
    },
    "Chosen": {
      "Monday": "Yoga",
      "Tuesday": "Running",
      "Wednesday": "",
      "Thursday": "Yoga",
      "Friday": "",
      "Saturday": "Running",
      "Sunday": ""
    },
    "Width": 50
  }
];

// Ініціалізація бази даних
export const dbPromise = openDB('ondaDB', 2, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('weeks')) {
      db.createObjectStore('weeks', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('calendar')) {
      db.createObjectStore('calendar', { keyPath: 'id', autoIncrement: true });
    }
    
    // Нова версія: створюємо окреме сховище для колонок
    if (oldVersion < 2) {
      if (!db.objectStoreNames.contains('columns')) {
        db.createObjectStore('columns', { keyPath: 'id' });
      }
    }
  },
});

// Функція для ініціалізації єдиного тижня
export async function initWeek() {
  try {
    const db = await dbPromise;
    const tx = db.transaction('weeks', 'readwrite');
    const store = tx.objectStore('weeks');

    // Перевіряємо, чи є вже тиждень
    const existingWeek = await store.get(1);
    if (!existingWeek) {
      // Додаємо тиждень із id: 1, якщо його немає
      await store.put({
        id: 1,
        lastUpdated: new Date(),
        body: initialWeekBody,
      });
      console.log('Тиждень ініціалізовано з ID: 1');
    } else {
      console.log('Тиждень уже існує:', existingWeek);
    }

    await tx.done;
  } catch (error) {
    console.error('Помилка при ініціалізації тижня:', error);
    throw error;
  }
}

// Функція для отримання тижня
export async function getWeek() {
  try {
    const db = await dbPromise;
    const store = db.transaction('weeks', 'readonly').objectStore('weeks');

    const week = await store.get(1);
    // Транзакція readonly автоматично завершується після get, tx.done можна не чекати

    if (week) {
      console.log('Тиждень:', week.body);
      return {
        status: 'Data fetched',
        data: week.body,
      };
    } else {
      initWeek(); // Ініціалізуємо тиждень, якщо його немає
      return {
        status: 'Data fetched',
        data: [], // пустий масив замість null
      };
    }
  } catch (error) {
    console.error('Помилка при отриманні тижня:', error);
    return {
      status: 'Error',
      data: initialWeekBody,
    };
  }
}


// Функція для редагування об’єкта в body за ColumnId
export async function updateColumn(updatedColumn) {
  try {
    const columnId = updatedColumn.ColumnId;
    const db = await dbPromise;
    const tx = db.transaction('weeks', 'readwrite');
    const store = tx.objectStore('weeks');

    const week = await store.get(1); // Отримуємо єдиний тиждень
    if (!week) {
      console.log('Тиждень не знайдено');
      await tx.done;
      return false;
    }

    // Знаходимо індекс блоку за ColumnId
    const blockIndex = week.body.findIndex((block) => block.ColumnId === columnId);
    if (blockIndex === -1) {
      console.log('Блок із ColumnId не знайдено:', columnId);
      await tx.done;
      return false;
    }

    // Оновлюємо блок
    week.body[blockIndex] = { ...week.body[blockIndex], ...updatedColumn };
    week.lastUpdated = new Date();

    // Зберігаємо оновлений тиждень
    await store.put(week);
    await tx.done;
    console.log('Блок оновлено:', week.body[blockIndex]);
    return true;
  } catch (error) {
    console.error('Помилка при оновленні блоку:', error);
    throw error;
  }
}

// New column creating func
export async function addNewColumn(columnType) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('weeks', 'readwrite');
    const store = tx.objectStore('weeks');

    const week = await store.get(1);
    if (!week) {
      await tx.done;
      return { status: false, message: 'Тиждень не знайдено' };
    }

    let newBlock = getColumnTemplates()[columnType];
    if (!newBlock) {
      await tx.done;
      return { status: false, message: 'Невідомий тип колонки' };
    }

    newBlock.ColumnId = Date.now().toString();
    newBlock.Name = `New column`;
    newBlock.Description = `Column created on ${new Date().toLocaleDateString()}`;
    newBlock.Type = columnType;

    week.body.push(newBlock);
    week.lastUpdated = new Date();

    await store.put(week);
    await tx.done;

    return { status: true, data: newBlock };
  } catch (error) {
    console.error('Помилка при додаванні блоку:', error);
    return { status: false, message: error.message };
  }
}

export async function deleteColumn(columnId) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('columns', 'readwrite');
    const store = tx.objectStore('columns');

    await store.delete(columnId);
    await tx.done;

    return { status: 'Column deleted', columnId };
  } catch (error) {
    console.error('Помилка при видаленні колонки:', error);
    return { status: 'Error', message: error.message, columnId };
  }
}

// Нові функції для роботи з окремими колонками

// Отримати всі колонки
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

// Додати нову колонку
export async function addColumn(columnData) {
  try {
    const db = await dbPromise;
    await db.put('columns', columnData);
    console.log('Колонку додано:', columnData.id);
    return { status: true, data: columnData };
  } catch (error) {
    console.error('Помилка при додаванні колонки:', error);
    return { status: false, message: error.message };
  }
}

// Оновити колонку за id
export async function updateColumnById(columnData) {
  try {
    const db = await dbPromise;
    await db.put('columns', columnData);
    console.log('Колонку оновлено:', columnData.id);
    return true;
  } catch (error) {
    console.error('Помилка при оновленні колонки:', error);
    return false;
  }
}

// Видалити колонку за id
export async function deleteColumnById(columnId) {
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

// Міграція старих даних з weeks.body до окремих колонок
export async function migrateColumnsToSeparateStorage() {
  try {
    const db = await dbPromise;
    
    // Перевіряємо чи вже є колонки
    const existingColumns = await db.getAll('columns');
    if (existingColumns.length > 0) {
      console.log('Колонки вже мігровані');
      return { status: 'Already migrated', count: existingColumns.length };
    }

    // Отримуємо старі дані з weeks
    const tx = db.transaction('weeks', 'readonly');
    const week = await tx.objectStore('weeks').get(1);
    
    if (!week || !week.body || week.body.length === 0) {
      console.log('Немає даних для міграції');
      return { status: 'No data to migrate' };
    }

    // Мігруємо кожну колонку
    const txWrite = db.transaction('columns', 'readwrite');
    const columnsStore = txWrite.objectStore('columns');
    
    for (const oldColumn of week.body) {
      // Конвертуємо старі поля у нові
      const newColumn = {
        id: oldColumn.ColumnId || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: oldColumn.Type,
        emojiIcon: oldColumn.EmojiIcon,
        width: oldColumn.Width,
        nameVisible: oldColumn.NameVisible,
        description: oldColumn.Description || '',
        
        // Конвертуємо Chosen у days або tasks
        ...(oldColumn.Chosen && typeof oldColumn.Chosen === 'object' && !oldColumn.Chosen.global 
          ? { days: oldColumn.Chosen }
          : {}),
        ...(oldColumn.Chosen?.global 
          ? { tasks: oldColumn.Chosen.global }
          : {}),
          
        // Інші поля
        ...(oldColumn.Options ? { options: oldColumn.Options } : {}),
        ...(oldColumn.TagColors ? { tagColors: oldColumn.TagColors } : {}),
        ...(oldColumn.CheckboxColor ? { checkboxColor: oldColumn.CheckboxColor } : {}),
        ...(oldColumn.DoneTags ? { doneTags: oldColumn.DoneTags } : {}),
      };
      
      await columnsStore.put(newColumn);
    }
    
    await txWrite.done;
    console.log('Міграцію завершено:', week.body.length, 'колонок');
    return { status: 'Migration completed', count: week.body.length };
  } catch (error) {
    console.error('Помилка при міграції:', error);
    return { status: 'Error', message: error.message };
  }
}

export async function deleteColumn_OLD(columnId) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('weeks', 'readwrite');
    const store = tx.objectStore('weeks');

    const week = await store.get(1);
    if (!week) {
      await tx.done;
      return { status: 'Week not found', columnId };
    }

    const initialLength = week.body.length;
    week.body = week.body.filter((item) => item.ColumnId !== columnId);

    if (week.body.length === initialLength) {
      await tx.done;
      return { status: 'Component not found', columnId };
    }

    week.lastUpdated = new Date();
    await store.put(week);
    await tx.done;

    return { status: 'Component deleted', columnId };
  } catch (error) {
    console.error('Помилка при видаленні блоку:', error);
    return { status: 'Error', message: error.message, columnId };
  }
}
/**
 * Експортує всі дані з IndexedDB
 * @returns {Object} Об'єкт з weeks, calendar, settings, columns
 */
export async function exportData() {
  try {
    const db = await dbPromise;
    const tx = db.transaction(['weeks', 'calendar', 'settings', 'columns'], 'readonly');

    const weeks = await tx.objectStore('weeks').getAll();
    const calendar = await tx.objectStore('calendar').getAll();
    const settings = await tx.objectStore('settings').getAll();
    const columns = await tx.objectStore('columns').getAll();

    return { 
      weeks, 
      calendar, 
      settings,
      columns,
      exportDate: new Date().toISOString(),
      version: 2 // версія для майбутніх міграцій
    };
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Імпортує дані в IndexedDB
 * @param {Object} data - Об'єкт з weeks, calendar, settings, columns
 * @returns {Object} Результат операції
 */
export async function importData(data) {
  try {
    const db = await dbPromise;
    const stores = ['weeks', 'calendar', 'settings', 'columns'];
    const tx = db.transaction(stores, 'readwrite');

    // Імпорт weeks
    if (data.weeks && data.weeks.length > 0) {
      const weeksStore = tx.objectStore('weeks');
      for (const week of data.weeks) {
        await weeksStore.put(week);
      }
    }

    // Імпорт calendar
    if (data.calendar && data.calendar.length > 0) {
      const calendarStore = tx.objectStore('calendar');
      for (const cal of data.calendar) {
        await calendarStore.put(cal);
      }
    }

    // Імпорт settings
    if (data.settings && data.settings.length > 0) {
      const settingsStore = tx.objectStore('settings');
      for (const s of data.settings) {
        await settingsStore.put(s);
      }
    }

    // Імпорт columns
    if (data.columns && data.columns.length > 0) {
      const columnsStore = tx.objectStore('columns');
      for (const col of data.columns) {
        await columnsStore.put(col);
      }
    }

    await tx.done;
    return { status: 'success', message: 'Data imported successfully' };
  } catch (error) {
    console.error('Import failed:', error);
    return { status: 'error', message: error.message };
  }
}
