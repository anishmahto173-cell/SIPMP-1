import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Application, Opportunity, Interview, Offer, Company } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Calendar,
  Gift,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterviewOfferSchedulingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Interview form state
  const [interviewAppId, setInterviewAppId] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [interviewDate, setInterviewDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 16)
  );
  const [venueOrLink, setVenueOrLink] = useState('https://meet.google.com/xyz-placement-tech');

  // Offer form state
  const [offerAppId, setOfferAppId] = useState<number>(0);
  const [packageAmount, setPackageAmount] = useState<number>(720000); // 7.2 LPA
  const [jobTitle, setJobTitle] = useState('Graduate Trainee Engineer');
  const [joiningDate, setJoiningDate] = useState('2025-07-01');
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const comps = portalState.getCompanies();
    const c = comps.find(comp => comp.user_id === currentUser.user_id) || comps[0];
    if (c) {
      setCompany(c);
      const opps = portalState.getOpportunities().filter(o => o.company_id === c.company_id);
      setOpportunities(opps);

      const allApps = portalState.getApplications().filter(a => opps.some(o => o.opportunity_id === a.opportunity_id));
      setApplications(allApps);

      if (allApps.length > 0) {
        const firstShortlisted = allApps.find(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled') || allApps[0];
        setInterviewAppId(firstShortlisted.application_id);
        setOfferAppId(allApps[0].application_id);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setFeedback(null);
    const res = portalState.scheduleInterview(
      {
        application_id: interviewAppId,
        round_number: Number(roundNumber),
        interview_datetime: new Date(interviewDate).toISOString(),
        venue_or_link: venueOrLink,
        mode: 'Online'
      },
      currentUser.user_id
    );

    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleRolloutOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (packageAmount <= 0) {
      setFeedback({ type: 'error', text: 'Offered Package must be greater than 0 (BR-06).' });
      return;
    }

    setFeedback(null);
    const res = portalState.releaseOffer(
      {
        application_id: offerAppId,
        package_amount: Number(packageAmount),
        job_title: jobTitle,
        joining_date: joiningDate,
        offer_validity_date: validUntil
      },
      currentUser.user_id
    );

    if (res.success) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setFeedback({ type: 'success', text: res.message });
      loadData();
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm">
        <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1D4ED8]" />
          Interview Scheduling &amp; Offer Rollout (S13)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Coordinate technical rounds with automatic clash detection (BR-08) and generate formal employment contracts.
        </p>
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

      {/* DUAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: INTERVIEW SCHEDULING (1 col) */}
        <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1D4ED8]" />
              Schedule Interview Round (Task T15)
            </h2>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Clash Safe (BR-08)</span>
          </div>

          <form onSubmit={handleScheduleInterview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Select Candidate / Application *
              </label>
              <select
                value={interviewAppId}
                onChange={(e) => setInterviewAppId(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white"
              >
                {applications.map(app => (
                  <option key={app.application_id} value={app.application_id}>
                    {app.student_name} — {app.opportunity_title} ({app.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Round Number *</label>
                <select
                  value={roundNumber}
                  onChange={(e) => setRoundNumber(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white"
                >
                  <option value={1}>Round 1 (Technical)</option>
                  <option value={2}>Round 2 (Coding / System)</option>
                  <option value={3}>Round 3 (Managerial / HR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Meeting Link or Room Venue *</label>
              <input
                type="text"
                required
                value={venueOrLink}
                onChange={(e) => setVenueOrLink(e.target.value)}
                placeholder="Google Meet URL or College Lab 3"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              Confirm Interview Schedule (BR-08)
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ISSUE FORMAL OFFER (1 col) */}
        <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              Issue Placement Offer (Task T16)
            </h2>
            <span className="text-[10px] font-bold text-amber-700">Single Offer (BR-09)</span>
          </div>

          <form onSubmit={handleRolloutOffer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Select Candidate to Offer *
              </label>
              <select
                value={offerAppId}
                onChange={(e) => setOfferAppId(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white"
              >
                {applications.map(app => (
                  <option key={app.application_id} value={app.application_id}>
                    {app.student_name} — {app.opportunity_title} ({app.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Offered CTC (Annual INR) *</label>
                <input
                  type="number"
                  step="10000"
                  min="10000"
                  required
                  value={packageAmount}
                  onChange={(e) => setPackageAmount(parseFloat(e.target.value))}
                  placeholder="720000"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono"
                />
                <span className="text-[10px] text-gray-500">{(packageAmount / 100000).toFixed(2)} LPA</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Designation *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Associate Software Engineer"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Tentative Joining Date</label>
                <input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Offer Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              Issuing an offer releases a contract to the candidate's dashboard.
            </p>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              Release Official Offer Letter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
