export interface Veterinarian {
    id: string;
    clinic_id: string;
    first_name: string;
    last_name: string;
    crmv: string;
    specialty?: string;
    email?: string;
    phone?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateVeterinarianData {
    clinic_id: string;
    first_name: string;
    last_name: string;
    crmv: string;
    specialty?: string;
    email?: string;
    phone?: string;
}
export interface UpdateVeterinarianData {
    first_name?: string;
    last_name?: string;
    crmv?: string;
    specialty?: string;
    email?: string;
    phone?: string;
}
export declare const createVeterinarian: (veterinarianData: CreateVeterinarianData) => Promise<Veterinarian>;
export declare const findVeterinarianById: (id: string) => Promise<Veterinarian | null>;
export declare const findVeterinariansByClinicId: (clinicId: string) => Promise<Veterinarian[]>;
export declare const findVeterinarianByCrmv: (crmv: string) => Promise<Veterinarian | null>;
export declare const updateVeterinarian: (id: string, veterinarianData: UpdateVeterinarianData) => Promise<Veterinarian | null>;
export declare const deleteVeterinarian: (id: string) => Promise<boolean>;
//# sourceMappingURL=Veterinarian.d.ts.map