import React, { useState, useEffect, useRef } from 'react';
import { Task, Note, ViewType } from '../types';
import { CheckIcon, XIcon } from './icons';

interface InlineFormProps {
  viewType: ViewType;
  editingItem?: Task | Note | null;
  onSave: (data: { title: string; content?: string; dueDate?: string }) => void;
  onCancel: () => void;
}

const InlineForm: React.FC<InlineFormProps> = ({ viewType, editingItem, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setContent((editingItem as Note).content || '');
      
      if ('dueDate' in editingItem && editingItem.dueDate) {
        const d = new Date(editingItem.dueDate);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() - tzOffset);
        setDueDate(localDate.toISOString().slice(0, 16));
      }
    } else {
      setTitle('');
      setContent('');
      setDueDate('');
    }
    
    // Focus on title input when form appears
    setTimeout(() => titleInputRef.current?.focus(), 100);
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      content: content.trim(),
      dueDate: dueDate || undefined
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 mb-6 shadow-2xl animate-scale-in">
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="space-y-4">
          <input
            ref={titleInputRef}
            type="text"
            placeholder={viewType === 'tasks' ? 'Nhập tên công việc...' : 'Nhập tiêu đề ghi chú...'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700/50 text-white text-lg p-4 rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 placeholder-gray-400"
          />
          
          {viewType === 'notes' && (
            <textarea
              placeholder="Nhập nội dung ghi chú..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-gray-700/50 text-white p-4 rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 placeholder-gray-400 resize-none"
            />
          )}
          
          {viewType === 'tasks' && (
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">
                Hạn chót (tùy chọn)
              </label>
              <input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-700/50 text-white p-3 rounded-lg border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-400">
              {viewType === 'tasks' ? 'Enter để lưu • Esc để hủy' : 'Ctrl+Enter để lưu • Esc để hủy'}
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-600/50 hover:bg-gray-500/50 transition-all duration-200 text-gray-300 hover:text-white"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 transition-all duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {editingItem ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InlineForm;