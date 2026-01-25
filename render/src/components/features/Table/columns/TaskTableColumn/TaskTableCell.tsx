import React from 'react';
import { useSelector } from 'react-redux';
import { getColorOptions } from '../../../../../utils/colorOptions';
import { useTaskState } from './hooks/useTaskState';
import { handleToggleTask } from './logic';
import { Tag } from '../../../../../types/newColumn.types';

interface RootState {
    newTheme: {
        themeMode: string;
    };
}

interface TaskTableCellProps {
    availableTags: Tag[];
    doneTasks: string[];
    onChange: (availableTags: Tag[], doneTasks: string[]) => void;
}

/**
 * TaskTableCell component
 * Displays available tasks with ability to toggle completion status.
 * Uses the new Dexie Tag format with ID tracking.
 */
export const TaskTableCell: React.FC<TaskTableCellProps> = ({
    availableTags,
    doneTasks,
    onChange,
}) => {
    const { themeMode } = useSelector((state: RootState) => state.newTheme);
    const darkMode = themeMode === 'dark' ? true : false;

    const {
        incompleteTasks,
        setIncompleteTasks,
        completedTasks,
        setCompletedTasks,
    } = useTaskState(availableTags, doneTasks);

    const colorOptions = getColorOptions({ darkMode });

    // Get Tag object by ID
    const getTagById = (tagId: string) => {
        return availableTags.find((tag) => tag.id === tagId);
    };

    return (
        <div className="h-full flex flex-col">
            <div
                className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[380px] ${
                    darkMode
                        ? 'custom-scroll-thin-dark'
                        : 'custom-scroll-thin-light'
                }`}
            >
                <div className="mb-4">
                    <h3
                        className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        To Do
                    </h3>
                    <div className="flex flex-wrap gap-1">
                        {incompleteTasks.map((taskId) => {
                            const tag = getTagById(taskId);
                            if (!tag) return null;

                            return (
                                <div
                                    key={taskId}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        handleToggleTask(
                                            taskId,
                                            false,
                                            incompleteTasks,
                                            completedTasks,
                                            setIncompleteTasks,
                                            setCompletedTasks,
                                            onChange,
                                            availableTags,
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {
                                            e.preventDefault();
                                            handleToggleTask(
                                                taskId,
                                                false,
                                                incompleteTasks,
                                                completedTasks,
                                                setIncompleteTasks,
                                                setCompletedTasks,
                                                onChange,
                                                availableTags,
                                            );
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer
                  ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}
                  hover:opacity-80 transition-opacity flex items-center gap-1`}
                                    aria-label={`Mark task "${tag.name}" as complete`}
                                >
                                    {tag.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h3
                        className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                        Completed
                    </h3>
                    <div className="flex flex-wrap gap-1">
                        {completedTasks.map((taskId) => {
                            const tag = getTagById(taskId);
                            if (!tag) return null;

                            const colorOption =
                                colorOptions.find(
                                    (opt) => opt.name === tag.color,
                                ) || colorOptions[1];

                            return (
                                <div
                                    key={taskId}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        handleToggleTask(
                                            taskId,
                                            true,
                                            incompleteTasks,
                                            completedTasks,
                                            setIncompleteTasks,
                                            setCompletedTasks,
                                            onChange,
                                            availableTags,
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {
                                            e.preventDefault();
                                            handleToggleTask(
                                                taskId,
                                                true,
                                                incompleteTasks,
                                                completedTasks,
                                                setIncompleteTasks,
                                                setCompletedTasks,
                                                onChange,
                                                availableTags,
                                            );
                                        }
                                    }}
                                    aria-label={`Mark task "${tag.name}" as incomplete`}
                                    className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer line-through 
                    ${colorOption.bg} ${colorOption.text}
                    hover:opacity-100 transition-opacity flex items-center gap-1`}
                                >
                                    {tag.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
