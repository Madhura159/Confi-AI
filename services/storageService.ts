import { Challenge, Affirmation, JournalEntry } from '../types';

let currentUserId: string | null = null;

const getStorageKey = (type: string) => `confi_${currentUserId}_${type}`;

const loadData = <T>(type: string): T[] => {
  if (!currentUserId) return [];
  const data = localStorage.getItem(getStorageKey(type));
  return data ? JSON.parse(data) : [];
};

const saveData = <T>(type: string, data: T[]) => {
  if (!currentUserId) return;
  localStorage.setItem(getStorageKey(type), JSON.stringify(data));
};

export const storageService = {
  setContext: (userId: string) => {
    currentUserId = userId;
  },

  // --- CHALLENGES ---
  getChallenges: async (): Promise<Challenge[]> => {
    return loadData<Challenge>('challenges');
  },

  saveChallenge: async (challenge: Challenge): Promise<void> => {
    const challenges = loadData<Challenge>('challenges');
    saveData('challenges', [challenge, ...challenges]);
  },

  updateChallenge: async (updatedChallenge: Challenge): Promise<void> => {
    const challenges = loadData<Challenge>('challenges');
    const index = challenges.findIndex(c => c.id === updatedChallenge.id);
    if (index !== -1) {
      challenges[index] = updatedChallenge;
      saveData('challenges', challenges);
    }
  },

  deleteChallenge: async (id: string): Promise<void> => {
    const challenges = loadData<Challenge>('challenges');
    saveData('challenges', challenges.filter(c => c.id !== id));
  },

  // --- AFFIRMATIONS ---
  getAffirmations: async (): Promise<Affirmation[]> => {
    return loadData<Affirmation>('affirmations');
  },

  saveAffirmation: async (affirmation: Affirmation): Promise<void> => {
    const affirmations = loadData<Affirmation>('affirmations');
    saveData('affirmations', [affirmation, ...affirmations]);
  },

  // --- JOURNAL ---
  getJournalEntries: async (): Promise<JournalEntry[]> => {
    return loadData<JournalEntry>('journal_entries');
  },

  saveJournalEntry: async (entry: JournalEntry): Promise<void> => {
    const entries = loadData<JournalEntry>('journal_entries');
    saveData('journal_entries', [entry, ...entries]);
  }
};