export interface Appointment {
    id: string;
    user_id: string;
    pet_id: string;
    clinic_id: string;
    veterinarian_id?: string;
    service_id: string;
    appointment_date: Date;
    notes?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateAppointmentData {
    user_id: string;
    pet_id: string;
    clinic_id: string;
    veterinarian_id?: string;
    service_id: string;
    appointment_date: Date;
    notes?: string;
    status?: string;
}
export interface UpdateAppointmentData {
    veterinarian_id?: string;
    service_id?: string;
    appointment_date?: Date;
    notes?: string;
    status?: string;
}
export interface AppointmentWithDetails extends Appointment {
    pet_name: string;
    pet_species: string;
    clinic_name: string;
    veterinarian_name?: string;
    service_name: string;
    service_price?: number;
    service_duration?: number;
}
export declare const createAppointment: (appointmentData: CreateAppointmentData) => Promise<Appointment>;
export declare const findAppointmentById: (id: string) => Promise<Appointment | null>;
export declare const findAppointmentsByUserId: (userId: string) => Promise<AppointmentWithDetails[]>;
export declare const findAppointmentsByClinicId: (clinicId: string) => Promise<AppointmentWithDetails[]>;
export declare const findAppointmentsByDateRange: (clinicId: string, startDate: Date, endDate: Date) => Promise<AppointmentWithDetails[]>;
export declare const updateAppointment: (id: string, appointmentData: UpdateAppointmentData) => Promise<Appointment | null>;
export declare const deleteAppointment: (id: string) => Promise<boolean>;
export declare const findAvailableTimeSlots: (clinicId: string, date: Date, veterinarianId?: string) => Promise<string[]>;
//# sourceMappingURL=Appointment.d.ts.map