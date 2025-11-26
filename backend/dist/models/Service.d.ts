export interface Service {
    id: string;
    name: string;
    description?: string;
    price?: number;
    duration_minutes?: number;
    created_at: Date;
    updated_at: Date;
}
export interface CreateServiceData {
    name: string;
    description?: string;
    price?: number;
    duration_minutes?: number;
}
export interface UpdateServiceData {
    name?: string;
    description?: string;
    price?: number;
    duration_minutes?: number;
}
export declare const createService: (serviceData: CreateServiceData) => Promise<Service>;
export declare const findServiceById: (id: string) => Promise<Service | null>;
export declare const findAllServices: () => Promise<Service[]>;
export declare const updateService: (id: string, serviceData: UpdateServiceData) => Promise<Service | null>;
export declare const deleteService: (id: string) => Promise<boolean>;
//# sourceMappingURL=Service.d.ts.map