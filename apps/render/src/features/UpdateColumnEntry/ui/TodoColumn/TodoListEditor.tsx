import type { Todo, TodoListColumn } from 'entities/Column';
import { updateColumnContent } from '../../api/updateColumnContent';
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
