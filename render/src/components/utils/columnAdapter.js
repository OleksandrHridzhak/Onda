/**
 * Адаптер для конвертації між класовим форматом (_instance) та legacy форматом (uppercase поля)
 */

/**
 * Конвертує екземпляр класу колонки в legacy формат
 * @param {Object} instance - Екземпляр класу колонки
 * @returns {Object} Об'єкт у legacy форматі
 */
export const instanceToLegacy = (instance) => {
  if (!instance) return null;
  
  return {
    ColumnId: instance.id,
    Type: instance.type,
    Name: instance.description || 'Column',
    EmojiIcon: instance.emojiIcon,
    NameVisible: instance.nameVisible,
    Width: instance.width,
    Description: instance.description,
    Chosen: instance.days || instance.tasks,
    Options: instance.options ? [...instance.options] : undefined,
    TagColors: instance.tagColors ? {...instance.tagColors} : undefined,
    CheckboxColor: instance.checkboxColor,
    DoneTags: instance.doneTags ? [...instance.doneTags] : undefined,
    _instance: instance
  };
};

/**
 * Оновлює екземпляр класу з legacy updates
 * @param {Object} instance - Екземпляр класу колонки
 * @param {Object} updates - Об'єкт з оновленнями у legacy форматі
 */
export const applyLegacyUpdates = (instance, updates) => {
  if (!instance) return;
  
  // Мапінг legacy полів на поля класу
  const fieldMapping = {
    Name: 'description',
    EmojiIcon: 'emojiIcon',
    Width: 'width',
    NameVisible: 'nameVisible',
    Description: 'description',
    CheckboxColor: 'checkboxColor',
    Options: 'options',
    TagColors: 'tagColors',
    DoneTags: 'doneTags'
  };
  
  Object.entries(updates).forEach(([legacyKey, value]) => {
    const instanceKey = fieldMapping[legacyKey];
    if (instanceKey && value !== undefined) {
      instance[instanceKey] = value;
    }
  });
};

/**
 * Конвертує legacy формат в JSON для збереження
 * @param {Object} legacyColumn - Колонка у legacy форматі
 * @returns {Object} JSON для збереження в БД
 */
export const legacyToJSON = (legacyColumn) => {
  return {
    id: legacyColumn.ColumnId,
    type: legacyColumn.Type,
    emojiIcon: legacyColumn.EmojiIcon,
    width: legacyColumn.Width,
    nameVisible: legacyColumn.NameVisible,
    description: legacyColumn.Description || legacyColumn.Name,
    days: legacyColumn.Type === 'todo' || legacyColumn.Type === 'tasktable' ? undefined : legacyColumn.Chosen,
    tasks: legacyColumn.Type === 'todo' ? legacyColumn.Chosen : undefined,
    options: legacyColumn.Options,
    tagColors: legacyColumn.TagColors,
    checkboxColor: legacyColumn.CheckboxColor,
    doneTags: legacyColumn.DoneTags,
  };
};
