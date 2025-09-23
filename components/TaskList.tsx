
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onEdit }) => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

  if (tasks.length === 0) {
    return <div className="text-center text-gray-500 mt-10 text-xl">Chưa có công việc nào. Hãy thêm một công việc mới!</div>;
  }

  return (
    <div className="space-y-4">
        {incompleteTasks.length > 0 && (
             <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-300 px-1">Chưa hoàn thành</h2>
                <div className="space-y-3">
                    {incompleteTasks.map((task) => (
                        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
                    ))}
                </div>
            </div>
        )}
        {completedTasks.length > 0 && (
             <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-300 px-1">Đã hoàn thành</h2>
                <div className="space-y-3">
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
