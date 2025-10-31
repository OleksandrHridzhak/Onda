module.exports = {
  init(ipcMain) {
    ipcMain.handle('collect-metrics', () => {
      const mem = process.memoryUsage();
      const cpu = process.cpuUsage();
      return {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        cpuUser: cpu.user,
        cpuSystem: cpu.system
      };
      });
  },
};
