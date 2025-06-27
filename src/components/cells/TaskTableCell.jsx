import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ChevronDown, Download, Plus, Edit2, X, Check, Calendar, Menu, Eye, EyeOff, Trash2, ListTodo } from 'lucide-react';
import('js-circle-progress').then(() => {
  // Веб-компонент має бути зареєстрований після імпорту
  if (!customElements.get('circle-progress')) {
    console.warn('circle-progress not registered');
  }
});
export const TaskTableCell = ({ column, onChangeOptions, darkMode }) => {
  const [incompleteTasks, setIncompleteTasks] = useState(column.Options || []);
  const [completedTasks, setCompletedTasks] = useState(column.DoneTags || []);

  const colorOptions = [
    { name: 'green', bg: darkMode ? 'bg-green-900' : 'bg-green-100', text: darkMode ? 'text-green-100' : 'text-green-800' },
    { name: 'blue', bg: darkMode ? 'bg-blue-900' : 'bg-blue-100', text: darkMode ? 'text-blue-100' : 'text-blue-800' },
    { name: 'purple', bg: darkMode ? 'bg-purple-900' : 'bg-purple-100', text: darkMode ? 'text-purple-100' : 'text-purple-800' },
    { name: 'orange', bg: darkMode ? 'bg-orange-900' : 'bg-orange-100', text: darkMode ? 'text-orange-100' : 'text-orange-800' }
  ];

  useEffect(() => {
    setIncompleteTasks(column.Options || []);
    setCompletedTasks(column.DoneTags || []);
  }, [column.Options, column.DoneTags]);

  const handleToggleTask = (task, isCompleted) => {
    let updatedIncomplete = [...incompleteTasks];
    let updatedCompleted = [...completedTasks];

    if (isCompleted) {
      // Move from DoneTags to Options (mark as incomplete)
      updatedCompleted = updatedCompleted.filter(t => t !== task);
      updatedIncomplete = [...updatedIncomplete, task];
    } else {
      // Move from Options to DoneTags (mark as completed)
      updatedIncomplete = updatedIncomplete.filter(t => t !== task);
      updatedCompleted = [...updatedCompleted, task];
    }

    setIncompleteTasks(updatedIncomplete);
    setCompletedTasks(updatedCompleted);
    onChangeOptions(column.ColumnId, updatedIncomplete, column.TagColors, updatedCompleted);
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`flex-1 overflow-y-auto overflow-x-hidden max-h-[310px]
        [&::-webkit-scrollbar]:w-1/2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:transition-colors
        [&::-webkit-scrollbar-thumb]:duration-200
        ${darkMode 
          ? '[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500'
          : '[&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300'
        }`}>
        <div className="mb-4">
          <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            To Do
          </h3>
          <div className="flex flex-wrap gap-1">
            {incompleteTasks.map((task, index) => (
              <div
                key={index}
                onClick={() => handleToggleTask(task, false)}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer
                  ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}
                  hover:opacity-80 transition-opacity flex items-center gap-1`}
              >
                {task}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Completed
          </h3>
          <div className="flex flex-wrap gap-1">
            {completedTasks.map((task, index) => {
              const color = column.TagColors[task] || 'blue';
              const colorOption = colorOptions.find(opt => opt.name === color) || colorOptions[1];
              return (
                <div
                  key={index}
                  onClick={() => handleToggleTask(task, true)}
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
