import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { InterviewsOffersPage } from './pages/student/InterviewsOffersPage';

// Opportunities Pages (Shared)
import { OpportunityListPage } from './pages/opportunities/OpportunityListPage';
import { OpportunityDetailsPage } from './pages/opportunities/OpportunityDetailsPage';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyProfilePage } from './pages/recruiter/CompanyProfilePage';
import { MyOpportunitiesPage } from './pages/recruiter/MyOpportunitiesPage';
import { ApplicantsPage } from './pages/recruiter/ApplicantsPage';
import { InterviewOfferSchedulingPage } from './pages/recruiter/InterviewOfferSchedulingPage';

// Staff Pages
import { PlacementDashboard } from './pages/staff/PlacementDashboard';
import { StudentDirectoryPage } from './pages/staff/StudentDirectoryPage';
import { ReportsPage } from './pages/staff/ReportsPage';
import { UserAccessPage } from './pages/staff/UserAccessPage';

// Guard for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

// Root index redirector based on authenticated user
const RootRedirect: React.FC = () => {
  const { currentUser, isStudent, isRecruiter, isAdmin } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (isStudent) {
    return <Navigate to="/student/dashboard" replace />;
  }
  if (isRecruiter) {
    return <Navigate to="/recruiter/dashboard" replace />;
  }
  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }
  return <Navigate to="/officer/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root Redirector */}
          <Route path="/" element={<RootRedirect />} />

          {/* Student Workspaces */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute>
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/interviews-offers"
            element={
              <ProtectedRoute>
                <InterviewsOffersPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Opportunity Drives */}
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <OpportunityListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/:id"
            element={
              <ProtectedRoute>
                <OpportunityDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Workspaces */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/company"
            element={
              <ProtectedRoute>
                <CompanyProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute>
                <MyOpportunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants"
            element={
              <ProtectedRoute>
                <ApplicantsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/scheduling"
            element={
              <ProtectedRoute>
                <InterviewOfferSchedulingPage />
              </ProtectedRoute>
            }
          />

          {/* Staff Workspaces */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute>
                <PlacementDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/students"
            element={
              <ProtectedRoute>
                <StudentDirectoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <UserAccessPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
