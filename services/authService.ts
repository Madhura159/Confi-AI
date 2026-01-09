import { UserProfile } from '../types';

const STORAGE_KEY = 'confi_users';

const getUsers = (): UserProfile[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: UserProfile[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  login: async (username: string): Promise<UserProfile | null> => {
    // Simulate slight delay for realism
    await new Promise(r => setTimeout(r, 400));
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user || null;
  },

  signup: async (username: string): Promise<UserProfile> => {
    await new Promise(r => setTimeout(r, 600));
    const users = getUsers();
    
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("Username already taken. Please pick another one.");
    }

    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      username,
      joinedDate: new Date().toISOString()
    };

    saveUsers([...users, newUser]);
    return newUser;
  }
};