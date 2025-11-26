import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
            clinic?: any;
            authType?: 'user' | 'clinic';
        }
    }
}
export interface AuthenticatedRequest extends Request {
    user?: any;
    clinic?: any;
    authType?: 'user' | 'clinic';
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireUserAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireClinicAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export { authMiddleware };
//# sourceMappingURL=authMiddleware.d.ts.map