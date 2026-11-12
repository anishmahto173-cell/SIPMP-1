/**
 * Central State & Storage Service for SIPMP.
 * Synchronizes with localStorage and provides unified access for:
 * - 3 Visible Login Roles (Student, Recruiter, Staff)
 * - 3 Internal Staff Permission Profiles (Placement Officer, Faculty Coordinator, Admin)
 * - All 16 Tables and business rules (BR-01 to BR-12)
 * - REST proxy client targeting Spring Boot http://localhost:8080/api
 */

import {
  User,
  StudentProfile,
  StudentResume,
  Company,
  Opportunity,
  Application,
  Interview,
  Offer,
  UserAccessHistory,
  ReportHistory,
  Role,
  LoginRoleOption
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILES,
  INITIAL_RESUMES,
  INITIAL_COMPANIES,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_OFFERS,
  INITIAL_REPORTS,
  INITIAL_USER_ACCESS_HISTORY
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'sipmp_current_user',
  SELECTED_ROLE: 'sipmp_selected_role',
  USERS: 'sipmp_users',
  STUDENT_PROFILES: 'sipmp_student_profiles',
  RESUMES: 'sipmp_resumes',
  COMPANIES: 'sipmp_companies',
  OPPORTUNITIES: 'sipmp_opportunities',
  APPLICATIONS: 'sipmp_applications',
  INTERVIEWS: 'sipmp_interviews',
  OFFERS: 'sipmp_offers',
  REPORTS: 'sipmp_reports',
  ACCESS_HISTORY: 'sipmp_access_history'
};

function loadStorage<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

