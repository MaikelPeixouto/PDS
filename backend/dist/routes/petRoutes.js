"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const petController_1 = require("../controllers/petController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Pet name is required'),
    (0, express_validator_1.body)('species').notEmpty().withMessage('Species is required'),
    (0, express_validator_1.body)('breed').optional().isString(),
    (0, express_validator_1.body)('age').optional().isString(),
    (0, express_validator_1.body)('weight').optional().isString(),
    (0, express_validator_1.body)('gender').optional().isIn(['Macho', 'Fêmea']),
    (0, express_validator_1.body)('microchip').optional().isString(),
    (0, express_validator_1.body)('image_url').optional().isURL(),
    (0, express_validator_1.body)('status').optional().isString(),
], petController_1.createPetController);
router.get('/', petController_1.getPetsController);
router.get('/:id', petController_1.getPetByIdController);
router.put('/:id', [
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('species').optional().notEmpty(),
    (0, express_validator_1.body)('breed').optional().isString(),
    (0, express_validator_1.body)('age').optional().isString(),
    (0, express_validator_1.body)('weight').optional().isString(),
    (0, express_validator_1.body)('gender').optional().isIn(['Macho', 'Fêmea']),
    (0, express_validator_1.body)('microchip').optional().isString(),
    (0, express_validator_1.body)('image_url').optional().isURL(),
    (0, express_validator_1.body)('status').optional().isString(),
], petController_1.updatePetController);
router.delete('/:id', petController_1.deletePetController);
exports.default = router;