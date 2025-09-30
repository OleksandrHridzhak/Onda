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
export const dbPromise = openDB('ondaDB', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('weeks')) {
      db.createObjectStore('weeks', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('calendar')) {
      db.createObjectStore('calendar', { keyPath: 'id', autoIncrement: true });
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
