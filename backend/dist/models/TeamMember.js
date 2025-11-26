"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class TeamMemberModel {
    static async findByClinicId(clinicId) {
        const query = 'SELECT * FROM clinic_team_members WHERE clinic_id = $1 ORDER BY created_at DESC';
        const result = await database_1.default.query(query, [clinicId]);
        return result.rows;
    }
    static async findById(id) {
        const query = 'SELECT * FROM clinic_team_members WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async create(data) {
        const query = `
            INSERT INTO clinic_team_members (clinic_id, user_id, email, name, role, permissions)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            data.clinic_id,
            data.user_id || null,
            data.email,
            data.name,
            data.role,
            JSON.stringify(data.permissions || [])
        ];
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'permissions') {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(JSON.stringify(value));
                }
                else {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(value);
                }
                paramCount++;
            }
        });
        if (fields.length === 0) {
            return await this.findById(id);
        }
        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);
        const query = `
            UPDATE clinic_team_members
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const query = 'DELETE FROM clinic_team_members WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rowCount > 0;
    }
}
exports.TeamMemberModel = TeamMemberModel;
