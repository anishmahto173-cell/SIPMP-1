import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { portalState } from '../../services/portalState';
import { Role } from '../../types';
import { GraduationCap, Briefcase, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('STUDENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password@123');
  const [address, setAddress] = useState('');

  // Student specific fields
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState(5);

  // Recruiter specific fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  // Staff specific fields
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [staffRoleType, setStaffRoleType] = useState<Role>('FACULTY_COORDINATOR');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const finalRole = role === 'FACULTY_COORDINATOR' || role === 'PLACEMENT_OFFICER' ? staffRoleType : role;

      const res = portalState.registerUser({
        full_name: fullName,
        email,
        phone,
        password_hash: password,
        role: finalRole,
        address,
        enrollment_no: role === 'STUDENT' ? enrollmentNo : undefined,
        branch: role === 'STUDENT' ? branch : undefined,
        semester: role === 'STUDENT' ? Number(semester) : undefined,
        company_name: role === 'COMPANY_RECRUITER' ? companyName : undefined,
        company_website: role === 'COMPANY_RECRUITER' ? companyWebsite : undefined,
        employee_id: (finalRole !== 'STUDENT' && finalRole !== 'COMPANY_RECRUITER') ? employeeId : undefined,
        designation: (finalRole !== 'STUDENT' && finalRole !== 'COMPANY_RECRUITER') ? designation : undefined,
        department: (finalRole !== 'STUDENT' && finalRole !== 'COMPANY_RECRUITER') ? department : undefined,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Top Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1D4ED8] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-[#D1D5DB] p-6 sm:p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-bold text-[#111827]">Create SIPMP Account (Task T01)</h1>
            <p className="text-xs text-gray-500 mt-1">
              Register a new account. Students are activated immediately; recruiters and staff require administrative approval per BR-03.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Registration Failed:</strong>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Success:</strong>
                <p className="mt-0.5">{successMessage} Redirecting to login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Segmentation Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Account Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all ${
                    role === 'STUDENT'
                      ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-bold shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mb-1 text-[#1D4ED8]" />
                  <span className="text-xs">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('COMPANY_RECRUITER')}
                  className={`flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all ${
                    role === 'COMPANY_RECRUITER'
                      ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-bold shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs">Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('FACULTY_COORDINATOR')}
                  className={`flex flex-col items-center justify-center p-3 rounded-md border text-center transition-all ${
                    role === 'FACULTY_COORDINATOR' || role === 'PLACEMENT_OFFICER'
                      ? 'border-[#1D4ED8] bg-blue-50/70 text-[#1D4ED8] font-bold shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mb-1 text-purple-600" />
                  <span className="text-xs">College Staff</span>
                </button>
              </div>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu or name@company.com"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Phone Number (10 Digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
                />
              </div>
            </div>

            {/* DYNAMIC ROLE FIELDS */}
            {role === 'STUDENT' && (
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/70 space-y-4">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Academic Information (Student Profile)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Enrollment No *</label>
                    <input
                      type="text"
                      required
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      placeholder="e.g. DCSE-2023-088"
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Branch *</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    >
                      <option value="CSE">Computer Science &amp; Engg (CSE)</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="ECE">Electronics &amp; Comm (ECE)</option>
                      <option value="ME">Mechanical Engg (ME)</option>
                      <option value="CE">Civil Engg (CE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Current Semester *</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    >
                      <option value={3}>Semester 3</option>
                      <option value={4}>Semester 4</option>
                      <option value={5}>Semester 5 (Final Year Diploma)</option>
                      <option value={6}>Semester 6 (Final Year Diploma)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {role === 'COMPANY_RECRUITER' && (
              <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200/70 space-y-4">
                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Company / Organization Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Infotech Systems Pvt Ltd"
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Company Website</label>
                    <input
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Notice: Recruiter accounts are verified by the T&amp;P Cell before job postings become active (BR-03).
                </p>
              </div>
            )}

            {(role === 'FACULTY_COORDINATOR' || role === 'PLACEMENT_OFFICER') && (
              <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200/70 space-y-4">
                <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Staff Role &amp; Department Assignment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Designation Role *</label>
                    <select
                      value={staffRoleType}
                      onChange={(e) => setStaffRoleType(e.target.value as Role)}
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    >
                      <option value="FACULTY_COORDINATOR">Faculty Coordinator</option>
                      <option value="PLACEMENT_OFFICER">Placement Officer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      placeholder="e.g. EMP-2024-04"
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700">Department *</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science and Engineering"
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700">Address / City</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Residential or official office address"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-xs focus:ring-[#1D4ED8] focus:border-[#1D4ED8]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md shadow-sm text-xs font-bold text-white bg-[#1D4ED8] hover:bg-blue-800 transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
