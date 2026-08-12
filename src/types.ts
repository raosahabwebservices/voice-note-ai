export type NoteCategory = 'Work' | 'Personal' | 'Study' | 'Tech' | 'Podcast' | 'Finance' | 'Student' | 'Entrepreneur' | 'Professional' | 'Content Creator' | 'General';
export type NoteLanguage = 'English' | 'Hindi' | 'Bilingual (Hinglish)';

export interface ActionItem {
  task: string;
  assignee?: string;
  completed: boolean;
  dueDate?: string;
}

export interface DeadlineItem {
  event: string;
  date: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  type?: 'core' | 'step' | 'outcome';
}

export interface DecisionOption {
  option: string;
  pros: string[];
  cons: string[];
  suitability?: string;
}

export interface DecisionMatrix {
  dilemma: string;
  options: DecisionOption[];
  recommendation: string;
}

export interface SmartNote {
  id: string;
  userId?: string;
  title: string;
  category: NoteCategory;
  language?: NoteLanguage;
  tags: string[];
  summary: string;
  transcript: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  deadlines: DeadlineItem[];
  questions: string[];
  mindMap?: MindMapNode[];
  decisionMatrix?: DecisionMatrix;
  audioDurationSeconds: number; // in seconds
  createdAt: string; // ISO string
  audioUrl?: string; // object URL or data URL if recorded/uploaded
  sourceType: 'recording' | 'upload' | 'text' | 'sample';
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  country: string;
  phone: string;
  isAdmin: boolean;
  isPremium: boolean;
  createdAt: string;
}

export type ActiveTab = 'presale' | 'notes' | 'record' | 'upload' | 'dashboard' | 'documentation';
