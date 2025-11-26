"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.findAllServices = exports.findServiceById = exports.createService = void 0;
const database_1 = __importDefault(require("../config/database"));
const createService = async (serviceData) => {
    const result = await database_1.default.query(`INSERT INTO vet_services (name, description, price, duration_minutes)
     VALUES ($1, $2, $3, $4) RETURNING *`, [
        serviceData.name,
        serviceData.description,
        serviceData.price,
        serviceData.duration_minutes
    ]);
    return result.rows[0];
};
exports.createService = createService;
const findServiceById = async (id) => {
    const result = await database_1.default.query('SELECT * FROM vet_services WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findServiceById = findServiceById;
const findAllServices = async () => {
    const result = await database_1.default.query('SELECT * FROM vet_services ORDER BY name ASC');
    return result.rows;
};
exports.findAllServices = findAllServices;
const updateService = async (id, serviceData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;
    Object.entries(serviceData).forEach(([key, value]) => {
        if (value !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });
    if (fields.length === 0) {
        return (0, exports.findServiceById)(id);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const result = await database_1.default.query(`UPDATE vet_services SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    return result.rows[0] || null;
};
exports.updateService = updateService;
const deleteService = async (id) => {
    const result = await database_1.default.query('DELETE FROM vet_services WHERE id = $1', [id]);
    return result.rowCount > 0;
};
exports.deleteService = deleteService;