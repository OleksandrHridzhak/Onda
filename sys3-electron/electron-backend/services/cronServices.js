const cron = require('node-cron');
const fs = require('fs'); 
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const { updateThemeBasedOnTime } = require('../utils/utils');


function initCronJobs() {
  updateThemeBasedOnTime();

  const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
  const settings = JSON.parse(data);
  if (!settings.theme.autoThemeSettings.enabled) return;

  const [startHour, startMinute] = settings.theme.autoThemeSettings.startTime.split(':').map(Number);
  const [endHour, endMinute] = settings.theme.autoThemeSettings.endTime.split(':').map(Number);

  cron.schedule(`${startMinute} ${startHour} * * *`, () => {
    updateThemeBasedOnTime();
  });

  cron.schedule(`${endMinute} ${endHour} * * *`, () => {
    updateThemeBasedOnTime();
  });
}

module.exports = { initCronJobs };
