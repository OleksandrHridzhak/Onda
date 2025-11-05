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
    toJSON(): Record<string, any> {
        return {
            type: this.type,
            emojiIcon: this.emojiIcon,
            nameVisible: this.nameVisible,
            description: this.description,
            width: this.width
        };
    }
}
type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

abstract class DayBasedColumn extends BaseColumn {
    
    days: Record<Day, string>;

    clearDays(): boolean {
        for (const day in this.days) {
            this.days[day as Day] = '';
        }
        return true;
    }

    constructor(type: string, emojiIcon: string, width: number, nameVisible: boolean, description: string = '') {
        super(type, emojiIcon, width, nameVisible, description)
        this.days = {
            Monday: '',
            Tuesday: '',
            Wednesday: '',
            Thursday:'',
            Friday:'',
            Saturday:'',
            Sunday:'',
        }
    }

    toJSON(): Record<string, any> {
        return {
            ...super.toJSON(),
            days: { ...this.days }
        };
    }
}

class CheckBoxColumn extends DayBasedColumn {
    static fromJSON(json: Record<string, any>): CheckBoxColumn {
        const instance = new CheckBoxColumn(
            json.emojiIcon,
            json.width,
            json.nameVisible,
            json.description
        );
        for (const day in instance.days) {
            instance.days[day as Day] = json.days[day];
        }
        instance.checkboxColor = json.checkboxColor;
        return instance;
    }
    checkboxColor: string;

    constructor(emojiIcon: string = 'Star', width: number = 50, nameVisible: boolean = false, description: string = '') {
        super('checkbox', emojiIcon, width, nameVisible, description)
        this.checkboxColor = 'green';
        
    }
    checkDay(day: Day): boolean {
        this.days[day] = 'checked';
        return true;
    }
    setCheckboxColor(color: string): boolean {
        this.checkboxColor = color
        return true
    }
    toJSON(): Record<string, any> {
        return {
            ...super.toJSON(),
            checkboxColor: this.checkboxColor
        };
    }

}
class NumberBoxColumn extends DayBasedColumn {
    static fromJSON(json: Record<string, any>): NumberBoxColumn {
        const instance = new NumberBoxColumn(
            json.emojiIcon,
            json.width,
            json.nameVisible,
            json.description
        );
        for (const day in instance.days) {
            instance.days[day as Day] = json.days[day];
        }
        return instance;
    }
    toJSON(): Record<string, any> {
        return {
            ...super.toJSON()
        };
    }

    constructor(emojiIcon: string = 'Star', width: number = 50, nameVisible: boolean = false, description: string = '') {
        super('numberBox', emojiIcon, width, nameVisible, description)
    }
    setNumber(day: Day, value: number): boolean {
        this.days[day] = value.toString();
        return true;
    }
}
class TextBoxColumn extends DayBasedColumn {
    static fromJSON(json: Record<string, any>): TextBoxColumn {
        const instance = new TextBoxColumn(
            json.emojiIcon,
            json.width,
            json.nameVisible,
            json.description
        );
        for (const day in instance.days) {
            instance.days[day as Day] = json.days[day];
        }
        return instance;
    }
    toJSON(): Record<string, any> {
        return {
            ...super.toJSON()
        };
    }

    constructor(emojiIcon: string = 'Star', width: number = 130, nameVisible: boolean = false, description: string = '') {
        super('textBox', emojiIcon, width, nameVisible, description)
    }
    setText(day: Day, value: string): boolean {
        this.days[day] = value;
        return true;
    }
}