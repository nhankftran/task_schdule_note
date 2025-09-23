
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
    <div className="flex items-center bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-5 rounded-xl shadow-lg hover:shadow-teal-500/10 hover:from-gray-700/60 hover:to-gray-600/60 transition-all duration-300 group border border-gray-600/30">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-6 w-6 rounded-lg border-2 border-gray-500 bg-gray-700/50 text-teal-500 focus:ring-2 focus:ring-teal-500/50 cursor-pointer transition-all duration-200 hover:border-teal-400"
      />
      <div className="flex-grow mx-4">
        <span
          className={`text-lg font-medium ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-100'
          }`}
        >
          {task.title}
        </span>
        {task.dueDate && (
            <div className={`flex items-center text-sm mt-2 px-2 py-1 rounded-md inline-flex ${
              isOverdue 
                ? 'text-red-300 bg-red-500/20 border border-red-500/30' 
                : 'text-gray-400 bg-gray-600/20 border border-gray-600/30'
            }`}>
                <ClockIcon className="h-4 w-4 mr-1.5" />
                <span>
                    {new Date(task.dueDate).toLocaleString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
        )}
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
          aria-label="Chỉnh sửa công việc"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
          aria-label="Xóa công việc"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;