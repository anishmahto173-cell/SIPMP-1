import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Application, Interview, Offer, Opportunity } from '../../types';
import {
  Briefcase,
  Calendar,
  Send,
  Gift,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const studentProfile = currentUser ? portalState.getStudentProfileByUserId(currentUser.user_id) : undefined;

  const loadData = () => {
    if (!studentProfile) return;
    const allApps = portalState.getApplications();
    const myApps = allApps.filter(a => a.student_id === studentProfile.student_id);
    setApplications(myApps);

    const allInterviews = portalState.getInterviews();
    const myInterviews = allInterviews.filter(i => myApps.some(a => a.application_id === i.application_id));
    setInterviews(myInterviews);

    const allOffers = portalState.getOffers();
    const myOffers = allOffers.filter(o => myApps.some(a => a.application_id === o.application_id));
    setOffers(myOffers);

    const openOpps = portalState.getOpportunities().filter(o => o.status === 'Open');
    setOpportunities(openOpps.slice(0, 4));
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Derived KPIs
  const totalApplied = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview Scheduled' || a.status === 'Selected').length;
  const interviewCount = interviews.filter(i => i.status === 'Scheduled').length;
  const offersCount = offers.length;
  const pendingOffers = offers.filter(o => o.status === 'Pending');
  const acceptedOffer = offers.find(o => o.status === 'Accepted');

  const handleAcceptOffer = (offerId: number) => {
    const ok = portalState.respondToOffer(offerId, 'Accepted');
    if (ok) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setMessage({ text: 'Offer accepted! Remaining applications updated per Single Offer Policy (BR-09).', type: 'success' });
      loadData();
    } else {
      setMessage({ text: 'Could not accept offer.', type: 'error' });
    }
  };

  const handleRejectOffer = (offerId: number) => {
    const ok = portalState.respondToOffer(offerId, 'Rejected');
    if (ok) {
      setMessage({ text: 'Offer declined.', type: 'success' });
      loadData();
    } else {
      setMessage({ text: 'Could not decline offer.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#111827]">
              Welcome back, {currentUser?.full_name}!
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1D4ED8] font-bold">
              {studentProfile?.branch || 'CSE'} Sem {studentProfile?.semester || 5}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enrollment: <strong className="font-mono text-gray-700">{studentProfile?.enrollment_no}</strong> • Current CGPA: <strong className="font-mono text-gray-700">{studentProfile?.cgpa.toFixed(2)}</strong> • Backlogs: <strong className="font-mono text-gray-700">{studentProfile?.backlogs}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/student/profile"
            className="text-xs font-semibold px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Update Resume & Profile
          </Link>
          <Link
            to="/opportunities"
            className="text-xs font-bold px-4 py-2 rounded-md bg-[#1D4ED8] hover:bg-blue-800 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            Browse Open Drives <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Global alert / flash message */}
      {message && (
        <div
          className={`p-3.5 rounded-md text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Accepted Offer Congratulations Banner (BR-09 active) */}
      {acceptedOffer && (
        <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-start gap-3 shadow-sm">
          <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Congratulations! Placement Offer Confirmed</h3>
            <p className="text-xs mt-1">
              You have accepted an offer from <strong>{acceptedOffer.company_name}</strong> for the position of{' '}
              <strong>{acceptedOffer.job_title}</strong> with a package of <strong>₹{(acceptedOffer.package_amount / 100000).toFixed(2)} LPA</strong>.
            </p>
            <p className="text-[11px] text-emerald-800 mt-1">
              Per college Single Offer Policy (BR-09), you are marked as successfully placed.
            </p>
          </div>
        </div>
      )}

      {/* PENDING OFFERS ALERT STRIP (S03 Spec) */}
      {pendingOffers.length > 0 && !acceptedOffer && (
        <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-800">
              <Gift className="w-4 h-4 text-amber-600" /> Action Required: You have {pendingOffers.length} Pending Job Offer{pendingOffers.length > 1 ? 's' : ''}!
            </span>
            <span className="text-[11px] text-amber-700">Policy: Accepting 1 offer automatically withdraws other applications</span>
          </div>
          <div className="space-y-2 mt-3">
            {pendingOffers.map(offer => (
              <div
                key={offer.offer_id}
                className="bg-white p-3 rounded-md border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">{offer.company_name} — {offer.job_title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Package: <strong className="text-emerald-700 font-bold">₹{(offer.package_amount / 100000).toFixed(2)} LPA</strong> • Valid Until: {new Date(offer.offer_validity_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectOffer(offer.offer_id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptOffer(offer.offer_id)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                  >
                    Accept Offer (BR-09)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 KPI CARDS (S03 Spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Applied</p>
            <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{totalApplied}</p>
            <Link to="/student/applications" className="text-[11px] font-semibold text-[#1D4ED8] hover:underline mt-2 inline-block">
              View Applications &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1D4ED8]">
            <Send className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Shortlisted</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{shortlistedCount}</p>
            <span className="text-[11px] text-gray-500 mt-2 inline-block">Moving to rounds</span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Interviews</p>
            <p className="text-2xl font-bold font-mono text-purple-600 mt-1">{interviewCount}</p>
            <Link to="/student/interviews-offers" className="text-[11px] font-semibold text-purple-600 hover:underline mt-2 inline-block">
              Schedule & Links &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Offers Received</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{offersCount}</p>
            <Link to="/student/interviews-offers" className="text-[11px] font-semibold text-emerald-600 hover:underline mt-2 inline-block">
              Offer Letters &rarr;
            </Link>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Gift className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: UPCOMING INTERVIEWS & RECENT APPLICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Interview (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1D4ED8]" /> Upcoming Interview
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#1D4ED8]">
                {interviews.length} Scheduled
              </span>
            </div>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.slice(0, 2).map((item) => (
                  <div key={item.interview_id} className="p-3.5 rounded-md border border-blue-100 bg-blue-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">{item.company_name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                        Round {item.round_number}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">{item.opportunity_title}</p>
                    <div className="mt-3 text-[11px] text-gray-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(item.interview_datetime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{item.venue_or_link}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs">
                No interviews scheduled right now. Keep an eye on your applications!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              to="/student/interviews-offers"
              className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center justify-center gap-1"
            >
              View Interview Calendar & History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Recommended Drives Matching Profile (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-[#D1D5DB] shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1D4ED8]" /> Recommended Openings For You
              </h2>
              <p className="text-[11px] text-gray-500">Based on your {studentProfile?.branch} background & CGPA</p>
            </div>
            <Link to="/opportunities" className="text-xs font-semibold text-[#1D4ED8] hover:underline">
              View All ({opportunities.length}) &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => {
              const hasApplied = applications.some(a => a.opportunity_id === opp.opportunity_id);
              const allowedBranches = opp.eligible_branches.split(',').map(b => b.trim());
              const isEligible = (studentProfile?.cgpa || 0) >= opp.min_cgpa &&
                allowedBranches.includes(studentProfile?.branch || 'CSE') &&
                (studentProfile?.backlogs || 0) <= opp.max_backlogs;

              return (
                <div
                  key={opp.opportunity_id}
                  className="p-3.5 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[#111827]">{opp.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-700">
                        {opp.type}
                      </span>
                      {isEligible ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Eligible
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                          Ineligible
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">
                      {opp.company_name} • {opp.location}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Min CGPA: <strong className="font-mono">{opp.min_cgpa}</strong> • Package: <strong className="font-mono text-emerald-700">₹{(opp.compensation / 100000).toFixed(2)} LPA</strong> • Deadline: {new Date(opp.application_deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {hasApplied ? (
                      <span className="px-3 py-1 text-xs font-bold rounded bg-blue-100 text-[#1D4ED8]">
                        Already Applied
                      </span>
                    ) : (
                      <Link
                        to={`/opportunities/${opp.opportunity_id}`}
                        className="px-3 py-1.5 text-xs font-bold rounded bg-[#1D4ED8] hover:bg-blue-800 text-white transition-colors"
                      >
                        Apply Now
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
