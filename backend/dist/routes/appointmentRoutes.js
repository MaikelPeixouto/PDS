"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', [
    authMiddleware_1.authMiddleware,
    (0, express_validator_1.body)('petId').isUUID().withMessage('Valid pet ID is required'),
    (0, express_validator_1.body)('clinicId').isUUID().withMessage('Valid clinic ID is required'),
    (0, express_validator_1.body)('serviceId').isUUID().withMessage('Valid service ID is required'),
    (0, express_validator_1.body)('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
    (0, express_validator_1.body)('veterinarianId').optional().isUUID().withMessage('Valid veterinarian ID is required'),
    (0, express_validator_1.body)('notes').optional().isString(),
    (0, express_validator_1.body)('paymentMethod').optional().isIn(['credit_card', 'debit_card', 'cash', 'pix', 'other']).withMessage('Invalid payment method'),
], appointmentController_1.createAppointmentController);
router.get('/user', authMiddleware_1.authMiddleware, appointmentController_1.getUserAppointmentsController);
router.get('/clinic', authMiddleware_1.authMiddleware, appointmentController_1.getClinicAppointmentsController);
router.get('/time-slots', [
    authMiddleware_1.optionalAuth,
    (0, express_validator_1.query)('clinicId').isUUID().withMessage('Valid clinic ID is required'),
    (0, express_validator_1.query)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.query)('veterinarianId').optional().isUUID().withMessage('Valid veterinarian ID is required'),
], appointmentController_1.getAvailableTimeSlotsController);
router.get('/:id', [
    authMiddleware_1.authMiddleware,
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid appointment ID is required'),
], appointmentController_1.getAppointmentByIdController);
router.put('/:id', [
    authMiddleware_1.authMiddleware,
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid appointment ID is required'),
    (0, express_validator_1.body)('veterinarianId').optional().isUUID(),
    (0, express_validator_1.body)('serviceId').optional().isUUID(),
    (0, express_validator_1.body)('appointmentDate').optional().isISO8601(),
    (0, express_validator_1.body)('notes').optional().isString(),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
    (0, express_validator_1.body)('paymentMethod').optional().isIn(['credit_card', 'debit_card', 'cash', 'pix', 'other']).withMessage('Invalid payment method'),
], appointmentController_1.updateAppointmentController);
router.delete('/:id', [
    authMiddleware_1.authMiddleware,
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid appointment ID is required'),
], appointmentController_1.deleteAppointmentController);
exports.default = router;
