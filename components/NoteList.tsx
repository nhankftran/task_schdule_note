
import React from 'react';
import { Note } from '../types';
import NoteItem from './NoteItem';
import InlineForm from './InlineForm';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  showInlineForm: boolean;
  editingItem: Note | null;
  onSave: (data: { title: string; content?: string; dueDate?: string }) => void;
  onCancel: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  onDelete, 
  onEdit, 
  showInlineForm, 
  editingItem, 
  onSave, 
  onCancel 
}) => {
  if (notes.length === 0 && !showInlineForm) {
    return (
      <div className="text-center mt-20">
        <div className="bg-gray-800/30 rounded-2xl p-12 border border-gray-700/50 backdrop-blur-sm">
          <div className="text-6xl mb-6">📔</div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-3">Chưa có ghi chú nào</h3>
          <p className="text-gray-500 text-lg">Nhấn nút "Thêm mới" để tạo ghi chú đầu tiên của bạn!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showInlineForm && (
        <InlineForm
          viewType="notes"
          editingItem={editingItem}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default NoteList;
