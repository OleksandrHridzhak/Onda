const { _electron: electron } = require('playwright'); // Потрібно встановити playwright
const fs = require('fs');

(async () => {
  const app = await electron.launch({ args: ['.'] }); // Запускає твій Electron
  const window = await app.firstWindow();

  const filePath = 'metrics.csv';
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'timestamp,rss,heapUsed,heapTotal,cpuUser,cpuSystem\n');
  }

  for (let i = 0; i < 10; i++) {
    const metrics = await window.evaluate(() => window.electronAPI.collectMetrics());
    const csvLine = `${Date.now()},${metrics.rss},${metrics.heapUsed},${metrics.heapTotal},${metrics.cpuUser},${metrics.cpuSystem}\n`;
    fs.appendFileSync(filePath, csvLine);
    if (i < 9) await new Promise(res => setTimeout(res, 1000));
  }

  await app.close();
})();
