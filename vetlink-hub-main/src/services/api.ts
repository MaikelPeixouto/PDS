const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

let showAuthError: ((message: string) => void) | null = null;

export const setAuthErrorHandler = (handler: (message: string) => void) => {
  showAuthError = handler;
};

const showErrorNotification = (message: string) => {
  if (showAuthError) {
    showAuthError(message);
  } else {
    alert(message);
  }
};

class ApiService {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private async refreshAccessToken(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to refresh token');
        }

        if (data.data?.tokens) {
          localStorage.setItem('accessToken', data.data.tokens.accessToken);
          localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOn401: boolean = true
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && retryOn401 && this.getRefreshToken()) {
          try {
            await this.refreshAccessToken();

            const newToken = this.getAuthToken();
            if (newToken) {
              headers['Authorization'] = `Bearer ${newToken}`;
              const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
                credentials: 'include',
              });

              const retryData = await retryResponse.json();

              if (!retryResponse.ok) {
                if (retryResponse.status === 401) {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  if (window.location.pathname !== '/login') {
                    showErrorNotification('Sua sessão expirou. Por favor, faça login novamente.');
                    window.location.href = '/login';
                  }
                }
                throw new Error(retryData.message || 'Erro na requisição após renovar token');
              }

              return retryData;
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if (window.location.pathname !== '/login') {
              showErrorNotification('Sua sessão expirou. Por favor, faça login novamente.');
              window.location.href = '/login';
            }
            throw new Error('Não foi possível renovar a sessão. Por favor, faça login novamente.');
          }
        } else if (response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (window.location.pathname !== '/login') {
            showErrorNotification('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/login';
          }
        }

        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async registerUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    cpf?: string;
  }) {
    return this.request<{
      user: any;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/register/user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async registerClinic(data: {
    email: string;
    password: string;
    name: string;
    cnpj: string;
    phone?: string;
    address?: string;
    description?: string;
    hours?: string;
    specialties?: string[];
  }) {
    return this.request<{
      clinic: any;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/register/clinic', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string, userType: 'user' | 'clinic') {
    const response = await this.request<{
      user?: any;
      clinic?: any;
      tokens: { accessToken: string; refreshToken: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    }, false);

    if (response.data?.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
    }

    return response;
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getMe() {
    return this.request<{ user?: any; clinic?: any; type: 'user' | 'clinic' }>(
      '/auth/me'
    );
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to refresh token');
    }

    if (data.data?.tokens) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    }

    return data;
  }

  async getPets() {
    const response = await this.request<any>('/pets');
    if ((response as any).pets && Array.isArray((response as any).pets)) {
      return (response as any).pets;
    }
    if ((response as any).data?.pets && Array.isArray((response as any).data.pets)) {
      return (response as any).data.pets;
    }
    return [];
  }

  async getPet(id: string | number) {
    try {
      const response = await this.request<{ pet: any }>(`/pets/${id}`);
      if ((response as any).pet) {
        return (response as any).pet;
      }
      if (response.data?.pet) {
        return response.data.pet;
      }
      return null;
    } catch (error) {
      console.error('Error fetching pet:', error);
      return null;
    }
  }

  async createPet(data: {
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
    gender: string;
    microchip?: string;
    image_url?: string;
    status?: string;
  }) {
    const response = await this.request<{ pet: any }>('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data?.pet;
  }

  async updatePet(id: number, data: Partial<{
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
    gender: string;
    microchip?: string;
    image_url?: string;
    status?: string;
  }>) {
    const response = await this.request<{ pet: any }>(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data?.pet;
  }

  async deletePet(id: number) {
    await this.request<void>(`/pets/${id}`, {
      method: 'DELETE',
    });
  }

  async getVaccines(petId: string | number) {
    const response = await this.request<{ vaccines: any[] }>(`/vaccines/${petId}`);
    if ((response as any).vaccines && Array.isArray((response as any).vaccines)) {
      return (response as any).vaccines;
    }
    if (response.data?.vaccines && Array.isArray(response.data.vaccines)) {
      return response.data.vaccines;
    }
    return [];
  }

  async createVaccine(petId: string | number, data: {
    name: string;
    vaccination_date: string;
    next_vaccination_date?: string;
  }) {
    const response = await this.request<{ vaccine: any }>(`/vaccines/${petId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data?.vaccine;
  }

  async updateVaccine(id: number, data: Partial<{
    name: string;
    vaccination_date: string;
    next_vaccination_date?: string;
  }>) {
    const response = await this.request<{ vaccine: any }>(`/vaccines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data?.vaccine;
  }

  async deleteVaccine(id: number) {
    await this.request<void>(`/vaccines/${id}`, {
      method: 'DELETE',
    });
  }

  async getAppointments(filters?: { clinicId?: string | number; userId?: string | number; date?: string }) {
    if (filters?.userId) {
      const response = await this.request<{ appointments: any[] }>('/appointments/user');
      return (response as any).appointments || response.data?.appointments || [];
    } else if (filters?.clinicId) {
      const response = await this.request<{ appointments: any[] }>('/appointments/clinic');
      return (response as any).appointments || response.data?.appointments || [];
    }
    const response = await this.request<{ appointments: any[] }>('/appointments/user');
    return (response as any).appointments || response.data?.appointments || [];
  }

  async getAppointment(id: string) {
    const response = await this.request<{ appointment: any }>(`/appointments/${id}`);
    return (response as any).appointment || response.data?.appointment;
  }

  async createAppointment(data: {
    petId: string;
    clinicId: string;
    serviceId: string;
    appointmentDate: string;
    veterinarianId?: string;
    notes?: string;
  }) {
    const response = await this.request<{ appointment: any; message?: string }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return (response as any).appointment || response.data?.appointment;
  }

  async updateAppointment(id: string, data: Partial<{
    veterinarianId?: string;
    serviceId?: string;
    appointmentDate?: string;
    notes?: string;
    status?: string;
  }>) {
    const response = await this.request<{ appointment: any }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return (response as any).appointment || response.data?.appointment;
  }

  async deleteAppointment(id: string) {
    await this.request<void>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  async getAvailableTimeSlots(clinicId: string, date: string, veterinarianId?: string) {
    const params = new URLSearchParams({ clinicId, date });
    if (veterinarianId) params.append('veterinarianId', veterinarianId);
    const response = await this.request<{ slots: string[] }>(`/appointments/time-slots?${params.toString()}`);
    return (response as any).slots || response.data?.slots || [];
  }

  async getClinics(filters?: { limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    const response = await this.request<{ data: any[] }>(`/clinics${query ? `?${query}` : ''}`);
    return response.data || [];
  }

  async getCepCoordinates(cep: string) {
    const response = await this.request<{
      latitude?: number;
      longitude?: number;
      address: string;
      city: string;
      state: string;
      cep: string;
      message?: string;
    }>(`/clinics/search/cep/${cep}`);
    return response.data || response;
  }

  async searchClinicsByLocation(latitude: number, longitude: number, radius?: number, limit?: number) {
    const params = new URLSearchParams();
    params.append('lat', latitude.toString());
    params.append('lng', longitude.toString());
    if (radius) params.append('radius', radius.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await this.request<{ data: any[] }>(`/clinics/search/location?${params.toString()}`);
    return response.data || [];
  }

  async searchExternalClinics(latitude: number, longitude: number, radius?: number, limit?: number) {
    const params = new URLSearchParams();
    params.append('lat', latitude.toString());
    params.append('lng', longitude.toString());
    if (radius) params.append('radius', radius.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await this.request<{ data: any[] }>(`/clinics/search/external?${params.toString()}`);
    return response.data || [];
  }

  async getClinic(id: string | number) {
    const response = await this.request<{ data: any }>(`/clinics/${id}`);
    return response.data || response;
  }

  async getClinicStatistics(clinicId: string | number) {
    const response = await this.request<{
      totalAppointments: number;
      activeClients: number;
      averageRating: number;
      totalReviews: number;
      returnRate: number;
    }>(`/clinics/${clinicId}/statistics`);
    return response.data || {
      totalAppointments: 0,
      activeClients: 0,
      averageRating: 0,
      totalReviews: 0,
      returnRate: 0
    };
  }

  async updateClinic(data: {
    name?: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    email?: string;
    description?: string;
    photo_url?: string;
  }) {
    const response = await this.request<{ clinic: any }>('/clinics/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data?.clinic;
  }

  async uploadClinicLogo(file: File): Promise<{ photo_url: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dataUrl = reader.result as string;
          const response = await this.request<{ photo_url: string }>('/clinics/me/logo', {
            method: 'POST',
            body: JSON.stringify({ photo_url: dataUrl }),
          });
          resolve(response.data || { photo_url: dataUrl });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async getOperatingHours() {
    const response = await this.request<Array<{
      id: string;
      clinic_id: string;
      day_of_week: string;
      open_time: string | null;
      close_time: string | null;
      is_open: boolean;
    }>>('/clinics/me/operating-hours');
    return response.data || [];
  }

  async updateOperatingHours(hours: Array<{
    day_of_week: string;
    open_time?: string | null;
    close_time?: string | null;
    is_open?: boolean;
  }>) {
    const response = await this.request<Array<any>>('/clinics/me/operating-hours', {
      method: 'PUT',
      body: JSON.stringify({ hours }),
    });
    return response.data || [];
  }

  async getAppointmentDurations() {
    const response = await this.request<Array<{
      id: string;
      clinic_id: string;
      appointment_type: string;
      duration_minutes: number;
    }>>('/clinics/me/appointment-durations');
    return response.data || [];
  }

  async updateAppointmentDurations(durations: Array<{
    appointment_type: string;
    duration_minutes: number;
  }>) {
    const response = await this.request<Array<any>>('/clinics/me/appointment-durations', {
      method: 'PUT',
      body: JSON.stringify({ durations }),
    });
    return response.data || [];
  }

  async getPaymentMethods() {
    const response = await this.request<Array<{
      id: string;
      clinic_id: string;
      payment_type: string;
      is_enabled: boolean;
    }>>('/clinics/me/payment-methods');
    return response.data || [];
  }

  async updatePaymentMethods(methods: Array<{
    payment_type: string;
    is_enabled: boolean;
  }>) {
    const response = await this.request<Array<any>>('/clinics/me/payment-methods', {
      method: 'PUT',
      body: JSON.stringify({ methods }),
    });
    return response.data || [];
  }

  async createClinicAppointment(data: {
    clientName: string;
    clientPhone: string;
    petName: string;
    petType: string;
    serviceId: string;
    veterinarianId: string;
    date: Date;
    notes?: string;
  }) {
    return this.request<any>('/clinics/me/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBillingInfo() {
    const response = await this.request<{
      pix_key?: string;
      bank_name?: string;
      bank_agency?: string;
      bank_account?: string;
    }>('/clinics/me/billing-info');
    return response.data || {
      pix_key: '',
      bank_name: '',
      bank_agency: '',
      bank_account: ''
    };
  }

  async updateBillingInfo(info: {
    pix_key?: string;
    bank_name?: string;
    bank_agency?: string;
    bank_account?: string;
  }) {
    const response = await this.request<any>('/clinics/me/billing-info', {
      method: 'PUT',
      body: JSON.stringify(info),
    });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.request<void>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response;
  }

  async getActiveSessions() {
    const response = await this.request<Array<{
      id: string;
      created_at: string;
      expires_at: string;
      device: string;
      location: string;
    }>>('/auth/active-sessions');
    return response.data || [];
  }

  async endSession(tokenId: string) {
    const response = await this.request<void>(`/auth/session/${tokenId}`, {
      method: 'DELETE',
    });
    return response;
  }

  async updateTwoFactor(enabled: boolean) {
    const response = await this.request<{ two_factor_enabled: boolean }>('/clinics/me/two-factor', {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
    return response.data;
  }

  async getTeamMembers() {
    const response = await this.request<Array<{
      id: string;
      clinic_id: string;
      user_id?: string;
      email: string;
      name: string;
      role: string;
      permissions: Array<any>;
    }>>('/clinics/me/team');
    return response.data || [];
  }

  async createTeamMember(data: {
    email: string;
    name: string;
    role: string;
    permissions?: Array<any>;
    user_id?: string;
  }) {
    const response = await this.request<any>('/clinics/me/team', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateTeamMember(memberId: string, data: {
    email?: string;
    name?: string;
    role?: string;
  }) {
    const response = await this.request<any>(`/clinics/me/team/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getServices() {
    const response = await this.request<any>('/services');
    if ((response as any).services) {
      return (response as any).services;
    }
    return response.data || [];
  }

  async getService(id: number) {
    const response = await this.request<{ service: any }>(`/services/${id}`);
    return response.data?.service;
  }

  // Clinic Service Management (Per-Clinic Services)
  async getClinicServices() {
    const response = await this.request<{ services: any[] }>('/clinics/me/services');
    return (response as any).services || response.data?.services || [];
  }

  async createClinicService(data: {
    name: string;
    price: number;
    duration_minutes?: number;
    description?: string;
  }) {
    const response = await this.request<{ service: any }>('/clinics/me/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return (response as any).service || response.data?.service;
  }

  async updateClinicService(id: string, data: Partial<{
    name: string;
    price: number;
    duration_minutes: number;
    description: string;
  }>) {
    const response = await this.request<{ service: any }>(`/clinics/me/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return (response as any).service || response.data?.service;
  }

  async deleteClinicService(id: string) {
    await this.request<void>(`/clinics/me/services/${id}`, {
      method: 'DELETE',
    });
  }

  async getVeterinarians(clinicId?: string | number) {
    const endpoint = clinicId ? `/veterinarians?clinicId=${clinicId}` : '/veterinarians';
    const response = await this.request<any>(endpoint);
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }

  async createVeterinarian(data: {
    clinic_id: number;
    first_name: string;
    last_name: string;
    crmv: string;
    specialty: string;
    email?: string;
    phone?: string;
  }) {
    return this.request<any>('/veterinarians', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateVeterinarian(id: number, data: Partial<{
    first_name: string;
    last_name: string;
    crmv: string;
    specialty: string;
    email?: string;
    phone?: string;
  }>) {
    return this.request<any>(`/veterinarians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteVeterinarian(id: number) {
    return this.request<void>(`/veterinarians/${id}`, {
      method: 'DELETE',
    });
  }

  async getNotifications(filters?: { read?: boolean; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filters?.read !== undefined) {
      params.append('read', filters.read.toString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    if (filters?.offset) {
      params.append('offset', filters.offset.toString());
    }
    const queryString = params.toString();
    const url = `/clinics/me/notifications${queryString ? `?${queryString}` : ''}`;
    const response = await this.request<Array<{
      id: string;
      clinic_id: string;
      type: string;
      title: string;
      message: string;
      read: boolean;
      metadata: any;
      created_at: string;
      updated_at: string;
    }>>(url);
    return response.data || [];
  }

  async markNotificationAsRead(id: string) {
    const response = await this.request<any>(`/clinics/me/notifications/${id}/read`, {
      method: 'PUT',
    });
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.request<{ message: string; data: any[] }>('/clinics/me/notifications/read-all', {
      method: 'PUT',
    });
    return response.data;
  }

  async getUnreadCount() {
    const response = await this.request<{ count: number }>('/clinics/me/notifications/unread-count');
    return response.data || { count: 0 };
  }

  async getNotificationPreferences() {
    const response = await this.request<{
      email_enabled: boolean;
      sms_enabled: boolean;
      push_enabled: boolean;
      appointments_enabled: boolean;
      payments_enabled: boolean;
      reminders_enabled: boolean;
      marketing_enabled: boolean;
    }>('/clinics/me/notification-preferences');
    return response.data || {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
      appointments_enabled: true,
      payments_enabled: true,
      reminders_enabled: true,
      marketing_enabled: false,
    };
  }

  async updateNotificationPreferences(preferences: {
    email_enabled?: boolean;
    sms_enabled?: boolean;
    push_enabled?: boolean;
    appointments_enabled?: boolean;
    payments_enabled?: boolean;
    reminders_enabled?: boolean;
    marketing_enabled?: boolean;
  }) {
    const response = await this.request<any>('/clinics/me/notification-preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
    return response.data;
  }

  async getMonthlyReport(year: number, month: number) {
    const response = await this.request<{ data: any }>(`/clinics/me/reports/monthly?year=${year}&month=${month}`);
    return response.data;
  }

  async getClientsReport(search?: string) {
    const url = search
      ? `/clinics/me/reports/clients?search=${encodeURIComponent(search)}`
      : `/clinics/me/reports/clients`;
    const response = await this.request<{ data: any }>(url);
    return response.data;
  }

  async getFinancialReport(year: number, month: number) {
    const response = await this.request<{ data: any }>(`/clinics/me/reports/financial?year=${year}&month=${month}`);
    return response.data;
  }

  async getCustomReport(startDate: Date, endDate: Date, reportTypes: string[]) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      types: reportTypes.join(','),
    });
    const response = await this.request<{ data: any }>(`/clinics/me/reports/custom?${params.toString()}`);
    return response.data;
  }

  async createReview(clinicId: string, appointmentId: string, rating: number, comment: string) {
    const response = await this.request<{ data: any; message?: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        clinicId,
        appointmentId,
        rating,
        comment,
      }),
    });
    return response.data || response;
  }

  async getClinicReviews(clinicId: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    const response = await this.request<{ data: any[] }>(`/reviews/clinics/${clinicId}${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data || [];
  }

  async getUserReview(clinicId: string, appointmentId?: string) {
    const params = new URLSearchParams();
    if (appointmentId) params.append('appointmentId', appointmentId);
    const response = await this.request<{ data: any }>(`/reviews/me/${clinicId}${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data || null;
  }
}

export const api = new ApiService();
export default api;
