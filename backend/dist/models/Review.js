"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClinicRating = exports.getReviewByUserAndClinic = exports.getReviewsByClinicId = exports.createReview = void 0;
const database_1 = __importDefault(require("../config/database"));
const createReview = async (clinicId, userId, appointmentId, rating, comment) => {
    const result = await database_1.default.query(`INSERT INTO clinic_reviews (user_id, clinic_id, appointment_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
        userId,
        clinicId,
        appointmentId || null,
        rating,
        comment
    ]);
    await updateClinicRating(clinicId);
    return result.rows[0];
};
exports.createReview = createReview;
const getReviewsByClinicId = async (clinicId, limit = 50, offset = 0) => {
    const result = await database_1.default.query(`SELECT
    r.*,
    u.first_name,
    u.last_name,
    u.avatar
    FROM clinic_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.clinic_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3`, [clinicId, limit, offset]);
    return result.rows;
};
exports.getReviewsByClinicId = getReviewsByClinicId;
const getReviewByUserAndClinic = async (userId, clinicId, appointmentId = null) => {
    let query = `SELECT * FROM clinic_reviews WHERE user_id = $1 AND clinic_id = $2`;
    const params = [userId, clinicId];
    if (appointmentId) {
        query += ` AND appointment_id = $3`;
        params.push(appointmentId);
    }
    query += ` ORDER BY created_at DESC LIMIT 1`;
    const result = await database_1.default.query(query, params);
    return result.rows[0] || null;
};
exports.getReviewByUserAndClinic = getReviewByUserAndClinic;
const updateClinicRating = async (clinicId) => {
    const ratingResult = await database_1.default.query(`SELECT
    COALESCE(AVG(rating), 0) as avg_rating,
    COUNT(*) as total_reviews
    FROM clinic_reviews
    WHERE clinic_id = $1`, [clinicId]);
    const avgRating = parseFloat(ratingResult.rows[0].avg_rating) || 0;
    const totalReviews = parseInt(ratingResult.rows[0].total_reviews) || 0;
    await database_1.default.query(`UPDATE clinics
    SET rating = $1, total_reviews = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3`, [avgRating, totalReviews, clinicId]);
    return { avgRating, totalReviews };
};
exports.updateClinicRating = updateClinicRating;
