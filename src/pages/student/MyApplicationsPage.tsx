import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Application } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RecruitmentTracker } from '../../components/common/RecruitmentTracker';
import {
  Send,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppForWithdraw, setSelectedAppForWithdraw] = useState<Application | null>(null);
  const [withdrawReason, setWithdrawReason] = useState('Change of career preference');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const studentProfile = currentUser ? portalState.getStudentProfileByUserId(currentUser.user_id) : undefined;

  const loadData = () => {
    if (!studentProfile) return;
    const all = portalState.getApplications();
    const myApps = all.filter(a => a.student_id === studentProfile.student_id);
    setApplications(myApps);
  };

  useEffect(() => {
    loadData();
  }, [currentUser, studentProfile]);

  const handleWithdrawConfirm = () => {
    if (!selectedAppForWithdraw) return;

    const res = portalState.withdrawApplication(
      selectedAppForWithdraw.application_id,
      withdrawReason
    );

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setSelectedAppForWithdraw(null);
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#1D4ED8]" />
            My Job Applications & Status Tracker (S07)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track real-time progress for all active campus placements and internship drives.
          </p>
        </div>
        <Link
          to="/opportunities"
          className="text-xs font-bold px-4 py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-md shadow-sm transition-colors"
        >
          Explore More Drives
        </Link>
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
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Applications List with Recruitment Stepper */}
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => {
            const canWithdraw = app.status === 'Applied' || app.status === 'Shortlisted';

            return (
              <div
                key={app.application_id}
                className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm p-5 space-y-4 hover:border-blue-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-sm font-bold text-[#111827]">{app.opportunity_title || 'Campus Drive'}</h2>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                      <span>{app.company_name}</span> • <span>Applied: {new Date(app.applied_on).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/opportunities/${app.opportunity_id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                      Drive Details <ExternalLink className="w-3 h-3" />
                    </Link>

                    {canWithdraw && (
                      <button
                        type="button"
                        onClick={() => setSelectedAppForWithdraw(app)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded"
                        title="Withdraw application before interview phase (BR-07)"
                      >
                        <Trash2 className="w-3 h-3" /> Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* Recruitment Stepper Component (Stitch Spec) */}
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    Recruitment Stage Pipeline
                  </span>
                  <RecruitmentTracker currentStatus={app.status} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
            <Send className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No Applications Submitted</h3>
            <p className="text-xs text-gray-500 mt-1">
              You haven't applied to any placement or internship opportunities yet.
            </p>
            <Link
              to="/opportunities"
              className="mt-4 inline-block px-4 py-2 bg-[#1D4ED8] text-white text-xs font-bold rounded-md"
            >
              Explore Open Drives
            </Link>
          </div>
        )}
      </div>

      {/* WITHDRAW APPLICATION CONFIRMATION MODAL (BR-07) */}
      {selectedAppForWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center gap-2.5 text-rose-700 mb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base">Withdraw Application</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to withdraw your application for{' '}
              <strong>{selectedAppForWithdraw.opportunity_title}</strong> at{' '}
              <strong>{selectedAppForWithdraw.company_name}</strong>?
              This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reason for Withdrawal
              </label>
              <select
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white"
              >
                <option value="Change of career preference">Change of career preference</option>
                <option value="Accepted another offer">Accepted another offer</option>
                <option value="Personal / Academic constraint">Personal / Academic constraint</option>
                <option value="Location mismatch">Location mismatch</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAppForWithdraw(null)}
                className="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWithdrawConfirm}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-xs"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
