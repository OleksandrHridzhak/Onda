export const handleToggleTask = (
  task,
  isCompleted,
  incompleteTasks,
  completedTasks,
  setIncompleteTasks,
  setCompletedTasks,
  onChangeOptions,
  column
) => {
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
