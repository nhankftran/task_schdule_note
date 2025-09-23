
import React from 'react';
import { Note } from '../types';
import { EditIcon, TrashIcon } from './icons';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete, onEdit }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl shadow-lg flex flex-col h-full group transition-all duration-300 hover:shadow-teal-500/20 hover:from-gray-700/60 hover:to-gray-600/60 border border-gray-600/30 hover:border-teal-500/50">
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-3 text-gray-100 truncate">{note.title}</h3>
        <p className="text-gray-400 break-words line-clamp-4 leading-relaxed">{note.content}</p>
      </div>
      <div className="mt-5 pt-4 border-t border-gray-600/50 flex justify-between items-center">
        <span className="text-sm text-gray-500 px-2 py-1 bg-gray-600/20 rounded-md">
          {new Date(note.lastModified).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
            aria-label="Chỉnh sửa ghi chú"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
            aria-label="Xóa ghi chú"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
