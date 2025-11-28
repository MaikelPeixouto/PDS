"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReviewController = exports.getReviewsController = exports.createReviewController = void 0;
const express_validator_1 = require("express-validator");
const Review_1 = require("../models/Review");
const Appointment_1 = require("../models/Appointment");
const createReviewController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { clinicId, appointmentId, rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({ message: 'Comment is required' });
        }
        if (appointmentId) {
            const appointment = await (0, Appointment_1.findAppointmentById)(appointmentId);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            if (appointment.user_id !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
            if (appointment.status !== 'completed') {
                return res.status(400).json({ message: 'Can only review completed appointments' });
            }
            if (appointment.clinic_id !== clinicId) {
                return res.status(400).json({ message: 'Appointment does not belong to this clinic' });
            }
            const existingReview = await (0, Review_1.getReviewByUserAndClinic)(req.user.id, clinicId, appointmentId);
            if (existingReview) {
                return res.status(400).json({ message: 'You have already reviewed this appointment' });
            }
        } else {
            // If no appointment is linked, check if user already reviewed this clinic generally (optional constraint, but good for anti-spam)
            // For now, let's allow it but maybe we should check if they have ANY review for this clinic without appointment?
            // Let's stick to the user request: "quero poder fazer uma avaliação da clínica mesmo sem ter um consulta concluída"

            // However, we should probably prevent spamming. Let's check if they already reviewed this clinic recently? 
            // Or just check if they have a review for this clinic that is NOT linked to an appointment?
            // The current unique constraint in DB might be (user_id, clinic_id, appointment_id). 
            // If appointment_id is NULL, the unique constraint might allow multiple NULLs depending on DB.
            // But usually we want 1 review per clinic per user if not per appointment.

            // Let's check if there is already a review by this user for this clinic where appointment_id is NULL
            const existingReview = await (0, Review_1.getReviewByUserAndClinic)(req.user.id, clinicId, null);
            if (existingReview) {
                // If they already reviewed without an appointment, maybe we update it? Or block?
                // For simplicity, let's block and say "You already reviewed this clinic".
                return res.status(400).json({ message: 'You have already reviewed this clinic' });
            }
        }
        const review = await (0, Review_1.createReview)(clinicId, req.user.id, appointmentId || null, rating, comment.trim());
        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: review
        });
    }
    catch (error) {
        console.error('Error creating review:', error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'You have already reviewed this clinic for this appointment' });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating review'
        });
    }
};
exports.createReviewController = createReviewController;
const getReviewsController = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const reviews = await (0, Review_1.getReviewsByClinicId)(clinicId, limit, offset);
        res.status(200).json({
            success: true,
            data: reviews
        });
    }
    catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving reviews'
        });
    }
};
exports.getReviewsController = getReviewsController;
const getUserReviewController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { clinicId } = req.params;
        const appointmentId = req.query.appointmentId || null;
        const review = await (0, Review_1.getReviewByUserAndClinic)(req.user.id, clinicId, appointmentId);
        res.status(200).json({
            success: true,
            data: review
        });
    }
    catch (error) {
        console.error('Error retrieving user review:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user review'
        });
    }
};
exports.getUserReviewController = getUserReviewController;
