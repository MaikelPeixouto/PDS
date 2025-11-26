"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpcomingVaccines = exports.deleteVaccine = exports.updateVaccine = exports.findVaccinesByPetId = exports.findVaccineById = exports.createVaccine = void 0;
const database_1 = __importDefault(require("../config/database"));
const createVaccine = async (vaccineData) => {
    const result = await database_1.default.query(`INSERT INTO vet_pet_vaccines (pet_id, name, vaccination_date, next_vaccination_date)
     VALUES ($1, $2, $3, $4) RETURNING *`, [
        vaccineData.pet_id,
        vaccineData.name,
        vaccineData.vaccination_date,
        vaccineData.next_vaccination_date
    ]);
    return result.rows[0];
};
exports.createVaccine = createVaccine;
const findVaccineById = async (id) => {
    const result = await database_1.default.query('SELECT * FROM vet_pet_vaccines WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findVaccineById = findVaccineById;
const findVaccinesByPetId = async (petId) => {
    const result = await database_1.default.query('SELECT * FROM vet_pet_vaccines WHERE pet_id = $1 ORDER BY vaccination_date DESC', [petId]);
    return result.rows;
};
exports.findVaccinesByPetId = findVaccinesByPetId;
const updateVaccine = async (id, vaccineData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;
    Object.entries(vaccineData).forEach(([key, value]) => {
        if (value !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });
    if (fields.length === 0) {
        return (0, exports.findVaccineById)(id);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const result = await database_1.default.query(`UPDATE vet_pet_vaccines SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    return result.rows[0] || null;
};
exports.updateVaccine = updateVaccine;
const deleteVaccine = async (id) => {
    const result = await database_1.default.query('DELETE FROM vet_pet_vaccines WHERE id = $1', [id]);
    return result.rowCount > 0;
};
exports.deleteVaccine = deleteVaccine;
const findUpcomingVaccines = async (petId, daysAhead = 30) => {
    const result = await database_1.default.query(`SELECT * FROM vet_pet_vaccines
     WHERE pet_id = $1
     AND next_vaccination_date IS NOT NULL
     AND next_vaccination_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${daysAhead} days'
     ORDER BY next_vaccination_date ASC`, [petId]);
    return result.rows;
};
exports.findUpcomingVaccines = findUpcomingVaccines;