export interface Vaccine {
    id: string;
    pet_id: string;
    name: string;
    vaccination_date: Date;
    next_vaccination_date?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface CreateVaccineData {
    pet_id: string;
    name: string;
    vaccination_date: Date;
    next_vaccination_date?: Date;
}
export interface UpdateVaccineData {
    name?: string;
    vaccination_date?: Date;
    next_vaccination_date?: Date;
}
export declare const createVaccine: (vaccineData: CreateVaccineData) => Promise<Vaccine>;
export declare const findVaccineById: (id: string) => Promise<Vaccine | null>;
export declare const findVaccinesByPetId: (petId: string) => Promise<Vaccine[]>;
export declare const updateVaccine: (id: string, vaccineData: UpdateVaccineData) => Promise<Vaccine | null>;
export declare const deleteVaccine: (id: string) => Promise<boolean>;
export declare const findUpcomingVaccines: (petId: string, daysAhead?: number) => Promise<Vaccine[]>;
//# sourceMappingURL=Vaccine.d.ts.map