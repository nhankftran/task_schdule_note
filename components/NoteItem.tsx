
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
    <div className="bg-gray-800 p-5 rounded-lg shadow-md flex flex-col h-full group transition-all duration-200 hover:shadow-teal-500/20 hover:border-teal-500 border border-transparent">
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-2 text-gray-100 truncate">{note.title}</h3>
        <p className="text-gray-400 break-words line-clamp-4">{note.content}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {new Date(note.lastModified).toLocaleDateString('vi-VN')}
        </span>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            aria-label="Chỉnh sửa ghi chú"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
