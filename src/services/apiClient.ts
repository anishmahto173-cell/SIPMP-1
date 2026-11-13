import { LoginRoleOption, Role, User } from '../types';

export interface BackendUserPayload {
  userId?: number;
  user_id?: number;
  fullName?: string;
  full_name?: string;
  email: string;
  phone: string;
  role: string;
  status: User['status'];
  failedAttempts?: number;
  failed_attempts?: number;
  lockedUntil?: string | null;
  locked_until?: string | null;
  address?: string;
  designation?: string;
  department?: string;
  companyName?: string;
  company_name?: string;
  companyWebsite?: string;
  company_website?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface PendingRecruiterRecord {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  companyName: string;
  companyWebsite?: string;
  designation?: string;
  status: string;
  createdAt: string;
}

export function normalizeRoleName(rawRole?: string | null): Role | null {
  if (!rawRole) return null;
  const cleaned = rawRole.trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (cleaned === 'STUDENT') return 'STUDENT';
  if (cleaned === 'COMPANY_RECRUITER' || cleaned === 'RECRUITER') return 'COMPANY_RECRUITER';
  if (cleaned === 'PLACEMENT_OFFICER') return 'PLACEMENT_OFFICER';
  if (cleaned === 'FACULTY_COORDINATOR') return 'FACULTY_COORDINATOR';
  return null;
}

export function mapBackendUser(payload: BackendUserPayload): User {
  const normalizedRole = normalizeRoleName(payload.role) || 'STUDENT';
  return {
    user_id: payload.userId ?? payload.user_id ?? 0,
    full_name: payload.fullName ?? payload.full_name ?? '',
    email: payload.email,
    phone: payload.phone,
    password_hash: '',
    role: normalizedRole,
    status: payload.status,
    failed_attempts: payload.failedAttempts ?? payload.failed_attempts ?? 0,
    locked_until: payload.lockedUntil ?? payload.locked_until ?? null,
    address: payload.address,
    designation: payload.designation,
    department: payload.department,
    company_name: payload.companyName ?? payload.company_name,
    company_website: payload.companyWebsite ?? payload.company_website,
    created_at: payload.createdAt ?? payload.created_at ?? '',
    updated_at: payload.updatedAt ?? payload.updated_at ?? '',
  };
}

function getCookieValue(name: string): string | null {
  const prefix = `${name}=`;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

async function ensureCsrfToken(): Promise<string | null> {
  const existingCookie = getCookieValue('XSRF-TOKEN');
  if (existingCookie) {
    return existingCookie;
  }
  const response = await fetch('/api/auth/csrf', {
    method: 'GET',
    credentials: 'include',
  });
  const cookieAfterFetch = getCookieValue('XSRF-TOKEN');
  if (cookieAfterFetch) {
    return cookieAfterFetch;
  }
  if (response.ok) {
    const data = await response.json().catch(() => null);
    if (data?.token) {
      return data.token as string;
    }
  }
  return null;
}

async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T | null; message?: string }> {
  const method = (options.method || 'GET').toUpperCase();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    const csrfToken = await ensureCsrfToken();
    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken);
    }
  }

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include',
  });

  let data: any = null;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    message: data?.message,
  };
}

export const authApi = {
  async login(
    roleOption: LoginRoleOption,
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const res = await apiRequest<{ success: boolean; message?: string; user?: BackendUserPayload }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ roleOption, identifier, password }),
        }
      );

      if (res.ok && res.data?.success && res.data.user) {
        return {
          success: true,
          message: res.data.message,
          user: mapBackendUser(res.data.user),
        };
      }

      return {
        success: false,
        message: res.message || res.data?.message || 'Invalid credentials.',
      };
    } catch {
      return {
        success: false,
        message: 'Unable to reach the authentication server. Please verify the Spring Boot backend is running on port 8080.',
      };
    }
  },

  async me(): Promise<User | null> {
    try {
      const res = await apiRequest<{ success: boolean; user?: BackendUserPayload }>('/api/auth/me', {
        method: 'GET',
      });
      if (res.ok && res.data?.success && res.data.user) {
        return mapBackendUser(res.data.user);
      }
      return null;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch {
      // Clear client state even if backend is temporarily unreachable
    }
  },
};

export const recruiterApprovalApi = {
  async list(status = 'Pending'): Promise<{
    ok: boolean;
    status: number;
    data: PendingRecruiterRecord[];
    message?: string;
  }> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await apiRequest<PendingRecruiterRecord[]>(`/api/staff/recruiter-approvals${query}`, {
      method: 'GET',
    });
    return {
      ok: res.ok,
      status: res.status,
      data: Array.isArray(res.data) ? res.data : [],
      message: res.message,
    };
  },

  async approve(userId: number, reason?: string): Promise<{
    ok: boolean;
    status: number;
    message?: string;
  }> {
    const res = await apiRequest<{ success: boolean; message?: string }>(
      `/api/staff/recruiter-approvals/${userId}/approve`,
      {
        method: 'POST',
        body: JSON.stringify(reason ? { reason } : {}),
      }
    );
    return {
      ok: res.ok,
      status: res.status,
      message: res.message || res.data?.message,
    };
  },

  async reject(userId: number, reason: string): Promise<{
    ok: boolean;
    status: number;
    message?: string;
  }> {
    const res = await apiRequest<{ success: boolean; message?: string }>(
      `/api/staff/recruiter-approvals/${userId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }
    );
    return {
      ok: res.ok,
      status: res.status,
      message: res.message || res.data?.message,
    };
  },
};
