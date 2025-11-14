interface Column {
  id: string;
  tagColors: Record<string, string>;
}

export const handleToggleTask = (
  task: string,
  isCompleted: boolean,
  incompleteTasks: string[],
  completedTasks: string[],
  setIncompleteTasks: React.Dispatch<React.SetStateAction<string[]>>,
  setCompletedTasks: React.Dispatch<React.SetStateAction<string[]>>,
  onChangeOptions: (id: string, incomplete: string[], tagColors: Record<string, string>, completed: string[]) => void,
  column: Column
): void => {
  let updatedIncomplete = [...incompleteTasks];
  let updatedCompleted = [...completedTasks];

  if (isCompleted) {
    // Move from DoneTags to Options (mark as incomplete)
    updatedCompleted = updatedCompleted.filter((t) => t !== task);
    updatedIncomplete = [...updatedIncomplete, task];
  } else {
    // Move from Options to DoneTags (mark as completed)
    updatedIncomplete = updatedIncomplete.filter((t) => t !== task);
    updatedCompleted = [...updatedCompleted, task];
  }

  setIncompleteTasks(updatedIncomplete);
  setCompletedTasks(updatedCompleted);
  onChangeOptions(
    column.id,
    updatedIncomplete,
    column.tagColors,
    updatedCompleted
  );
};
