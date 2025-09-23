
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
    <div className="w-64 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 flex flex-col h-screen fixed top-0 left-0 shadow-2xl border-r border-gray-700/50">
      <div className="flex items-center mb-10">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl mr-4 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý</h1>
          <p className="text-sm text-gray-400">Cá nhân</p>
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center p-4 rounded-xl text-left text-lg font-medium transition-all duration-300 ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                <span className="mr-4 text-xl">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={onNewItem}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white p-4 rounded-xl flex items-center justify-center text-lg font-semibold hover:from-teal-500 hover:to-teal-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 shadow-lg hover:shadow-teal-500/25 transform hover:scale-105"
      >
        <PlusIcon className="h-5 w-5 mr-3" />
        Thêm mới
      </button>
    </div>
  );
};

export default Sidebar;
