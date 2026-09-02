import type { Todo, TodoListColumn } from 'features/columns/types/types';
import { updateColumnContent } from 'features/table/api/updateColumnContent';
import { TodoCell } from './TodoCell';

interface TodoListEditorProps {
    column: TodoListColumn;
}

export function TodoListEditor({
    column,
}: TodoListEditorProps): React.ReactElement {
    const handleChange = (todos: Todo[]): void => {
        void updateColumnContent(column.id, {
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
