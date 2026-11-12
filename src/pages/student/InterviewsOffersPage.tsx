import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Interview, Offer } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Calendar,
  Gift,
  Clock,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InterviewsOffersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const studentProfile = currentUser ? portalState.getStudentProfileByUserId(currentUser.user_id) : undefined;

  const loadData = () => {
    if (!studentProfile) return;
    const allApps = portalState.getApplications();
    const myApps = allApps.filter(a => a.student_id === studentProfile.student_id);

    const allInterviews = portalState.getInterviews();
    const myInterviews = allInterviews.filter(i => myApps.some(a => a.application_id === i.application_id));
    setInterviews(myInterviews);

    const allOffers = portalState.getOffers();
    const myOffers = allOffers.filter(o => myApps.some(a => a.application_id === o.application_id));
    setOffers(myOffers);
  };

  useEffect(() => {
    loadData();
  }, [currentUser, studentProfile]);

  const handleRespondOffer = (offerId: number, status: 'Accepted' | 'Rejected') => {
    const ok = portalState.respondToOffer(offerId, status);
    if (ok) {
      if (status === 'Accepted') {
        confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
        setFeedback({ type: 'success', text: 'Offer accepted! Congratulations!' });
      } else {
        setFeedback({ type: 'success', text: 'Offer declined.' });
      }
      loadData();
    } else {
      setFeedback({ type: 'error', text: 'Failed to update offer.' });
    }
  };

  const acceptedOffer = offers.find(o => o.status === 'Accepted');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            Interviews & Offer Letters (S08)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Access meeting links for evaluation rounds and review issued employment contracts.
          </p>
        </div>

        {acceptedOffer && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Placed at {acceptedOffer.company_name} (₹{(acceptedOffer.package_amount / 100000).toFixed(2)} LPA)
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
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* TWO COLUMN WORKSPACE (S08 Spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: INTERVIEWS (1 col) */}
        <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1D4ED8]" />
              Scheduled Interview Rounds
            </h2>
            <span className="text-xs font-mono font-bold text-gray-500">
              {interviews.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {interviews.length > 0 ? (
              interviews.map((item) => (
                <div
                  key={item.interview_id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50/60 hover:bg-white hover:border-blue-300 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-[#111827]">{item.company_name}</h3>
                      <p className="text-xs text-gray-600 font-medium">{item.opportunity_title}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1D4ED8] text-white">
                        Round {item.round_number}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 pt-1 border-t border-gray-200/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{new Date(item.interview_datetime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>Mode: {item.mode}</span>
                    </div>
                  </div>

                  {item.venue_or_link && (
                    <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-gray-500 font-medium">Meeting Link / Room:</span>
                      {item.venue_or_link.startsWith('http') ? (
                        <a
                          href={item.venue_or_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#1D4ED8] hover:underline"
                        >
                          Join Video Call <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="font-semibold text-gray-800">{item.venue_or_link}</span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No interview sessions scheduled for your applications yet.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: OFFERS (1 col) */}
        <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              Employment Offers Issued
            </h2>
            <span className="text-[11px] font-semibold text-amber-700">
              BR-09: Single Offer Policy
            </span>
          </div>

          <div className="space-y-4">
            {offers.length > 0 ? (
              offers.map((offer) => {
                const isPending = offer.status === 'Pending';
                const isAccepted = offer.status === 'Accepted';

                return (
                  <div
                    key={offer.offer_id}
                    className={`p-4 rounded-lg border transition-all space-y-3 ${
                      isAccepted
                        ? 'border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-400'
                        : isPending
                        ? 'border-amber-300 bg-amber-50/30'
                        : 'border-gray-200 bg-gray-50/50 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">{offer.company_name}</h3>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">{offer.job_title}</p>
                      </div>
                      <StatusBadge status={offer.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-gray-200/60">
                      <div>
                        <span className="text-[11px] text-gray-500">Package Offered:</span>
                        <p className="font-mono font-bold text-emerald-700 text-sm">
                          ₹{(offer.package_amount / 100000).toFixed(2)} LPA
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-500">Joining Date:</span>
                        <p className="font-mono text-gray-700">{offer.joining_date ? new Date(offer.joining_date).toLocaleDateString() : 'Upon Graduation'}</p>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-500">Response Deadline:</span>
                        <p className="font-mono text-rose-700 font-semibold">{new Date(offer.offer_validity_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-[11px] text-gray-500">Remarks:</span>
                        <p className="font-medium text-gray-600 truncate">{offer.remarks || 'Standard Contract'}</p>
                      </div>
                    </div>

                    {/* Action buttons if Pending */}
                    {isPending && !acceptedOffer && (
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleRespondOffer(offer.offer_id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespondOffer(offer.offer_id, 'Accepted')}
                          className="px-4 py-1.5 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          Accept Offer (BR-09)
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-between pt-1">
                        <span>Official offer accepted. Induction details sent via email.</span>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading signed offer letter for ${offer.company_name}`)}
                          className="inline-flex items-center gap-1 text-[#1D4ED8] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" /> Letter
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                No formal job offers issued at this moment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
