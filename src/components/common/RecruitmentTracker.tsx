import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { ApplicationStatus } from '../../types';

interface RecruitmentTrackerProps {
  currentStatus: ApplicationStatus;
}

const STAGES: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Interview Scheduled',
  'Selected'
];

export const RecruitmentTracker: React.FC<RecruitmentTrackerProps> = ({ currentStatus }) => {
  const isRejected = currentStatus === 'Rejected';
  const isWithdrawn = currentStatus === 'Withdrawn';

  const getStageIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied': return 0;
      case 'Shortlisted': return 1;
      case 'Interview Scheduled': return 2;
      case 'Selected': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  if (isRejected || isWithdrawn) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-center justify-between">
        <span>Application Terminal State: <strong>{currentStatus}</strong></span>
        <span className="text-xs text-red-600">Archived in Application Status History</span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0" />
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-[#1D4ED8] transition-all duration-300 -z-0"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 90}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={stage} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 shadow-sm ${
                  isPassed 
                    ? 'bg-[#15803D] text-white border-2 border-white' 
                    : isCurrent 
                      ? 'bg-[#1D4ED8] text-white ring-4 ring-blue-100' 
                      : 'bg-white text-gray-400 border-2 border-gray-300'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-[#1D4ED8] font-bold' : isPassed ? 'text-gray-800' : 'text-gray-400'}`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
