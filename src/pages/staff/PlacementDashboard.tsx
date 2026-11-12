import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Company, Opportunity, StudentProfile, User, Offer } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Gift,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

export const PlacementDashboard: React.FC = () => {
  const { currentUser, isPlacementOfficer, isFacultyCoordinator, isAdmin } = useAuth();

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    let allStudents = portalState.getAllStudentProfiles();
    // If Faculty Coordinator, restrict to own department
    if (isFacultyCoordinator && currentUser?.department) {
      const dept = currentUser.department.toLowerCase();
      if (dept.includes('cse') || dept.includes('computer')) {
        allStudents = allStudents.filter(s => s.branch === 'CSE' || s.branch === 'IT');
      }
    }
    setStudents(allStudents);
    setOpportunities(portalState.getOpportunities());
    setCompanies(portalState.getCompanies());
    setUsers(portalState.getUsers());
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Derived metrics
  const totalStudents = students.length;
  const verifiedStudents = students.filter(s => s.verification_status === 'Verified').length;
  const allOffers = portalState.getOffers();
  const placedOffers = allOffers.filter(o => o.status === 'Accepted');
  const placedCount = placedOffers.length;
  const placementRate = totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(1) : '0';

  const avgPackage = placedOffers.length > 0
    ? ((placedOffers.reduce((acc, curr) => acc + curr.package_amount, 0) / placedOffers.length) / 100000).toFixed(2)
    : '6.50';

  // Pending recruiter registrations (BR-03)
  const pendingRecruiters = users.filter(u => u.role === 'COMPANY_RECRUITER' && u.status === 'Pending');

  const handleApproveRecruiter = (userId: number) => {
    if (!currentUser) return;
    const ok = portalState.updateUserAccess(userId, 'APPROVE', undefined, 'Recruiter verified by T&P Cell', currentUser.user_id);
    if (ok) {
      setFeedback({ type: 'success', text: 'Recruiter account approved and activated.' });
      loadData();
    }
  };

  const handleRejectRecruiter = (userId: number) => {
    if (!currentUser) return;
    const ok = portalState.updateUserAccess(userId, 'REJECT', undefined, 'Verification criteria not satisfied', currentUser.user_id);
    if (ok) {
      setFeedback({ type: 'success', text: 'Recruiter registration rejected.' });
      loadData();
    }
  };

  // Branch-wise distribution
  const branches = ['CSE', 'IT', 'ECE', 'ME', 'CE'];
  const branchStats = branches.map(b => {
    const total = students.filter(s => s.branch === b).length;
    const placed = students.filter(s => s.branch === b && placedOffers.some((o: Offer) => o.student_id === s.student_id)).length;
    return { branch: b, total, placed };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827]">
              {isPlacementOfficer
                ? 'Training &amp; Placement Executive Dashboard (S14)'
                : isFacultyCoordinator
                ? `Department Coordinator Dashboard (${currentUser?.department || 'CSE'})`
                : 'Administrative Placement Overview (S14)'}
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics for diploma campus drives, batch placement percentage, and partner relations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/officer/students"
            className="text-xs font-semibold px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700"
          >
            Student Directory
          </Link>
          <Link
            to="/reports"
            className="text-xs font-bold px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white shadow-sm flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Reports (T18)
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-md text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* 4 EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Registered</p>
            <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{totalStudents}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-2 inline-block">
              {verifiedStudents} Verified Profiles
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1D4ED8]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Placement Rate</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{placementRate}%</p>
            <span className="text-[11px] text-gray-500 mt-2 inline-block font-mono">
              {placedCount} of {totalStudents} Students
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Package</p>
            <p className="text-2xl font-bold font-mono text-purple-600 mt-1">₹{avgPackage} LPA</p>
            <span className="text-[11px] text-gray-500 mt-2 inline-block">Top offer: ₹8.5 LPA</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Gift className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Companies</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{companies.length}</p>
            <span className="text-[11px] text-amber-700 font-semibold mt-2 inline-block">
              {pendingRecruiters.length} Pending Approval
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* PENDING RECRUITER APPROVALS STRIP (BR-03) */}
      {pendingRecruiters.length > 0 && (isPlacementOfficer || isAdmin) && (
        <div className="bg-amber-50/70 border-2 border-amber-300 p-5 rounded-lg shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-600" />
              Pending Recruiter Registrations Awaiting Verification (BR-03)
            </span>
            <span className="text-[11px] text-amber-800 font-mono">{pendingRecruiters.length} Request(s)</span>
          </div>

          <div className="space-y-2">
            {pendingRecruiters.map(rec => (
              <div
                key={rec.user_id}
                className="bg-white p-3.5 rounded-md border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <h4 className="font-bold text-xs text-[#111827]">
                    {rec.company_name || 'Organization'} — {rec.full_name}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Email: {rec.email} • Phone: {rec.phone} • Website: {rec.company_website || 'Not provided'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRejectRecruiter(rec.user_id)}
                    className="px-3 py-1 text-xs font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveRecruiter(rec.user_id)}
                    className="px-3.5 py-1 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    Approve Account
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TWO SECTIONS: BRANCH-WISE BREAKDOWN & ACTIVE DRIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise placement distribution */}
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#1D4ED8]" />
              Branch-wise Placement Statistics
            </h2>
            <span className="text-[11px] text-gray-500 font-mono">Diploma 2024-25</span>
          </div>

          <div className="space-y-3.5">
            {branchStats.map(stat => {
              const pct = stat.total > 0 ? ((stat.placed / stat.total) * 100).toFixed(0) : '0';
              return (
                <div key={stat.branch} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-800">{stat.branch} Engineering</span>
                    <span className="font-mono text-gray-600">
                      <strong>{stat.placed}</strong> placed / {stat.total} total ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#1D4ED8] h-2.5 rounded-full transition-all"
                      style={{ width: `${Math.max(Number(pct), 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Campus Drives Overview */}
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              Active Campus Drives
            </h2>
            <Link to="/opportunities" className="text-xs font-semibold text-[#1D4ED8] hover:underline">
              View All ({opportunities.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-2.5">
            {opportunities.slice(0, 4).map(opp => (
              <div
                key={opp.opportunity_id}
                className="p-3 rounded-md border border-gray-200 bg-gray-50/40 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">{opp.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {opp.company_name} • Min CGPA: <strong className="font-mono">{opp.min_cgpa}</strong> • Package: <strong className="text-emerald-700 font-mono">₹{(opp.compensation / 100000).toFixed(2)} LPA</strong>
                  </p>
                </div>
                <div>
                  <StatusBadge status={opp.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
