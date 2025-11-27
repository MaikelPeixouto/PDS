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
        // Delete existing record
        await database_1.default.query('DELETE FROM clinic_appointment_durations WHERE clinic_id = $1', [clinicId]);

        // durations should be an object like: { standard: 30, followup: 15, emergency: 60 }
        // Or if it's an array with a single object, extract it
        const durationsObj = Array.isArray(durations) ? durations[0] : durations;

        if (!durationsObj) {
            return [];
        }

        const query = `
            INSERT INTO clinic_appointment_durations (clinic_id, standard, followup, emergency)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [
            clinicId,
            durationsObj.standard || 30,
            durationsObj.followup || 15,
            durationsObj.emergency || 60
        ];

        const result = await database_1.default.query(query, values);
        return result.rows;
    }
}
exports.AppointmentDurationModel = AppointmentDurationModel;
