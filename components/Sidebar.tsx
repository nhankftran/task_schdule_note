
import React from 'react';
import { TaskIcon, NoteIcon, PlusIcon } from './icons';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onNewItem: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onNewItem }) => {
  const navItems = [
    { id: 'tasks', label: 'Công việc', icon: <TaskIcon /> },
    { id: 'notes', label: 'Ghi chú', icon: <NoteIcon /> },
  ];

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col h-screen fixed top-0 left-0 shadow-lg">
      <div className="flex items-center mb-8">
        <div className="bg-teal-500 p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white">Quản lý Cá nhân</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center p-3 my-1 rounded-lg text-left text-lg transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={onNewItem}
        className="w-full bg-teal-600 text-white p-3 rounded-lg flex items-center justify-center text-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500"
      >
        <PlusIcon className="h-6 w-6 mr-2" />
        Thêm mới
      </button>
    </div>
  );
};

export default Sidebar;
