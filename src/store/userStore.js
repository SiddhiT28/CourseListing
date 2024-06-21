import { create } from 'zustand';

const initialUserState = {
  name: '',
  profilePic: '',
  id: '',
};

export const useStore = create((set) => ({
  user: {},
  isLoggedIn: false,
  searchQuery: '',
  search: (query) => set({ searchQuery: query }),
  userLogin: (user) => set({ isLoggedIn: true, user }),
  userLogout: () => set({ isLoggedIn: false, user: initialUserState }),
}));
