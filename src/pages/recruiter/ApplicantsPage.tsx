import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Application, Opportunity, StudentProfile, StudentResume } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';

export const ApplicantsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOppId, setSelectedOppId] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Rejection modal
  const [appToReject, setAppToReject] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState('Did not meet technical requirements for this round');

  // Candidate detail drawer
  const [viewingCandidate, setViewingCandidate] = useState<{
    app: Application;
    profile?: StudentProfile;
    resume?: StudentResume;
  } | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const comps = portalState.getCompanies();
    const c = comps.find(comp => comp.user_id === currentUser.user_id) || comps[0];
    if (c) {
      const opps = portalState.getOpportunities().filter(o => o.company_id === c.company_id);
      setOpportunities(opps);

      let allApps = portalState.getApplications().filter(a => opps.some(o => o.opportunity_id === a.opportunity_id));

      if (selectedOppId !== 'ALL') {
        allApps = allApps.filter(a => a.opportunity_id === Number(selectedOppId));
      }

      if (statusFilter !== 'ALL') {
        allApps = allApps.filter(a => a.status === statusFilter);
      }

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        allApps = allApps.filter(a =>
          (a.student_name && a.student_name.toLowerCase().includes(q)) ||
          (a.opportunity_title && a.opportunity_title.toLowerCase().includes(q))
        );
      }

      setApplications(allApps);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, selectedOppId, statusFilter, searchTerm]);

  const handleShortlist = (appId: number) => {
    if (!currentUser) return;
    try {
      portalState.updateApplicationStatus(appId, 'Shortlisted', 'Profile shortlisted for interview assessment', currentUser.user_id);
      setFeedback({ type: 'success', text: 'Candidate marked as Shortlisted.' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Failed to shortlist.' });
    }
  };

  const handleConfirmReject = () => {
    if (!appToReject || !currentUser) return;
    try {
      portalState.updateApplicationStatus(appToReject.application_id, 'Rejected', rejectReason, currentUser.user_id);
      setFeedback({ type: 'success', text: 'Candidate marked as Rejected.' });
      setAppToReject(null);
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Failed to reject.' });
    }
  };

  const handleOpenDrawer = (app: Application) => {
    const profile = portalState.getAllStudentProfiles().find(p => p.student_id === app.student_id);
    const resume = portalState.getResumeByStudentId(app.student_id);
    setViewingCandidate({
      app,
      profile,
      resume
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1D4ED8]" />
            Candidate Applications Review (S12)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Evaluate candidate credentials, review uploaded PDF resumes, and progress students through recruitment stages.
          </p>
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
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* FILTER STRIP */}
      <div className="bg-white p-4 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Postings ({opportunities.length})</option>
              {opportunities.map(o => (
                <option key={o.opportunity_id} value={o.opportunity_id}>{o.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* CANDIDATES TABLE */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Candidate Name</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Applied Drive</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Branch / Sem</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">CGPA / Backlogs</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Applied Date</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Stage Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length > 0 ? (
                applications.map((app) => {
                  const student = portalState.getAllStudentProfiles().find(p => p.student_id === app.student_id);

                  return (
                    <tr key={app.application_id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(app)}
                          className="hover:text-[#1D4ED8] hover:underline text-left"
                        >
                          {app.student_name}
                        </button>
                        <p className="text-[11px] font-normal text-gray-500 font-mono">
                          {student?.enrollment_no || 'DCSE-Candidate'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-gray-700">
                        {app.opportunity_title}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800">{student?.branch || 'CSE'}</span>
                        <span className="text-[11px] text-gray-500 block">Sem {student?.semester || 5}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#1D4ED8]">
                          {student?.cgpa.toFixed(2) || '8.00'}
                        </span>
                        <span className={`text-[11px] block font-mono ${student?.backlogs === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {student?.backlogs || 0} Backlogs
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {new Date(app.applied_on).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(app)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          View Resume
                        </button>

                        {app.status === 'Applied' && (
                          <button
                            type="button"
                            onClick={() => handleShortlist(app.application_id)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-blue-50 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white"
                          >
                            Shortlist
                          </button>
                        )}

                        {app.status !== 'Rejected' && app.status !== 'Withdrawn' && app.status !== 'Selected' && (
                          <button
                            type="button"
                            onClick={() => setAppToReject(app)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded text-rose-700 hover:bg-rose-50 border border-rose-200"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No candidate applications match the chosen filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CANDIDATE DETAIL DRAWER */}
      {viewingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
          <div className="bg-white h-full w-full max-w-md p-6 overflow-y-auto shadow-2xl border-l border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#111827]">
                  {viewingCandidate.app.student_name}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {viewingCandidate.profile?.enrollment_no} • {viewingCandidate.profile?.branch} Sem {viewingCandidate.profile?.semester}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingCandidate(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-md border border-gray-100 space-y-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Candidate Scorecard</span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-gray-500">CGPA:</span>
                    <p className="font-mono font-bold text-base text-[#1D4ED8]">
                      {viewingCandidate.profile?.cgpa.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Active Backlogs:</span>
                    <p className="font-mono font-bold text-base text-gray-800">
                      {viewingCandidate.profile?.backlogs}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Key Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {viewingCandidate.profile?.skills?.split(',').map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-100 text-[#1D4ED8] font-medium">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume File */}
              <div className="p-4 rounded-md border border-gray-200 bg-blue-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1D4ED8]" />
                    <div>
                      <p className="font-bold text-gray-900">
                        {viewingCandidate.resume?.file_name || 'Resume_Document.pdf'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {viewingCandidate.resume?.file_size_kb || 250} KB • PDF Document
                      </p>
                    </div>
                  </div>
                  <a
                    href={viewingCandidate.resume?.file_path || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-white border border-gray-300 text-gray-700 hover:text-[#1D4ED8]"
                    title="Open PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="pt-4 border-t border-gray-200 flex justify-between gap-2">
                {viewingCandidate.app.status === 'Applied' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleShortlist(viewingCandidate.app.application_id);
                      setViewingCandidate(null);
                    }}
                    className="flex-1 py-2 rounded bg-[#1D4ED8] text-white font-bold text-xs shadow-xs"
                  >
                    Shortlist Candidate
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAppToReject(viewingCandidate.app);
                    setViewingCandidate(null);
                  }}
                  className="py-2 px-3 border border-rose-200 text-rose-700 font-semibold rounded text-xs hover:bg-rose-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL (BR-11 / BR-12) */}
      {appToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="font-bold text-base text-rose-700 mb-2">Reject Candidate Application</h3>
            <p className="text-xs text-gray-600 mb-4">
              Please state the specific evaluation reason for rejecting{' '}
              <strong>{appToReject.student_name}</strong> for <strong>{appToReject.opportunity_title}</strong>.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Evaluation Notes / Reason *
              </label>
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAppToReject(null)}
                className="px-3 py-2 text-xs font-semibold border border-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
