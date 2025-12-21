import { useState, useEffect } from 'react';

interface Column {
  options?: string[];
  doneTags?: string[];
}

interface TaskState {
  incompleteTasks: string[];
  setIncompleteTasks: React.Dispatch<React.SetStateAction<string[]>>;
  completedTasks: string[];
  setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useTaskState = (column: Column): TaskState => {
  const [incompleteTasks, setIncompleteTasks] = useState<string[]>(
    column.options || [],
  );
  const [completedTasks, setCompletedTasks] = useState<string[]>(
    column.doneTags || [],
  );

  useEffect(() => {
    setIncompleteTasks(column.options || []);
    setCompletedTasks(column.doneTags || []);
  }, [column]);

  return {
    incompleteTasks,
    setIncompleteTasks,
    completedTasks,
    setCompletedTasks,
  };
};
