import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { ReportHistory } from '../../types';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<ReportHistory[]>([]);
  const [reportType, setReportType] = useState('Placement Summary Report');
  const [format, setFormat] = useState<'PDF' | 'Excel'>('PDF');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = () => {
    setReports(portalState.getReports());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    portalState.generateReport(
      {
        report_type: reportType,
        start_date: startDate,
        end_date: endDate,
        export_format: format,
        scope: 'All Branches'
      },
      currentUser.user_id
    );

    setFeedback(`Generated "${reportType}" (${format}) successfully!`);
    loadData();

    // Trigger instant mock download
    const blob = new Blob([`SIPMP Institutional Report: ${reportType}\nGenerated on: ${new Date().toLocaleString()}\nAuthor: ${currentUser.full_name}\nFormat: ${format}`], {
      type: format === 'PDF' ? 'application/pdf' : 'application/vnd.ms-excel'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.replace(/\s+/g, '_')}_${Date.now()}.${format === 'PDF' ? 'pdf' : 'xlsx'}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm">
        <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#1D4ED8]" />
          Placement Cell Analytics &amp; Reporting (Task T18, S16)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Export verified accreditation data, AICTE/DTE compliance summaries, and company drive logs.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* GENERATE REPORT FORM */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm">
        <form onSubmit={handleGenerateReport} className="space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Generate New Institutional Report
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700">Report Category *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs bg-white text-gray-800"
              >
                <option value="Placement Summary Report">Master Placement Summary (All branches &amp; statistics)</option>
                <option value="Branch-wise Offers Report">Branch-wise Offers &amp; CTC Breakdown (CSE, IT, ECE, ME, CE)</option>
                <option value="Company Hiring Analysis">Company Hiring Trends &amp; Salary Packages</option>
                <option value="Unplaced Student Cohort Report">Unplaced Final Year Cohort (Eligible for upcoming drives)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Export Format *</label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setFormat('PDF')}
                  className={`flex-1 py-2 text-xs font-bold rounded border flex items-center justify-center gap-1.5 ${
                    format === 'PDF'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                      : 'border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('Excel')}
                  className={`flex-1 py-2 text-xs font-bold rounded border flex items-center justify-center gap-1.5 ${
                    format === 'Excel'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel (.xlsx)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" /> Generate &amp; Download Report
            </button>
          </div>
        </form>
      </div>

      {/* HISTORICAL REPORT LOG TABLE */}
      <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Institutional Audit History (Table: report_history)
          </h2>
          <span className="text-[11px] text-gray-500 font-mono">{reports.length} Reports Archived</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#172554] text-white border-b border-[#1E3A8A]">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Report Type</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Date Scope</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Format</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Generated Timestamp</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((r) => (
                <tr key={r.report_id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1D4ED8] shrink-0" />
                    <span>{r.report_type}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-600">
                    {r.start_date} to {r.end_date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                      {r.export_format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-500">
                    {new Date(r.generated_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading archived institutional report: ${r.report_type}`)}
                      className="p-1.5 text-gray-600 hover:text-[#1D4ED8] hover:bg-gray-100 rounded"
                      title="Download copy"
                    >
                      <Download className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
