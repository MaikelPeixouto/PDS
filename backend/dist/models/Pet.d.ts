export interface Pet {
    id: string;
    user_id: string;
    name: string;
    species: string;
    breed?: string;
    age?: string;
    weight?: string;
    gender?: string;
    microchip?: string;
    image_url?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreatePetData {
    user_id: string;
    name: string;
    species: string;
    breed?: string;
    age?: string;
    weight?: string;
    gender?: string;
    microchip?: string;
    image_url?: string;
    status?: string;
}
export interface UpdatePetData {
    name?: string;
    species?: string;
    breed?: string;
    age?: string;
    weight?: string;
    gender?: string;
    microchip?: string;
    image_url?: string;
    status?: string;
}
export declare const createPet: (petData: CreatePetData) => Promise<Pet>;
export declare const findPetById: (id: string) => Promise<Pet | null>;
export declare const findPetsByUserId: (userId: string) => Promise<Pet[]>;
export declare const updatePet: (id: string, petData: UpdatePetData) => Promise<Pet | null>;
export declare const deletePet: (id: string) => Promise<boolean>;
export declare const findPetByMicrochip: (microchip: string) => Promise<Pet | null>;
//# sourceMappingURL=Pet.d.ts.map