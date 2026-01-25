import { useState, useEffect } from 'react';
import { Tag } from '../../../../../../types/newColumn.types';

interface TaskState {
    incompleteTasks: string[];
    setIncompleteTasks: React.Dispatch<React.SetStateAction<string[]>>;
    completedTasks: string[];
    setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Custom hook for managing task state
 * Handles local state for tasks separating them into incomplete and completed
 */
export const useTaskState = (
    availableTags: Tag[],
    doneTasks: string[],
): TaskState => {
    // Incomplete tasks are all tags that are NOT in doneTasks
    const getIncompleteTasks = () => {
        return availableTags
            .filter((tag) => !doneTasks.includes(tag.id))
            .map((tag) => tag.id);
    };

    const [incompleteTasks, setIncompleteTasks] = useState<string[]>(
        getIncompleteTasks(),
    );
    const [completedTasks, setCompletedTasks] = useState<string[]>(
        doneTasks || [],
    );

    useEffect(() => {
        setIncompleteTasks(getIncompleteTasks());
        setCompletedTasks(doneTasks || []);
    }, [availableTags, doneTasks]);

    return {
        incompleteTasks,
        setIncompleteTasks,
        completedTasks,
        setCompletedTasks,
    };
};
