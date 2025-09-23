
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import InlineForm from './InlineForm';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  showInlineForm: boolean;
  editingItem: Task | null;
  onSave: (data: { title: string; content?: string; dueDate?: string }) => void;
  onCancel: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggle, 
  onDelete, 
  onEdit, 
  showInlineForm, 
  editingItem, 
  onSave, 
  onCancel 
}) => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

  if (tasks.length === 0 && !showInlineForm) {
    return (
      <div className="text-center mt-20">
        <div className="bg-gray-800/30 rounded-2xl p-12 border border-gray-700/50 backdrop-blur-sm">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">Chưa có công việc nào</h3>
          <p className="text-gray-500 text-lg">Nhấn nút "Thêm mới" để tạo công việc đầu tiên của bạn!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {showInlineForm && (
          <InlineForm
            viewType="tasks"
            editingItem={editingItem}
            onSave={onSave}
            onCancel={onCancel}
          />
        )}
        
        {incompleteTasks.length > 0 && (
             <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
                  Chưa hoàn thành
                  <span className="ml-3 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium">
                    {incompleteTasks.length}
                  </span>
                </h2>
                <div className="space-y-4">
                    {incompleteTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                    ))}
                </div>
            </div>
        )}
        
        {completedTasks.length > 0 && (
             <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  Đã hoàn thành
                  <span className="ml-3 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                    {completedTasks.length}
                  </span>
                </h2>
                <div className="space-y-4">
                    {completedTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default TaskList;
