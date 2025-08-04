const fs = require('fs');

const ensureDataFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    console.log(`File ${filePath} created`);
  } else {
    console.log(`File ${filePath} exists`);
  }
};

module.exports = { ensureDataFileExists };