"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class RefreshTokenModel {
    static async create(data) {
        const query = `
      INSERT INTO refresh_tokens (token, user_id, clinic_id, expires_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [
            data.token,
            data.user_id || null,
            data.clinic_id || null,
            data.expires_at,
        ];
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByToken(token) {
        const query = 'SELECT * FROM refresh_tokens WHERE token = $1';
        const result = await database_1.default.query(query, [token]);
        return result.rows[0] || null;
    }
    static async findByUserId(userId) {
        const query = 'SELECT * FROM refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await database_1.default.query(query, [userId]);
        return result.rows;
    }
    static async findByClinicId(clinicId) {
        const query = 'SELECT * FROM refresh_tokens WHERE clinic_id = $1 ORDER BY created_at DESC';
        const result = await database_1.default.query(query, [clinicId]);
        return result.rows;
    }
    static async deleteByToken(token) {
        const query = 'DELETE FROM refresh_tokens WHERE token = $1';
        const result = await database_1.default.query(query, [token]);
        return result.rowCount > 0;
    }
    static async deleteByUserId(userId) {
        const query = 'DELETE FROM refresh_tokens WHERE user_id = $1';
        const result = await database_1.default.query(query, [userId]);
        return result.rowCount > 0;
    }
    static async deleteByClinicId(clinicId) {
        const query = 'DELETE FROM refresh_tokens WHERE clinic_id = $1';
        const result = await database_1.default.query(query, [clinicId]);
        return result.rowCount > 0;
    }
    static async deleteExpired() {
        const query = 'DELETE FROM refresh_tokens WHERE expires_at < NOW()';
        const result = await database_1.default.query(query);
        return result.rowCount || 0;
    }
    static async isValid(token) {
        const query = 'SELECT 1 FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()';
        const result = await database_1.default.query(query, [token]);
        return result.rows.length > 0;
    }
    static async getActiveTokensCount(userId, clinicId) {
        let query = 'SELECT COUNT(*) FROM refresh_tokens WHERE expires_at > NOW()';
        const values = [];
        if (userId) {
            query += ' AND user_id = $1';
            values.push(userId);
        }
        else if (clinicId) {
            query += ' AND clinic_id = $1';
            values.push(clinicId);
        }
        const result = await database_1.default.query(query, values);
        return parseInt(result.rows[0].count);
    }
}
exports.RefreshTokenModel = RefreshTokenModel;