
import { UserProfile } from '../types';

const USERS_KEY = 'confi_users';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authService = {
  login: async (username: string): Promise<UserProfile | null> => {
    await delay(800);
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: UserProfile[] = usersRaw ? JSON.parse(usersRaw) : [];
    
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user || null;
  },

  signup: async (username: string): Promise<UserProfile> => {
    await delay(800);
    const usersRaw = localStorage.getItem(USERS_KEY);
    const users: UserProfile[] = usersRaw ? JSON.parse(usersRaw) : [];
    
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("Username already exists");
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      username,
      joinedDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  }
};
