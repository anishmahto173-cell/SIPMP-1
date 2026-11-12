import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { portalState } from '../../services/portalState';
import { StudentProfile, StudentResume } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentResume, setCurrentResume] = useState<StudentResume | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [cgpa, setCgpa] = useState<number>(8.0);
  const [backlogs, setBacklogs] = useState<number>(0);
  const [skills, setSkills] = useState('');
  const [address, setAddress] = useState('');
  const [semester, setSemester] = useState(5);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Resume upload state
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadData = () => {
    if (!currentUser) return;
    const p = portalState.getStudentProfileByUserId(currentUser.user_id);
    if (p) {
      setProfile(p);
      setCgpa(p.cgpa);
      setBacklogs(p.backlogs);
      setSkills(p.skills || '');
      setAddress(p.address || '');
      setSemester(p.semester);
      setCurrentResume(portalState.getResumeByStudentId(p.student_id));
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !currentUser) return;

    const ok = portalState.updateStudentProfile(
      profile.student_id,
      {
        cgpa: Number(cgpa),
        backlogs: Number(backlogs),
        skills,
        address,
        semester: Number(semester)
      },
      currentUser.user_id
    );

    if (ok) {
      setFeedback({ type: 'success', text: 'Student profile updated successfully!' });
      setIsEditing(false);
      loadData();
    } else {
      setFeedback({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // BR-02: PDF only, max 2MB
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are allowed for resume upload (BR-02).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size exceeds the 2MB limit (BR-02). Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB.');
      return;
    }

    if (!profile) return;

    try {
      const res = portalState.uploadResume(
        profile.student_id,
        file.name,
        Math.round(file.size / 1024)
      );

      setFeedback({ type: 'success', text: `Resume "${res.file_name}" uploaded successfully!` });
      loadData();
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed.');
    }
  };

  if (!profile) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500 text-sm">No student profile record found.</p>
      </div>
    );
  }

  // Profile completion calculation
  let completionPoints = 0;
  if (profile.full_name) completionPoints += 20;
  if (profile.enrollment_no) completionPoints += 20;
  if (profile.skills) completionPoints += 20;
  if (profile.address) completionPoints += 20;
  if (currentResume) completionPoints += 20;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-lg border border-[#D1D5DB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#111827]">{profile.full_name}</h1>
            <StatusBadge status={profile.verification_status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enrollment: <span className="font-mono font-bold text-gray-800">{profile.enrollment_no}</span> • Branch: {profile.branch} • Semester {profile.semester}
          </p>
        </div>

        {/* Profile Completion Meter */}
        <div className="w-full md:w-64 bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="flex justify-between items-center text-xs mb-1 font-semibold">
            <span className="text-gray-700">Profile Completion</span>
            <span className="font-mono text-[#1D4ED8]">{completionPoints}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                completionPoints === 100 ? 'bg-emerald-500' : 'bg-[#1D4ED8]'
              }`}
              style={{ width: `${completionPoints}%` }}
            />
          </div>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Personal Info (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#D1D5DB] shadow-sm p-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
            <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#1D4ED8]" /> Academic & Contact Information
            </h2>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Edit Details
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500">Email Address</span>
                <p className="font-semibold text-gray-800 mt-0.5">{profile.email}</p>
              </div>

              <div className="p-3 rounded bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500">Phone Number</span>
                <p className="font-semibold font-mono text-gray-800 mt-0.5">{profile.phone}</p>
              </div>

              <div className="p-3 rounded bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500">Current CGPA (out of 10.0)</span>
                <p className="font-bold font-mono text-base text-[#1D4ED8] mt-0.5">{profile.cgpa.toFixed(2)}</p>
              </div>

              <div className="p-3 rounded bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500">Active Backlogs</span>
                <p className={`font-bold font-mono text-base mt-0.5 ${profile.backlogs === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {profile.backlogs} {profile.backlogs === 0 ? '(Clear)' : 'Active'}
                </p>
              </div>

              <div className="sm:col-span-2 p-3 rounded bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500">Technical Skills</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {profile.skills?.split(',').map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-[#1D4ED8]">
                      {skill.trim()}
                    </span>
                  )) || <span className="text-gray-400">None specified</span>}
                </div>
              </div>

              <div className="sm:col-span-2 p-3 rounded bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-medium text-gray-500">Permanent / Campus Address</span>
                <p className="font-medium text-gray-700 mt-0.5">{profile.address || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Cumulative GPA (CGPA) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Active Backlogs *</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    required
                    value={backlogs}
                    onChange={(e) => setBacklogs(parseInt(e.target.value, 10))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Semester *</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                  >
                    <option value={3}>Semester 3</option>
                    <option value={4}>Semester 4</option>
                    <option value={5}>Semester 5</option>
                    <option value={6}>Semester 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Java, Python, SQL, React"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 border border-gray-300 text-xs font-semibold rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1D4ED8] hover:bg-blue-800 text-xs font-bold text-white rounded-md shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Resume Management (1 col) */}
        <div className="bg-white rounded-lg border border-[#D1D5DB] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1D4ED8]" /> Resume & Documents
              </h2>
              <span className="text-[10px] font-bold text-gray-500 uppercase">BR-02 (PDF ≤ 2MB)</span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg p-5 text-center transition-colors bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700">Upload New Resume Version</p>
              <p className="text-[11px] text-gray-500 mt-1">PDF format only, maximum 2MB</p>

              <label className="mt-3 inline-block cursor-pointer px-3.5 py-1.5 text-xs font-bold text-[#1D4ED8] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md">
                Browse PDF File
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-600 mt-2 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
              </p>
            )}

            {/* Existing Resumes */}
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Current Active Resume</p>
              {currentResume ? (
                <div
                  key={currentResume.resume_id}
                  className="p-3 rounded-md border border-gray-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 truncate max-w-[150px]">{currentResume.file_name}</p>
                      <p className="text-[10px] text-gray-500">
                        {currentResume.file_size_kb} KB • {new Date(currentResume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={currentResume.file_path}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-gray-500 hover:text-[#1D4ED8] rounded hover:bg-gray-100"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <p className="text-xs text-gray-400 py-3 text-center">No resume uploaded yet.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-5">
            <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Resumes are forwarded to recruiters when applying for job drives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
