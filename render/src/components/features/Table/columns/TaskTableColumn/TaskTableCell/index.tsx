import React from 'react';
import { useSelector } from 'react-redux';
import { getColorOptions } from '../../../../../../utils/colorOptions';
import { useTaskState } from './hooks/useTaskState';
import { handleToggleTask } from './logic';

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

interface Column {
  id: string;
  options?: string[];
  doneTags?: string[];
  tagColors?: Record<string, string>;
}

interface TaskTableCellProps {
  column: Column;
  onChangeOptions: (
    id: string,
    incomplete: string[],
    tagColors: Record<string, string>,
    completed: string[],
  ) => void;
}

export const TaskTableCell: React.FC<TaskTableCellProps> = ({
  column,
  onChangeOptions,
}) => {
  const { themeMode } = useSelector((state: RootState) => state.newTheme);
  const darkMode = themeMode === 'dark' ? true : false;

  const {
    incompleteTasks,
    setIncompleteTasks,
    completedTasks,
    setCompletedTasks,
  } = useTaskState(column);

  const colorOptions = getColorOptions({ darkMode });

  return (
    <div className="h-full flex flex-col">
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[380px] ${
          darkMode ? 'custom-scroll-thin-dark' : 'custom-scroll-thin-light'
        }`}
      >
        <div className="mb-4">
          <h3
            className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            To Do
          </h3>
          <div className="flex flex-wrap gap-1">
            {incompleteTasks.map((task, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() =>
                  handleToggleTask(
                    task,
                    false,
                    incompleteTasks,
                    completedTasks,
                    setIncompleteTasks,
                    setCompletedTasks,
                    onChangeOptions,
                    column,
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleTask(
                      task,
                      false,
                      incompleteTasks,
                      completedTasks,
                      setIncompleteTasks,
                      setCompletedTasks,
                      onChangeOptions,
                      column,
                    );
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer
                  ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}
                  hover:opacity-80 transition-opacity flex items-center gap-1`}
                aria-label={`Mark task "${task}" as complete`}
              >
                {task}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3
            className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Completed
          </h3>
          <div className="flex flex-wrap gap-1">
            {completedTasks.map((task, index) => {
              const color = column.tagColors[task] || 'blue';
              const colorOption =
                colorOptions.find((opt) => opt.name === color) ||
                colorOptions[1];
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    handleToggleTask(
                      task,
                      true,
                      incompleteTasks,
                      completedTasks,
                      setIncompleteTasks,
                      setCompletedTasks,
                      onChangeOptions,
                      column,
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleTask(
                        task,
                        true,
                        incompleteTasks,
                        completedTasks,
                        setIncompleteTasks,
                        setCompletedTasks,
                        onChangeOptions,
                        column,
                      );
                    }
                  }}
                  aria-label={`Mark task "${task}" as incomplete`}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer line-through 
                    ${colorOption.bg} ${colorOption.text}
                    hover:opacity-100 transition-opacity flex items-center gap-1`}
                >
                  {task}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
