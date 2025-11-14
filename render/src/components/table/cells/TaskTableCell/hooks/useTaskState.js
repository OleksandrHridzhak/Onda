import { useState, useEffect } from 'react';

export const useTaskState = (column) => {
  const [incompleteTasks, setIncompleteTasks] = useState(column.options || []);
  const [completedTasks, setCompletedTasks] = useState(column.doneTags || []);

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
