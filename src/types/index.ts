/**
 * Database schema representation and TypeScript models matching
 * the 16 MySQL tables defined in Industrial Assignment 5 & 6.
 */

export type Role = 'STUDENT' | 'COMPANY_RECRUITER' | 'PLACEMENT_OFFICER' | 'FACULTY_COORDINATOR' | 'ADMINISTRATOR';

// The 3 public selectable login personas requested by user
export type LoginRoleOption = 'STUDENT' | 'RECRUITER' | 'STAFF';

export type UserStatus = 'Active' | 'Pending' | 'Deactivated' | 'Rejected' | 'Deleted';

export type OpportunityType = 'Internship' | 'Placement';
export type OpportunityStatus = 'Open' | 'Closed' | 'Deleted';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Interview Scheduled' 
  | 'Selected' 
  | 'Rejected' 
  | 'Withdrawn';

export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type InterviewResult = 'Pending' | 'Passed' | 'Failed';

export type OfferStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Expired' | 'Revoked';

// 1. users
export interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: Role;
  status: UserStatus;
  failed_attempts: number;
  locked_until: string | null;
  address?: string;
  employee_id?: string;
  designation?: string;
  department?: string;
  joining_date?: string;
  enrollment_no?: string;
  branch?: string;
  semester?: number;
  company_name?: string;
  company_website?: string;
  appointment_date?: string;
  scope_of_access?: string;
  created_at: string;
  updated_at: string;
}

// 2. login_sessions
export interface LoginSession {
  session_id: number;
  user_id: number;
  session_token: string;
  login_time: string;
  last_activity: string;
  logout_time: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 3. user_access_history
export interface UserAccessHistory {
  history_id: number;
  user_id: number;
  action_type: string; // 'APPROVE' | 'REJECT' | 'DEACTIVATE' | 'REACTIVATE' | 'ROLE_CHANGE' | 'DELETE'
  old_role?: string;
  new_role?: string;
  old_status?: string;
  new_status?: string;
  reason: string;
  action_by: number; // user_id
  action_by_name?: string;
  created_at: string;
  updated_at: string;
}

// 4. student_profiles
export interface StudentProfile {
  student_id: number;
  user_id: number;
  enrollment_no: string;
  branch: string;
  semester: number;
  cgpa: number;
  backlogs: number;
  skills: string;
  address: string;
  date_of_birth: string;
  linkedin_url?: string;
  github_url?: string;
  verification_status: 'Pending' | 'Verified' | 'Correction Requested';
  verification_remarks?: string;
  verified_by?: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  // joined from users
  full_name?: string;
  email?: string;
  phone?: string;
}

// 5. student_resumes
export interface StudentResume {
  resume_id: number;
  student_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size_kb: number;
  is_current: boolean;
  removal_reason?: string;
  removed_by?: number;
  created_at: string;
  updated_at: string;
}

// 6. student_edit_history
export interface StudentEditHistory {
  history_id: number;
  student_id: number;
  field_name: string;
  old_value: string;
  new_value: string;
  reason: string;
  edited_by: number;
  edited_by_name?: string;
  created_at: string;
  updated_at: string;
}

// 7. companies
export interface Company {
  company_id: number;
  user_id: number;
  company_name: string;
  industry: string;
  website: string;
  location: string;
  hr_name: string;
  hr_email: string;
  hr_phone: string;
  description: string;
  company_size?: string;
  created_at: string;
  updated_at: string;
}

// 8. opportunities
export interface Opportunity {
  opportunity_id: number;
  company_id: number;
  title: string;
  type: OpportunityType;
  description: string;
  location: string;
  min_cgpa: number;
  eligible_branches: string; // comma separated: 'CSE,IT'
  min_semester: number;
  max_backlogs: number;
  compensation: number;
  vacancies: number;
  application_deadline: string;
  status: OpportunityStatus;
  posted_by: number;
  created_at: string;
  updated_at: string;
  // joined details
  company_name?: string;
  company_website?: string;
}

// 9. opportunity_edit_history
export interface OpportunityEditHistory {
  history_id: number;
  opportunity_id: number;
  field_name: string;
  old_value: string;
  new_value: string;
  reason: string;
  edited_by: number;
  edited_by_name?: string;
  created_at: string;
  updated_at: string;
}

// 10. opportunity_deletion_history
export interface OpportunityDeletionHistory {
  deletion_id: number;
  opportunity_id: number;
  title: string;
  previous_status: string;
  reason: string;
  deleted_by: number;
  deleted_at: string;
  restored_at: string | null;
  created_at: string;
  updated_at: string;
}

// 11. applications
export interface Application {
  application_id: number;
  student_id: number;
  opportunity_id: number;
  resume_id?: number;
  applied_on: string;
  status: ApplicationStatus;
  applied_by?: number;
  created_at: string;
  updated_at: string;
  // joined
  student_name?: string;
  enrollment_no?: string;
  branch?: string;
  cgpa?: number;
  skills?: string;
  company_name?: string;
  opportunity_title?: string;
  opportunity_type?: OpportunityType;
  resume_file?: string;
}

// 12. application_status_history
export interface ApplicationStatusHistory {
  history_id: number;
  application_id: number;
  old_status?: string;
  new_status: string;
  changed_by: number;
  changed_by_name?: string;
  change_reason: string;
  changed_at: string;
  created_at: string;
  updated_at: string;
}

// 13. interviews
export interface Interview {
  interview_id: number;
  application_id: number;
  round_number: number;
  interview_datetime: string;
  mode: 'Online' | 'Offline';
  venue_or_link: string;
  status: InterviewStatus;
  result: InterviewResult;
  rescheduled_from?: string;
  cancel_reason?: string;
  scheduled_by: number;
  created_at: string;
  updated_at: string;
  // joined
  opportunity_title?: string;
  company_name?: string;
  student_name?: string;
}

// 14. offers
export interface Offer {
  offer_id: number;
  application_id: number;
  job_title: string;
  package_amount: number;
  joining_date?: string;
  offer_validity_date: string;
  status: OfferStatus;
  remarks?: string;
  released_by: number;
  responded_at?: string;
  created_at: string;
  updated_at: string;
  // joined
  company_name?: string;
  student_name?: string;
  student_id?: number;
}

// 15. dashboard_preferences
export interface DashboardPreference {
  preference_id: number;
  user_id: number;
  widget_name: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// 16. report_history
export interface ReportHistory {
  report_id: number;
  report_type: string;
  start_date: string;
  end_date: string;
  scope: string;
  export_format: 'PDF' | 'Excel';
  generated_by: number;
  generated_at: string;
  schedule_frequency?: string;
  created_at: string;
  updated_at: string;
}
