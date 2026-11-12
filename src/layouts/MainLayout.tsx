import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Send,
  Calendar,
  Gift,
  Building2,
  Users,
  ShieldCheck,
  FileSpreadsheet,
  LogOut,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const {
    currentUser,
    currentRole,
    isStudent,
    isRecruiter,
    isStaff,
    isPlacementOfficer,
    isFacultyCoordinator,
    isAdmin,
    logout,
    switchUserRoleForTesting
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [showArchModal, setShowArchModal] = React.useState(false);

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-[#111827] overflow-hidden">
      {/* 240px Fixed Deep Navy Sidebar per Stitch Spec */}
      <aside className="w-60 bg-[#172554] text-white flex flex-col justify-between shrink-0 shadow-lg z-20">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center gap-3 px-5 border-b border-blue-900/60 bg-[#1E3A8A]">
            <div className="w-9 h-9 rounded-lg bg-[#1D4ED8] flex items-center justify-center text-white font-black shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white leading-tight">SIPMP</h1>
              <p className="text-[10px] text-blue-200 tracking-wider uppercase font-semibold">Placement Portal</p>
            </div>
          </div>

          {/* Current Role Identity Badge */}
          <div className="px-5 py-3.5 bg-blue-950/40 border-b border-blue-900/40">
            <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">Active Workspace</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                {currentUser?.full_name || 'Guest User'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#1D4ED8] text-white">
                {isStudent ? 'STUDENT' : isRecruiter ? 'RECRUITER' : currentRole || 'STAFF'}
              </span>
            </div>
            {isFacultyCoordinator && currentUser?.department && (
              <p className="text-[11px] text-blue-300 mt-1">Dept: {currentUser.department}</p>
            )}
          </div>

          {/* Navigation Items based on strict 3-role authorization */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {/* STUDENT NAVIGATION (S03 to S08) */}
            {isStudent && (
              <>
                <NavLink
                  to="/student/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/student/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <User className="w-4 h-4" />
                  My Profile & Resume
                </NavLink>

                <NavLink
                  to="/opportunities"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Briefcase className="w-4 h-4" />
                  Opportunities (Drives)
                </NavLink>

                <NavLink
                  to="/student/applications"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Send className="w-4 h-4" />
                  My Applications
                </NavLink>

                <NavLink
                  to="/student/interviews-offers"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Gift className="w-4 h-4" />
                  Interviews & Offers
                </NavLink>
              </>
            )}

            {/* RECRUITER NAVIGATION (S09 to S13) */}
            {isRecruiter && (
              <>
                <NavLink
                  to="/recruiter/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Recruiter Dashboard
                </NavLink>

                <NavLink
                  to="/recruiter/company"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Building2 className="w-4 h-4" />
                  Company Profile
                </NavLink>

                <NavLink
                  to="/recruiter/jobs"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Briefcase className="w-4 h-4" />
                  My Opportunities
                </NavLink>

                <NavLink
                  to="/recruiter/applicants"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Users className="w-4 h-4" />
                  Applicants Review
                </NavLink>

                <NavLink
                  to="/recruiter/scheduling"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Calendar className="w-4 h-4" />
                  Interview & Offer
                </NavLink>
              </>
            )}

            {/* STAFF NAVIGATION (S14, S15, S16, S17) */}
            {isStaff && (
              <>
                <NavLink
                  to="/officer/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {isPlacementOfficer ? 'Placement Dashboard' : isFacultyCoordinator ? 'Department Dashboard' : 'Admin Overview'}
                </NavLink>

                <NavLink
                  to="/officer/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Users className="w-4 h-4" />
                  Student Directory {isFacultyCoordinator && '(Dept)'}
                </NavLink>

                <NavLink
                  to="/opportunities"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <Briefcase className="w-4 h-4" />
                  All Drives / Openings
                </NavLink>

                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                      isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                    }`
                  }
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Reports & Analytics
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                        isActive ? 'bg-[#1D4ED8] text-white shadow-sm font-semibold' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
                      }`
                    }
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    User Access & Roles
                  </NavLink>
                )}
              </>
            )}
          </nav>
        </div>

        {/* Footer controls & Fast role-switcher for student inspection */}
        <div className="p-3 border-t border-blue-900/60 bg-blue-950/60 space-y-2">
          {/* Fast Role Simulator */}
          <div className="bg-blue-900/40 p-2 rounded border border-blue-800/60">
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> Test Persona Switcher
            </p>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => {
                  switchUserRoleForTesting('STUDENT');
                  navigate('/student/dashboard');
                }}
                className={`text-[10px] py-1 px-1.5 rounded font-semibold text-center truncate ${
                  isStudent ? 'bg-blue-600 text-white' : 'bg-blue-950 text-blue-200 hover:bg-blue-800'
                }`}
                title="Student: Priya Shah"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  switchUserRoleForTesting('COMPANY_RECRUITER');
                  navigate('/recruiter/dashboard');
                }}
                className={`text-[10px] py-1 px-1.5 rounded font-semibold text-center truncate ${
                  isRecruiter ? 'bg-blue-600 text-white' : 'bg-blue-950 text-blue-200 hover:bg-blue-800'
                }`}
                title="Recruiter: Karan Joshi (TechNova)"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => {
                  switchUserRoleForTesting('PLACEMENT_OFFICER');
                  navigate('/officer/dashboard');
                }}
                className={`text-[10px] py-1 px-1.5 rounded font-semibold text-center truncate ${
                  isPlacementOfficer ? 'bg-blue-600 text-white' : 'bg-blue-950 text-blue-200 hover:bg-blue-800'
                }`}
                title="Staff: Neha Patel (Placement Officer)"
              >
                PO
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  switchUserRoleForTesting('FACULTY_COORDINATOR');
                  navigate('/officer/dashboard');
                }}
                className={`text-[10px] py-1 px-1.5 rounded font-semibold text-center truncate ${
                  isFacultyCoordinator ? 'bg-blue-600 text-white' : 'bg-blue-950 text-blue-200 hover:bg-blue-800'
                }`}
                title="Staff: Dr. Amit Verma (Faculty Coord CSE)"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => {
                  switchUserRoleForTesting('ADMINISTRATOR');
                  navigate('/admin/users');
                }}
                className={`text-[10px] py-1 px-1.5 rounded font-semibold text-center truncate ${
                  isAdmin ? 'bg-blue-600 text-white' : 'bg-blue-950 text-blue-200 hover:bg-blue-800'
                }`}
                title="Admin: Sana Khan"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-200 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 rounded-md transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 64px Persistent White Utility Top Header */}
        <header className="h-16 bg-white border-b border-[#D1D5DB] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-[#111827]">
              {location.pathname.includes('/student')
                ? 'Student Workspace'
                : location.pathname.includes('/recruiter')
                ? 'Recruitment Portal'
                : location.pathname.includes('/admin')
                ? 'System Administration'
                : 'Academic Placement Cell'}
            </h2>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-600 font-medium capitalize">
              {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Spring Boot & MySQL architecture inspector */}
            <button
              type="button"
              onClick={() => setShowArchModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#1D4ED8] transition-colors"
              title="Inspect backend Spring Boot 3.5.7 configuration and 16 MySQL tables"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Backend &amp; DB Architecture</span>
            </button>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#111827] leading-tight">{currentUser?.full_name}</p>
                <p className="text-[10px] text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body with 24px outer padding per Stitch spec */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* SPRING BOOT & MYSQL ARCHITECTURE MODAL */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#172554] text-white flex items-center justify-center font-bold text-xs">
                  Java
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#111827]">
                    Spring Boot 3.5.7 + MySQL 8 Architecture (SIPMP)
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    Backend Port: 8080 | Frontend Port: 5173 | Database: placement_portal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowArchModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Existing Database Preserved (placement_portal)
                </p>
                <p className="text-[11px] leading-relaxed">
                  Configured with <code>spring.jpa.hibernate.ddl-auto=validate</code>. No destructive <code>DROP TABLE</code> scripts are executed. All 16 tables and 28 foreign-key relationships from the authoritative 22-page IA6 ERD are strictly validated.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">
                  16 MySQL Tables &amp; JPA Entity Mappings
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[11px]">
                  <span className="p-1.5 bg-gray-100 rounded">1. users</span>
                  <span className="p-1.5 bg-gray-100 rounded">2. login_sessions</span>
                  <span className="p-1.5 bg-gray-100 rounded">3. user_access_history</span>
                  <span className="p-1.5 bg-gray-100 rounded">4. student_profiles</span>
                  <span className="p-1.5 bg-gray-100 rounded">5. student_resumes</span>
                  <span className="p-1.5 bg-gray-100 rounded">6. student_edit_hist</span>
                  <span className="p-1.5 bg-gray-100 rounded">7. companies</span>
                  <span className="p-1.5 bg-gray-100 rounded">8. opportunities</span>
                  <span className="p-1.5 bg-gray-100 rounded">9. opp_edit_hist</span>
                  <span className="p-1.5 bg-gray-100 rounded">10. opp_del_hist</span>
                  <span className="p-1.5 bg-gray-100 rounded">11. applications</span>
                  <span className="p-1.5 bg-gray-100 rounded">12. app_status_hist</span>
                  <span className="p-1.5 bg-gray-100 rounded">13. interviews</span>
                  <span className="p-1.5 bg-gray-100 rounded">14. offers</span>
                  <span className="p-1.5 bg-gray-100 rounded">15. dashboard_pref</span>
                  <span className="p-1.5 bg-gray-100 rounded">16. report_history</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">
                  Running Spring Boot Backend Locally in VS Code
                </h4>
                <div className="p-3 bg-gray-900 text-gray-200 rounded font-mono text-[11px] space-y-1">
                  <p># Navigate to the backend folder</p>
                  <p className="text-emerald-400">cd backend</p>
                  <p># Run with Maven</p>
                  <p className="text-emerald-400">mvn spring-boot:run</p>
                  <p># Backend will launch on http://localhost:8080/api</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-1">
                  Postman Test Suite (IA12 Compliant)
                </h4>
                <p className="text-[11px] text-gray-600 mb-2">
                  Ready-to-import Postman JSON collection available in <code>/backend/postman/SIPMP_Postman_Collection.json</code> covering tasks T01 through T18.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-xs"
              >
                Close Architecture View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
