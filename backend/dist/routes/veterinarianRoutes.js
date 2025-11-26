"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const veterinarianController_1 = require("../controllers/veterinarianController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', veterinarianController_1.getVeterinariansController);
router.use(authMiddleware_1.authMiddleware);
router.post('/', [
    (0, express_validator_1.body)('first_name').notEmpty().withMessage('Nome é obrigatório'),
    (0, express_validator_1.body)('last_name').notEmpty().withMessage('Sobrenome é obrigatório'),
    (0, express_validator_1.body)('crmv').notEmpty().withMessage('CRMV é obrigatório'),
    (0, express_validator_1.body)('specialty').notEmpty().withMessage('Especialidade é obrigatória'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Email inválido'),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
], veterinarianController_1.createVeterinarianController);
router.put('/:id', [
    (0, express_validator_1.param)('id').notEmpty().withMessage('ID é obrigatório'),
    (0, express_validator_1.body)('first_name').optional().notEmpty(),
    (0, express_validator_1.body)('last_name').optional().notEmpty(),
    (0, express_validator_1.body)('crmv').optional().notEmpty(),
    (0, express_validator_1.body)('specialty').optional().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail(),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('pt-BR'),
], veterinarianController_1.updateVeterinarianController);
router.delete('/:id', [
    (0, express_validator_1.param)('id').notEmpty().withMessage('ID é obrigatório'),
], veterinarianController_1.deleteVeterinarianController);
exports.default = router;
