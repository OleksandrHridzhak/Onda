const { _electron: electron } = require('playwright');
const fs = require('fs');

(async () => {
  const app = await electron.launch({ args: ['.'] });
  let window = await app.firstWindow();

  const filePath = 'metrics.csv';
  // Додаємо розширений заголовок з підписами полів
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      'label,timestamp,rss,heapUsed,heapTotal,cpuUser,cpuSystem,cpuUser_ms_per_sec,cpuSystem_ms_per_sec\n'
    );
    // Довідка-рядок (можна закоментувати, якщо не треба в CSV)
    fs.appendFileSync(
      filePath,
      'fields,Unix ms,Resident Set Size (bytes),V8 heap used (bytes),V8 heap total (bytes),CPU user (µs, cumulative),CPU system (µs, cumulative),CPU user per sec (ms/s),CPU system per sec (ms/s)\n'
    );
  }

  let prevMetrics = null;
  let prevTimestamp = null;

  for (let i = 0; i < 50; i++) {
    let metrics, timestamp;
    try {
      await window.waitForLoadState('domcontentloaded');
      metrics = await window.evaluate(() =>
        window.electronAPI.collectMetrics()
      );
      timestamp = Date.now();
      console.log(`✅ [${i + 1}] Metrics collected`);
    } catch (err) {
      console.log(
        `⚠️ [${i + 1}] Context lost, catching new window... (${err.message})`
      );
      window = await app.firstWindow();
      await window.waitForLoadState('domcontentloaded');
      try {
        metrics = await window.evaluate(() =>
          window.electronAPI.collectMetrics()
        );
        timestamp = Date.now();
        console.log(`♻️ [${i + 1}] Metrics after reload`);
      } catch (err2) {
        console.log(
          `❌ [${i + 1}] Failed after reload, skipping iteration (${err2.message})`
        );
        continue;
      }
    }

    let cpuUser_ms_per_sec = '';
    let cpuSystem_ms_per_sec = '';
    if (prevMetrics) {
      const deltaCpuUser = metrics.cpuUser - prevMetrics.cpuUser; // µs
      const deltaCpuSystem = metrics.cpuSystem - prevMetrics.cpuSystem; // µs
      const deltaTime = (timestamp - prevTimestamp) / 1000; // s
      cpuUser_ms_per_sec = (deltaCpuUser / 1000 / deltaTime).toFixed(2); // ms/s
      cpuSystem_ms_per_sec = (deltaCpuSystem / 1000 / deltaTime).toFixed(2); // ms/s
    }

    // Людиночитний підпис для рядка
    const label = prevMetrics
      ? `sample ${i + 1} (ΔCPU user=${cpuUser_ms_per_sec} ms/s, ΔCPU sys=${cpuSystem_ms_per_sec} ms/s)`
      : `sample ${i + 1} (baseline)`;

    const csvLine = `${label},${timestamp},${metrics.rss},${metrics.heapUsed},${metrics.heapTotal},${metrics.cpuUser},${metrics.cpuSystem},${cpuUser_ms_per_sec},${cpuSystem_ms_per_sec}\n`;
    fs.appendFileSync(filePath, csvLine);

    // Також короткий підпис у консоль
    console.log(
      `[${i + 1}] ts=${timestamp} rss=${metrics.rss} heapUsed=${metrics.heapUsed} heapTotal=${metrics.heapTotal} cpuUser_ms/s=${cpuUser_ms_per_sec || '-'} cpuSys_ms/s=${cpuSystem_ms_per_sec || '-'}`
    );

    prevMetrics = metrics;
    prevTimestamp = timestamp;

    if (i < 49) await new Promise((res) => setTimeout(res, 1000));
  }

  await app.close();
})();
