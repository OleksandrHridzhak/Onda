const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');

function updateThemeBasedOnTime() {
  const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
  const settings = JSON.parse(data);

  if (settings.theme.autoThemeSettings.enabled) {
    const currentHour = new Date().getHours();

    const startTime = settings.theme.autoThemeSettings.startTime;
    const endTime = settings.theme.autoThemeSettings.endTime;

    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);

    const isDarkMode = currentHour <= startHour && currentHour > endHour;

    if (settings.theme.darkMode !== isDarkMode) {
      settings.theme.darkMode = isDarkMode;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      console.log(`Theme changed to ${isDarkMode ? 'dark' : 'light'} mode`);
    }
  }
}

module.exports = { updateThemeBasedOnTime };
