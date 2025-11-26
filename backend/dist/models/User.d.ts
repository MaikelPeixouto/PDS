export interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    cpf?: string;
    profile_public: boolean;
    show_email: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserData {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    cpf?: string;
}
export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    phone?: string;
    cpf?: string;
    profile_public?: boolean;
    show_email?: boolean;
}
export declare class UserModel {
    static create(data: CreateUserData): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: string): Promise<User | null>;
    static update(id: string, data: UpdateUserData): Promise<User | null>;
    static delete(id: string): Promise<boolean>;
    static emailExists(email: string): Promise<boolean>;
    static cpfExists(cpf: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map