import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { Company } from '../../types';
import { Building2, CheckCircle2, AlertCircle, Globe, MapPin, Mail, Phone, FileText } from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [hrName, setHrName] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [hrPhone, setHrPhone] = useState('');
  const [description, setDescription] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    if (!currentUser) return;
    const comps = portalState.getCompanies();
    const c = comps.find(comp => comp.user_id === currentUser.user_id) || comps[0];
    if (c) {
      setCompany(c);
      setCompanyName(c.company_name);
      setIndustry(c.industry || 'Information Technology');
      setWebsite(c.website || '');
      setLocation(c.location || '');
      setHrName(c.hr_name);
      setHrEmail(c.hr_email);
      setHrPhone(c.hr_phone);
      setDescription(c.description || '');
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setIsSubmitting(true);
    setFeedback(null);

    if (!currentUser) return;
    try {
      portalState.saveCompanyProfile(
        {
          company_name: companyName,
          industry,
          website,
          location,
          hr_name: hrName,
          hr_email: hrEmail,
          hr_phone: hrPhone,
          description
        },
        currentUser.user_id
      );
      setFeedback({ type: 'success', text: 'Company profile updated successfully.' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', text: err?.message || 'Failed to update company.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm">
        <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#1D4ED8]" />
          Company & Recruiter Profile (Task T09)
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Maintain verified corporate information visible to diploma students and the Training & Placement Cell.
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

      {/* Profile Form */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-[#D1D5DB] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Corporate Details (BR-01 Unique Organization Check)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Company Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. TechNova Solutions Pvt Ltd"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">
                Must be unique across all registered placement partners (BR-01).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Industry Domain <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Information Technology / Cloud Services"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Corporate Website URL
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Primary Development / Office Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Pune, Hyderabad"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div className="border-b border-gray-100 pb-4 pt-2">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
              Authorized Campus HR Coordinator
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700">
                HR Contact Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={hrName}
                onChange={(e) => setHrName(e.target.value)}
                placeholder="e.g. Karan Joshi"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Official HR Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={hrEmail}
                onChange={(e) => setHrEmail(e.target.value)}
                placeholder="hr@company.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">
                Official HR Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={hrPhone}
                onChange={(e) => setHrPhone(e.target.value)}
                placeholder="9876543210"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Company Background & Overview
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description about projects, technologies, and graduate career tracks..."
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#1D4ED8] hover:bg-blue-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors"
            >
              {isSubmitting ? 'Saving Profile...' : 'Save Company Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
