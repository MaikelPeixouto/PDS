"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const userRegistrationValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres'),
    (0, express_validator_1.body)('firstName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Sobrenome deve ter entre 2 e 100 caracteres'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('pt-BR')
        .withMessage('Telefone inválido'),
    (0, express_validator_1.body)('cpf')
        .optional()
        .isLength({ min: 11, max: 14 })
        .withMessage('CPF inválido')
];
const clinicRegistrationValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres'),
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Nome da clínica deve ter entre 2 e 255 caracteres'),
    (0, express_validator_1.body)('cnpj')
        .isLength({ min: 14, max: 18 })
        .withMessage('CNPJ inválido'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('pt-BR')
        .withMessage('Telefone inválido'),
    (0, express_validator_1.body)('address')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Endereço muito longo'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Descrição muito longa'),
    (0, express_validator_1.body)('hours')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Horário muito longo'),
    (0, express_validator_1.body)('specialties')
        .optional()
        .isArray()
        .withMessage('Especialidades deve ser um array')
];
const loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    (0, express_validator_1.body)('userType')
        .isIn(['user', 'clinic'])
        .withMessage('Tipo de usuário deve ser "user" ou "clinic"')
];
const refreshTokenValidation = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token é obrigatório')
];
const logoutValidation = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token é obrigatório')
];
router.post('/register/user', userRegistrationValidation, authController_1.registerUser);
router.post('/register/clinic', clinicRegistrationValidation, authController_1.registerClinic);
router.post('/login', loginValidation, authController_1.login);
router.post('/refresh', refreshTokenValidation, authController_1.refreshToken);
router.post('/logout', logoutValidation, authController_1.logout);
router.get('/me', authMiddleware_1.authenticateToken, authController_1.getMe);
router.put('/change-password', authMiddleware_1.authenticateToken, authController_1.changePassword);
router.get('/active-sessions', authMiddleware_1.authenticateToken, authController_1.getActiveSessions);
router.delete('/session/:tokenId', authMiddleware_1.authenticateToken, authController_1.endSession);
exports.default = router;
