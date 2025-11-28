"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();

// GET /api/clinics/me/services - List services for authenticated clinic
router.get('/me/services', [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
], async (req, res) => {
    try {
        const clinicId = req.clinic?.id;
        if (!clinicId) {
            return res.status(401).json({ message: 'Clinic authentication required' });
        }

        const result = await database_1.default.query(
            'SELECT * FROM vet_services WHERE clinic_id = $1 AND is_active = true ORDER BY name ASC',
            [clinicId]
        );

        res.status(200).json({
            message: 'Services retrieved successfully',
            services: result.rows
        });
    } catch (error) {
        console.error('Error retrieving clinic services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/clinics/:clinicId/services - List services for a specific clinic (Public/Tutor)
router.get('/:clinicId/services', async (req, res) => {
    try {
        const { clinicId } = req.params;

        // Validate UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(clinicId)) {
            return res.status(400).json({ message: 'Invalid clinic ID format' });
        }

        const result = await database_1.default.query(
            'SELECT * FROM vet_services WHERE clinic_id = $1 AND is_active = true ORDER BY name ASC',
            [clinicId]
        );

        res.status(200).json({
            message: 'Services retrieved successfully',
            services: result.rows
        });
    } catch (error) {
        console.error('Error retrieving clinic services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/clinics/me/services - Create service for authenticated clinic
router.post('/me/services', [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    (0, express_validator_1.body)('name').notEmpty().withMessage('Service name is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('duration_minutes').optional().isInt().withMessage('Duration must be an integer'),
    (0, express_validator_1.body)('description').optional().isString(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const clinicId = req.clinic?.id;
        if (!clinicId) {
            return res.status(401).json({ message: 'Clinic authentication required' });
        }

        const { name, price, duration_minutes, description } = req.body;

        const result = await database_1.default.query(
            `INSERT INTO vet_services (name, price, duration_minutes, description, clinic_id, is_active)
             VALUES ($1, $2, $3, $4, $5, true)
             RETURNING *`,
            [name, parseFloat(price), duration_minutes || null, description || null, clinicId]
        );

        res.status(201).json({
            message: 'Service created successfully',
            service: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/clinics/me/services/:id - Update service
router.put('/me/services/:id', [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid service ID is required'),
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('price').optional().isNumeric(),
    (0, express_validator_1.body)('duration_minutes').optional().isInt(),
    (0, express_validator_1.body)('description').optional().isString(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const clinicId = req.clinic?.id;
        const { id } = req.params;

        if (!clinicId) {
            return res.status(401).json({ message: 'Clinic authentication required' });
        }

        // Verify service belongs to clinic
        const checkResult = await database_1.default.query(
            'SELECT * FROM vet_services WHERE id = $1 AND clinic_id = $2',
            [id, clinicId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found or access denied' });
        }

        const updates = [];
        const values = [];
        let paramCount = 1;

        const { name, price, duration_minutes, description } = req.body;

        if (name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (price !== undefined) {
            updates.push(`price = $${paramCount++}`);
            values.push(parseFloat(price));
        }
        if (duration_minutes !== undefined) {
            updates.push(`duration_minutes = $${paramCount++}`);
            values.push(duration_minutes);
        }
        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        values.push(id);
        values.push(clinicId);

        const result = await database_1.default.query(
            `UPDATE vet_services SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $${paramCount++} AND clinic_id = $${paramCount}
             RETURNING *`,
            values
        );

        res.status(200).json({
            message: 'Service updated successfully',
            service: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/clinics/me/services/:id - Soft delete service
router.delete('/me/services/:id', [
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid service ID is required'),
], async (req, res) => {
    try {
        const clinicId = req.clinic?.id;
        const { id } = req.params;

        if (!clinicId) {
            return res.status(401).json({ message: 'Clinic authentication required' });
        }

        const result = await database_1.default.query(
            `UPDATE vet_services SET is_active = false, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND clinic_id = $2
             RETURNING *`,
            [id, clinicId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found or access denied' });
        }

        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

exports.default = router;
