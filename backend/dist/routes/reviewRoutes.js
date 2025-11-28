"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', [
    authMiddleware_1.authMiddleware,
    (0, express_validator_1.body)('clinicId').isUUID().withMessage('Valid clinic ID is required'),
    (0, express_validator_1.body)('appointmentId').optional({ nullable: true }).isUUID().withMessage('Valid appointment ID is required'),
    (0, express_validator_1.body)('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    (0, express_validator_1.body)('comment').notEmpty().trim().withMessage('Comment is required'),
], reviewController_1.createReviewController);
router.get('/clinics/:clinicId', [
    (0, express_validator_1.param)('clinicId').isUUID().withMessage('Valid clinic ID is required'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
    (0, express_validator_1.query)('offset').optional().isInt({ min: 0 }),
], reviewController_1.getReviewsController);
router.get('/me/:clinicId', [
    authMiddleware_1.authMiddleware,
    (0, express_validator_1.param)('clinicId').isUUID().withMessage('Valid clinic ID is required'),
    (0, express_validator_1.query)('appointmentId').optional().isUUID().withMessage('Valid appointment ID is required'),
], reviewController_1.getUserReviewController);
exports.default = router;
