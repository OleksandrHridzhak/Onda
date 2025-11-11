/**
 * IPC handlers for table-related operations
 */
module.exports = {
  /**
   * Initializes IPC handlers for table operations
   * @param {Electron.IpcMain} ipcMain - The IPC main process instance
   */
  init(ipcMain) {
    /**
     * Handler for collecting system metrics
     * @returns {Object} Memory and CPU usage metrics
     */
    ipcMain.handle('collect-metrics', () => {
      const mem = process.memoryUsage();
      const cpu = process.cpuUsage();
      return {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        cpuUser: cpu.user,
        cpuSystem: cpu.system,
      };
    });
  },
};