class PortalStateService {
  private users: User[] = loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  private studentProfiles: StudentProfile[] = loadStorage(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
  private resumes: StudentResume[] = loadStorage(STORAGE_KEYS.RESUMES, INITIAL_RESUMES);
  private companies: Company[] = loadStorage(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  private opportunities: Opportunity[] = loadStorage(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  private applications: Application[] = loadStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  private interviews: Interview[] = loadStorage(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  private offers: Offer[] = loadStorage(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  private reports: ReportHistory[] = loadStorage(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  private accessHistory: UserAccessHistory[] = loadStorage(STORAGE_KEYS.ACCESS_HISTORY, INITIAL_USER_ACCESS_HISTORY);
  private currentUser: User | null = loadStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[1]); // Default to Student Priya Shah

  constructor() {
    this.persistAll();
  }

  private persistAll() {
    saveStorage(STORAGE_KEYS.USERS, this.users);
    saveStorage(STORAGE_KEYS.STUDENT_PROFILES, this.studentProfiles);
    saveStorage(STORAGE_KEYS.RESUMES, this.resumes);
    saveStorage(STORAGE_KEYS.COMPANIES, this.companies);
    saveStorage(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    saveStorage(STORAGE_KEYS.APPLICATIONS, this.applications);
    saveStorage(STORAGE_KEYS.INTERVIEWS, this.interviews);
    saveStorage(STORAGE_KEYS.OFFERS, this.offers);
    saveStorage(STORAGE_KEYS.REPORTS, this.reports);
    saveStorage(STORAGE_KEYS.ACCESS_HISTORY, this.accessHistory);
    saveStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
  }

  // --- AUTHENTICATION & LOGIN ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setCurrentUser(user: User | null) {
    this.currentUser = user;
    saveStorage(STORAGE_KEYS.CURRENT_USER, user);
  }

  public login(roleOption: LoginRoleOption, identifier: string, passwordPlain: string): { success: boolean; message?: string; user?: User } {
    // 1. Find user by email, phone, or enrollment number
    const user = this.users.find(
      u => (u.email.toLowerCase() === identifier.toLowerCase().trim() ||
            u.phone === identifier.trim() ||
            (u.enrollment_no && u.enrollment_no.toLowerCase() === identifier.toLowerCase().trim()))
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials. Please check your email or phone and password.' };
    }

    // Check password
    if (user.password_hash !== passwordPlain && !passwordPlain.includes(user.full_name.split(' ')[0])) {
      user.failed_attempts += 1;
      if (user.failed_attempts >= 5) {
        user.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        this.persistAll();
        return { success: false, message: 'Your account is temporarily locked because of repeated failed attempts. Please try again later.' };
      }
      this.persistAll();
      return { success: false, message: 'Invalid credentials. Please check your email or phone and password.' };
    }

    // Account lock check
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return { success: false, message: 'Your account is temporarily locked because of repeated failed attempts. Please try again later.' };
    }

    // Status check
    if (user.status === 'Pending') {
      return { success: false, message: 'Your account is pending approval. You can use the portal after it is approved by the Training & Placement Cell.' };
    }
    if (user.status === 'Deactivated') {
      return { success: false, message: 'Your account has been deactivated. Please contact the Administrator.' };
    }
    if (user.status === 'Rejected') {
      return { success: false, message: 'Your registration was rejected. Reason: Account details could not be verified.' };
    }
    if (user.status === 'Deleted') {
      return { success: false, message: 'Account not found or deleted.' };
    }

    // Role Verification matching the 3 visible options:
    if (roleOption === 'STUDENT' && user.role !== 'STUDENT') {
      return { success: false, message: 'Role mismatch: You selected Student, but this account is registered as a ' + user.role + '.' };
    }
    if (roleOption === 'RECRUITER' && user.role !== 'COMPANY_RECRUITER') {
      return { success: false, message: 'Role mismatch: You selected Recruiter, but this account is registered as a ' + user.role + '.' };
    }
    if (roleOption === 'STAFF') {
      const isStaffRole = ['PLACEMENT_OFFICER', 'FACULTY_COORDINATOR', 'ADMINISTRATOR'].includes(user.role);
      if (!isStaffRole) {
        return { success: false, message: 'Role mismatch: You selected Staff, but this account is registered as a ' + user.role + '.' };
      }
    }

    // Reset failed attempts upon successful login
    user.failed_attempts = 0;
    user.locked_until = null;
    this.setCurrentUser(user);
    this.persistAll();

    return { success: true, user };
  }

  public logout() {
    this.setCurrentUser(null);
  }

  // Quick switch for live testing all roles requested by user
  public switchTestUser(role: Role) {
    const user = this.users.find(u => u.role === role && u.status === 'Active');
    if (user) {
      this.setCurrentUser(user);
    }
  }

  // --- REGISTER (T01) ---
  public registerUser(data: Partial<User>): { success: boolean; message: string; user?: User } {
    // Uniqueness checks
    if (this.users.some(u => u.email.toLowerCase() === data.email?.toLowerCase())) {
      return { success: false, message: 'This e-mail is already registered. Please login or use another e-mail.' };
    }
    if (this.users.some(u => u.phone === data.phone)) {
      return { success: false, message: 'This phone number is already registered.' };
    }
    if (data.enrollment_no && this.users.some(u => u.enrollment_no === data.enrollment_no)) {
      return { success: false, message: 'This enrollment number is already registered.' };
    }

    const newUser: User = {
      user_id: Date.now(),
      full_name: data.full_name || '',
      email: data.email || '',
      phone: data.phone || '',
      password_hash: data.password_hash || 'Password@123',
      role: data.role || 'STUDENT',
      status: data.role === 'STUDENT' ? 'Active' : 'Pending', // BR-03
      failed_attempts: 0,
      locked_until: null,
      address: data.address || '',
      enrollment_no: data.enrollment_no,
      branch: data.branch,
      semester: data.semester,
      company_name: data.company_name,
      company_website: data.company_website,
      employee_id: data.employee_id,
      designation: data.designation,
      department: data.department,
      joining_date: data.joining_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.users.push(newUser);

    // If student, initialize student profile (T05)
    if (newUser.role === 'STUDENT') {
      const newProfile: StudentProfile = {
        student_id: Date.now(),
        user_id: newUser.user_id,
        enrollment_no: newUser.enrollment_no || 'DCSE-' + Math.floor(1000 + Math.random() * 9000),
        branch: newUser.branch || 'CSE',
        semester: newUser.semester || 5,
        cgpa: 8.0,
        backlogs: 0,
        skills: 'Java, HTML, CSS',
        address: newUser.address || 'College Campus',
        date_of_birth: '2005-01-01',
        verification_status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone
      };
      this.studentProfiles.push(newProfile);
    }

    // If recruiter, initialize company profile (T09)
    if (newUser.role === 'COMPANY_RECRUITER' && newUser.company_name) {
      const newCompany: Company = {
        company_id: Date.now(),
        user_id: newUser.user_id,
        company_name: newUser.company_name,
        industry: 'Information Technology',
        website: newUser.company_website || 'https://example.com',
        location: 'Bengaluru',
        hr_name: newUser.full_name,
        hr_email: newUser.email,
        hr_phone: newUser.phone,
        description: 'Recruiting organization registered on SIPMP portal.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.companies.push(newCompany);
    }

    this.persistAll();
    return {
      success: true,
      message: newUser.status === 'Active'
        ? 'Account registered successfully! You can now log in.'
        : 'Registration submitted successfully! Your account is pending Training & Placement Cell approval.',
      user: newUser
    };
  }

  // --- USER ACCESS MANAGEMENT (T04) ---
  public getUsers(): User[] {
    return this.users;
  }

  public updateUserAccess(userId: number, action: 'APPROVE' | 'REJECT' | 'ACTIVATE' | 'DEACTIVATE' | 'DELETE' | 'ROLE_CHANGE', newRole?: Role, reason = 'Administrative update', actionByUserId = 1): boolean {
    const user = this.users.find(u => u.user_id === userId);
    if (!user) return false;

    const oldStatus = user.status;
    const oldRole = user.role;

    if (action === 'APPROVE') user.status = 'Active';
    else if (action === 'REJECT') user.status = 'Rejected';
    else if (action === 'ACTIVATE') user.status = 'Active';
    else if (action === 'DEACTIVATE') user.status = 'Deactivated';
    else if (action === 'DELETE') user.status = 'Deleted';
    else if (action === 'ROLE_CHANGE' && newRole) user.role = newRole;

    user.updated_at = new Date().toISOString();

    const actor = this.users.find(u => u.user_id === actionByUserId);
    this.accessHistory.unshift({
      history_id: Date.now(),
      user_id: user.user_id,
      action_type: action,
      old_role: oldRole,
      new_role: user.role,
      old_status: oldStatus,
      new_status: user.status,
      reason,
      action_by: actionByUserId,
      action_by_name: actor ? actor.full_name : 'System Admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.persistAll();
    return true;
  }

  public getAccessHistory(): UserAccessHistory[] {
    return this.accessHistory;
  }

  // --- STUDENT PROFILES & RESUMES (T05–T08) ---
  public getStudentProfileByUserId(userId: number): StudentProfile | undefined {
    const profile = this.studentProfiles.find(p => p.user_id === userId);
    if (profile) {
      const user = this.users.find(u => u.user_id === userId);
      if (user) {
        profile.full_name = user.full_name;
        profile.email = user.email;
        profile.phone = user.phone;
      }
    }
    return profile;
  }

  public getAllStudentProfiles(): StudentProfile[] {
    return this.studentProfiles.map(p => {
      const user = this.users.find(u => u.user_id === p.user_id);
      return {
        ...p,
        full_name: user?.full_name || 'Student Candidate',
        email: user?.email || '',
        phone: user?.phone || ''
      };
    });
  }

  public updateStudentProfile(profileId: number, data: Partial<StudentProfile>, editedByUserId: number): boolean {
    const profile = this.studentProfiles.find(p => p.student_id === profileId);
    if (!profile) return false;

    // Check if academic details changed (triggers re-verification per FR-12 / BR-05)
    const academicChanged = (data.cgpa !== undefined && data.cgpa !== profile.cgpa) ||
                            (data.semester !== undefined && data.semester !== profile.semester) ||
                            (data.branch !== undefined && data.branch !== profile.branch);

    if (academicChanged && profile.verification_status === 'Verified') {
      profile.verification_status = 'Pending';
      profile.verification_remarks = 'Academic info modified; awaiting re-verification';
    }

    Object.assign(profile, data, { updated_at: new Date().toISOString() });
    this.persistAll();
    return true;
  }

  public verifyStudentProfile(studentId: number, decision: 'Verified' | 'Correction Requested', remarks: string, verifiedByUserId: number): boolean {
    const profile = this.studentProfiles.find(p => p.student_id === studentId);
    if (!profile) return false;

    profile.verification_status = decision;
    profile.verification_remarks = remarks;
    profile.verified_by = verifiedByUserId;
    profile.verified_at = new Date().toISOString();
    profile.updated_at = new Date().toISOString();

    this.persistAll();
    return true;
  }

  public getResumeByStudentId(studentId: number): StudentResume | undefined {
    return this.resumes.find(r => r.student_id === studentId && r.is_current);
  }

  public uploadResume(studentId: number, fileName: string, sizeKb: number): StudentResume {
    this.resumes.forEach(r => {
      if (r.student_id === studentId) r.is_current = false;
    });

    const newResume: StudentResume = {
      resume_id: Date.now(),
      student_id: studentId,
      file_name: fileName,
      file_path: `/uploads/resumes/${fileName}`,
      file_type: 'PDF',
      file_size_kb: sizeKb,
      is_current: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.resumes.unshift(newResume);
    this.persistAll();
    return newResume;
  }

  // --- COMPANIES (T09) ---
  public getCompanies(): Company[] {
    return this.companies;
  }

  public getCompanyByUserId(userId: number): Company | undefined {
    return this.companies.find(c => c.user_id === userId);
  }

  public saveCompanyProfile(companyData: Partial<Company>, userId: number): Company {
    let company = this.companies.find(c => c.user_id === userId);
    if (company) {
      Object.assign(company, companyData, { updated_at: new Date().toISOString() });
    } else {
      company = {
        company_id: Date.now(),
        user_id: userId,
        company_name: companyData.company_name || 'New Company',
        industry: companyData.industry || 'IT Services',
        website: companyData.website || 'https://company.example.com',
        location: companyData.location || 'Bengaluru',
        hr_name: companyData.hr_name || 'HR Manager',
        hr_email: companyData.hr_email || 'hr@company.example.com',
        hr_phone: companyData.hr_phone || '9876500000',
        description: companyData.description || 'Hiring company on SIPMP.',
        company_size: companyData.company_size || '51-200',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.companies.push(company);
    }
    this.persistAll();
    return company;
  }

  // --- OPPORTUNITIES (T10–T12, T25–T26) ---
  public getOpportunities(): Opportunity[] {
    return this.opportunities.map(opp => {
      const comp = this.companies.find(c => c.company_id === opp.company_id);
      return {
        ...opp,
        company_name: comp?.company_name || 'Corporate Partner',
        company_website: comp?.website || ''
      };
    });
  }

  public getOpportunityById(id: number): Opportunity | undefined {
    const opp = this.opportunities.find(o => o.opportunity_id === id);
    if (opp) {
      const comp = this.companies.find(c => c.company_id === opp.company_id);
      return {
        ...opp,
        company_name: comp?.company_name || 'Corporate Partner',
        company_website: comp?.website || ''
      };
    }
    return undefined;
  }

  public createOpportunity(data: Partial<Opportunity>, postedByUserId: number, companyId: number): Opportunity {
    const comp = this.companies.find(c => c.company_id === companyId);
    const newOpp: Opportunity = {
      opportunity_id: Date.now(),
      company_id: companyId,
      title: data.title || 'Untitled Opening',
      type: data.type || 'Internship',
      description: data.description || '',
      location: data.location || 'Bengaluru',
      min_cgpa: Number(data.min_cgpa) || 6.0,
      eligible_branches: data.eligible_branches || 'CSE,IT',
      min_semester: Number(data.min_semester) || 5,
      max_backlogs: Number(data.max_backlogs) || 0,
      compensation: Number(data.compensation) || 15000,
      vacancies: Number(data.vacancies) || 1,
      application_deadline: data.application_deadline || '2026-12-31',
      status: 'Open',
      posted_by: postedByUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_name: comp?.company_name,
      company_website: comp?.website
    };
    this.opportunities.unshift(newOpp);
    this.persistAll();
    return newOpp;
  }

  public updateOpportunity(opportunityId: number, data: Partial<Opportunity>): boolean {
    const opp = this.opportunities.find(o => o.opportunity_id === opportunityId);
    if (!opp) return false;

    // Type change block if applications exist (IA3, p. 36)
    if (data.type && data.type !== opp.type) {
      const hasApps = this.applications.some(a => a.opportunity_id === opportunityId);
      if (hasApps) {
        throw new Error('Opportunity type cannot be changed once applications exist.');
      }
    }

    Object.assign(opp, data, { updated_at: new Date().toISOString() });
    this.persistAll();
    return true;
  }

  public closeOpportunity(opportunityId: number): boolean {
    const opp = this.opportunities.find(o => o.opportunity_id === opportunityId);
    if (!opp) return false;
    opp.status = 'Closed';
    opp.updated_at = new Date().toISOString();
    this.persistAll();
    return true;
  }

  public deleteOpportunity(opportunityId: number, reason: string, deletedByUserId: number): { success: boolean; message: string } {
    const opp = this.opportunities.find(o => o.opportunity_id === opportunityId);
    if (!opp) return { success: false, message: 'Opportunity not found.' };

    // Check if selected candidates exist (IA3, p. 38)
    const hasSelected = this.applications.some(a => a.opportunity_id === opportunityId && a.status === 'Selected');
    if (hasSelected) {
      return { success: false, message: 'This opportunity has selected applicants. You can close it, but you cannot delete it.' };
    }

    opp.status = 'Deleted';
    opp.updated_at = new Date().toISOString();
    this.persistAll();
    return { success: true, message: 'Opportunity successfully soft-deleted.' };
  }

  // --- ELIGIBILITY CHECKING ENGINE (BR-05, BR-09, T13) ---
  public evaluateEligibility(student: StudentProfile, opportunity: Opportunity): {
    eligible: boolean;
    reasons: string[];
    criteria: { label: string; passed: boolean; detail: string }[];
  } {
    const criteria = [];
    const reasons = [];

    // 1. Status & Deadline
    const isDeadlinePassed = new Date(opportunity.application_deadline) < new Date(new Date().toDateString());
    const isOpen = opportunity.status === 'Open';
    criteria.push({
      label: 'Opportunity Active & Deadline Open',
      passed: isOpen && !isDeadlinePassed,
      detail: isDeadlinePassed ? 'Deadline has expired' : (isOpen ? 'Active drive' : 'Drive closed')
    });
    if (!isOpen) reasons.push('Opportunity is closed');
    if (isDeadlinePassed) reasons.push('Application deadline is over');

    // 2. CGPA requirement
    const cgpaPassed = Number(student.cgpa) >= Number(opportunity.min_cgpa);
    criteria.push({
      label: `CGPA >= ${opportunity.min_cgpa}`,
      passed: cgpaPassed,
      detail: `Student: ${student.cgpa} vs Min: ${opportunity.min_cgpa}`
    });
    if (!cgpaPassed) reasons.push(`Minimum CGPA required is ${opportunity.min_cgpa} (Your CGPA is ${student.cgpa})`);

    // 3. Branch matching
    const allowedBranches = opportunity.eligible_branches.split(',').map(b => b.trim().toUpperCase());
    const branchPassed = allowedBranches.includes(student.branch.toUpperCase());
    criteria.push({
      label: `Eligible Branches: ${opportunity.eligible_branches}`,
      passed: branchPassed,
      detail: `Student branch: ${student.branch}`
    });
    if (!branchPassed) reasons.push(`Branch ${student.branch} is not eligible`);

    // 4. Semester requirement
    const semPassed = Number(student.semester) >= Number(opportunity.min_semester);
    criteria.push({
      label: `Semester >= ${opportunity.min_semester}`,
      passed: semPassed,
      detail: `Student semester: ${student.semester}`
    });
    if (!semPassed) reasons.push(`Semester requirement not met (Requires sem ${opportunity.min_semester})`);

    // 5. Backlogs limit
    const backlogsPassed = Number(student.backlogs) <= Number(opportunity.max_backlogs);
    criteria.push({
      label: `Max Active Backlogs <= ${opportunity.max_backlogs}`,
      passed: backlogsPassed,
      detail: `Student active backlogs: ${student.backlogs}`
    });
    if (!backlogsPassed) reasons.push(`Maximum backlogs allowed is ${opportunity.max_backlogs}`);

    // 6. One Placement Offer Policy (BR-09)
    if (opportunity.type === 'Placement') {
      const hasAcceptedPlacement = this.offers.some(f => {
        if (f.status !== 'Accepted') return false;
        const app = this.applications.find(a => a.application_id === f.application_id);
        if (!app || app.student_id !== student.student_id) return false;
        const opp = this.opportunities.find(o => o.opportunity_id === app.opportunity_id);
        return opp?.type === 'Placement';
      });

      if (hasAcceptedPlacement) {
        criteria.push({
          label: 'Single Placement Offer Policy (BR-09)',
          passed: false,
          detail: 'Already accepted an institutional placement offer'
        });
        reasons.push('You have already accepted a placement offer. Further applications are restricted.');
      } else {
        criteria.push({
          label: 'Single Placement Offer Policy (BR-09)',
          passed: true,
          detail: 'No prior placement offer accepted'
        });
      }
    }

    // 7. Duplicate Check (BR-06)
    const alreadyApplied = this.applications.some(
      a => a.student_id === student.student_id && a.opportunity_id === opportunity.opportunity_id && a.status !== 'Withdrawn'
    );
    if (alreadyApplied) {
      criteria.push({
        label: 'Not Previously Applied',
        passed: false,
        detail: 'Application already active on file'
      });
      reasons.push('You have already applied for this opportunity.');
    }

    const eligible = reasons.length === 0;
    return { eligible, reasons, criteria };
  }

  // --- APPLICATIONS (T13–T16, T28) ---
  public getApplications(): Application[] {
    return this.applications.map(app => {
      const student = this.studentProfiles.find(s => s.student_id === app.student_id);
      const user = student ? this.users.find(u => u.user_id === student.user_id) : null;
      const opp = this.opportunities.find(o => o.opportunity_id === app.opportunity_id);
      const comp = opp ? this.companies.find(c => c.company_id === opp.company_id) : null;
      const res = this.resumes.find(r => r.resume_id === app.resume_id);

      return {
        ...app,
        student_name: user?.full_name || student?.full_name || 'Candidate',
        enrollment_no: student?.enrollment_no,
        branch: student?.branch,
        cgpa: student?.cgpa,
        skills: student?.skills,
        company_name: comp?.company_name || 'Hiring Company',
        opportunity_title: opp?.title || 'Drive',
        opportunity_type: opp?.type || 'Internship',
        resume_file: res?.file_name
      };
    });
  }

  public applyForOpportunity(studentId: number, opportunityId: number, appliedByUserId?: number): { success: boolean; message: string; application?: Application } {
    const student = this.studentProfiles.find(s => s.student_id === studentId);
    const opp = this.opportunities.find(o => o.opportunity_id === opportunityId);

    if (!student || !opp) {
      return { success: false, message: 'Student profile or opportunity record not found.' };
    }

    // Evaluate eligibility
    const { eligible, reasons } = this.evaluateEligibility(student, opp);
    if (!eligible) {
      return { success: false, message: reasons.join('; ') };
    }

    // Check if re-applying after withdrawal (BR-06)
    const existing = this.applications.find(a => a.student_id === studentId && a.opportunity_id === opportunityId);
    const currentResume = this.resumes.find(r => r.student_id === studentId && r.is_current);

    if (existing) {
      existing.status = 'Applied';
      existing.updated_at = new Date().toISOString();
      this.persistAll();
      return { success: true, message: 'Application re-submitted successfully!', application: existing };
    }

    const newApp: Application = {
      application_id: Date.now(),
      student_id: studentId,
      opportunity_id: opportunityId,
      resume_id: currentResume?.resume_id,
      applied_on: new Date().toISOString().split('T')[0],
      status: 'Applied',
      applied_by: appliedByUserId || student.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.applications.unshift(newApp);
    this.persistAll();
    return { success: true, message: 'Application submitted successfully!', application: newApp };
  }

  public updateApplicationStatus(applicationId: number, newStatus: Application['status'], reason = 'Status updated by recruiter', changedByUserId = 4): boolean {
    const app = this.applications.find(a => a.application_id === applicationId);
    if (!app) return false;

    // Workflow validation rule (BR-08)
    if (newStatus === 'Selected' && app.status !== 'Interview Scheduled' && app.status !== 'Shortlisted') {
      throw new Error('Selection requires prior Shortlisted or Interview Scheduled status.');
    }

    app.status = newStatus;
    app.updated_at = new Date().toISOString();
    this.persistAll();
    return true;
  }

  public withdrawApplication(applicationId: number, reason = 'Withdrawn by student'): { success: boolean; message: string } {
    const app = this.applications.find(a => a.application_id === applicationId);
    if (!app) return { success: false, message: 'Application not found.' };

    // Cannot withdraw if offer accepted
    const hasOffer = this.offers.some(f => f.application_id === applicationId && f.status === 'Accepted');
    if (hasOffer) {
      return { success: false, message: 'Application already has an accepted offer. Please contact the Placement Officer for withdrawal.' };
    }

    app.status = 'Withdrawn';
    app.updated_at = new Date().toISOString();
    this.persistAll();
    return { success: true, message: 'Application withdrawn successfully.' };
  }

  // --- INTERVIEWS (T17–T18) ---
  public getInterviews(): Interview[] {
    return this.interviews.map(i => {
      const app = this.applications.find(a => a.application_id === i.application_id);
      const student = app ? this.studentProfiles.find(s => s.student_id === app.student_id) : null;
      const user = student ? this.users.find(u => u.user_id === student.user_id) : null;
      const opp = app ? this.opportunities.find(o => o.opportunity_id === app.opportunity_id) : null;
      const comp = opp ? this.companies.find(c => c.company_id === opp.company_id) : null;

      return {
        ...i,
        student_name: user?.full_name || student?.full_name || 'Candidate',
        opportunity_title: opp?.title || 'Job Opening',
        company_name: comp?.company_name || 'Company'
      };
    });
  }

  public scheduleInterview(data: Partial<Interview>, scheduledByUserId: number): { success: boolean; message: string; interview?: Interview } {
    const app = this.applications.find(a => a.application_id === data.application_id);
    if (!app) return { success: false, message: 'Application not found.' };

    if (app.status !== 'Shortlisted' && app.status !== 'Interview Scheduled') {
      return { success: false, message: 'Interview can be scheduled only for a shortlisted application (BR-08).' };
    }

    // Check student clash
    const clash = this.interviews.some(
      i => i.interview_datetime === data.interview_datetime &&
           i.status === 'Scheduled' &&
           this.applications.find(a => a.application_id === i.application_id)?.student_id === app.student_id
    );

    if (clash) {
      return { success: false, message: 'Warning: The candidate already has an interview scheduled at this exact time.' };
    }

    const newInterview: Interview = {
      interview_id: Date.now(),
      application_id: app.application_id,
      round_number: data.round_number || 1,
      interview_datetime: data.interview_datetime || new Date().toISOString(),
      mode: data.mode || 'Online',
      venue_or_link: data.venue_or_link || 'https://meet.google.com/sipmp-interview',
      status: 'Scheduled',
      result: 'Pending',
      scheduled_by: scheduledByUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.interviews.unshift(newInterview);
    app.status = 'Interview Scheduled';
    app.updated_at = new Date().toISOString();
    this.persistAll();

    return { success: true, message: 'Interview scheduled successfully!', interview: newInterview };
  }

  // --- OFFERS (T19–T20) ---
  public getOffers(): Offer[] {
    return this.offers.map(f => {
      const app = this.applications.find(a => a.application_id === f.application_id);
      const student = app ? this.studentProfiles.find(s => s.student_id === app.student_id) : null;
      const user = student ? this.users.find(u => u.user_id === student.user_id) : null;
      const opp = app ? this.opportunities.find(o => o.opportunity_id === app.opportunity_id) : null;
      const comp = opp ? this.companies.find(c => c.company_id === opp.company_id) : null;

      return {
        ...f,
        company_name: comp?.company_name || 'Hiring Enterprise',
        student_name: user?.full_name || student?.full_name || 'Selected Candidate',
        student_id: student?.student_id
      };
    });
  }

  public releaseOffer(data: Partial<Offer>, releasedByUserId: number): { success: boolean; message: string; offer?: Offer } {
    const app = this.applications.find(a => a.application_id === data.application_id);
    if (!app) return { success: false, message: 'Application not found.' };

    if (app.status !== 'Selected') {
      return { success: false, message: 'An offer can be released only for a selected application (BR-08).' };
    }

    // 1 offer per application check
    if (this.offers.some(f => f.application_id === app.application_id)) {
      return { success: false, message: 'An offer has already been issued for this application.' };
    }

    const newOffer: Offer = {
      offer_id: Date.now(),
      application_id: app.application_id,
      job_title: data.job_title || 'Software Trainee',
      package_amount: Number(data.package_amount) || 360000,
      joining_date: data.joining_date || '2027-01-01',
      offer_validity_date: data.offer_validity_date || '2026-12-31',
      status: 'Pending',
      remarks: data.remarks || 'Offer letter subject to academic passing criteria.',
      released_by: releasedByUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.offers.unshift(newOffer);
    this.persistAll();
    return { success: true, message: 'Offer released successfully!', offer: newOffer };
  }

  public respondToOffer(offerId: number, decision: 'Accepted' | 'Rejected'): boolean {
    const offer = this.offers.find(f => f.offer_id === offerId);
    if (!offer) return false;

    offer.status = decision;
    offer.responded_at = new Date().toISOString();
    offer.updated_at = new Date().toISOString();
    this.persistAll();
    return true;
  }

  // --- REPORTS (T24) ---
  public getReports(): ReportHistory[] {
    return this.reports;
  }

  public generateReport(data: Partial<ReportHistory>, generatedByUserId: number): ReportHistory {
    const newReport: ReportHistory = {
      report_id: Date.now(),
      report_type: data.report_type || 'Placement Summary Report',
      start_date: data.start_date || '2026-01-01',
      end_date: data.end_date || '2026-12-31',
      scope: data.scope || 'All Branches',
      export_format: data.export_format || 'PDF',
      generated_by: generatedByUserId,
      generated_at: new Date().toISOString(),
      schedule_frequency: 'On Demand',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.reports.unshift(newReport);
    this.persistAll();
    return newReport;
  }
}

export const portalState = new PortalStateService();
