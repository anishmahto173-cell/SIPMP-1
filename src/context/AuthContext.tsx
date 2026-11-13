import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, LoginRoleOption } from '../types';
import { portalState } from '../services/portalState';
import { authApi } from '../services/apiClient';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role | null;
  isAuthLoading: boolean;
  isStudent: boolean;
  isRecruiter: boolean;
  isStaff: boolean;
  isPlacementOfficer: boolean;
  isFacultyCoordinator: boolean;
  isAdmin: boolean;
  login: (
    roleOption: LoginRoleOption,
    identifier: string,
    passwordPlain: string
  ) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  switchUserRoleForTesting: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const restoreSession = async () => {
      try {
        const sessionUser = await authApi.me();
        if (!active) return;
        setCurrentUser(sessionUser);
        portalState.setCurrentUser(sessionUser);
      } finally {
        if (active) {
          setIsAuthLoading(false);
        }
      }
    };
    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (
    roleOption: LoginRoleOption,
    identifier: string,
    passwordPlain: string
  ): Promise<{ success: boolean; message?: string; user?: User }> => {
    const res = await authApi.login(roleOption, identifier, passwordPlain);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      portalState.setCurrentUser(res.user);
      return { success: true, message: res.message, user: res.user };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await authApi.logout();
    portalState.logout();
    setCurrentUser(null);
  };

  const switchUserRoleForTesting = (_role: Role) => {
    // Authentication is enforced via backend HttpSession; client-side role switching is disabled.
  };

  const currentRole = currentUser?.role || null;
  const isStudent = currentRole === 'STUDENT';
  const isRecruiter = currentRole === 'COMPANY_RECRUITER';
  const isPlacementOfficer = currentRole === 'PLACEMENT_OFFICER';
  const isFacultyCoordinator = currentRole === 'FACULTY_COORDINATOR';
  const isStaff = isPlacementOfficer || isFacultyCoordinator;
  const isAdmin = false;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthLoading,
        isStudent,
        isRecruiter,
        isStaff,
        isPlacementOfficer,
        isFacultyCoordinator,
        isAdmin,
        login,
        logout,
        switchUserRoleForTesting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
