"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const vaccineController_1 = require("../controllers/vaccineController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/:petId', [
    (0, express_validator_1.param)('petId').isUUID().withMessage('Invalid pet ID'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Vaccine name is required'),
    (0, express_validator_1.body)('vaccination_date').isISO8601().withMessage('Valid vaccination date is required'),
    (0, express_validator_1.body)('next_vaccination_date').optional().isISO8601().withMessage('Valid next vaccination date is required'),
], vaccineController_1.createVaccineController);
router.get('/:petId', [
    (0, express_validator_1.param)('petId').isUUID().withMessage('Invalid pet ID'),
], vaccineController_1.getVaccinesController);
router.get('/:petId/upcoming', [
    (0, express_validator_1.param)('petId').isUUID().withMessage('Invalid pet ID'),
    (0, express_validator_1.query)('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
], vaccineController_1.getUpcomingVaccinesController);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid vaccine ID'),
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('vaccination_date').optional().isISO8601(),
    (0, express_validator_1.body)('next_vaccination_date').optional().isISO8601(),
], vaccineController_1.updateVaccineController);
router.delete('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid vaccine ID'),
], vaccineController_1.deleteVaccineController);
exports.default = router;