import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

let apiInstance: AxiosInstance | null = null;

export function getApi(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    apiInstance.interceptors.request.use(async (config) => {
      const token    = await SecureStore.getItemAsync('access_token');
      const tenantId = await SecureStore.getItemAsync('tenant_id');
      if (token)    config.headers.Authorization = `Bearer ${token}`;
      if (tenantId) config.headers['X-Tenant-ID'] = tenantId;
      return config;
    });

    apiInstance.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync('access_token');
          // Trigger navigation to login handled by auth store
        }
        return Promise.reject(error);
      }
    );
  }
  return apiInstance;
}

// ── Typed API Methods ─────────────────────────────────────────────────────────
export const authService = {
  login:    (email: string, password: string) => getApi().post('/auth/login', { email, password }),
  register: (data: Record<string, unknown>)   => getApi().post('/auth/register', data),
  me:       ()                                => getApi().get('/auth/me'),
  logout:   ()                                => getApi().post('/auth/logout'),
  updateFcm:(token: string)                   => getApi().put('/auth/fcm-token', { fcm_token: token }),
};

export const appointmentService = {
  list:    (params?: Record<string, unknown>) => getApi().get('/appointments', { params }),
  get:     (id: number)                       => getApi().get(`/appointments/${id}`),
  create:  (data: Record<string, unknown>)    => getApi().post('/appointments', data),
  cancel:  (id: number, reason: string)       => getApi().put(`/appointments/${id}/cancel`, { reason }),
  confirm: (id: number)                       => getApi().put(`/appointments/${id}/confirm`),
  complete:(id: number)                       => getApi().put(`/appointments/${id}/complete`),
  slots:   (doctorId: number, date: string)   => getApi().get('/public/appointment-slots', { params: { doctor_id: doctorId, date } }),
  lockSlot:(data: Record<string, unknown>)    => getApi().post('/appointments/lock-slot', data),
  today:   ()                                 => getApi().get('/appointments/today'),
};

export const doctorService = {
  list:  (params?: Record<string, unknown>) => getApi().get('/public/doctors', { params }),
  get:   (slug: string)                     => getApi().get(`/public/doctors/${slug}`),
  schedule:(id: number, date: string)       => getApi().get('/appointments', { params: { doctor_id: id, date } }),
};

export const patientService = {
  list:   (params?: Record<string, unknown>) => getApi().get('/patients', { params }),
  get:    (id: number)                       => getApi().get(`/patients/${id}`),
  update: (id: number, data: Record<string, unknown>) => getApi().put(`/patients/${id}`, data),
};

export const dashboardService = {
  stats: (start: string, end: string) => getApi().get('/appointments/stats', { params: { start, end } }),
};
