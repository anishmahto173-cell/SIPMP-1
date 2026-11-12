import React from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';

interface EligibilityStripProps {
  criteria: {
    label: string;
    passed: boolean;
    detail: string;
  }[];
  overallEligible: boolean;
}

export const EligibilityStrip: React.FC<EligibilityStripProps> = ({ criteria, overallEligible }) => {
  return (
    <div className="bg-white border border-[#D1D5DB] rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
        <h4 className="text-sm font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#1D4ED8]" />
          Automated Eligibility Verification (BR-05)
        </h4>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-bold ${
            overallEligible 
              ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]' 
              : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'
          }`}
        >
          {overallEligible ? 'Eligible for Drive' : 'Ineligible'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {criteria.map((c, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 p-2 rounded-md border text-xs ${
              c.passed
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
            }`}
          >
            <div className={`mt-0.5 rounded-full p-0.5 ${c.passed ? 'bg-[#22C55E] text-white' : 'bg-[#EF4444] text-white'}`}>
              {c.passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <div>
              <p className="font-semibold">{c.label}</p>
              <p className="text-[11px] opacity-80">{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
