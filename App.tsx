import React, { useState, useEffect, useCallback } from 'react';
import { Task, Note, ViewType } from './types';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import NoteList from './components/NoteList';
import Modal from './components/Modal';
import { supabase } from './supabaseClient';

const initialTasks: Task[] = [
    { id: 't1', title: 'Hoàn thành báo cáo dự án', completed: false, dueDate: Date.now() + 86400000 },
    { id: 't2', title: 'Đi chợ mua thực phẩm', completed: true },
    { id: 't3', title: 'Gọi điện cho khách hàng', completed: false },
];

const initialNotes: Note[] = [
    { id: 'n1', title: 'Ý tưởng cho ứng dụng mới', content: 'Xây dựng một trình quản lý công việc và ghi chú cá nhân bằng React và Tailwind CSS. Giao diện phải đẹp và mượt mà.', lastModified: Date.now() },
    { id: 'n2', title: 'Công thức nấu ăn', content: 'Thịt kho tàu: 500g thịt ba chỉ, 4 quả trứng, nước dừa, gia vị...', lastModified: Date.now() - 86400000 },
];

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const saved = localStorage.getItem('tasks');
            return saved ? JSON.parse(saved) as Task[] : initialTasks;
        } catch {
            return initialTasks;
        }
    });
    const [notes, setNotes] = useState<Note[]>(() => {
        try {
            const saved = localStorage.getItem('notes');
            return saved ? JSON.parse(saved) as Note[] : initialNotes;
        } catch {
            return initialNotes;
        }
    });
    const [activeView, setActiveView] = useState<ViewType>(() => {
        try {
            const saved = localStorage.getItem('activeView');
            return (saved === 'tasks' || saved === 'notes') ? (saved as ViewType) : 'tasks';
        } catch {
            return 'tasks';
        }
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Task | Note | null>(null);

    const [formState, setFormState] = useState({ title: '', content: '', dueDate: '' });
    const [notifiedTaskIds, setNotifiedTaskIds] = useState<string[]>([]);
    const [supabaseStatus, setSupabaseStatus] = useState<'disabled' | 'ok' | 'error'>('disabled');

    const isSupabaseEnabled = Boolean(
        (import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
    );

    // Request notification permission on startup
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);

    // Check for due tasks and send system notifications
    useEffect(() => {
        const interval = setInterval(() => {
            if (Notification.permission !== 'granted') return;

            const now = Date.now();
            tasks.forEach(task => {
                if (task.dueDate && !task.completed && now >= task.dueDate && !notifiedTaskIds.includes(task.id)) {
                    // Send system notification
                    new Notification('Nhắc nhở công việc', {
                        body: `Đã đến giờ thực hiện công việc: "${task.title}"`,
                        // You can add an icon here if you have one
                        // icon: '/path/to/icon.png' 
                    });
                    setNotifiedTaskIds(prev => [...prev, task.id]);
                }
            });
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [tasks, notifiedTaskIds]);

    // Persist data to localStorage when it changes
    useEffect(() => {
        try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch {}
    }, [tasks]);
    useEffect(() => {
        try { localStorage.setItem('notes', JSON.stringify(notes)); } catch {}
    }, [notes]);
    useEffect(() => {
        try { localStorage.setItem('activeView', activeView); } catch {}
    }, [activeView]);

    // Load initial data from Supabase if configured
    useEffect(() => {
        if (!isSupabaseEnabled) return;
        const load = async () => {
            try {
                const { data: taskRows, error: taskErr } = await supabase
                    .from('tasks')
                    .select('id,title,completed,due_date');
                if (taskErr) throw taskErr;
                if (taskRows) {
                    const loadedTasks: Task[] = taskRows.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        completed: Boolean(r.completed),
                        dueDate: r.due_date ?? undefined,
                    }));
                    if (loadedTasks.length) setTasks(loadedTasks);
                }

                const { data: noteRows, error: noteErr } = await supabase
                    .from('notes')
                    .select('id,title,content,last_modified');
                if (noteErr) throw noteErr;
                if (noteRows) {
                    const loadedNotes: Note[] = noteRows.map((r: any) => ({
                        id: r.id,
                        title: r.title,
                        content: r.content ?? '',
                        lastModified: Number(r.last_modified ?? Date.now()),
                    }));
                    if (loadedNotes.length) setNotes(loadedNotes);
                }
                setSupabaseStatus('ok');
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Failed to load from Supabase', e);
                setSupabaseStatus('error');
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const upsertTaskToSupabase = async (task: Task) => {
        if (!isSupabaseEnabled) return;
        try {
            await supabase.from('tasks').upsert({
                id: task.id,
                title: task.title,
                completed: task.completed,
                due_date: task.dueDate ?? null,
            }, { onConflict: 'id' });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to upsert task', e);
        }
    };

    const deleteTaskFromSupabase = async (id: string) => {
        if (!isSupabaseEnabled) return;
        try {
            await supabase.from('tasks').delete().eq('id', id);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to delete task', e);
        }
    };

    const upsertNoteToSupabase = async (note: Note) => {
        if (!isSupabaseEnabled) return;
        try {
            await supabase.from('notes').upsert({
                id: note.id,
                title: note.title,
                content: note.content,
                last_modified: note.lastModified,
            }, { onConflict: 'id' });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to upsert note', e);
        }
    };

    const deleteNoteFromSupabase = async (id: string) => {
        if (!isSupabaseEnabled) return;
        try {
            await supabase.from('notes').delete().eq('id', id);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to delete note', e);
        }
    };

    const handleOpenModal = useCallback((item: Task | Note | null) => {
        setEditingItem(item);
        let dueDateString = '';
        if (item && 'dueDate' in item && item.dueDate) {
            const d = new Date(item.dueDate);
            const tzOffset = d.getTimezoneOffset() * 60000;
            const localDate = new Date(d.getTime() - tzOffset);
            dueDateString = localDate.toISOString().slice(0, 16);
        }

        setFormState({
            title: item?.title || '',
            content: (item as Note)?.content || '',
            dueDate: dueDateString
        });
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormState({ title: '', content: '', dueDate: '' });
    }, []);

    const handleToggleTask = (id: string) => {
        const taskToToggle = tasks.find(t => t.id === id);
        if (!taskToToggle) return;

        const updated = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
        setTasks(updated);
        const changed = updated.find(t => t.id === id);
        if (changed) upsertTaskToSupabase(changed);

        // If a task is marked as complete, we can allow it to notify again if it's un-completed later
        if (taskToToggle.completed === false) { // it's about to be marked as complete
             setNotifiedTaskIds(prev => prev.filter(taskId => taskId !== id));
        }
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
        setNotifiedTaskIds(prev => prev.filter(taskId => taskId !== id));
        deleteTaskFromSupabase(id);
    };

    const handleDeleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
        deleteNoteFromSupabase(id);
    };

    const handleSave = () => {
        if (!formState.title) return;

        if (activeView === 'tasks') {
            const dueDateTimestamp = formState.dueDate ? new Date(formState.dueDate).getTime() : undefined;
            if (editingItem) {
                const oldTask = tasks.find(t => t.id === editingItem.id);
                const nextTasks = tasks.map(t => t.id === editingItem.id ? { ...t, title: formState.title, dueDate: dueDateTimestamp } : t);
                setTasks(nextTasks);
                const changed = nextTasks.find(t => t.id === editingItem.id);
                if (changed) upsertTaskToSupabase(changed);
                if (oldTask?.dueDate !== dueDateTimestamp) {
                    setNotifiedTaskIds(prev => prev.filter(taskId => taskId !== editingItem.id));
                }
            } else {
                const newTask: Task = { id: `t${Date.now()}`, title: formState.title, completed: false, dueDate: dueDateTimestamp };
                setTasks([newTask, ...tasks]);
                upsertTaskToSupabase(newTask);
            }
        } else {
            if (editingItem) {
                const updatedNotes = notes.map(n => n.id === editingItem.id ? { ...n, title: formState.title, content: formState.content, lastModified: Date.now() } : n);
                setNotes(updatedNotes);
                const changed = updatedNotes.find(n => n.id === editingItem.id);
                if (changed) upsertNoteToSupabase(changed);
            } else {
                const newNote: Note = { id: `n${Date.now()}`, title: formState.title, content: formState.content, lastModified: Date.now() };
                setNotes([newNote, ...notes]);
                upsertNoteToSupabase(newNote);
            }
        }
        handleCloseModal();
    };
    
    const sortedNotes = [...notes].sort((a, b) => b.lastModified - a.lastModified);

    return (
        <>
            <style>{`
                @keyframes scale-in {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            <div className="flex h-screen bg-gray-900 text-gray-100">
                <Sidebar activeView={activeView} setActiveView={setActiveView} onNewItem={() => handleOpenModal(null)} />
                <main className="flex-1 p-8 ml-64 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold text-white">{activeView === 'tasks' ? 'Công việc' : 'Ghi chú'}</h1>
                        <div>
                            {isSupabaseEnabled ? (
                                supabaseStatus === 'ok' ? (
                                    <span className="px-3 py-1 rounded-md text-sm bg-emerald-600/20 text-emerald-300 border border-emerald-600/40">Supabase: Connected</span>
                                ) : supabaseStatus === 'error' ? (
                                    <span className="px-3 py-1 rounded-md text-sm bg-rose-600/20 text-rose-300 border border-rose-600/40">Supabase: Error</span>
                                ) : null
                            ) : (
                                <span className="px-3 py-1 rounded-md text-sm bg-gray-600/30 text-gray-300 border border-gray-600/40">Supabase: Disabled</span>
                            )}
                        </div>
                    </div>
                    {activeView === 'tasks' ? (
                        <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} onEdit={(task) => handleOpenModal(task)} />
                    ) : (
                        <NoteList notes={sortedNotes} onDelete={handleDeleteNote} onEdit={(note) => handleOpenModal(note)} />
                    )}
                </main>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? `Chỉnh sửa ${activeView === 'tasks' ? 'Công việc' : 'Ghi chú'}` : `Tạo ${activeView === 'tasks' ? 'Công việc' : 'Ghi chú'} mới`}
            >
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Tiêu đề"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {activeView === 'notes' && (
                        <textarea
                            placeholder="Nội dung"
                            value={formState.content}
                            onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                            rows={6}
                            className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    )}
                    {activeView === 'tasks' && (
                         <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1 mt-2">
                                Hạn chót (tùy chọn)
                            </label>
                            <input
                                id="dueDate"
                                type="datetime-local"
                                value={formState.dueDate}
                                onChange={(e) => setFormState({ ...formState, dueDate: e.target.value })}
                                className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button onClick={handleCloseModal} className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                            Hủy
                        </button>
                        <button onClick={handleSave} className="px-5 py-2 rounded-md bg-teal-600 hover:bg-teal-700 transition-colors">
                            Lưu
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default App;