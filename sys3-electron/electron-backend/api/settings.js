const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');

const DATA_FILE = path.join(__dirname, '../userData/data.json');
const CALENDAR_FILE = path.join(__dirname, '../userData/calendar.json');
const SETTINGS_FILE = path.join(__dirname, '../userData/settings.json');
const { updateThemeBasedOnTime } = require('../utils/utils');
