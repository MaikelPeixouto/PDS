"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClinicByEmail = exports.findClinicById = exports.ClinicModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class ClinicModel {
    static async create(data) {
        const query = `
      INSERT INTO clinics (email, password_hash, name, cnpj, phone, address, description, hours, specialties, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
        const values = [
            data.email,
            data.password_hash,
            data.name,
            data.cnpj,
            data.phone || null,
            data.address || null,
            data.description || null,
            data.hours || null,
            JSON.stringify(data.specialties || []),
            data.latitude || null,
            data.longitude || null,
        ];
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const query = 'SELECT * FROM clinics WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const query = 'SELECT * FROM clinics WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async findByCnpj(cnpj) {
        const query = 'SELECT * FROM clinics WHERE cnpj = $1';
        const result = await database_1.default.query(query, [cnpj]);
        return result.rows[0] || null;
    }
    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'specialties') {
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
        values.push(id);
        const query = `
      UPDATE clinics
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const query = 'DELETE FROM clinics WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rowCount > 0;
    }
    static async emailExists(email) {
        const query = 'SELECT 1 FROM clinics WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        return result.rows.length > 0;
    }
    static async cnpjExists(cnpj) {
        const query = 'SELECT 1 FROM clinics WHERE cnpj = $1';
        const result = await database_1.default.query(query, [cnpj]);
        return result.rows.length > 0;
    }
    static async findAll(limit = 10, offset = 0, search = '') {
        let query = `
      SELECT * FROM clinics
    `;
        const params = [limit, offset];

        if (search) {
            query += ` WHERE name ILIKE $3`;
            params.push(`%${search}%`);
        }

        query += `
      ORDER BY rating DESC, total_reviews DESC
      LIMIT $1 OFFSET $2
    `;
        const result = await database_1.default.query(query, params);
        return result.rows;
    }
    static async findByLocation(latitude, longitude, radius = 10) {
        const query = `
      SELECT *,
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) *
         cos(radians(longitude) - radians($2)) +
         sin(radians($1)) * sin(radians(latitude)))) AS distance
      FROM clinics
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance < $3
      ORDER BY distance
    `;
        const result = await database_1.default.query(query, [latitude, longitude, radius]);
        return result.rows;
    }
}
exports.ClinicModel = ClinicModel;
const findClinicById = async (id) => {
    const result = await database_1.default.query('SELECT * FROM clinics WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findClinicById = findClinicById;
const findClinicByEmail = async (email) => {
    const result = await database_1.default.query('SELECT * FROM clinics WHERE email = $1', [email]);
    return result.rows[0] || null;
};
exports.findClinicByEmail = findClinicByEmail;
