import { openDB } from 'idb';
import { getColumnTemplates } from '../components/utils/fileTemplates';
// Початковий масив body для тижня
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
    if (!db.objectStoreNames.contains('calendarData')) {
      db.createObjectStore('calendarData', { keyPath: 'id', autoIncrement: true });
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
    const tx = db.transaction('weeks', 'readonly');
    const store = tx.objectStore('weeks');

    const week = await store.get(1); // Отримуємо єдиний тиждень із id: 1
    await tx.done;

    if (week) {
      console.log('Тиждень:', week);
      return week;
    } else {
      console.log('Тиждень не знайдено');
      return null;
    }
  } catch (error) {
    console.error('Помилка при отриманні тижня:', error);
    throw error;
  }
}

// Функція для редагування об’єкта в body за ColumnId
export async function updateBlockInWeek(columnId, updatedBlock) {
  try {
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
    week.body[blockIndex] = { ...week.body[blockIndex], ...updatedBlock };
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


export async function addNewColumn(columnType) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('weeks', 'readwrite');
    const store = tx.objectStore('weeks');

    const week = await store.get(1);
    if (!week) {
      console.log('Тиждень не знайдено');
      await tx.done;
      return false;
    }
    let newBlock = getColumnTemplates()[columnType];

    if (!newBlock) {
      console.warn('Невідомий тип колонки:', columnType);
      await tx.done;
      return false;
    }
    newBlock.ColumnId = Date.now().toString();
    newBlock.Name = `New column`;
    newBlock.Description = `Column created on ${new Date().toLocaleDateString()}`;
    newBlock.Type = columnType;
    
    console.log('Додавання нового блоку:', newBlock);

    week.body.push(newBlock);
    week.lastUpdated = new Date();


    await store.put(week);
    await tx.done;
    console.log('Новий блок додано:', newBlock);
    return true;
  } catch (error) {
    console.error('Помилка при додаванні блоку:', error);
    throw error;
  }
}
