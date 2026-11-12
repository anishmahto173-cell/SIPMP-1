import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Opportunity, Company, OpportunityType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Briefcase,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building2,
  Calendar
} from 'lucide-react';

export const MyOpportunitiesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isPostingFormOpen, setIsPostingFormOpen] = useState(false);

  // Form states for new job
  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState<OpportunityType>('Placement');
  const [description, setDescription] = useState('');
  const [compensation, setCompensation] = useState<number>(650000); // 6.5 LPA in INR
  const [location, setLocation] = useState('Bengaluru');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [minCgpa, setMinCgpa] = useState<number>(7.0);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['CSE', 'IT']);
  const [minSemester, setMinSemester] = useState<number>(5);
  const [maxBacklogs, setMaxBacklogs] = useState<number>(0);
  const [vacancies, setVacancies] = useState<number>(10);

  // Soft delete modal state (BR-10)
  const [oppToDelete, setOppToDelete] = useState<Opportunity | null>(null);
  const [deleteReason, setDeleteReason] = useState('Position filled internally');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const comps = portalState.getCompanies();
    const c = comps.find(comp => comp.user_id === currentUser.user_id) || comps[0];
    if (c) {
      setCompany(c);
      const list = portalState.getOpportunities().filter(o => o.company_id === c.company_id);
      setOpportunities(list);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleBranchToggle = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter(b => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const handleCreatePosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !currentUser) return;

    if (compensation <= 0) {
      setFeedback({ type: 'error', text: 'Compensation must be greater than 0 (BR-06).' });
      return;
    }
    if (selectedBranches.length === 0) {
      setFeedback({ type: 'error', text: 'Please select at least one eligible branch.' });
      return;
    }

    try {
      portalState.createOpportunity(
        {
          title,
          type: jobType,
          description,
          compensation: Number(compensation),
          location,
          application_deadline: deadline,
          min_cgpa: Number(minCgpa),
          eligible_branches: selectedBranches.join(','),
          min_semester: Number(minSemester),
          max_backlogs: Number(maxBacklogs),
          vacancies: Number(vacancies)
        },
        currentUser.user_id,
        company.company_id
      );

      setFeedback({ type: 'success', text: 'Opportunity drive published successfully.' });
      setIsPostingFormOpen(false);
      setTitle('');
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Failed to post opportunity.' });
    }
  };

  const handleClosePosting = (oppId: number) => {
    const ok = portalState.closeOpportunity(oppId);
    if (ok) {
      setFeedback({ type: 'success', text: 'Opportunity marked as Closed.' });
      loadData();
    }
  };

  const handleConfirmSoftDelete = () => {
    if (!oppToDelete || !currentUser) return;
    const res = portalState.deleteOpportunity(oppToDelete.opportunity_id, deleteReason, currentUser.user_id);
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setOppToDelete(null);
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
            <Briefcase className="w-5 h-5 text-[#1D4ED8]" />
            Manage Opportunity Postings (S10, S11)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create new campus recruitment drives, configure automated eligibility filters, and track active statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPostingFormOpen(!isPostingFormOpen)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          {isPostingFormOpen ? 'Hide Form' : 'Post New Job Opening (T10)'}
        </button>
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
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* POST NEW JOB OPENING FORM (T10 Spec) */}
      {isPostingFormOpen && (
        <div className="bg-white p-6 sm:p-8 rounded-lg border-2 border-blue-200 shadow-md">
          <div className="border-b border-gray-200 pb-3 mb-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Create New Job Drive (Task T10)
            </h2>
            <span className="text-[11px] text-gray-500">All fields validated per BR-05 &amp; BR-06</span>
          </div>

          <form onSubmit={handleCreatePosting} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700">Job Title / Designation *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Associate Software Engineer / Trainee"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Job Type *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as OpportunityType)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white"
                >
                  <option value="Placement">Placement (Full-time)</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Compensation (Annual INR) *</label>
                <input
                  type="number"
                  step="10000"
                  min="10000"
                  required
                  value={compensation}
                  onChange={(e) => setCompensation(parseFloat(e.target.value))}
                  placeholder="650000"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono"
                />
                <span className="text-[10px] text-gray-500">{(compensation / 100000).toFixed(2)} LPA</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Job Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Pune"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Application Deadline *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Vacancies Count</label>
                <input
                  type="number"
                  min="1"
                  value={vacancies}
                  onChange={(e) => setVacancies(parseInt(e.target.value, 10))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono"
                />
              </div>
            </div>

            {/* Eligibility Filters Box */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Automated Eligibility Criteria (BR-05)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700">Minimum CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                    className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700">Max Active Backlogs Allowed</label>
                  <input
                    type="number"
                    min="0"
                    value={maxBacklogs}
                    onChange={(e) => setMaxBacklogs(parseInt(e.target.value, 10))}
                    className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700">Min Eligible Semester</label>
                  <select
                    value={minSemester}
                    onChange={(e) => setMinSemester(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                  >
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5 (Final Year)</option>
                    <option value={6}>Semester 6 (Final Year)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Eligible Branches (Select Applicable)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['CSE', 'IT', 'ECE', 'ME', 'CE'].map(branch => {
                    const isSelected = selectedBranches.includes(branch);
                    return (
                      <button
                        type="button"
                        key={branch}
                        onClick={() => handleBranchToggle(branch)}
                        className={`px-3 py-1 text-xs font-bold rounded-md border transition-all ${
                          isSelected
                            ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {branch}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Job Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key responsibilities, team overview, perks, training curriculum..."
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPostingFormOpen(false)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-sm"
              >
                Publish Job Drive
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OPPORTUNITIES TABLE */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Opportunity Title</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Package</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Min CGPA</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Branches</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Deadline</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities.length > 0 ? (
                opportunities.map((opp) => (
                  <tr key={opp.opportunity_id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {opp.title}
                      <p className="text-[11px] text-gray-500 font-normal">{opp.location}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-700">{opp.type}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      ₹{(opp.compensation / 100000).toFixed(2)} LPA
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{opp.min_cgpa.toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-gray-600">{opp.eligible_branches}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{new Date(opp.application_deadline).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={opp.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {opp.status === 'Open' && (
                        <button
                          type="button"
                          onClick={() => handleClosePosting(opp.opportunity_id)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                          title="Close drive to stop receiving applications"
                        >
                          Close
                        </button>
                      )}

                      {opp.status !== 'Deleted' && (
                        <button
                          type="button"
                          onClick={() => setOppToDelete(opp)}
                          className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded"
                          title="Soft delete posting with audit log (BR-10)"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 text-xs">
                    No postings created yet. Click "Post New Job Opening" above to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOFT DELETE CONFIRMATION MODAL (BR-10) */}
      {oppToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200">
            <div className="flex items-center gap-2.5 text-rose-700 mb-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base">Soft Delete Opportunity (BR-10)</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to remove <strong>{oppToDelete.title}</strong>?
              Per database policy BR-10, the record will be flagged as Deleted.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Reason for Removal <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. Requirement cancelled, budget revisions, filled internally"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOppToDelete(null)}
                className="px-3 py-2 text-xs font-semibold border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSoftDelete}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md shadow-xs"
              >
                Confirm Soft Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
