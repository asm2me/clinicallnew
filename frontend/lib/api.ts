import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

/**
 * Create a pre-configured axios instance with tenant and auth headers.
 */
export function createApiClient(tenantId?: string): AxiosInstance {
  const instance = axios.create({
    baseURL: `${API_URL}/v1`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Attach auth token
  instance.interceptors.request.use((config) => {
    const token = Cookies.get('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const tid = tenantId ?? Cookies.get('tenant_id');
    if (tid) config.headers['X-Tenant-ID'] = tid;

    return config;
  });

  // Handle 401 → redirect to login
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401) {
        Cookies.remove('access_token');
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export const api = createApiClient();

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: Record<string, unknown>)             => api.post('/auth/register', data),
  me:       ()                                          => api.get('/auth/me'),
  logout:   ()                                          => api.post('/auth/logout'),
  refresh:  ()                                          => api.post('/auth/refresh'),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentsApi = {
  list:    (params?: Record<string, unknown>)              => api.get('/appointments', { params }),
  get:     (id: number)                                    => api.get(`/appointments/${id}`),
  create:  (data: Record<string, unknown>)                 => api.post('/appointments', data),
  confirm: (id: number)                                    => api.put(`/appointments/${id}/confirm`),
  cancel:  (id: number, reason: string)                    => api.put(`/appointments/${id}/cancel`, { reason }),
  complete:(id: number, data?: Record<string, unknown>)    => api.put(`/appointments/${id}/complete`, data),
  slots:   (doctorId: number, date: string)                => api.get('/public/appointment-slots', { params: { doctor_id: doctorId, date } }),
  lockSlot:(data: { doctor_id: number; date: string; time: string }) => api.post('/appointments/lock-slot', data),
  today:   ()                                              => api.get('/appointments/today'),
  stats:   (start: string, end: string)                    => api.get('/appointments/stats', { params: { start, end } }),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const doctorsApi = {
  list:   (params?: Record<string, unknown>) => api.get('/public/doctors', { params }),
  get:    (slug: string)                     => api.get(`/public/doctors/${slug}`),
  create: (data: FormData)                   => api.post('/doctors', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData)       => api.post(`/doctors/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number)                       => api.delete(`/doctors/${id}`),
};

// ── Patients ──────────────────────────────────────────────────────────────────
export const patientsApi = {
  list:   (params?: Record<string, unknown>) => api.get('/patients', { params }),
  get:    (id: number)                       => api.get(`/patients/${id}`),
  create: (data: Record<string, unknown>)    => api.post('/patients', data),
  update: (id: number, data: Record<string, unknown>) => api.put(`/patients/${id}`, data),
  delete: (id: number)                       => api.delete(`/patients/${id}`),
};

// ── Website Builder ───────────────────────────────────────────────────────────
export const websiteApi = {
  pages:          ()                                        => api.get('/website/pages'),
  getPage:        (slug: string)                            => api.get(`/website/pages/${slug}`),
  savePage:       (data: Record<string, unknown>)           => api.post('/website/pages', data),
  updatePage:     (slug: string, data: Record<string, unknown>) => api.put(`/website/pages/${slug}`, data),
  deletePage:     (slug: string)                            => api.delete(`/website/pages/${slug}`),
  blockTypes:     ()                                        => api.get('/website/block-types'),
  themes:         ()                                        => api.get('/website/themes'),
  settings:       ()                                        => api.get('/website/settings'),
  updateSettings: (data: Record<string, unknown>)           => api.put('/website/settings', data),
  widgetScript:   ()                                        => api.get('/website/widget-script'),
};

// ── Billing ───────────────────────────────────────────────────────────────────
export const billingApi = {
  plans:        ()                                                               => api.get('/billing/plans'),
  subscribe:    (data: { plan_id: number; interval: 'monthly' | 'yearly' })    => api.post('/billing/subscribe', data),
  subscription: ()                                                               => api.get('/billing/subscription'),
  cancel:       ()                                                               => api.post('/billing/cancel-subscription'),
};

// ── Super Admin ───────────────────────────────────────────────────────────────
export const superAdminApi = createApiClient();
superAdminApi.defaults.baseURL = `${API_URL}/super-admin`;

export const tenantsApi = {
  list:         (params?: Record<string, unknown>) => superAdminApi.get('/tenants', { params }),
  get:          (id: string)                       => superAdminApi.get(`/tenants/${id}`),
  create:       (data: Record<string, unknown>)    => superAdminApi.post('/tenants', data),
  suspend:      (id: string, reason: string)       => superAdminApi.put(`/tenants/${id}/suspend`, { reason }),
  restore:      (id: string)                       => superAdminApi.put(`/tenants/${id}/restore`),
  stats:        ()                                 => superAdminApi.get('/stats'),
};
