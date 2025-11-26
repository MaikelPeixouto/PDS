"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPetByMicrochip = exports.deletePet = exports.updatePet = exports.findPetsByUserId = exports.findPetById = exports.createPet = void 0;
const database_1 = __importDefault(require("../config/database"));
const createPet = async (petData) => {
    const result = await database_1.default.query(`INSERT INTO vet_pets (user_id, name, species, breed, age, weight, gender, microchip, image_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
        petData.user_id,
        petData.name,
        petData.species,
        petData.breed,
        petData.age,
        petData.weight,
        petData.gender,
        petData.microchip,
        petData.image_url,
        petData.status || 'Saudável'
    ]);
    return result.rows[0];
};
exports.createPet = createPet;
const findPetById = async (id) => {
    const result = await database_1.default.query('SELECT * FROM vet_pets WHERE id = $1', [id]);
    return result.rows[0] || null;
};
exports.findPetById = findPetById;
const findPetsByUserId = async (userId) => {
    const result = await database_1.default.query('SELECT * FROM vet_pets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
};
exports.findPetsByUserId = findPetsByUserId;
const updatePet = async (id, petData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;
    Object.entries(petData).forEach(([key, value]) => {
        if (value !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });
    if (fields.length === 0) {
        return (0, exports.findPetById)(id);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const result = await database_1.default.query(`UPDATE vet_pets SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    return result.rows[0] || null;
};
exports.updatePet = updatePet;
const deletePet = async (id) => {
    const result = await database_1.default.query('DELETE FROM vet_pets WHERE id = $1', [id]);
    return result.rowCount > 0;
};
exports.deletePet = deletePet;
const findPetByMicrochip = async (microchip) => {
    const result = await database_1.default.query('SELECT * FROM vet_pets WHERE microchip = $1', [microchip]);
    return result.rows[0] || null;
};
exports.findPetByMicrochip = findPetByMicrochip;