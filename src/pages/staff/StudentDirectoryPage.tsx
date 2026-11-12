import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { StudentProfile } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  AlertCircle,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export const StudentDirectoryPage: React.FC = () => {
  const { currentUser, isPlacementOfficer, isFacultyCoordinator, isAdmin } = useAuth();

  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Verify modal state
  const [studentToVerify, setStudentToVerify] = useState<StudentProfile | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'Verified' | 'Correction Requested'>('Verified');
  const [verifyRemarks, setVerifyRemarks] = useState('Documents and marksheets verified against academic master records');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    let list = portalState.getAllStudentProfiles();

    // Faculty Coordinator role restriction: filter to their department
    if (isFacultyCoordinator && currentUser?.department) {
      const dept = currentUser.department.toLowerCase();
      if (dept.includes('cse') || dept.includes('computer')) {
        list = list.filter(s => s.branch === 'CSE' || s.branch === 'IT');
      }
    }

    if (branchFilter !== 'ALL') {
      list = list.filter(s => s.branch === branchFilter);
    }

    if (statusFilter !== 'ALL') {
      list = list.filter(s => s.verification_status === statusFilter);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(s =>
        (s.full_name && s.full_name.toLowerCase().includes(q)) ||
        s.enrollment_no.toLowerCase().includes(q) ||
        (s.skills && s.skills.toLowerCase().includes(q))
      );
    }

    setStudents(list);
  };

  useEffect(() => {
    loadData();
  }, [currentUser, branchFilter, statusFilter, searchTerm]);

  const handleConfirmVerify = () => {
    if (!studentToVerify || !currentUser) return;

    const ok = portalState.verifyStudentProfile(
      studentToVerify.student_id,
      verifyStatus,
      verifyRemarks,
      currentUser.user_id
    );

    if (ok) {
      setFeedback({
        type: 'success',
        text: `Student profile ${verifyStatus.toLowerCase()} successfully.`
      });
      setStudentToVerify(null);
      loadData();
    } else {
      setFeedback({ type: 'error', text: 'Verification update failed.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1D4ED8]" />
            Student Directory &amp; Academic Records (S15)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Official student cohort master list with verified CGPA and backlog tallies.
          </p>
        </div>

        {isFacultyCoordinator && (
          <div className="px-3 py-1.5 rounded-md bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Faculty View: Student contact phones masked for privacy.</span>
          </div>
        )}
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
            placeholder="Search by student name, enrollment, skill..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs bg-white text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Correction Requested">Correction Requested</option>
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Candidate / Enrollment</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Branch &amp; Semester</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">CGPA</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Backlogs</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Verification</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Contact Info</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => {
                  const displayedPhone = isFacultyCoordinator
                    ? student.phone ? `${student.phone.slice(0, 4)}••••••` : '••••••••••'
                    : student.phone;

                  return (
                    <tr key={student.student_id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {student.full_name}
                        <p className="text-[11px] font-mono text-gray-500 font-normal">
                          {student.enrollment_no}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800">{student.branch}</span>
                        <span className="text-[11px] text-gray-500 block">Semester {student.semester}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-base text-[#1D4ED8]">
                        {student.cgpa.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-semibold ${student.backlogs === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {student.backlogs} {student.backlogs === 0 ? '(Clear)' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={student.verification_status} />
                      </td>

                      <td className="py-3.5 px-4 text-[11px]">
                        <p className="text-gray-700 font-medium">{student.email}</p>
                        <p className="font-mono text-gray-500">{displayedPhone}</p>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {(isPlacementOfficer || isAdmin) && (
                          <button
                            type="button"
                            onClick={() => setStudentToVerify(student)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-blue-50 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-colors"
                          >
                            Verify Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                    No student records found matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFY MODAL */}
      {studentToVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <h3 className="font-bold text-base text-[#111827] mb-2">Verify Student Profile (T07)</h3>
            <p className="text-xs text-gray-600 mb-4">
              Update academic standing and enrollment certificate verification status for{' '}
              <strong>{studentToVerify.full_name}</strong> ({studentToVerify.enrollment_no}).
            </p>

            <div className="mb-4 space-y-3">
              <label className="block text-xs font-semibold text-gray-700">Verification Outcome</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyStatus('Verified')}
                  className={`py-2 text-xs font-bold rounded border ${
                    verifyStatus === 'Verified'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  Approve (Verified)
                </button>
                <button
                  type="button"
                  onClick={() => setVerifyStatus('Correction Requested')}
                  className={`py-2 text-xs font-bold rounded border ${
                    verifyStatus === 'Correction Requested'
                      ? 'bg-rose-50 border-rose-500 text-rose-800'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  Correction Requested
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Verification Remarks
                </label>
                <textarea
                  rows={2}
                  value={verifyRemarks}
                  onChange={(e) => setVerifyRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToVerify(null)}
                className="px-3 py-2 text-xs font-semibold border border-gray-300 rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerify}
                className="px-4 py-2 text-xs font-bold bg-[#1D4ED8] hover:bg-blue-800 text-white rounded shadow-xs"
              >
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
