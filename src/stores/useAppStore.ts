'use client';
import { create } from 'zustand';
import type { UserRole, User, Project } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Navigation
  activeModule: string;
  setActiveModule: (module: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // Role (for demo/switching)
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  activeModule: 'overview',
  setActiveModule: (module) => set({ activeModule: module }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),

  currentRole: 'Project Manager',
  setCurrentRole: (role) => set({ currentRole: role }),
}));
