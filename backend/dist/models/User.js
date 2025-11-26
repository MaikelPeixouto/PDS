"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class UserModel {
    static async create(data) {
        const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, cpf)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [
            data.email,
            data.password_hash,
            data.first_name,
            data.last_name,
            data.phone || null,
            data.cpf || null,
        ];
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });
        if (fields.length === 0) {
            return await this.findById(id);
        }
        values.push(id);
        const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rowCount > 0;
    }
    static async emailExists(email) {
        const query = 'SELECT 1 FROM users WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        return result.rows.length > 0;
    }
    static async cpfExists(cpf) {
        const query = 'SELECT 1 FROM users WHERE cpf = $1';
        const result = await database_1.default.query(query, [cpf]);
        return result.rows.length > 0;
    }
}
exports.UserModel = UserModel;