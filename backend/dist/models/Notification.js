"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class NotificationModel {
    static async findByClinicId(clinicId, filters = {}) {
        let query = 'SELECT * FROM clinic_notifications WHERE clinic_id = $1';
        const params = [clinicId];
        let paramCount = 2;
        if (filters.read !== undefined) {
            query += ` AND read = $${paramCount}`;
            params.push(filters.read);
            paramCount++;
        }
        query += ' ORDER BY created_at DESC';
        if (filters.limit) {
            query += ` LIMIT $${paramCount}`;
            params.push(filters.limit);
            paramCount++;
        }
        if (filters.offset) {
            query += ` OFFSET $${paramCount}`;
            params.push(filters.offset);
        }
        const result = await database_1.default.query(query, params);
        return result.rows;
    }
    static async create(notificationData) {
        const { clinic_id, type, title, message, metadata } = notificationData;
        const result = await database_1.default.query(`INSERT INTO clinic_notifications (clinic_id, type, title, message, metadata)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
            clinic_id,
            type,
            title,
            message,
            JSON.stringify(metadata || {})
        ]);
        return result.rows[0];
    }
    static async markAsRead(notificationId, clinicId) {
        const result = await database_1.default.query(`UPDATE clinic_notifications
            SET read = true, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND clinic_id = $2 RETURNING *`, [notificationId, clinicId]);
        return result.rows[0] || null;
    }
    static async markAllAsRead(clinicId) {
        const result = await database_1.default.query(`UPDATE clinic_notifications
            SET read = true, updated_at = CURRENT_TIMESTAMP
            WHERE clinic_id = $1 AND read = false RETURNING *`, [clinicId]);
        return result.rows;
    }
    static async getUnreadCount(clinicId) {
        const result = await database_1.default.query(`SELECT COUNT(*) as count
            FROM clinic_notifications
            WHERE clinic_id = $1 AND read = false`, [clinicId]);
        return parseInt(result.rows[0].count, 10);
    }
}
exports.NotificationModel = NotificationModel;
