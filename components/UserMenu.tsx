import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface UserMenuProps {
  user: User;
  onSignOut: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-200 truncate max-w-32">
            {user.email}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600/50 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-600/50">
            <p className="text-xs text-gray-400">Đăng nhập với</p>
            <p className="text-sm text-gray-200 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              onSignOut();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors duration-200"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;