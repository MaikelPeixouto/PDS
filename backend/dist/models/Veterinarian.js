"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVeterinarian = exports.updateVeterinarian = exports.findVeterinarianByCrmv = exports.findVeterinariansByClinicId = exports.findVeterinarianById = exports.createVeterinarian = void 0;
const database_1 = __importDefault(require("../config/database"));
const createVeterinarian = async (veterinarianData) => {
    const result = await database_1.default.query(`INSERT INTO vet_veterinarians (clinic_id, first_name, last_name, crmv, specialty, email, phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [
        veterinarianData.clinic_id,
        veterinarianData.first_name,
        veterinarianData.last_name,
        veterinarianData.crmv,
        veterinarianData.specialty,
        veterinarianData.email,
        veterinarianData.phone
    ]);
    return result.rows[0];
};
exports.createVeterinarian = createVeterinarian;
const findVeterinarianById = async (id) => {
    const result = await database_1.default.query('SELECT * FROM vet_veterinarians WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findVeterinarianById = findVeterinarianById;
const findVeterinariansByClinicId = async (clinicId) => {
    const result = await database_1.default.query('SELECT * FROM vet_veterinarians WHERE clinic_id = $1 ORDER BY first_name ASC', [clinicId]);
    return result.rows;
};
exports.findVeterinariansByClinicId = findVeterinariansByClinicId;
const findVeterinarianByCrmv = async (crmv) => {
    const result = await database_1.default.query('SELECT * FROM vet_veterinarians WHERE crmv = $1', [crmv]);
    return result.rows[0] || null;
};
exports.findVeterinarianByCrmv = findVeterinarianByCrmv;
const updateVeterinarian = async (id, veterinarianData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;
    Object.entries(veterinarianData).forEach(([key, value]) => {
        if (value !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });
    if (fields.length === 0) {
        return (0, exports.findVeterinarianById)(id);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const result = await database_1.default.query(`UPDATE vet_veterinarians SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    return result.rows[0] || null;
};
exports.updateVeterinarian = updateVeterinarian;
const deleteVeterinarian = async (id) => {
    const result = await database_1.default.query('DELETE FROM vet_veterinarians WHERE id = $1', [id]);
    return result.rowCount > 0;
};
exports.deleteVeterinarian = deleteVeterinarian;