import { Tag } from '../../../../../types/newColumn.types';

/**
 * Toggle task completion status
 * Moves task between incomplete and completed lists
 */
export const handleToggleTask = (
    taskId: string,
    isCompleted: boolean,
    incompleteTasks: string[],
    completedTasks: string[],
    setIncompleteTasks: React.Dispatch<React.SetStateAction<string[]>>,
    setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>,
    onChange: (availableTags: Tag[], doneTasks: string[]) => void,
    availableTags: Tag[],
): void => {
    let updatedIncomplete = [...incompleteTasks];
    let updatedCompleted = [...completedTasks];

    if (isCompleted) {
        // Move from completed to incomplete
        updatedCompleted = updatedCompleted.filter((id) => id !== taskId);
        updatedIncomplete = [...updatedIncomplete, taskId];
    } else {
        // Move from incomplete to completed
        updatedIncomplete = updatedIncomplete.filter((id) => id !== taskId);
        updatedCompleted = [...updatedCompleted, taskId];
    }

    setIncompleteTasks(updatedIncomplete);
    setCompletedTasks(updatedCompleted);

    // Update database with new doneTasks list
    onChange(availableTags, updatedCompleted);
};
