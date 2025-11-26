export interface Clinic {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    cnpj: string;
    phone?: string;
    address?: string;
    description?: string;
    hours?: string;
    rating: number;
    total_reviews: number;
    specialties: string[];
    latitude?: number;
    longitude?: number;
    is_open: boolean;
    photo_url?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateClinicData {
    email: string;
    password_hash: string;
    name: string;
    cnpj: string;
    phone?: string;
    address?: string;
    description?: string;
    hours?: string;
    specialties?: string[];
    latitude?: number;
    longitude?: number;
}
export interface UpdateClinicData {
    name?: string;
    phone?: string;
    address?: string;
    description?: string;
    hours?: string;
    specialties?: string[];
    latitude?: number;
    longitude?: number;
    is_open?: boolean;
    photo_url?: string;
}
export declare class ClinicModel {
    static create(data: CreateClinicData): Promise<Clinic>;
    static findByEmail(email: string): Promise<Clinic | null>;
    static findById(id: string): Promise<Clinic | null>;
    static findByCnpj(cnpj: string): Promise<Clinic | null>;
    static update(id: string, data: UpdateClinicData): Promise<Clinic | null>;
    static delete(id: string): Promise<boolean>;
    static emailExists(email: string): Promise<boolean>;
    static cnpjExists(cnpj: string): Promise<boolean>;
    static findAll(limit?: number, offset?: number): Promise<Clinic[]>;
    static findByLocation(latitude: number, longitude: number, radius?: number): Promise<Clinic[]>;
}
export declare const findClinicById: (id: string) => Promise<Clinic | null>;
export declare const findClinicByEmail: (email: string) => Promise<Clinic | null>;
//# sourceMappingURL=Clinic.d.ts.map