"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentDurationModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class AppointmentDurationModel {
    static async findByClinicId(clinicId) {
        const query = 'SELECT * FROM clinic_appointment_durations WHERE clinic_id = $1';
        const result = await database_1.default.query(query, [clinicId]);
        return result.rows;
    }
    static async upsert(clinicId, durations) {
        await database_1.default.query('DELETE FROM clinic_appointment_durations WHERE clinic_id = $1', [clinicId]);
        const values = [];
        const placeholders = [];
        let paramCount = 1;
        for (const duration of durations) {
            placeholders.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2})`);
            values.push(clinicId, duration.appointment_type, duration.duration_minutes);
            paramCount += 3;
        }
        if (placeholders.length === 0) {
            return [];
        }
        const query = `
            INSERT INTO clinic_appointment_durations (clinic_id, appointment_type, duration_minutes)
            VALUES ${placeholders.join(', ')}
            RETURNING *
        `;
        const result = await database_1.default.query(query, values);
        return result.rows;
    }
}
exports.AppointmentDurationModel = AppointmentDurationModel;
