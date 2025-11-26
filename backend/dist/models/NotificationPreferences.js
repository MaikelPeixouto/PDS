"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationPreferencesModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class NotificationPreferencesModel {
    static async findByClinicId(clinicId) {
        const result = await database_1.default.query('SELECT * FROM clinic_notification_preferences WHERE clinic_id = $1', [clinicId]);
        return result.rows[0] || null;
    }
    static async updateOrCreate(clinicId, preferences) {
        const { email_enabled, sms_enabled, push_enabled, appointments_enabled, payments_enabled, reminders_enabled, marketing_enabled } = preferences;
        const result = await database_1.default.query(`INSERT INTO clinic_notification_preferences
            (clinic_id, email_enabled, sms_enabled, push_enabled, appointments_enabled, payments_enabled, reminders_enabled, marketing_enabled)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (clinic_id) DO UPDATE SET
                email_enabled = EXCLUDED.email_enabled,
                sms_enabled = EXCLUDED.sms_enabled,
                push_enabled = EXCLUDED.push_enabled,
                appointments_enabled = EXCLUDED.appointments_enabled,
                payments_enabled = EXCLUDED.payments_enabled,
                reminders_enabled = EXCLUDED.reminders_enabled,
                marketing_enabled = EXCLUDED.marketing_enabled,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *`, [
            clinicId,
            email_enabled !== undefined ? email_enabled : true,
            sms_enabled !== undefined ? sms_enabled : false,
            push_enabled !== undefined ? push_enabled : true,
            appointments_enabled !== undefined ? appointments_enabled : true,
            payments_enabled !== undefined ? payments_enabled : true,
            reminders_enabled !== undefined ? reminders_enabled : true,
            marketing_enabled !== undefined ? marketing_enabled : false
        ]);
        return result.rows[0];
    }
}
exports.NotificationPreferencesModel = NotificationPreferencesModel;
