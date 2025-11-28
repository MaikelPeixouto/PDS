const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, requireClinicAuth } = require('../middleware/authMiddleware');
const db = require('../config/database').default;

// Create appointment as clinic (for non-registered clients)
router.post(
    '/',
    authenticateToken,
    requireClinicAuth,
    [
        body('clientName').notEmpty().withMessage('Client name is required'),
        body('clientPhone').notEmpty().withMessage('Client phone is required'),
        body('petName').notEmpty().withMessage('Pet name is required'),
        body('petType').notEmpty().withMessage('Pet type is required'),
        body('serviceId').notEmpty().withMessage('Service ID is required'),
        body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
    ],
    async (req, res) => {
        try {
            const clinicId = req.clinic.id;
            const {
                clientName,
                clientPhone,
                petName,
                petType,
                serviceId,
                appointmentDate,
                notes,
                paymentMethod,
                veterinarianId
            } = req.body;



            // Verify service exists
            const serviceResult = await db.query(
                'SELECT id FROM vet_services WHERE id = $1 AND clinic_id = $2',
                [serviceId, clinicId]
            );

            if (serviceResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Service not found'
                });
            }

            // Create appointment
            const query = `
        INSERT INTO vet_appointments (
          clinic_id,
          client_name,
          client_phone,
          pet_name,
          pet_type,
          service_id,
          appointment_date,
          notes,
          payment_method,
          veterinarian_id,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING *
      `;

            const values = [
                clinicId,
                clientName,
                clientPhone,
                petName,
                petType,
                serviceId,
                new Date(appointmentDate),
                notes || null,
                paymentMethod || null,
                veterinarianId || null,
                'pending'
            ];

            const result = await db.query(query, values);
            const appointment = result.rows[0];

            res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                data: appointment
            });

        } catch (error) {
            console.error('[Clinic Appointment] Error:', error);
            const fs = require('fs');
            fs.writeFileSync('error.log', `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n`);
            res.status(500).json({
                success: false,
                message: 'Error creating appointment',
                error: error.message
            });
        }
    }
);

module.exports = router;
