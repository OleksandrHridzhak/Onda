import { dbPromise } from '../../services/indexedDB';

export abstract class BaseColumn {
  id: string;
  type: string;
  name: string;
  emojiIcon: string;
  width: number;
  nameVisible: boolean;
  description: string;

  constructor(
    type: string,
    emojiIcon: string,
    width: number,
    nameVisible: boolean,
    name: string = '',
    description: string = '',
    id?: string,
  ) {
    this.id =
      id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.emojiIcon = emojiIcon;
    this.width = width;
    this.nameVisible = nameVisible;
    this.name = name;
    this.description = description;
  }

  // === IndexedDB Operations ===

  /**
   * Saves the column to IndexedDB
   */
  async save(): Promise<boolean> {
    try {
      const db = await dbPromise;
      await db.put('columns', this.toJSON());
      console.log('Column saved:', this.id);
      return true;
    } catch (error) {
      console.error('Failed to save column:', error);
      return false;
    }
  }

  /**
   * Deletes the column from IndexedDB
   */
  async delete(): Promise<boolean> {
    try {
      const db = await dbPromise;
      await db.delete('columns', this.id);
      console.log('Column deleted:', this.id);
      return true;
    } catch (error) {
      console.error('Failed to delete column:', error);
      return false;
    }
  }

  /**
   * Loads a column from IndexedDB by id
   */
  static async load(id: string): Promise<any | null> {
    try {
      const db = await dbPromise;
      const columnData = await db.get('columns', id);
      return columnData || null;
    } catch (error) {
      console.error('Failed to load column:', error);
      return null;
    }
  }

  // === Instance Methods ===

  async setEmojiIcon(icon: string): Promise<boolean> {
    if (icon === this.emojiIcon) return false;
    this.emojiIcon = icon;
    await this.save();
    return true;
  }

  async setWidth(width: number): Promise<boolean> {
    if (width <= 0 || width === this.width) return false;
    this.width = width;
    await this.save();
    return true;
  }

  async setNameVisible(visible: boolean): Promise<boolean> {
    if (visible === this.nameVisible) return false;
    this.nameVisible = visible;
    await this.save();
    return true;
  }

  async setName(name: string): Promise<boolean> {
    if (name === this.name) return false;
    this.name = name;
    await this.save();
    return true;
  }

  async setDescription(desc: string): Promise<boolean> {
    if (desc === this.description) return false;
    this.description = desc;
    await this.save();
    return true;
  }

  async update(
    params: Partial<
      Pick<
        BaseColumn,
        'emojiIcon' | 'width' | 'nameVisible' | 'name' | 'description'
      >
    >,
  ): Promise<boolean> {
    let changed = false;

    if (params.emojiIcon !== undefined && params.emojiIcon !== this.emojiIcon) {
      this.emojiIcon = params.emojiIcon;
      changed = true;
    }
    if (
      params.width !== undefined &&
      params.width > 0 &&
      params.width !== this.width
    ) {
      this.width = params.width;
      changed = true;
    }
    if (
      params.nameVisible !== undefined &&
      params.nameVisible !== this.nameVisible
    ) {
      this.nameVisible = params.nameVisible;
      changed = true;
    }
    if (params.name !== undefined && params.name !== this.name) {
      this.name = params.name;
      changed = true;
    }
    if (
      params.description !== undefined &&
      params.description !== this.description
    ) {
      this.description = params.description;
      changed = true;
    }

    if (changed) {
      await this.save();
    }

    return changed;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      emojiIcon: this.emojiIcon,
      nameVisible: this.nameVisible,
      description: this.description,
      width: this.width,
    };
  }
}
