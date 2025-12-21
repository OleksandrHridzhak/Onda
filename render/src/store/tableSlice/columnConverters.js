// Helper function to convert IndexedDB format to Redux format
export const convertToReduxFormat = (dbColumn) => {
  const baseProps = {
    Name: dbColumn.name || '',
    Type: dbColumn.type?.toUpperCase() || '',
    EmojiIcon: dbColumn.emojiIcon || 'Star',
    NameVisible:
      dbColumn.nameVisible !== undefined ? dbColumn.nameVisible : true,
    Width: dbColumn.width || 100,
    Description: dbColumn.description || '',
  };

  // Build uniqueProperties based on column type
  const uniqueProperties = {};

  if (dbColumn.days) {
    uniqueProperties.Days = dbColumn.days;
  }
  if (dbColumn.checkboxColor) {
    uniqueProperties.CheckboxColor = dbColumn.checkboxColor;
  }
  if (dbColumn.options) {
    uniqueProperties.Options = dbColumn.options;
  }
  if (dbColumn.tagColors) {
    uniqueProperties.TagsColors = dbColumn.tagColors;
    uniqueProperties.OptionsColors = dbColumn.tagColors;
  }
  if (dbColumn.doneTags) {
    uniqueProperties.DoneTags = dbColumn.doneTags;
  }
  if (dbColumn.tasks) {
    uniqueProperties.Chosen = { global: dbColumn.tasks };
  }
  // For multiselect, also add Tags
  if (dbColumn.type === 'multiselect' && dbColumn.options) {
    uniqueProperties.Tags = dbColumn.options;
  }
  // For todo, add Categorys (keeping legacy naming for compatibility)
  if (dbColumn.type === 'todo' && dbColumn.options) {
    uniqueProperties.Categorys = dbColumn.options;
    uniqueProperties.CategoryColors = dbColumn.tagColors || {};
  }

  return {
    ...baseProps,
    uniqueProperties,
  };
};

// Helper function to convert Redux format to IndexedDB format
export const convertToDBFormat = (columnId, reduxColumn) => {
  const dbColumn = {
    id: columnId,
    type: reduxColumn.Type?.toLowerCase() || '',
    name: reduxColumn.Name || '',
    emojiIcon: reduxColumn.EmojiIcon || 'Star',
    nameVisible:
      reduxColumn.NameVisible !== undefined ? reduxColumn.NameVisible : true,
    width: reduxColumn.Width || 100,
    description: reduxColumn.Description || '',
  };

  const up = reduxColumn.uniqueProperties || {};

  if (up.Days) {
    dbColumn.days = up.Days;
  }
  if (up.CheckboxColor) {
    dbColumn.checkboxColor = up.CheckboxColor;
  }
  if (up.Options) {
    dbColumn.options = up.Options;
  }
  if (up.Tags) {
    dbColumn.options = up.Tags;
  }
  // Keep legacy naming 'Categorys' for backwards compatibility
  if (up.Categorys) {
    dbColumn.options = up.Categorys;
  }
  if (up.TagsColors) {
    dbColumn.tagColors = up.TagsColors;
  }
  if (up.OptionsColors) {
    dbColumn.tagColors = up.OptionsColors;
  }
  // Keep legacy naming 'CategoryColors' for backwards compatibility
  if (up.CategoryColors) {
    dbColumn.tagColors = up.CategoryColors;
  }
  if (up.DoneTags) {
    dbColumn.doneTags = up.DoneTags;
  }
  if (up.Chosen?.global) {
    dbColumn.tasks = up.Chosen.global;
  }

  return dbColumn;
};
