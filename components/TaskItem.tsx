
import React from 'react';
import { Task } from '../types';
import { EditIcon, TrashIcon, ClockIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const isOverdue = task.dueDate && !task.completed && Date.now() > task.dueDate;
  
  return (
    <div className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 group">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-6 w-6 rounded border-gray-600 bg-gray-700 text-teal-500 focus:ring-teal-500 cursor-pointer"
      />
      <div className="flex-grow mx-4">
        <span
          className={`text-lg ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-100'
          }`}
        >
          {task.title}
        </span>
        {task.dueDate && (
            <div className={`flex items-center text-xs mt-1 ${isOverdue ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                <ClockIcon className="h-4 w-4 mr-1.5" />
                <span>
                    {new Date(task.dueDate).toLocaleString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
        )}
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          aria-label="Chỉnh sửa công việc"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Xóa công việc"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;