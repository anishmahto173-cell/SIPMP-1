import React from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  AlertCircle,
  FileCheck,
  Building,
  UserCheck
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = (status || '').toLowerCase();
  const py = size === 'sm' ? 'py-0.5 px-2 text-xs' : 'py-1 px-2.5 text-xs';

  if (['accepted', 'verified', 'passed', 'completed', 'active'].includes(norm)) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] ${py}`}>
        <CheckCircle className="w-3 h-3" />
        {status}
      </span>
    );
  }

  if (['shortlisted', 'under review', 'applied', 'open', 'internship'].includes(norm)) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#DBEAFE] text-[#1D4ED8] border border-[#93C5FD] ${py}`}>
        {norm === 'internship' ? <Building className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {status}
      </span>
    );
  }

  if (['pending', 'action required', 'correction requested'].includes(norm)) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] ${py}`}>
        <AlertCircle className="w-3 h-3" />
        {status}
      </span>
    );
  }

  if (['interview scheduled', 'placement'].includes(norm)) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#C4B5FD] ${py}`}>
        {norm === 'placement' ? <FileCheck className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
        {status}
      </span>
    );
  }

  if (['rejected', 'failed', 'deactivated', 'deleted', 'expired', 'revoked'].includes(norm)) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5] ${py}`}>
        <XCircle className="w-3 h-3" />
        {status}
      </span>
    );
  }

  // Neutral (Withdrawn, Closed, etc.)
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#E5E7EB] text-[#4B5563] border border-[#D1D5DB] ${py}`}>
      {status}
    </span>
  );
};
