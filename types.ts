export type NoteCategory = 'Study' | 'Student' | 'General';
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
  audioDurationSeconds: number;
  createdAt: string;
  lastReviewed?: string;
  audioUrl?: string;
  sourceType: 'recording' | 'upload' | 'text' | 'sample';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  profilePicture?: string;
  authProvider: 'email' | 'phone' | 'google';
  role: 'USER' | 'ADMIN';
  plan: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  status: 'ACTIVE' | 'DISABLED';
  userCategory?: 'Student';
  createdAt: string;
  lastLoginAt: string;
  studyStreak?: number;
  notesReviewedCount?: number;
  testsCompletedCount?: number;
}

export interface AuditLogItem {
  id: string;
  adminEmail: string;
  action: string;
  targetUserEmail?: string;
  timestamp: string;
  metadata?: any;
}

export type ActiveTab = 'notes' | 'record' | 'upload' | 'dashboard' | 'documentation' | 'admin' | 'admin_login' | 'study_planner' | 'coaching' | 'subscription';
