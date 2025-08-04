const fs = require('fs');

const ensureDataFileExists = (filePath, getTemplate) => {
  if (!fs.existsSync(filePath)) {

    template = getTemplate ? getTemplate() : [];
    
    fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
    console.log(`File ${filePath} created`);
  } else {
    console.log(`File ${filePath} exists`);
  }
};

module.exports = { ensureDataFileExists };