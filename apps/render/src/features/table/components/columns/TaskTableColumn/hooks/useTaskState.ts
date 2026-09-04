import { useState, useEffect } from 'react';
import type { Tag } from '../../../../types/columnTypes';

interface TaskState {
    incompleteTasks: string[];
    setIncompleteTasks: React.Dispatch<React.SetStateAction<string[]>>;
    completedTasks: string[];
    setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
}

const computeIncompleteTasks = (
    availableTags: Tag[],
    doneTasks: string[] = [],
): string[] => {
    return availableTags
        .filter((tag) => !doneTasks.includes(tag.id))
        .map((tag) => tag.id);
};

/**
 * Custom hook for managing task state
 * Handles local state for tasks separating them into incomplete and completed
 */
export const useTaskState = (
    availableTags: Tag[],
    doneTasks: string[],
): TaskState => {
    const [incompleteTasks, setIncompleteTasks] = useState<string[]>(() =>
        computeIncompleteTasks(availableTags, doneTasks),
    );
    const [completedTasks, setCompletedTasks] = useState<string[]>(
        doneTasks || [],
    );

    useEffect(() => {
        setIncompleteTasks(computeIncompleteTasks(availableTags, doneTasks));
        setCompletedTasks(doneTasks || []);
    }, [availableTags, doneTasks]);

    return {
        incompleteTasks,
        setIncompleteTasks,
        completedTasks,
        setCompletedTasks,
    };
};
