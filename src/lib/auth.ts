import { create } from 'zustand';
import { User, UserRole, StoreLocation } from '@shared/types';
// Mock users for simulation
const mockUsers: Record<UserRole, User> = {
  'front-desk': { id: 'user-1', name: 'Alice Johnson', role: 'front-desk', store: 'Ellisville', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' },
  'shift-lead': { id: 'user-2', name: 'Bob Williams', role: 'shift-lead', store: 'Ellisville', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  'manager': { id: 'user-3', name: 'Charlie Brown', role: 'manager', store: 'Rock Hill', avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
  'owner': { id: 'user-5', name: 'Eve Davis', role: 'owner', store: 'Ellisville', avatarUrl: 'https://i.pravatar.cc/150?u=user-5' },
};
interface AuthState {
  user: User | null;
  role: UserRole;
  store: StoreLocation;
  login: (role: UserRole) => void;
  logout: () => void;
  setStore: (store: StoreLocation) => void;
}
export const useAuth = create<AuthState>((set) => ({
  user: mockUsers['manager'], // Default to manager for full view
  role: 'manager',
  store: 'Ellisville',
  login: (role) => set({ user: mockUsers[role], role, store: mockUsers[role].store }),
  logout: () => set({ user: null, role: 'front-desk', store: 'Ellisville' }), // Reset to a default state
  setStore: (store) => set((state) => ({ ...state, store })),
}));