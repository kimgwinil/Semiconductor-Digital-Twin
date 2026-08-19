import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, User, WaferState } from '../types';

interface AppContextType {
  state: AppState;
  loginUser: (user: User) => void;
  setCurrentModule: (moduleId: string) => void;
  updateWafer: (wafer: WaferState) => void;
}

const defaultState: AppState = {
  user: null,
  wafer: {
    id: `WAFER-${new Date().getFullYear()}-000001`,
    diameter: 300,
    layers: [{ material: 'Silicon', thickness: 775000, color: '#8892b0' }], // 775um
    processHistory: []
  },
  currentModule: 'm2', // Default to reference module for now
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const loginUser = (user: User) => setState(prev => ({ ...prev, user }));
  const setCurrentModule = (moduleId: string) => setState(prev => ({ ...prev, currentModule: moduleId }));
  const updateWafer = (wafer: WaferState) => setState(prev => ({ ...prev, wafer }));

  return (
    <AppContext.Provider value={{ state, loginUser, setCurrentModule, updateWafer }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
