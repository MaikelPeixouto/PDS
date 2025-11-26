export interface RefreshToken {
    id: string;
    token: string;
    user_id?: string;
    clinic_id?: string;
    expires_at: Date;
    created_at: Date;
}
export interface CreateRefreshTokenData {
    token: string;
    user_id?: string;
    clinic_id?: string;
    expires_at: Date;
}
export declare class RefreshTokenModel {
    static create(data: CreateRefreshTokenData): Promise<RefreshToken>;
    static findByToken(token: string): Promise<RefreshToken | null>;
    static findByUserId(userId: string): Promise<RefreshToken[]>;
    static findByClinicId(clinicId: string): Promise<RefreshToken[]>;
    static deleteByToken(token: string): Promise<boolean>;
    static deleteByUserId(userId: string): Promise<boolean>;
    static deleteByClinicId(clinicId: string): Promise<boolean>;
    static deleteExpired(): Promise<number>;
    static isValid(token: string): Promise<boolean>;
    static getActiveTokensCount(userId?: string, clinicId?: string): Promise<number>;
}
//# sourceMappingURL=RefreshToken.d.ts.map