const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { Notification } = require('electron');

const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const CALENDAR_FILE = path.join(__dirname, '../userData/calendar.json');
const { updateThemeBasedOnTime } = require('../utils/utils');

function initCronJobs() {
  // Існуюча логіка для тем
  updateThemeBasedOnTime();

  const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
  const settings = JSON.parse(data);
  if (settings.theme?.autoThemeSettings?.enabled) {
    const [startHour, startMinute] = settings.theme.autoThemeSettings.startTime
      .split(':')
      .map(Number);
    const [endHour, endMinute] = settings.theme.autoThemeSettings.endTime
      .split(':')
      .map(Number);

    cron.schedule(`${startMinute} ${startHour} * * *`, () => {
      updateThemeBasedOnTime();
    });

    cron.schedule(`${endMinute} ${endHour} * * *`, () => {
      updateThemeBasedOnTime();
    });
  }

  // Нова логіка для сповіщень про події
  cron.schedule('* * * * *', () => {
    // Кожну хвилину
    try {
      const calendarData = fs.readFileSync(CALENDAR_FILE, 'utf8');
      const events = JSON.parse(calendarData);

      const now = new Date(); // Поточний час: 05:55 PM EEST, 21 травня 2025
      const currentDayOfWeek = now.getDay(); // 3 (середа)

      // Перевірка, чи увімкнені сповіщення в налаштуваннях
      if (!settings.calendar?.notifications) {
        return; // Якщо сповіщення вимкнені, виходимо з функції
      }

      events.forEach((event) => {
        let eventDate;

        // Якщо подія повторюється
        if (event.isRepeating && event.repeatDays.includes(currentDayOfWeek)) {
          // Формуємо дату для поточного дня
          const [hours, minutes] = event.startTime.split(':').map(Number);
          eventDate = new Date(now);
          eventDate.setHours(hours, minutes, 0, 0);
        } else if (event.date) {
          // Якщо подія одноразова
          const [hours, minutes] = event.startTime.split(':').map(Number);
          eventDate = new Date(`${event.date} ${hours}:${minutes}:00`);
        } else {
          return; // Пропускаємо, якщо немає дати
        }

        const timeDiff = (eventDate - now) / (1000 * 60); // Різниця в хвилинах
        if (timeDiff > 9 && timeDiff <= 10) {
          // Якщо залишилося 10 хвилин або менше
          const notification = new Notification({
            title: 'Нагадування про подію',
            body: `Подія "${event.title}" розпочнеться о ${event.startTime} (${event.date || 'сьогодні'})`,
            icon: path.join(__dirname, '../assets/onda-logo.ico'), // Додай іконку
          });
          notification.show();

          notification.on('click', () => {
            if (global.mainWindow) {
              global.mainWindow.focus();
            }
          });
        }
      });
    } catch (err) {
      console.error('Error checking events for notifications:', err);
    }
  });
}

module.exports = { initCronJobs };
