- Translate indexeddb files and returns msgs
- init and get functions are the same in settings and calendar
- we don't use weeks    


Refactoring plane

1. New structure for indexeddb
Columns
|id|commonProps|uniqeProps|
Calendar
|id|props|
Settings
|cat 1|cat 2| cat 3|

2. Write types for columns all types of columns,settings,calendar items

interface Column {
	id: string,
	type: ColumnType;
	name: string;

	commonProps: {
		emojiIconName: string;
		width: int;
		isNameVisible: boolean;
		description: string;
	}

	uniqueProps: object;

}

interface CheckBoxColumn extends Column{
	days: {
        Monday: boolean,
        Tuesday: boolean,
        Wednesday: boolean,
        Thursday: boolean,
        Friday: boolean,
        Saturday: boolean,
        Sunday: boolean,
      },
    CheckboxColor: string,
}

interface NumberBoxColumn extends Column{
	days: {
        Monday: string,
        Tuesday: string,
        Wednesday: string,
        Thursday: string,
        Friday: string,
        Saturday: string,
        Sunday: string,
      }
}

interface TextboxColumn extends Column{
	days: {
        Monday: string,
        Tuesday: string,
        Wednesday: string,
        Thursday: string,
        Friday: string,
        Saturday: string,
        Sunday: string,
      }
}

// Is it better to put in day arrays only ids and just load properies from global columns store?
interface TagsColumn extends Column{
	days: {
        Monday[]: {
        	tagId:string;
        	tagName:string;
        },
        Tuesday[]: {
        	tagId:string;
        	tagName:string;
        },
        Wednesday[]: {
        	tagId:string;
        	tagName:string;
        },
        Thursday[]: {
        	tagId:string;
        	tagName:string;
        },
        Friday[]: {
        	tagId:string;
        	tagName:string;
        },
        Saturday[]: {
        	tagId:string;
        	tagName:string;
        },
        Sunday[]: {
        	tagId:string;
        	tagName:string;
        },
      }
}

interface TagsColumn extends Column{
	days: {
        Monday[]: {
        	tagId:string;
        	tagName:string;
        },
        Tuesday[]: {
        	tagId:string;
        	tagName:string;
        },
        Wednesday[]: {
        	tagId:string;
        	tagName:string;
        },
        Thursday[]: {
        	tagId:string;
        	tagName:string;
        },
        Friday[]: {
        	tagId:string;
        	tagName:string;
        },
        Saturday[]: {
        	tagId:string;
        	tagName:string;
        },
        Sunday[]: {
        	tagId:string;
        	tagName:string;
        },
      }
}























interface daysColumn extends Column{
	days: {
        Monday: string,
        Tuesday: string,
        Wednesday: string,
        Thursday: string,
        Friday: string,
        Saturday: string,
        Sunday: string,
      }
}






