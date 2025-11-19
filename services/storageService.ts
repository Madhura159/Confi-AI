
import { Challenge, Affirmation, JournalEntry } from '../types';

// Helper to simulate delay for realism
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// We will store the current user ID here to prefix keys
let currentUserId: string | null = null;

const getChallengeKey = () => `confi_challenges_${currentUserId || 'guest'}`;
const getAffirmationKey = () => `confi_affirmations_${currentUserId || 'guest'}`;
const getJournalKey = () => `confi_journal_${currentUserId || 'guest'}`;

export const storageService = {
  // Set the context when user logs in
  setContext: (userId: string) => {
    currentUserId = userId;
  },

  getChallenges: async (): Promise<Challenge[]> => {
    if (!currentUserId) return [];
    await delay(300);
    const data = localStorage.getItem(getChallengeKey());
    return data ? JSON.parse(data) : [];
  },

  saveChallenge: async (challenge: Challenge): Promise<void> => {
    if (!currentUserId) return;
    await delay(300);
    const current = await storageService.getChallenges();
    const updated = [...current, challenge];
    localStorage.setItem(getChallengeKey(), JSON.stringify(updated));
  },

  updateChallenge: async (updatedChallenge: Challenge): Promise<void> => {
    if (!currentUserId) return;
    await delay(200);
    const current = await storageService.getChallenges();
    const index = current.findIndex(c => c.id === updatedChallenge.id);
    if (index !== -1) {
      current[index] = updatedChallenge;
      localStorage.setItem(getChallengeKey(), JSON.stringify(current));
    }
  },

  deleteChallenge: async (id: string): Promise<void> => {
    if (!currentUserId) return;
    await delay(200);
    const current = await storageService.getChallenges();
    const filtered = current.filter(c => c.id !== id);
    localStorage.setItem(getChallengeKey(), JSON.stringify(filtered));
  },

  getAffirmations: async (): Promise<Affirmation[]> => {
    if (!currentUserId) return [];
    const data = localStorage.getItem(getAffirmationKey());
    return data ? JSON.parse(data) : [];
  },

  saveAffirmation: async (affirmation: Affirmation): Promise<void> => {
    if (!currentUserId) return;
    await delay(200);
    const current = await storageService.getAffirmations();
    // Keep only last 10
    const updated = [affirmation, ...current].slice(0, 10);
    localStorage.setItem(getAffirmationKey(), JSON.stringify(updated));
  },

  getJournalEntries: async (): Promise<JournalEntry[]> => {
    if (!currentUserId) return [];
    await delay(300);
    const data = localStorage.getItem(getJournalKey());
    return data ? JSON.parse(data) : [];
  },

  saveJournalEntry: async (entry: JournalEntry): Promise<void> => {
    if (!currentUserId) return;
    await delay(300);
    const current = await storageService.getJournalEntries();
    // Add to beginning
    const updated = [entry, ...current];
    localStorage.setItem(getJournalKey(), JSON.stringify(updated));
  }
};