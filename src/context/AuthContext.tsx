import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, LoginRoleOption } from '../types';
import { portalState } from '../services/portalState';

interface AuthContextType {
  currentUser: User | null;
  currentRole: Role | null;
  isStudent: boolean;
  isRecruiter: boolean;
  isStaff: boolean;
  isPlacementOfficer: boolean;
  isFacultyCoordinator: boolean;
  isAdmin: boolean;
  login: (roleOption: LoginRoleOption, identifier: string, passwordPlain: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUserRoleForTesting: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(portalState.getCurrentUser());

  useEffect(() => {
    // Keep local component state in sync with portalState
    const checkUser = () => {
      setCurrentUser(portalState.getCurrentUser());
    };
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const login = (roleOption: LoginRoleOption, identifier: string, passwordPlain: string) => {
    const res = portalState.login(roleOption, identifier, passwordPlain);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return { success: res.success, message: res.message };
  };

  const logout = () => {
    portalState.logout();
    setCurrentUser(null);
  };

  const switchUserRoleForTesting = (role: Role) => {
    portalState.switchTestUser(role);
    setCurrentUser(portalState.getCurrentUser());
  };

  const currentRole = currentUser?.role || null;
  const isStudent = currentRole === 'STUDENT';
  const isRecruiter = currentRole === 'COMPANY_RECRUITER';
  const isStaff = ['PLACEMENT_OFFICER', 'FACULTY_COORDINATOR', 'ADMINISTRATOR'].includes(currentRole || '');
  const isPlacementOfficer = currentRole === 'PLACEMENT_OFFICER';
  const isFacultyCoordinator = currentRole === 'FACULTY_COORDINATOR';
  const isAdmin = currentRole === 'ADMINISTRATOR';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isStudent,
        isRecruiter,
        isStaff,
        isPlacementOfficer,
        isFacultyCoordinator,
        isAdmin,
        login,
        logout,
        switchUserRoleForTesting
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
