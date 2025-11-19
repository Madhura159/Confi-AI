
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CHALLENGES = 'CHALLENGES',
  PROGRESS = 'PROGRESS',
  LEARNING = 'LEARNING',
  AFFIRMATIONS = 'AFFIRMATIONS'
}

export enum ChallengeStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  COMPLETED = 'Completed'
}

export interface UserProfile {
  id: string;
  username: string;
  joinedDate: string;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  subTasks: SubTask[];
}

export interface Affirmation {
  id: string;
  text: string;
  date: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface UserStats {
  completedChallenges: number;
  activeStreaks: number;
  moodScore: number; // 1-10
}