
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export type ViewType = 'tasks' | 'notes';