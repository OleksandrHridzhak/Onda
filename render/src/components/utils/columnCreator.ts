abstract class BaseColumn {
    type: string
    emojiIcon: string
    width: number
    nameVisible: boolean
    description: string 

    constructor(type: string, emojiIcon: string, width: number, nameVisible: boolean, description: string = '') {
        this.type = type
        this.emojiIcon = emojiIcon
        this.width = width
        this.nameVisible = nameVisible
        this.description = description
    }

    setEmojiIcon(icon: string): boolean {
        if (icon === this.emojiIcon) return false
        this.emojiIcon = icon
        return true
    }

    setWidth(width: number): boolean {
        if (width <= 0 || width === this.width) return false
        this.width = width
        return true
    }

    setNameVisible(visible: boolean): boolean {
        if (visible === this.nameVisible) return false
        this.nameVisible = visible
        return true
    }

    setDescription(desc: string): boolean {
        if (desc === this.description) return false
        this.description = desc
        return true
    }

    update(params: Partial<Pick<BaseColumn, 'emojiIcon' | 'width' | 'nameVisible' | 'description'>>): boolean {
        let changed = false

        if (params.emojiIcon !== undefined && params.emojiIcon !== this.emojiIcon) {
            this.emojiIcon = params.emojiIcon
            changed = true
        }
        if (params.width !== undefined && params.width > 0 && params.width !== this.width) {
            this.width = params.width
            changed = true
        }
        if (params.nameVisible !== undefined && params.nameVisible !== this.nameVisible) {
            this.nameVisible = params.nameVisible
            changed = true
        }
        if (params.description !== undefined && params.description !== this.description) {
            this.description = params.description
            changed = true
        }

        return changed
    }

    abstract render(): void
}
