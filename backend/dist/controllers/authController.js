"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.registerClinic = exports.registerUser = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const Clinic_1 = require("../models/Clinic");
const RefreshToken_1 = require("../models/RefreshToken");
const tokenUtils_1 = require("../utils/tokenUtils");
const registerUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }
        const { email, password, firstName, lastName, phone, cpf } = req.body;
        const trimmedEmail = email.trim();
        if (await User_1.UserModel.emailExists(trimmedEmail)) {
            return res.status(409).json({
                success: false,
                message: 'Email já está em uso'
            });
        }
        const hashedPassword = await tokenUtils_1.TokenUtils.hashPassword(password);
        const user = await User_1.UserModel.create({
            email: trimmedEmail,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            phone,
            cpf
        });
        const tokens = tokenUtils_1.TokenUtils.generateTokens({
            id: user.id,
            email: user.email,
            type: 'user'
        });
        await RefreshToken_1.RefreshTokenModel.create({
            token: tokens.refreshToken,
            user_id: user.id,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name
                },
                tokens
            }
        });
    }
    catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.registerUser = registerUser;
const registerClinic = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }
        const { email, password, name, cnpj, phone, address, description, hours, specialties } = req.body;
        const trimmedEmail = email.trim();
        if (await Clinic_1.ClinicModel.emailExists(trimmedEmail)) {
            return res.status(409).json({
                success: false,
                message: 'Email já está em uso'
            });
        }
        if (await Clinic_1.ClinicModel.cnpjExists(cnpj)) {
            return res.status(409).json({
                success: false,
                message: 'CNPJ já está em uso'
            });
        }
        const passwordHash = await (0, tokenUtils_1.hashPassword)(password);
        const clinicData = {
            email: trimmedEmail,
            password_hash: passwordHash,
            name,
            cnpj,
            phone: phone || undefined,
            address: address || undefined,
            description: description || undefined,
            hours: hours || undefined,
            specialties: specialties || [],
        };
        const clinic = await Clinic_1.ClinicModel.create(clinicData);
        const { accessToken, refreshToken, tokenId } = (0, tokenUtils_1.generateTokenPair)(clinic.id, clinic.email, 'clinic');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await RefreshToken_1.RefreshTokenModel.create({
            token: refreshToken,
            clinic_id: clinic.id,
            expires_at: expiresAt,
        });
        const { password_hash, ...clinicResponse } = clinic;
        res.status(201).json({
            success: true,
            message: 'Clínica criada com sucesso',
            data: {
                clinic: clinicResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        });
    }
    catch (error) {
        console.error('Register clinic error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.registerClinic = registerClinic;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }
        const { email, password, userType } = req.body;
        const trimmedEmail = email.trim();
        let user = null;
        let entityType = userType;
        if (userType === 'user') {
            user = await User_1.UserModel.findByEmail(trimmedEmail);
        }
        else if (userType === 'clinic') {
            user = await Clinic_1.ClinicModel.findByEmail(trimmedEmail);
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Tipo de usuário inválido'
            });
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }
        const isValidPassword = await (0, tokenUtils_1.comparePassword)(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }
        const { accessToken, refreshToken, tokenId } = (0, tokenUtils_1.generateTokenPair)(user.id, user.email, entityType);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await RefreshToken_1.RefreshTokenModel.create({
            token: refreshToken,
            user_id: entityType === 'user' ? user.id : undefined,
            clinic_id: entityType === 'clinic' ? user.id : undefined,
            expires_at: expiresAt,
        });
        const { password_hash, ...userResponse } = user;
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                [entityType]: userResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token não fornecido'
            });
        }
        const payload = (0, tokenUtils_1.verifyRefreshToken)(refreshToken);
        const tokenRecord = await RefreshToken_1.RefreshTokenModel.findByToken(refreshToken);
        if (!tokenRecord || !await RefreshToken_1.RefreshTokenModel.isValid(refreshToken)) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token inválido ou expirado'
            });
        }
        let user = null;
        if (payload.type === 'user') {
            user = await User_1.UserModel.findById(payload.id);
        }
        else if (payload.type === 'clinic') {
            user = await Clinic_1.ClinicModel.findById(payload.id);
        }
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        const { accessToken } = (0, tokenUtils_1.generateTokenPair)(user.id, user.email, payload.type);
        const { password_hash, ...userResponse } = user;
        res.json({
            success: true,
            message: 'Token renovado com sucesso',
            data: {
                [payload.type]: userResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Refresh token inválido'
        });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token não fornecido'
            });
        }
        const deleted = await RefreshToken_1.RefreshTokenModel.deleteByToken(refreshToken);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Refresh token não encontrado'
            });
        }
        res.json({
            success: true,
            message: 'Logout realizado com sucesso'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        if (req.authType === 'user' && req.user) {
            const { password_hash, ...userResponse } = req.user;
            return res.json({
                success: true,
                data: {
                    user: userResponse,
                    type: 'user'
                }
            });
        }
        else if (req.authType === 'clinic' && req.clinic) {
            const { password_hash, ...clinicResponse } = req.clinic;
            return res.json({
                success: true,
                data: {
                    clinic: clinicResponse,
                    type: 'clinic'
                }
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Não autenticado'
            });
        }
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Senha atual e nova senha são obrigatórias'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Nova senha deve ter pelo menos 6 caracteres'
            });
        }
        let userOrClinic;
        if (req.authType === 'user' && req.user) {
            userOrClinic = await User_1.UserModel.findById(req.user.id);
            if (!userOrClinic) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }
            const isValidPassword = await (0, tokenUtils_1.comparePassword)(currentPassword, userOrClinic.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Senha atual incorreta'
                });
            }
            const newPasswordHash = await (0, tokenUtils_1.hashPassword)(newPassword);
            await User_1.UserModel.update(req.user.id, { password_hash: newPasswordHash });
        }
        else if (req.authType === 'clinic' && req.clinic) {
            userOrClinic = await Clinic_1.ClinicModel.findById(req.clinic.id);
            if (!userOrClinic) {
                return res.status(404).json({
                    success: false,
                    message: 'Clínica não encontrada'
                });
            }
            const isValidPassword = await (0, tokenUtils_1.comparePassword)(currentPassword, userOrClinic.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Senha atual incorreta'
                });
            }
            const newPasswordHash = await (0, tokenUtils_1.hashPassword)(newPassword);
            await Clinic_1.ClinicModel.update(req.clinic.id, { password_hash: newPasswordHash });
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Senha alterada com sucesso'
        });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.changePassword = changePassword;
