import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Company, Opportunity, Application } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Building2,
  Briefcase,
  Users,
  Calendar,
  Gift,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const comps = portalState.getCompanies();
    const c = comps.find(comp => comp.user_id === currentUser.user_id) || comps[0];
    if (c) {
      setCompany(c);
      const opps = portalState.getOpportunities().filter(o => o.company_id === c.company_id);
      setOpportunities(opps);

      const allApps = portalState.getApplications();
      const compApps = allApps.filter((a: Application) => opps.some(o => o.opportunity_id === a.opportunity_id));
      setApplications(compApps);
    }
  }, [currentUser]);

  const activeDrives = opportunities.filter(o => o.status === 'Open').length;
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length;
  const selectedCount = applications.filter(a => a.status === 'Selected').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#111827]">
              {company ? company.company_name : 'Recruiting Organization'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Verified Partner
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            HR Representative: <strong className="text-gray-800">{company?.hr_name}</strong> ({company?.hr_email}) • Location: {company?.location}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/company"
            className="text-xs font-semibold px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700"
          >
            Company Profile
          </Link>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-bold px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post New Job (T10)
          </Link>
        </div>
      </div>

      {/* 4 DRIVE METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Job Drives</p>
            <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{activeDrives}</p>
            <Link to="/recruiter/jobs" className="text-[11px] font-semibold text-[#1D4ED8] hover:underline mt-2 inline-block">
              Manage Postings &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1D4ED8]">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Candidates</p>
            <p className="text-2xl font-bold font-mono text-purple-600 mt-1">{totalApplicants}</p>
            <Link to="/recruiter/applicants" className="text-[11px] font-semibold text-purple-600 hover:underline mt-2 inline-block">
              Review Resumes &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">In Evaluation</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{shortlistedCount}</p>
            <Link to="/recruiter/scheduling" className="text-[11px] font-semibold text-amber-600 hover:underline mt-2 inline-block">
              Interview Schedule &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Selected / Offers</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{selectedCount}</p>
            <Link to="/recruiter/scheduling" className="text-[11px] font-semibold text-emerald-600 hover:underline mt-2 inline-block">
              Rollout Offers &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TWO SECTIONS: POSTED DRIVES & RECENT APPLICANTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Drives */}
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#1D4ED8]" />
              Posted Opportunities
            </h2>
            <Link to="/recruiter/jobs" className="text-xs font-semibold text-[#1D4ED8] hover:underline">
              Manage All ({opportunities.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities.length > 0 ? (
              opportunities.map(opp => {
                const count = applications.filter(a => a.opportunity_id === opp.opportunity_id).length;
                return (
                  <div
                    key={opp.opportunity_id}
                    className="p-3.5 rounded-md border border-gray-200 bg-gray-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-[#111827]">{opp.title}</h3>
                        <StatusBadge status={opp.status} />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {opp.type} • ₹{(opp.compensation / 100000).toFixed(2)} LPA • Deadline: {new Date(opp.application_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-100 text-[#1D4ED8]">
                        {count} Applicants
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No postings created yet.</p>
            )}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Recent Candidate Submissions
            </h2>
            <Link to="/recruiter/applicants" className="text-xs font-semibold text-purple-600 hover:underline">
              Review Queue &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {applications.length > 0 ? (
              applications.slice(0, 4).map(app => (
                <div
                  key={app.application_id}
                  className="p-3.5 rounded-md border border-gray-200 bg-gray-50/50 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-[#111827]">{app.student_name}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Applied for: <strong>{app.opportunity_title || 'Drive'}</strong> • Applied: {new Date(app.applied_on).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-6 text-center">No candidate applications submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
