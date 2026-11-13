import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginRoleOption } from '../../types';
import { GraduationCap, Briefcase, ShieldCheck, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<LoginRoleOption>('STUDENT');
  const [identifier, setIdentifier] = useState('priya.shah@college.edu');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick preset loader for presentation & evaluation
  const setPreset = (role: LoginRoleOption, email: string, pass: string) => {
    setSelectedRole(role);
    setIdentifier(email);
    setPassword(pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(selectedRole, identifier, password);
      if (res.success && res.user) {
        if (res.user.role === 'STUDENT') {
          navigate('/student/dashboard');
        } else if (res.user.role === 'COMPANY_RECRUITER') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/officer/dashboard');
        }
      } else {
        setError(res.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-xl bg-[#172554] flex items-center justify-center text-white shadow-lg mb-3">
          <GraduationCap className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-black text-[#111827] tracking-tight">SIPMP</h1>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-0.5">
          Student Internship &amp; Placement Management Portal
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Select your role persona to access your authorized workspace
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-[#D1D5DB] sm:px-10">
          {/* STEP 1: Strict 3-Role Tab Selector per Stitch Specification */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Step 1: Choose Your Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('STUDENT');
                  setIdentifier('priya.shah@college.edu');
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-md border text-center transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-bold shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-5 h-5 mb-1 text-[#1D4ED8]" />
                <span className="text-xs">Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('RECRUITER');
                  setIdentifier('karan.joshi@technova.com');
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-md border text-center transition-all ${
                  selectedRole === 'RECRUITER'
                    ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-bold shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-xs">Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('STAFF');
                  setIdentifier('neha.patel@college.edu');
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-md border text-center transition-all ${
                  selectedRole === 'STAFF'
                    ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-bold shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mb-1 text-purple-600" />
                <span className="text-xs">Staff</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              {selectedRole === 'STUDENT' && 'For registered diploma candidates accessing job postings, drives, and tracking offers.'}
              {selectedRole === 'RECRUITER' && 'For verified industry partners posting job openings and shortlisting applicants.'}
              {selectedRole === 'STAFF' && 'For Placement Officers and Faculty Coordinators.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Authentication Error:</strong>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* STEP 2: Credential Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-semibold text-gray-700">
                Email Address or Phone / Enrollment No
              </label>
              <div className="mt-1">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. priya.shah@college.edu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8] bg-white text-[#111827]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <span className="text-[11px] text-gray-500">Min 8 chars, 1 uppercase, 1 symbol</span>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8] bg-white text-[#111827]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-bold text-white bg-[#1D4ED8] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4ED8] transition-colors"
            >
              {isLoading ? 'Verifying...' : `Sign In as ${selectedRole}`}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Fast Testing Presets (Directly from IA5 sample data) */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Quick-Fill Demo Personas:
              </span>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setPreset('STUDENT', 'priya.shah@college.edu', 'Password@123')}
                className="w-full text-left px-2.5 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-blue-50 text-[11px] text-gray-700 flex items-center justify-between transition-colors"
              >
                <span><strong>Student:</strong> Priya Shah (CSE Sem 5, CGPA 8.75)</span>
                <span className="text-[10px] text-blue-600 font-mono">Fill</span>
              </button>
              <button
                type="button"
                onClick={() => setPreset('RECRUITER', 'karan.joshi@technova.com', 'Password@123')}
                className="w-full text-left px-2.5 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-emerald-50 text-[11px] text-gray-700 flex items-center justify-between transition-colors"
              >
                <span><strong>Recruiter:</strong> Karan Joshi (TechNova Solutions)</span>
                <span className="text-[10px] text-emerald-600 font-mono">Fill</span>
              </button>
              <button
                type="button"
                onClick={() => setPreset('STAFF', 'neha.patel@college.edu', 'Password@123')}
                className="w-full text-left px-2.5 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-purple-50 text-[11px] text-gray-700 flex items-center justify-between transition-colors"
              >
                <span><strong>Placement Officer:</strong> Neha Patel (T&amp;P Cell)</span>
                <span className="text-[10px] text-purple-600 font-mono">Fill</span>
              </button>
              <button
                type="button"
                onClick={() => setPreset('STAFF', 'amit.verma@college.edu', 'Password@123')}
                className="w-full text-left px-2.5 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-purple-50 text-[11px] text-gray-700 flex items-center justify-between transition-colors"
              >
                <span><strong>Faculty Coord:</strong> Dr. Amit Verma (CSE Dept)</span>
                <span className="text-[10px] text-purple-600 font-mono">Fill</span>
              </button>
            </div>
          </div>

          {/* Navigation to Register */}
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#1D4ED8] hover:underline">
                Register new account (T01)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
