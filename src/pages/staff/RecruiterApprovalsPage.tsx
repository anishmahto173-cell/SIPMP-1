import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PendingRecruiterRecord, recruiterApprovalApi } from '../../services/apiClient';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  UserCheck,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  Clock,
  Mail,
  Calendar,
} from 'lucide-react';

export const RecruiterApprovalsPage: React.FC = () => {
  const { isPlacementOfficer } = useAuth();

  const [recruiters, setRecruiters] = useState<PendingRecruiterRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Active' | 'Rejected' | 'ALL'>('Pending');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [busyUserId, setBusyUserId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Rejection modal state
  const [rejectTarget, setRejectTarget] = useState<PendingRecruiterRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const fetchRecruiters = useCallback(async () => {
    if (!isPlacementOfficer) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await recruiterApprovalApi.list(statusFilter);
      if (res.ok) {
        setRecruiters(res.data);
      } else {
        setRecruiters([]);
        setFeedback({
          type: 'error',
          text:
            res.status === 403
              ? 'Access denied: Only Placement Officers can view recruiter approvals.'
              : res.status === 401
              ? 'Your session has expired. Please log in again.'
              : res.message || 'Unable to load recruiter registrations from the server.',
        });
      }
    } catch {
      setRecruiters([]);
      setFeedback({
        type: 'error',
        text: 'Failed to connect to the Spring Boot backend. Ensure the server is running on port 8080.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isPlacementOfficer, statusFilter]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  const handleApprove = async (recruiter: PendingRecruiterRecord) => {
    setFeedback(null);
    setBusyUserId(recruiter.userId);
    try {
      const res = await recruiterApprovalApi.approve(recruiter.userId);
      if (res.ok) {
        setFeedback({
          type: 'success',
          text: `${recruiter.fullName} (${recruiter.companyName}) approved and activated.`,
        });
        await fetchRecruiters();
      } else {
        setFeedback({
          type: 'error',
          text: res.message || 'Could not approve recruiter registration.',
        });
      }
    } finally {
      setBusyUserId(null);
    }
  };

  const openRejectModal = (recruiter: PendingRecruiterRecord) => {
    setRejectTarget(recruiter);
    setRejectReason('');
    setRejectError(null);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget) return;

    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError('Please enter a clear rejection reason.');
      return;
    }

    setRejectError(null);
    setBusyUserId(rejectTarget.userId);
    try {
      const res = await recruiterApprovalApi.reject(rejectTarget.userId, trimmed);
      if (res.ok) {
        setFeedback({
          type: 'success',
          text: `${rejectTarget.fullName} (${rejectTarget.companyName}) registration rejected.`,
        });
        setRejectTarget(null);
        setRejectReason('');
        await fetchRecruiters();
      } else {
        setRejectError(res.message || 'Could not reject recruiter registration.');
      }
    } finally {
      setBusyUserId(null);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!isPlacementOfficer) {
    return (
      <div className="bg-white p-8 rounded-lg border border-rose-200 shadow-sm text-center max-w-lg mx-auto mt-8 space-y-3">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#111827]">403 — Access Restricted</h2>
        <p className="text-xs text-gray-600">
          Recruiter Approvals is strictly restricted to Staff users with the <strong>PLACEMENT_OFFICER</strong> designation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#1D4ED8]" />
            Recruiter Registration Approvals
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Verify and approve pending company recruiter accounts before they can post campus opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filter recruiter status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'Pending' | 'Active' | 'Rejected' | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-md text-xs font-medium bg-white text-[#111827]"
          >
            <option value="Pending">Pending Approval</option>
            <option value="Active">Approved (Active)</option>
            <option value="Rejected">Rejected</option>
            <option value="ALL">All Recruiters</option>
          </select>

          <button
            type="button"
            onClick={fetchRecruiters}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-md text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="font-bold underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Recruiters Table */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>
              {statusFilter === 'Pending'
                ? 'Pending COMPANY_RECRUITER Accounts'
                : statusFilter === 'ALL'
                ? 'All COMPANY_RECRUITER Accounts'
                : `${statusFilter} COMPANY_RECRUITER Accounts`}
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            {recruiters.length} record{recruiters.length === 1 ? '' : 's'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-xs text-gray-500">
            Loading recruiter registrations from MySQL...
          </div>
        ) : recruiters.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Building2 className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No recruiter accounts found</p>
            <p className="text-xs text-gray-500">
              {statusFilter === 'Pending'
                ? 'There are currently no pending COMPANY_RECRUITER registrations awaiting verification.'
                : `No recruiter accounts match the "${statusFilter}" filter.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Recruiter Name</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Company Name</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Registration Date</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recruiters.map((recruiter) => {
                  const isPending = recruiter.status?.toLowerCase() === 'pending';
                  const isBusy = busyUserId === recruiter.userId;

                  return (
                    <tr key={recruiter.userId} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-[#111827]">{recruiter.fullName}</p>
                        {recruiter.designation && (
                          <p className="text-[11px] text-gray-500">{recruiter.designation}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-gray-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {recruiter.email}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#111827]">{recruiter.companyName}</p>
                        {recruiter.companyWebsite && (
                          <p className="text-[11px] text-gray-500 font-mono">{recruiter.companyWebsite}</p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(recruiter.createdAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={recruiter.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => openRejectModal(recruiter)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleApprove(recruiter)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isBusy ? 'Processing...' : 'Approve'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-medium">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-[#D1D5DB]">
            <h3 className="font-bold text-base text-[#111827]">Reject Recruiter Registration</h3>
            <p className="text-xs text-gray-600 mt-1">
              Provide a verification reason for rejecting <strong>{rejectTarget.fullName}</strong> ({rejectTarget.companyName}). This reason is logged to the audit history table.
            </p>

            <form onSubmit={handleConfirmReject} className="mt-4 space-y-4">
              {rejectError && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {rejectError}
                </div>
              )}

              <div>
                <label htmlFor="rejection-reason" className="block text-xs font-semibold text-gray-700 mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="rejection-reason"
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Company domain and HR credentials could not be verified."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectTarget(null)}
                  className="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyUserId === rejectTarget.userId}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md disabled:opacity-50"
                >
                  {busyUserId === rejectTarget.userId ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
