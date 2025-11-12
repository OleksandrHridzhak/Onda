export abstract class BaseColumn {
	id: string;
	type: string;
	name: string;
	emojiIcon: string;
	width: number;
	nameVisible: boolean;
	description: string;

	constructor(type: string, emojiIcon: string, width: number, nameVisible: boolean, name: string = '', description: string = '', id?: string) {
		this.id = id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
		this.type = type;
		this.emojiIcon = emojiIcon;
		this.width = width;
		this.nameVisible = nameVisible;
		this.name = name;
		this.description = description;
	}

	setEmojiIcon(icon: string): boolean {
		if (icon === this.emojiIcon) return false;
		this.emojiIcon = icon;
		return true;
	}

	setWidth(width: number): boolean {
		if (width <= 0 || width === this.width) return false;
		this.width = width;
		return true;
	}

	setNameVisible(visible: boolean): boolean {
		if (visible === this.nameVisible) return false;
		this.nameVisible = visible;
		return true;
	}

	setName(name: string): boolean {
		if (name === this.name) return false;
		this.name = name;
		return true;
	}

	setDescription(desc: string): boolean {
		if (desc === this.description) return false;
		this.description = desc;
		return true;
	}

	update(params: Partial<Pick<BaseColumn, 'emojiIcon' | 'width' | 'nameVisible' | 'name' | 'description'>>): boolean {
		let changed = false;

		if (params.emojiIcon !== undefined && params.emojiIcon !== this.emojiIcon) {
			this.emojiIcon = params.emojiIcon;
			changed = true;
		}
		if (params.width !== undefined && params.width > 0 && params.width !== this.width) {
			this.width = params.width;
			changed = true;
		}
		if (params.nameVisible !== undefined && params.nameVisible !== this.nameVisible) {
			this.nameVisible = params.nameVisible;
			changed = true;
		}
		if (params.name !== undefined && params.name !== this.name) {
			this.name = params.name;
			changed = true;
		}
		if (params.description !== undefined && params.description !== this.description) {
			this.description = params.description;
			changed = true;
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