const getActiveSessions = async (req, res) => {
    try {
        let userId = null;
        let clinicId = null;
        if (req.authType === 'user' && req.user) {
            userId = req.user.id;
        }
        else if (req.authType === 'clinic' && req.clinic) {
            clinicId = req.clinic.id;
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const RefreshToken_1 = require("../models/RefreshToken");
        const tokens = userId
            ? await RefreshToken_1.RefreshTokenModel.findByUserId(userId)
            : await RefreshToken_1.RefreshTokenModel.findByClinicId(clinicId);
        const activeTokens = tokens.filter(token => {
            const expiresAt = new Date(token.expires_at);
            return expiresAt > new Date();
        });
        const sessions = activeTokens.map(token => ({
            id: token.id,
            created_at: token.created_at,
            expires_at: token.expires_at,
            device: 'Unknown',
            location: 'Unknown'
        }));
        res.status(200).json({
            success: true,
            data: sessions
        });
    }
    catch (error) {
        console.error('Error retrieving active sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getActiveSessions = getActiveSessions;
const endSession = async (req, res) => {
    try {
        const { tokenId } = req.params;
        if (!tokenId) {
            return res.status(400).json({
                success: false,
                message: 'ID do token é obrigatório'
            });
        }
        const RefreshToken_1 = require("../models/RefreshToken");
        const database_1 = require("../config/database").default;
        const result = await database_1.query('DELETE FROM refresh_tokens WHERE id = $1', [tokenId]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sessão não encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Sessão encerrada com sucesso'
        });
    }
    catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.endSession = endSession;
