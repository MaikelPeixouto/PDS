// Clinic type definitions

export interface BaseClinic {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    rating?: number;
    totalReviews?: number;
    distance?: number;
    isRegistered: boolean;
}

export interface RegisteredClinic extends BaseClinic {
    isRegistered: true;
    email: string;
    cnpj: string;
    description?: string;
    hours?: string;
    specialties?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ExternalClinic extends BaseClinic {
    isRegistered: false;
    placeId: string;
    googleMapsUrl: string;
    photoUrl?: string;
    openNow?: boolean;
}

export type Clinic = RegisteredClinic | ExternalClinic;

export interface SearchClinicsParams {
    latitude: number;
    longitude: number;
    radius?: number;
    limit?: number;
}
