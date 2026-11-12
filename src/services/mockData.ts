/**
 * Initial Seed Data directly extracted from Industrial Assignment 5
 * (Sample Data Reference, Pages 3, 5, 6, 14, 21, 23, 25, 26, 32, 42, 47)
 * 
 * Provides transparent simulation data when running standalone or in preview,
 * directly reflecting the 16 MySQL database tables.
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
  StudentEditHistory,
  OpportunityEditHistory,
  OpportunityDeletionHistory,
  ApplicationStatusHistory,
  ReportHistory
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    user_id: 1,
    full_name: 'Sana Khan',
    email: 'sana.khan@college.edu',
    phone: '9876500001',
    password_hash: 'Sana@123',
    role: 'ADMINISTRATOR',
    status: 'Active',
    failed_attempts: 0,
    locked_until: null,
    address: 'Ahmedabad, Gujarat',
    employee_id: 'ADM101',
    designation: 'System Administrator',
    appointment_date: '2026-06-01',
    scope_of_access: 'All Modules',
    created_at: '2026-06-01 09:00:00',
    updated_at: '2026-06-01 09:00:00'
  },
  {
    user_id: 2,
    full_name: 'Priya Shah',
    email: 'priya.shah@college.edu',
    phone: '9876500002',
    password_hash: 'Priya@123',
    role: 'STUDENT',
    status: 'Active',
    failed_attempts: 0,
    locked_until: null,
    address: 'Ahmedabad, Gujarat',
    enrollment_no: 'DCSE2023002',
    branch: 'CSE',
    semester: 5,
    created_at: '2026-06-15 10:00:00',
    updated_at: '2026-06-15 10:00:00'
  },
  {
    user_id: 3,
    full_name: 'Rohan Mehta',
    email: 'rohan.mehta@college.edu',
    phone: '9876500003',
    password_hash: 'Rohan@123',
    role: 'STUDENT',
    status: 'Active',
    failed_attempts: 0,
    locked_until: null,
    address: 'Surat, Gujarat',
    enrollment_no: 'DCSE2023003',
    branch: 'CSE',
    semester: 5,
    created_at: '2026-06-16 11:30:00',
    updated_at: '2026-06-16 11:30:00'
  },
  {
    user_id: 4,
    full_name: 'Karan Joshi',
    email: 'karan.joshi@technova.com',
    phone: '9876500004',
    password_hash: 'Karan@123',
    role: 'COMPANY_RECRUITER',
    status: 'Active', // Approved by PO in Query 30
    failed_attempts: 0,
    locked_until: null,
    designation: 'HR Manager',
    company_name: 'TechNova Solutions',
    company_website: 'www.technova.com',
    created_at: '2026-06-18 14:00:00',
    updated_at: '2026-06-20 16:00:00'
  },
  {
    user_id: 5,
    full_name: 'Neha Patel',
    email: 'neha.patel@college.edu',
    phone: '9876500005',
    password_hash: 'Neha@123',
    role: 'PLACEMENT_OFFICER',
    status: 'Active', // Approved by Admin in Query 28
    failed_attempts: 0,
    locked_until: null,
    address: 'Ahmedabad, Gujarat',
    employee_id: 'PO101',
    designation: 'Placement Officer',
    department: 'Training and Placement Cell',
    joining_date: '2026-06-15',
    created_at: '2026-06-15 08:30:00',
    updated_at: '2026-06-16 09:00:00'
  },
  {
    user_id: 6,
    full_name: 'Dr. Amit Verma',
    email: 'amit.verma@college.edu',
    phone: '9876500006',
    password_hash: 'Amit@123',
    role: 'FACULTY_COORDINATOR',
    status: 'Active', // Approved by Admin in Query 29
    failed_attempts: 0,
    locked_until: null,
    address: 'Ahmedabad, Gujarat',
    employee_id: 'FC101',
    designation: 'Head of Department',
    department: 'Computer Science and Engineering',
    joining_date: '2026-06-15',
    created_at: '2026-06-15 09:00:00',
    updated_at: '2026-06-16 09:30:00'
  },
  {
    user_id: 7,
    full_name: 'Anjali Nair',
    email: 'anjali.nair@brightpath.com',
    phone: '9876500007',
    password_hash: 'Anjali@123',
    role: 'COMPANY_RECRUITER',
    status: 'Active', // Approved in Query 30
    failed_attempts: 0,
    locked_until: null,
    designation: 'Talent Acquisition Lead',
    company_name: 'BrightPath Infotech',
    company_website: 'www.brightpath.in',
    created_at: '2026-06-21 11:00:00',
    updated_at: '2026-06-22 15:00:00'
  },
  {
    user_id: 8,
    full_name: 'Vikram Rao',
    email: 'vikram.rao@quickhire.com',
    phone: '9876500008',
    password_hash: 'Vikram@123',
    role: 'COMPANY_RECRUITER',
    status: 'Rejected', // Rejected in Query 31: 'Company could not be verified'
    failed_attempts: 0,
    locked_until: null,
    company_name: 'QuickHire Pvt Ltd',
    designation: 'HR Executive',
    created_at: '2026-06-25 10:00:00',
    updated_at: '2026-06-26 12:00:00'
  },
  {
    user_id: 9,
    full_name: 'Meera Iyer',
    email: 'meera.iyer@college.edu',
    phone: '9876500009',
    password_hash: 'Meera@123',
    role: 'FACULTY_COORDINATOR',
    status: 'Deactivated', // Deactivated in Query 32
    failed_attempts: 0,
    locked_until: null,
    employee_id: 'FC102',
    department: 'Information Technology',
    created_at: '2026-06-27 10:00:00',
    updated_at: '2026-06-28 14:00:00'
  }
];

export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    student_id: 1,
    user_id: 2,
    enrollment_no: 'DCSE2023002',
    branch: 'CSE',
    semester: 5,
    cgpa: 8.60,
    backlogs: 0,
    skills: 'Java, SQL, React, Spring Boot',
    address: 'Ahmedabad, Gujarat',
    date_of_birth: '2005-03-14',
    linkedin_url: 'https://linkedin.com/in/priyashah',
    github_url: 'https://github.com/priyashah',
    verification_status: 'Verified',
    verification_remarks: 'Marksheet checked',
    verified_by: 5,
    verified_at: '2026-06-20 11:00:00',
    created_at: '2026-06-15 10:15:00',
    updated_at: '2026-06-20 11:00:00',
    full_name: 'Priya Shah',
    email: 'priya.shah@college.edu',
    phone: '9876500002'
  },
  {
    student_id: 2,
    user_id: 3,
    enrollment_no: 'DCSE2023003',
    branch: 'CSE',
    semester: 5,
    cgpa: 7.10,
    backlogs: 1,
    skills: 'HTML, CSS, JavaScript, MySQL',
    address: 'Surat, Gujarat',
    date_of_birth: '2005-07-21',
    linkedin_url: 'https://linkedin.com/in/rohanmehta',
    github_url: 'https://github.com/rohanmehta',
    verification_status: 'Verified',
    verification_remarks: 'Corrected and verified',
    verified_by: 5,
    verified_at: '2026-06-22 14:00:00',
    created_at: '2026-06-16 12:00:00',
    updated_at: '2026-06-22 14:00:00',
    full_name: 'Rohan Mehta',
    email: 'rohan.mehta@college.edu',
    phone: '9876500003'
  }
];

export const INITIAL_RESUMES: StudentResume[] = [
  {
    resume_id: 1,
    student_id: 1,
    file_name: 'Priya_Shah_Resume_v2.pdf',
    file_path: '/uploads/resumes/priya_shah_v2.pdf',
    file_type: 'PDF',
    file_size_kb: 455,
    is_current: true,
    created_at: '2026-06-18 10:00:00',
    updated_at: '2026-06-18 10:00:00'
  },
  {
    resume_id: 2,
    student_id: 2,
    file_name: 'Rohan_Mehta_Resume.pdf',
    file_path: '/uploads/resumes/rohan_mehta_v1.pdf',
    file_type: 'PDF',
    file_size_kb: 380,
    is_current: true,
    created_at: '2026-06-19 11:30:00',
    updated_at: '2026-06-19 11:30:00'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    company_id: 1,
    user_id: 4,
    company_name: 'TechNova Solutions',
    industry: 'IT Services',
    website: 'https://www.technova.com',
    location: 'Bengaluru',
    hr_name: 'Karan Joshi',
    hr_email: 'karan.joshi@technova.com',
    hr_phone: '9876500044',
    description: 'Software services and product engineering company delivering web and enterprise applications.',
    company_size: '501-1000',
    created_at: '2026-06-20 16:30:00',
    updated_at: '2026-06-20 16:30:00'
  },
  {
    company_id: 2,
    user_id: 7,
    company_name: 'BrightPath Infotech',
    industry: 'Software Product',
    website: 'https://www.brightpath.in',
    location: 'Hyderabad',
    hr_name: 'Anjali Nair',
    hr_email: 'anjali.nair@brightpath.com',
    hr_phone: '9876500007',
    description: 'Web and mobile product development company specializing in cloud-native microservices.',
    company_size: '51-200',
    created_at: '2026-06-22 15:30:00',
    updated_at: '2026-06-22 15:30:00'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    opportunity_id: 1,
    company_id: 1,
    title: 'Java Developer Intern',
    type: 'Internship',
    description: 'Work on Spring Boot REST APIs and MySQL under mentor guidance in our cloud engineering group.',
    location: 'Bengaluru',
    min_cgpa: 7.00,
    eligible_branches: 'CSE,IT',
    min_semester: 5,
    max_backlogs: 0,
    compensation: 18000,
    vacancies: 5,
    application_deadline: '2026-11-30',
    status: 'Open',
    posted_by: 4,
    created_at: '2026-07-01 10:00:00',
    updated_at: '2026-07-05 12:00:00',
    company_name: 'TechNova Solutions',
    company_website: 'https://www.technova.com'
  },
  {
    opportunity_id: 2,
    company_id: 1,
    title: 'Software Engineer Trainee',
    type: 'Placement',
    description: 'Full-time trainee role in software development with 6 months training across full-stack systems.',
    location: 'Bengaluru (Hybrid)',
    min_cgpa: 7.50,
    eligible_branches: 'CSE,IT',
    min_semester: 5,
    max_backlogs: 0,
    compensation: 350000,
    vacancies: 10,
    application_deadline: '2026-12-15',
    status: 'Open',
    posted_by: 4,
    created_at: '2026-07-02 11:00:00',
    updated_at: '2026-07-08 14:00:00',
    company_name: 'TechNova Solutions',
    company_website: 'https://www.technova.com'
  },
  {
    opportunity_id: 3,
    company_id: 2,
    title: 'Web Developer Intern',
    type: 'Internship',
    description: 'Build responsive web pages using React and REST APIs for client-facing SaaS dashboards.',
    location: 'Hyderabad',
    min_cgpa: 6.00,
    eligible_branches: 'CSE,IT',
    min_semester: 4,
    max_backlogs: 2,
    compensation: 10000,
    vacancies: 3,
    application_deadline: '2026-11-25',
    status: 'Open',
    posted_by: 7,
    created_at: '2026-07-03 14:00:00',
    updated_at: '2026-07-09 10:00:00',
    company_name: 'BrightPath Infotech',
    company_website: 'https://www.brightpath.in'
  },
  {
    opportunity_id: 4,
    company_id: 2,
    title: 'Associate Developer',
    type: 'Placement',
    description: 'Campus drive arranged offline; role in core product engineering and data warehousing team.',
    location: 'Hyderabad',
    min_cgpa: 6.50,
    eligible_branches: 'CSE',
    min_semester: 5,
    max_backlogs: 0,
    compensation: 450000,
    vacancies: 4,
    application_deadline: '2026-12-20',
    status: 'Open',
    posted_by: 5, // Posted by PO on behalf in Query 75
    created_at: '2026-07-04 15:00:00',
    updated_at: '2026-07-04 15:00:00',
    company_name: 'BrightPath Infotech',
    company_website: 'https://www.brightpath.in'
  },
  {
    opportunity_id: 5,
    company_id: 2,
    title: 'Test Posting - Duplicate Entry',
    type: 'Internship',
    description: 'Test posting demonstrating close and soft-delete features.',
    location: 'Hyderabad',
    min_cgpa: 6.00,
    eligible_branches: 'CSE',
    min_semester: 5,
    max_backlogs: 1,
    compensation: 8000,
    vacancies: 1,
    application_deadline: '2026-12-31',
    status: 'Closed', // Closed in Query 87
    posted_by: 7,
    created_at: '2026-07-05 09:00:00',
    updated_at: '2026-07-06 10:00:00',
    company_name: 'BrightPath Infotech',
    company_website: 'https://www.brightpath.in'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    application_id: 1,
    student_id: 1,
    opportunity_id: 1,
    resume_id: 1,
    applied_on: '2026-10-12',
    status: 'Selected', // Selected in Query 114
    applied_by: 2,
    created_at: '2026-10-12 09:30:00',
    updated_at: '2026-10-28 17:00:00',
    student_name: 'Priya Shah',
    enrollment_no: 'DCSE2023002',
    branch: 'CSE',
    cgpa: 8.60,
    skills: 'Java, SQL, React',
    company_name: 'TechNova Solutions',
    opportunity_title: 'Java Developer Intern',
    opportunity_type: 'Internship',
    resume_file: 'Priya_Shah_Resume_v2.pdf'
  },
  {
    application_id: 2,
    student_id: 1,
    opportunity_id: 2,
    resume_id: 1,
    applied_on: '2026-10-12',
    status: 'Rejected', // Rejected in Query 113 ('Vacancies filled')
    applied_by: 2,
    created_at: '2026-10-12 10:00:00',
    updated_at: '2026-10-15 16:00:00',
    student_name: 'Priya Shah',
    enrollment_no: 'DCSE2023002',
    branch: 'CSE',
    cgpa: 8.60,
    skills: 'Java, SQL, React',
    company_name: 'TechNova Solutions',
    opportunity_title: 'Software Engineer Trainee',
    opportunity_type: 'Placement',
    resume_file: 'Priya_Shah_Resume_v2.pdf'
  },
  {
    application_id: 3,
    student_id: 2,
    opportunity_id: 3,
    resume_id: 2,
    applied_on: '2026-10-14',
    status: 'Selected', // Selected in Query 115
    applied_by: 3,
    created_at: '2026-10-14 11:00:00',
    updated_at: '2026-10-29 16:30:00',
    student_name: 'Rohan Mehta',
    enrollment_no: 'DCSE2023003',
    branch: 'CSE',
    cgpa: 7.10,
    skills: 'HTML, CSS, JavaScript',
    company_name: 'BrightPath Infotech',
    opportunity_title: 'Web Developer Intern',
    opportunity_type: 'Internship',
    resume_file: 'Rohan_Mehta_Resume.pdf'
  },
  {
    application_id: 4,
    student_id: 1,
    opportunity_id: 4,
    resume_id: 1,
    applied_on: '2026-10-15',
    status: 'Withdrawn', // Withdrawn in Query 117
    applied_by: 5, // Applied on behalf by PO in Query 99
    created_at: '2026-10-15 14:00:00',
    updated_at: '2026-10-20 10:30:00',
    student_name: 'Priya Shah',
    enrollment_no: 'DCSE2023002',
    branch: 'CSE',
    cgpa: 8.60,
    skills: 'Java, SQL, React',
    company_name: 'BrightPath Infotech',
    opportunity_title: 'Associate Developer',
    opportunity_type: 'Placement',
    resume_file: 'Priya_Shah_Resume_v2.pdf'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    interview_id: 1,
    application_id: 1,
    round_number: 1,
    interview_datetime: '2026-10-28 10:00:00',
    mode: 'Online',
    venue_or_link: 'https://meet.example.com/technova-r1',
    status: 'Completed',
    result: 'Passed', // Passed in Query 128
    scheduled_by: 4,
    created_at: '2026-10-16 11:00:00',
    updated_at: '2026-10-28 11:30:00',
    opportunity_title: 'Java Developer Intern',
    company_name: 'TechNova Solutions',
    student_name: 'Priya Shah'
  },
  {
    interview_id: 2,
    application_id: 3,
    round_number: 1,
    interview_datetime: '2026-10-30 11:00:00', // Rescheduled in Query 127
    mode: 'Offline',
    venue_or_link: 'Seminar Hall, Main Campus',
    status: 'Completed',
    result: 'Passed',
    rescheduled_from: '2026-10-29 11:00:00',
    scheduled_by: 7,
    created_at: '2026-10-17 14:00:00',
    updated_at: '2026-10-30 12:00:00',
    opportunity_title: 'Web Developer Intern',
    company_name: 'BrightPath Infotech',
    student_name: 'Rohan Mehta'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    offer_id: 1,
    application_id: 1,
    job_title: 'Java Developer Intern',
    package_amount: 20000, // Revised in Query 139
    joining_date: '2027-01-05',
    offer_validity_date: '2026-11-10',
    status: 'Accepted', // Accepted by Priya Shah in Query 143
    remarks: 'Stipend revised after management approval',
    released_by: 4,
    responded_at: '2026-11-01 15:30:00',
    created_at: '2026-10-29 14:00:00',
    updated_at: '2026-11-01 15:30:00',
    company_name: 'TechNova Solutions',
    student_name: 'Priya Shah',
    student_id: 1
  },
  {
    offer_id: 2,
    application_id: 3,
    job_title: 'Web Developer Intern',
    package_amount: 10000,
    joining_date: '2027-01-10',
    offer_validity_date: '2026-11-12',
    status: 'Pending',
    remarks: 'Bring original documents for verification at onboarding',
    released_by: 7,
    responded_at: undefined,
    created_at: '2026-10-31 16:00:00',
    updated_at: '2026-10-31 16:00:00',
    company_name: 'BrightPath Infotech',
    student_name: 'Rohan Mehta',
    student_id: 2
  }
];

export const INITIAL_REPORTS: ReportHistory[] = [
  {
    report_id: 1,
    report_type: 'Placement Summary Report',
    start_date: '2026-10-01',
    end_date: '2026-10-31',
    scope: 'All Branches',
    export_format: 'PDF',
    generated_by: 5,
    generated_at: '2026-10-31 18:00:00',
    schedule_frequency: 'Monthly',
    created_at: '2026-10-31 18:00:00',
    updated_at: '2026-10-31 18:00:00'
  },
  {
    report_id: 2,
    report_type: 'Branch-wise Placement Report',
    start_date: '2026-07-01',
    end_date: '2026-10-31',
    scope: 'CSE',
    export_format: 'Excel',
    generated_by: 6,
    generated_at: '2026-10-31 19:15:00',
    schedule_frequency: 'Quarterly',
    created_at: '2026-10-31 19:15:00',
    updated_at: '2026-10-31 19:15:00'
  }
];

export const INITIAL_USER_ACCESS_HISTORY: UserAccessHistory[] = [
  {
    history_id: 1,
    user_id: 5,
    action_type: 'APPROVE',
    old_status: 'Pending',
    new_status: 'Active',
    reason: 'Employee verification completed',
    action_by: 1,
    action_by_name: 'Sana Khan',
    created_at: '2026-06-16 09:00:00',
    updated_at: '2026-06-16 09:00:00'
  },
  {
    history_id: 2,
    user_id: 4,
    action_type: 'APPROVE',
    old_status: 'Pending',
    new_status: 'Active',
    reason: 'Company verified by Placement Officer',
    action_by: 5,
    action_by_name: 'Neha Patel',
    created_at: '2026-06-20 16:00:00',
    updated_at: '2026-06-20 16:00:00'
  },
  {
    history_id: 3,
    user_id: 8,
    action_type: 'REJECT',
    old_status: 'Pending',
    new_status: 'Rejected',
    reason: 'Company could not be verified',
    action_by: 5,
    action_by_name: 'Neha Patel',
    created_at: '2026-06-26 12:00:00',
    updated_at: '2026-06-26 12:00:00'
  }
];
