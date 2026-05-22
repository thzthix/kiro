/**
 * AppContext - React Context for global application state
 * Feature: turtle-study-app
 *
 * Provides centralized state management using Context API and useReducer.
 * All components can access and update application state through this context.
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState } from '../types';
import { appReducer, AppAction } from './AppReducer';

// ============================================================================
// Initial State
// ============================================================================

/**
 * Initial application state
 * Starts on home screen with no active session
 */
const initialState: AppState = {
  screen: 'home',
  session: null,
  error: null,
};

// ============================================================================
// Context Definition
// ============================================================================

/**
 * Context type definition
 * Provides access to application state and dispatch function
 */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

/**
 * Create the context
 * Undefined by default to enforce usage within provider
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

/**
 * Props for AppProvider component
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider component - wraps the application with state context
 * Uses useReducer to manage application state with the appReducer
 * @param props - Component props
 * @param props.children - Child components to wrap with context
 * @returns Provider component
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================================================
// Custom Hook
// ============================================================================

/**
 * Custom hook to access app context
 * Provides type-safe access to application state and dispatch
 * @throws {Error} If used outside of AppProvider
 * @returns Context value with state and dispatch
 * @example
 * ```tsx
 * const { state, dispatch } = useAppContext();
 * dispatch(startSession(30));
 * ```
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
