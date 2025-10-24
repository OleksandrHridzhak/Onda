/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./preload.js":
/*!********************!*\
  !*** ./preload.js ***!
  \********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("{const { contextBridge, ipcRenderer } = __webpack_require__(/*! electron */ \"electron\");\r\n\r\ncontextBridge.exposeInMainWorld('electronAPI', {\r\n  // Calendar Operations\r\n  // Methods for managing calendar events and time\r\n  //calendarGetEvents: () => ipcRenderer.invoke('calendar-get-events'),\r\n  //calendarGetTime: () => ipcRenderer.invoke('calendar-get-time'),\r\n  //getTime: () => ipcRenderer.invoke('get-time'),\r\n  //calendarSaveEvent: (eventData) =>\r\n  //  ipcRenderer.invoke('calendar-save-event', eventData),\r\n  //calendarDeleteEvent: (eventId) =>\r\n    //ipcRenderer.invoke('calendar-delete-event', eventId),\r\n\r\n  // Table Operations\r\n  // Methods for managing table data, components, and export/import\r\n  //saveData: (data) => ipcRenderer.invoke('save-data', data),\r\n  //exportData: () => ipcRenderer.invoke('export-data'),\r\n  //importData: (data) => ipcRenderer.invoke('import-data', data),\r\n  //changeColumn: (checkbox) => ipcRenderer.invoke('column-change', checkbox),\r\n  //createComponent: (type) => ipcRenderer.invoke('create-component', type),\r\n  //deleteComponent: (columnId) =>\r\n  //  ipcRenderer.invoke('delete-component', columnId),\r\n  //updateColumnOrder: (columnOrder) =>\r\n  //  ipcRenderer.invoke('update-column-order', columnOrder),\r\n  //updateCellSettings: (cellId, newSettings) =>\r\n    //ipcRenderer.invoke('update-cell-settings', cellId, newSettings),\r\n  //deleteCellSettings: (cellId) =>\r\n  //  ipcRenderer.invoke('delete-cell-settings', cellId),\r\n\r\n  // Settings Operations\r\n  // Methods for managing themes, general settings, UI, and cell settings\r\n  //getTheme: () => ipcRenderer.invoke('get-theme'),\r\n  //getSettings: () => ipcRenderer.invoke('get-settings'),\r\n  //getCellSettings: () => ipcRenderer.invoke('get-cell-settings'),\r\n  //switchTheme: (darkMode) => ipcRenderer.invoke('switch-theme', darkMode),\r\n  //updateTableSettings: (tableSettings) =>\r\n  //  ipcRenderer.invoke('update-table-settings', tableSettings),\r\n  //updateTheme: (themeSettings) =>\r\n  //  ipcRenderer.invoke('update-theme', themeSettings),\r\n  //updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),\r\n  //updateUISettings: (uiSettings) =>\r\n  //  ipcRenderer.invoke('update-ui-settings', uiSettings),\r\n\r\n\r\n\r\n  // Window Management\r\n  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),\r\n  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),\r\n  closeWindow: () => ipcRenderer.invoke('window-close'),\r\n  showNotification: (options) => ipcRenderer.invoke('show-notification', options),\r\n  sendNextTab: () => ipcRenderer.send('next-tab'),\r\n  onNextTab: (callback) => {\r\n    ipcRenderer.on('next-tab', callback);\r\n    return () => ipcRenderer.removeListener('next-tab', callback);\r\n  },\r\n\r\n  //Metric colection\r\n  collectMetrics: (event, data) => ipcRenderer.invoke('collect-metrics', event, data),\r\n  // preload.js\r\n\r\n});\r\n\n\n//# sourceURL=webpack://electron-backend/./preload.js?\n}");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./preload.js");
/******/ 	
/******/ })()
;