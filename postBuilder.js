const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

const buildDir = path.join(__dirname, "..", "build");
const electronTargetDir = path.join(__dirname, "..", "..", "electron-app", "build");

(async () => {
  try {
    await fse.remove(electronTargetDir);
    await fse.copy(buildDir, electronTargetDir);
    console.log("✅ Build скопійовано у electron-app/build");
  } catch (err) {
    console.error("❌ Помилка копіювання build у electron-app:", err);
    process.exit(1);
  }
})();
