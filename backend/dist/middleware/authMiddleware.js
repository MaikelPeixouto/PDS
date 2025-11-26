"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.optionalAuth = exports.requireClinicAuth = exports.requireUserAuth = exports.authenticateToken = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
const User_1 = require("../models/User");
const Clinic_1 = require("../models/Clinic");
const authenticateToken = async (req, res, next) => {
    try {
        const token = (0, tokenUtils_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acesso não fornecido'
            });
        }
        const payload = (0, tokenUtils_1.verifyAccessToken)(token);
        if (payload.type === 'user') {
            const user = await User_1.UserModel.findById(payload.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }
            req.user = user;
            req.authType = 'user';
        }
        else if (payload.type === 'clinic') {
            const clinic = await Clinic_1.ClinicModel.findById(payload.id);
            if (!clinic) {
                return res.status(401).json({
                    success: false,
                    message: 'Clínica não encontrada'
                });
            }
            req.clinic = clinic;
            req.authType = 'clinic';
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Tipo de token inválido'
            });
        }
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireUserAuth = (req, res, next) => {
    if (!req.user || req.authType !== 'user') {
        return res.status(403).json({
            success: false,
            message: 'Acesso restrito a usuários'
        });
    }
    next();
};
exports.requireUserAuth = requireUserAuth;
const requireClinicAuth = (req, res, next) => {
    if (!req.clinic || req.authType !== 'clinic') {
        return res.status(403).json({
            success: false,
            message: 'Acesso restrito a clínicas'
        });
    }
    next();
};
exports.requireClinicAuth = requireClinicAuth;
const optionalAuth = async (req, res, next) => {
    try {
        const token = (0, tokenUtils_1.extractTokenFromHeader)(req.headers.authorization);
        if (token) {
            const payload = (0, tokenUtils_1.verifyAccessToken)(token);
            if (payload.type === 'user') {
                const user = await User_1.UserModel.findById(payload.id);
                if (user) {
                    req.user = user;
                    req.authType = 'user';
                }
            }
            else if (payload.type === 'clinic') {
                const clinic = await Clinic_1.ClinicModel.findById(payload.id);
                if (clinic) {
                    req.clinic = clinic;
                    req.authType = 'clinic';
                }
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
exports.authMiddleware = authenticateToken;
