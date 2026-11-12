import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Opportunity } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  IndianRupee,
  ChevronRight
} from 'lucide-react';

export const OpportunityListPage: React.FC = () => {
  const { currentUser, isStudent, isRecruiter, isStaff } = useAuth();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('ALL');
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const studentProfile = currentUser && isStudent
    ? portalState.getStudentProfileByUserId(currentUser.user_id)
    : undefined;

  const loadData = () => {
    let list = portalState.getOpportunities();

    // Filter by search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        o => o.title.toLowerCase().includes(q) ||
             (o.company_name && o.company_name.toLowerCase().includes(q)) ||
             (o.location && o.location.toLowerCase().includes(q))
      );
    }

    // Filter by type
    if (jobTypeFilter !== 'ALL') {
      list = list.filter(o => o.type === jobTypeFilter);
    }

    // Filter by eligibility if requested
    if (eligibleOnly && studentProfile) {
      list = list.filter(o => {
        const allowedBranches = o.eligible_branches.split(',').map(b => b.trim().toUpperCase());
        const meetsCgpa = studentProfile.cgpa >= o.min_cgpa;
        const meetsBranch = allowedBranches.includes(studentProfile.branch.toUpperCase());
        const meetsBacklogs = studentProfile.backlogs <= o.max_backlogs;
        return meetsCgpa && meetsBranch && meetsBacklogs && o.status === 'Open';
      });
    }

    setOpportunities(list);
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, jobTypeFilter, eligibleOnly]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#1D4ED8]" />
            Campus Placement &amp; Internship Drives (S05)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse verified job postings, check eligibility criteria, and submit applications.
          </p>
        </div>

        {/* Action Button for Recruiters/Staff */}
        {(isRecruiter || isStaff) && (
          <Link
            to="/recruiter/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Post New Opportunity (T10)
          </Link>
        )}
      </div>

      {/* FILTER & SEARCH STRIP */}
      <div className="bg-white p-4 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company, city..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Job Type Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Types</option>
              <option value="Placement">Placement</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Student "Eligible Only" Switch */}
          {isStudent && (
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="rounded text-[#1D4ED8] focus:ring-[#1D4ED8]"
              />
              <span>Show Eligible Drives Only</span>
            </label>
          )}
        </div>
      </div>

      {/* ERP DATA TABLE */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Opportunity / Company</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Job Type</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Eligible Branches</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Min CGPA</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Compensation</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Deadline</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities.length > 0 ? (
                opportunities.map((opp) => {
                  let isEligible = true;
                  let eligibilityReason = '';
                  const allowedBranches = opp.eligible_branches.split(',').map(b => b.trim().toUpperCase());

                  if (studentProfile) {
                    if (studentProfile.cgpa < opp.min_cgpa) {
                      isEligible = false;
                      eligibilityReason = `CGPA ${studentProfile.cgpa} < Min ${opp.min_cgpa}`;
                    } else if (!allowedBranches.includes(studentProfile.branch.toUpperCase())) {
                      isEligible = false;
                      eligibilityReason = `Branch ${studentProfile.branch} not in ${opp.eligible_branches}`;
                    } else if (studentProfile.backlogs > opp.max_backlogs) {
                      isEligible = false;
                      eligibilityReason = `Backlogs ${studentProfile.backlogs} > Max ${opp.max_backlogs}`;
                    }
                  }

                  const isExpired = new Date(opp.application_deadline) < new Date();

                  return (
                    <tr
                      key={opp.opportunity_id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Title & Company */}
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/opportunities/${opp.opportunity_id}`}
                          className="font-bold text-gray-900 hover:text-[#1D4ED8]"
                        >
                          {opp.title}
                        </Link>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>{opp.company_name}</span> • <span>{opp.location}</span>
                        </p>
                      </td>

                      {/* Job Type */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {opp.type}
                        </span>
                      </td>

                      {/* Eligible Branches */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {allowedBranches.map((b) => (
                            <span
                              key={b}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                studentProfile?.branch.toUpperCase() === b
                                  ? 'bg-blue-100 text-[#1D4ED8]'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Min CGPA */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                        {opp.min_cgpa.toFixed(2)}
                      </td>

                      {/* Package / Compensation */}
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        ₹{(opp.compensation / 100000).toFixed(2)} LPA
                      </td>

                      {/* Deadline */}
                      <td className="py-3.5 px-4">
                        <span className={`font-mono ${isExpired ? 'text-rose-600 font-bold' : 'text-gray-700'}`}>
                          {new Date(opp.application_deadline).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Status & Eligibility */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <StatusBadge status={opp.status} />
                          {isStudent && (
                            <div>
                              {isEligible ? (
                                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Eligible
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1" title={eligibilityReason}>
                                  <XCircle className="w-3 h-3" /> Not Eligible
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/opportunities/${opp.opportunity_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-50 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white font-bold transition-all"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                    No placement drives found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
