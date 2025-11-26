"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class PaymentMethodModel {
    static async findByClinicId(clinicId) {
        const query = 'SELECT * FROM clinic_payment_methods WHERE clinic_id = $1';
        const result = await database_1.default.query(query, [clinicId]);
        return result.rows;
    }
    static async upsert(clinicId, methods) {
        await database_1.default.query('DELETE FROM clinic_payment_methods WHERE clinic_id = $1', [clinicId]);
        const values = [];
        const placeholders = [];
        let paramCount = 1;
        for (const method of methods) {
            placeholders.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2})`);
            values.push(clinicId, method.payment_type, method.is_enabled !== undefined ? method.is_enabled : true);
            paramCount += 3;
        }
        if (placeholders.length === 0) {
            return [];
        }
        const query = `
            INSERT INTO clinic_payment_methods (clinic_id, payment_type, is_enabled)
            VALUES ${placeholders.join(', ')}
            RETURNING *
        `;
        const result = await database_1.default.query(query, values);
        return result.rows;
    }
}
exports.PaymentMethodModel = PaymentMethodModel;
