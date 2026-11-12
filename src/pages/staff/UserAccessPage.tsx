import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { User, UserAccessHistory, Role } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  UserCog,
  History,
  Shield
} from 'lucide-react';

export const UserAccessPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [accessHistory, setAccessHistory] = useState<UserAccessHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Role change modal
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>('PLACEMENT_OFFICER');
  const [changeReason, setChangeReason] = useState('Administrative re-assignment');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    let allUsers = portalState.getUsers();

    if (roleFilter !== 'ALL') {
      allUsers = allUsers.filter(u => u.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      allUsers = allUsers.filter(u => u.status === statusFilter);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      allUsers = allUsers.filter(u =>
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.enrollment_no && u.enrollment_no.toLowerCase().includes(q))
      );
    }

    setUsers(allUsers);
    setAccessHistory(portalState.getAccessHistory());
  };

  useEffect(() => {
    loadData();
  }, [roleFilter, statusFilter, searchTerm]);

  const handleAction = (userId: number, action: 'APPROVE' | 'REJECT' | 'ACTIVATE' | 'DEACTIVATE', reason: string) => {
    if (!currentUser) return;
    const ok = portalState.updateUserAccess(userId, action, undefined, reason, currentUser.user_id);
    if (ok) {
      setFeedback({ type: 'success', text: `User account status updated (${action}).` });
      loadData();
    } else {
      setFeedback({ type: 'error', text: 'Action failed.' });
    }
  };

  const handleConfirmRoleChange = () => {
    if (!selectedUserForRole || !currentUser) return;
    const ok = portalState.updateUserAccess(
      selectedUserForRole.user_id,
      'ROLE_CHANGE',
      newRole,
      changeReason,
      currentUser.user_id
    );

    if (ok) {
      setFeedback({ type: 'success', text: `Role updated to ${newRole}.` });
      setSelectedUserForRole(null);
      loadData();
    } else {
      setFeedback({ type: 'error', text: 'Failed to update role.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            User Access & Role-Based Authorization (Task T04, S17)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            System administration console: manage credentials, unlock accounts, assign staff permissions, and review audit trail.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          Administrator Console
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* FILTER STRIP */}
      <div className="bg-white p-4 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, enrollment..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="COMPANY_RECRUITER">Company Recruiter</option>
              <option value="PLACEMENT_OFFICER">Placement Officer</option>
              <option value="FACULTY_COORDINATOR">Faculty Coordinator</option>
              <option value="ADMINISTRATOR">Administrator</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Deactivated">Deactivated</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">User Account</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Assigned Role</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Organization / Dept</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Failed Logins</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    {user.full_name}
                    <p className="text-[11px] font-normal text-gray-500">{user.email}</p>
                    <p className="text-[10px] font-mono text-gray-400">{user.phone}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-[#1D4ED8]">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={user.status} />
                  </td>

                  <td className="py-3.5 px-4 font-medium text-gray-700">
                    {user.company_name || user.department || user.branch || '—'}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className={user.failed_attempts > 0 ? 'text-rose-600 font-bold' : 'text-gray-500'}>
                      {user.failed_attempts} attempts
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {user.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAction(user.user_id, 'APPROVE', 'Admin approved account')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(user.user_id, 'REJECT', 'Admin rejected account')}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded text-rose-700 hover:bg-rose-50 border border-rose-200"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {user.status === 'Active' && user.user_id !== currentUser?.user_id && (
                      <button
                        type="button"
                        onClick={() => handleAction(user.user_id, 'DEACTIVATE', 'Administrative deactivation')}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        title="Deactivate Account"
                      >
                        Deactivate
                      </button>
                    )}

                    {user.status === 'Deactivated' && (
                      <button
                        type="button"
                        onClick={() => handleAction(user.user_id, 'ACTIVATE', 'Administrative reactivation')}
                        className="px-2.5 py-1 text-[11px] font-bold rounded bg-blue-50 text-[#1D4ED8] hover:bg-blue-100"
                      >
                        Reactivate
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUserForRole(user);
                        setNewRole(user.role);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT TRAIL LOG TABLE (Table: user_access_history) */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            Security & Role Change Audit Trail (Table: user_access_history)
          </h2>
          <span className="text-[11px] text-gray-500 font-mono">{accessHistory.length} Logged Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
                <th className="py-2.5 px-4 font-bold">Action</th>
                <th className="py-2.5 px-4 font-bold">Old &rarr; New Role</th>
                <th className="py-2.5 px-4 font-bold">Status Change</th>
                <th className="py-2.5 px-4 font-bold">Audit Reason</th>
                <th className="py-2.5 px-4 font-bold">Executed By</th>
                <th className="py-2.5 px-4 font-bold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accessHistory.map((h) => (
                <tr key={h.history_id} className="hover:bg-gray-50">
                  <td className="py-2.5 px-4 font-bold font-mono text-gray-900">{h.action_type}</td>
                  <td className="py-2.5 px-4">
                    <span className="font-mono text-gray-500">{h.old_role}</span> &rarr;{' '}
                    <strong className="font-mono text-[#1D4ED8]">{h.new_role}</strong>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-gray-500">{h.old_status}</span> &rarr;{' '}
                    <strong className="text-gray-900">{h.new_status}</strong>
                  </td>
                  <td className="py-2.5 px-4 text-gray-600">{h.reason}</td>
                  <td className="py-2.5 px-4 font-medium text-gray-700">{h.action_by_name}</td>
                  <td className="py-2.5 px-4 font-mono text-gray-400">
                    {new Date(h.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROLE CHANGE MODAL */}
      {selectedUserForRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="font-bold text-base text-[#111827] mb-2">Modify User Role Assignment</h3>
            <p className="text-xs text-gray-600 mb-4">
              Reassign access permissions for <strong>{selectedUserForRole.full_name}</strong> ({selectedUserForRole.email}).
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">New Role Target</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="COMPANY_RECRUITER">COMPANY_RECRUITER</option>
                  <option value="PLACEMENT_OFFICER">PLACEMENT_OFFICER</option>
                  <option value="FACULTY_COORDINATOR">FACULTY_COORDINATOR</option>
                  <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Audit Justification *</label>
                <textarea
                  rows={2}
                  required
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedUserForRole(null)}
                className="px-3 py-2 text-xs font-semibold border border-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleChange}
                className="px-4 py-2 text-xs font-bold bg-[#1D4ED8] hover:bg-blue-800 text-white rounded"
              >
                Confirm Role Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
