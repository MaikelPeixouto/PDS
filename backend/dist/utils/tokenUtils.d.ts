export interface TokenPayload {
    id: string;
    email: string;
    type: 'user' | 'clinic';
}
export interface RefreshTokenPayload {
    id: string;
    tokenId: string;
    type: 'user' | 'clinic';
}
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateAccessToken: (payload: TokenPayload) => string;
export declare const generateRefreshToken: (payload: RefreshTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => TokenPayload;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload;
export declare const generateTokenPair: (id: string, email: string, type: "user" | "clinic") => {
    accessToken: string;
    refreshToken: string;
    tokenId: string;
};
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string | null;
//# sourceMappingURL=tokenUtils.d.ts.map