"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatingHoursModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class OperatingHoursModel {
    static async findByClinicId(clinicId) {
        const query = `SELECT * FROM clinic_operating_hours WHERE clinic_id = $1
            ORDER BY CASE day_of_week
                WHEN 'Domingo' THEN 0
                WHEN 'Segunda-feira' THEN 1
                WHEN 'Terça-feira' THEN 2
                WHEN 'Quarta-feira' THEN 3
                WHEN 'Quinta-feira' THEN 4
                WHEN 'Sexta-feira' THEN 5
                WHEN 'Sábado' THEN 6
            END`;
        const result = await database_1.default.query(query, [clinicId]);
        return result.rows;
    }
    static async upsert(clinicId, hours) {
        await database_1.default.query('DELETE FROM clinic_operating_hours WHERE clinic_id = $1', [clinicId]);
        const values = [];
        const placeholders = [];
        let paramCount = 1;
        for (const hour of hours) {
            placeholders.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2}, $${paramCount + 3}, $${paramCount + 4})`);
            values.push(clinicId, hour.day_of_week, hour.open_time || null, hour.close_time || null, hour.is_open !== undefined ? hour.is_open : true);
            paramCount += 5;
        }
        if (placeholders.length === 0) {
            return [];
        }
        const query = `
            INSERT INTO clinic_operating_hours (clinic_id, day_of_week, open_time, close_time, is_open)
            VALUES ${placeholders.join(', ')}
            RETURNING *
        `;
        const result = await database_1.default.query(query, values);
        return result.rows;
    }
}
exports.OperatingHoursModel = OperatingHoursModel;
