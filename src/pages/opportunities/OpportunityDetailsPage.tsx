import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Opportunity, StudentProfile } from '../../types';
import { EligibilityStrip } from '../../components/common/EligibilityStrip';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isStudent } = useAuth();

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const item = portalState.getOpportunityById(Number(id));
    if (item) {
      setOpp(item);
    }

    if (currentUser && isStudent) {
      const p = portalState.getStudentProfileByUserId(currentUser.user_id);
      if (p) {
        setProfile(p);
        const apps = portalState.getApplications().filter(a => a.student_id === p.student_id);
        const applied = apps.some(a => a.opportunity_id === Number(id));
        setHasApplied(applied);
      }
    }
  }, [id, currentUser, isStudent]);

  if (!opp) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500 text-sm">Opportunity not found or has been removed.</p>
        <Link to="/opportunities" className="text-xs text-[#1D4ED8] font-bold mt-3 inline-block">
          &larr; Back to Opportunities
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    if (!currentUser || !profile) {
      setFeedback({ type: 'error', text: 'You must be logged in as a student to apply.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = portalState.applyForOpportunity(profile.student_id, opp.opportunity_id, currentUser.user_id);

    if (res.success) {
      confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 } });
      setFeedback({ type: 'success', text: res.message });
      setHasApplied(true);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1D4ED8]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Drives
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#D1D5DB] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#111827]">{opp.title}</h1>
              <StatusBadge status={opp.status} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-gray-900">
                <Building2 className="w-4 h-4 text-[#1D4ED8]" />
                {opp.company_name}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {opp.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {opp.type}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                <IndianRupee className="w-4 h-4" />
                ₹{(opp.compensation / 100000).toFixed(2)} LPA CTC
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                Deadline: {new Date(opp.application_deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Quick Apply CTA */}
          {isStudent && (
            <div className="shrink-0">
              {hasApplied ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Application Submitted
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isSubmitting || opp.status !== 'Open'}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-blue-800 disabled:bg-gray-300 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : '1-Click Apply (Attach Resume)'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Feedback alerts */}
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
            {feedback.type === 'success' && (
              <Link to="/student/applications" className="font-bold underline text-[11px]">
                View My Applications &rarr;
              </Link>
            )}
          </div>
        )}

        {/* INTERACTIVE ELIGIBILITY STRIP (S06 Spec) */}
        {isStudent && profile && (() => {
          const evalResult = portalState.evaluateEligibility(profile, opp);
          return (
            <EligibilityStrip
              criteria={evalResult.criteria}
              overallEligible={evalResult.eligible}
            />
          );
        })()}

        {/* Job Description & Specification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Main Description (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Role Description &amp; Responsibilities
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-md border border-gray-100">
                {opp.description}
              </p>
            </div>
          </div>

          {/* Criteria Summary Card (1 col) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 text-xs">
            <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] border-b border-gray-200 pb-2">
              Criteria Summary
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Minimum CGPA:</span>
              <span className="font-mono font-bold text-gray-900">{opp.min_cgpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Eligible Branches:</span>
              <span className="font-semibold text-gray-900">{opp.eligible_branches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Min Semester:</span>
              <span className="font-semibold text-gray-900">Sem {opp.min_semester}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Max Active Backlogs:</span>
              <span className="font-mono font-semibold text-gray-900">{opp.max_backlogs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Application Deadline:</span>
              <span className="font-mono font-semibold text-gray-900">{new Date(opp.application_deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
