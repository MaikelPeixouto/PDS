"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingInfoModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class BillingInfoModel {
    static async findByClinicId(clinicId) {
        const query = 'SELECT * FROM clinic_billing_info WHERE clinic_id = $1';
        const result = await database_1.default.query(query, [clinicId]);
        return result.rows[0] || null;
    }
    static async upsert(clinicId, info) {
        const existing = await this.findByClinicId(clinicId);
        if (existing) {
            const fields = [];
            const values = [];
            let paramCount = 1;
            Object.entries(info).forEach(([key, value]) => {
                if (value !== undefined) {
                    fields.push(`${key} = $${paramCount}`);
                    values.push(value);
                    paramCount++;
                }
            });
            if (fields.length === 0) {
                return existing;
            }
            fields.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(clinicId);
            const query = `
                UPDATE clinic_billing_info
                SET ${fields.join(', ')}
                WHERE clinic_id = $${paramCount}
                RETURNING *
            `;
            const result = await database_1.default.query(query, values);
            return result.rows[0];
        }
        else {
            const query = `
                INSERT INTO clinic_billing_info (clinic_id, pix_key, bank_name, bank_agency, bank_account)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const result = await database_1.default.query(query, [
                clinicId,
                info.pix_key || null,
                info.bank_name || null,
                info.bank_agency || null,
                info.bank_account || null,
            ]);
            return result.rows[0];
        }
    }
}
exports.BillingInfoModel = BillingInfoModel;
