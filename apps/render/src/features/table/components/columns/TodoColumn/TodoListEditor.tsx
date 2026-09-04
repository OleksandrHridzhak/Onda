import type { Todo, TodoListColumn } from 'features/columns/types/types';
import { updateColumnFields } from 'features/columns/api/updateColumnFields';
import { TodoCell } from './TodoCell';

interface TodoListEditorProps {
    column: TodoListColumn;
}

export function TodoListEditor({
    column,
}: TodoListEditorProps): React.ReactElement {
    const handleChange = (todos: Todo[]): void => {
        void updateColumnFields(column.id, {
            'uniqueProps.todos': todos,
        });
    };

    return (
        <TodoCell
            value={column.uniqueProps.todos || []}
            onChange={handleChange}
            availableCategories={column.uniqueProps.availableCategories || []}
        />
    );
}
