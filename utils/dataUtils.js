const fs = require('fs');

const ensureDataFileExists = (filePath, getTemplate) => {
  if (!fs.existsSync(filePath)) {
    const template = getTemplate ? getTemplate() : [];

    fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
    console.log(`File ${filePath} created`);
  } else {
    console.log(`File ${filePath} exists`);
  }
};
// Function to get users data from JSON FILES
const getData = async (filePath, getDefaultData = () => []) => {
  try {
    ensureDataFileExists(filePath, getDefaultData);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Помилка при читанні файлу ${filePath}:`, error);
    return Array.isArray(getDefaultData?.()) ? [] : null;
  }
};
// Function to save users data to JSON FILES
const saveData = async (filePath, data, getDefaultData = () => []) => {
  try {
    ensureDataFileExists(filePath, getDefaultData);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Помилка при збереженні даних:`, error);
    return false;
  }
};
module.exports = { ensureDataFileExists, getData, saveData };
