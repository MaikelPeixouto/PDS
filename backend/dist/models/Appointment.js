"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAvailableTimeSlots = exports.deleteAppointment = exports.updateAppointment = exports.findAppointmentsByDateRange = exports.findAppointmentsByClinicId = exports.findAppointmentsByUserId = exports.findAppointmentById = exports.createAppointment = void 0;
const database_1 = __importDefault(require("../config/database"));
const createAppointment = async (appointmentData) => {
    const result = await database_1.default.query(`INSERT INTO vet_appointments (user_id, pet_id, clinic_id, veterinarian_id, service_id, appointment_date, notes, status, payment_method)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
        appointmentData.user_id,
        appointmentData.pet_id,
        appointmentData.clinic_id,
        appointmentData.veterinarian_id,
        appointmentData.service_id,
        appointmentData.appointment_date,
        appointmentData.notes,
        appointmentData.status || 'pending',
        appointmentData.payment_method || null
    ]);
    return result.rows[0];
};
exports.createAppointment = createAppointment;
const findAppointmentById = async (id) => {
    const result = await database_1.default.query(`SELECT
    a.*,
    p.name as pet_name,
    p.species as pet_species,
    p.age as pet_age,
    u.first_name as user_first_name,
    u.last_name as user_last_name,
    u.email as user_email,
    u.phone as user_phone,
    c.name as clinic_name,
    CONCAT(v.first_name, ' ', v.last_name) as veterinarian_name,
    s.name as service_name,
    s.price as service_price,
    s.duration_minutes as service_duration
    FROM vet_appointments a
    JOIN vet_pets p ON a.pet_id = p.id
    JOIN users u ON a.user_id = u.id
    JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN vet_veterinarians v ON a.veterinarian_id = v.id
    JOIN vet_services s ON a.service_id = s.id
    WHERE a.id = $1`, [id]);
    return result.rows[0] || null;
};
exports.findAppointmentById = findAppointmentById;
const findAppointmentsByUserId = async (userId) => {
    const result = await database_1.default.query(`SELECT
    a.*,
    p.name as pet_name,
    p.species as pet_species,
    c.name as clinic_name,
    CONCAT(v.first_name, ' ', v.last_name) as veterinarian_name,
    s.name as service_name,
    s.price as service_price,
    s.duration_minutes as service_duration
    FROM vet_appointments a
    JOIN vet_pets p ON a.pet_id = p.id
    JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN vet_veterinarians v ON a.veterinarian_id = v.id
    JOIN vet_services s ON a.service_id = s.id
    WHERE a.user_id = $1
    ORDER BY a.appointment_date DESC`, [userId]);
    return result.rows;
};
exports.findAppointmentsByUserId = findAppointmentsByUserId;
const findAppointmentsByClinicId = async (clinicId) => {
    const result = await database_1.default.query(`SELECT
    a.*,
    COALESCE(p.name, a.pet_name) as pet_name,
    p.species as pet_species,
    COALESCE(u.first_name || ' ' || u.last_name, a.client_name) as user_name,
    a.client_phone,
    c.name as clinic_name,
    CONCAT(v.first_name, ' ', v.last_name) as veterinarian_name,
    s.name as service_name,
    s.price as service_price,
    s.duration_minutes as service_duration
    FROM vet_appointments a
    LEFT JOIN vet_pets p ON a.pet_id = p.id
    LEFT JOIN users u ON a.user_id = u.id
    JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN vet_veterinarians v ON a.veterinarian_id = v.id
    JOIN vet_services s ON a.service_id = s.id
    WHERE a.clinic_id = $1
    ORDER BY a.appointment_date DESC`, [clinicId]);
    return result.rows;
};
exports.findAppointmentsByClinicId = findAppointmentsByClinicId;
const findAppointmentsByDateRange = async (clinicId, startDate, endDate) => {
    const result = await database_1.default.query(`SELECT
      a.*,
      p.name as pet_name,
      p.species as pet_species,
      c.name as clinic_name,
      CONCAT(v.first_name, ' ', v.last_name) as veterinarian_name,
      s.name as service_name,
      s.price as service_price,
      s.duration_minutes as service_duration
    FROM vet_appointments a
    JOIN vet_pets p ON a.pet_id = p.id
    JOIN clinics c ON a.clinic_id = c.id
    LEFT JOIN vet_veterinarians v ON a.veterinarian_id = v.id
    JOIN vet_services s ON a.service_id = s.id
    WHERE a.clinic_id = $1
    AND a.appointment_date BETWEEN $2 AND $3
    ORDER BY a.appointment_date ASC`, [clinicId, startDate, endDate]);
    return result.rows;
};
exports.findAppointmentsByDateRange = findAppointmentsByDateRange;
const updateAppointment = async (id, appointmentData) => {
    const fields = [];
    const values = [];
    let paramCount = 1;
    Object.entries(appointmentData).forEach(([key, value]) => {
        if (value !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
        }
    });
    if (fields.length === 0) {
        return (0, exports.findAppointmentById)(id);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const result = await database_1.default.query(`UPDATE vet_appointments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
    return result.rows[0] || null;
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (id) => {
    const result = await database_1.default.query('DELETE FROM vet_appointments WHERE id = $1', [id]);
    return result.rowCount > 0;
};
exports.deleteAppointment = deleteAppointment;
const findAvailableTimeSlots = async (clinicId, date, veterinarianId) => {
    const OperatingHours_1 = require("./OperatingHours");
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const appointmentDate = new Date(date);
    const dayOfWeek = dayNames[appointmentDate.getDay()];
    console.log(`[findAvailableTimeSlots] Date: ${date}, Day of week: ${dayOfWeek}, Clinic ID: ${clinicId}`);
    const operatingHours = await OperatingHours_1.OperatingHoursModel.findByClinicId(clinicId);
    console.log(`[findAvailableTimeSlots] Operating hours found: ${operatingHours.length}`);
    const dayHours = operatingHours.find((h) => h.day_of_week === dayOfWeek);
    console.log(`[findAvailableTimeSlots] Day hours for ${dayOfWeek}:`, dayHours ? { is_open: dayHours.is_open, open_time: dayHours.open_time, close_time: dayHours.close_time } : 'NOT FOUND');
    if (!dayHours || !dayHours.is_open || !dayHours.open_time || !dayHours.close_time) {
        console.log(`[findAvailableTimeSlots] Clinic is closed on ${dayOfWeek}, returning empty array`);
        return [];
    }
    const [openHour, openMinute] = dayHours.open_time.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close_time.split(':').map(Number);
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    const slots = [];
    let currentTime = openTime;
    while (currentTime < closeTime) {
        const hour = Math.floor(currentTime / 60);
        const minute = currentTime % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
        currentTime += 30;
    }
    const dateStr = appointmentDate.toISOString().split('T')[0];
    const queryParams = veterinarianId
        ? [clinicId, dateStr, veterinarianId]
        : [clinicId, dateStr];
    const existingAppointments = await database_1.default.query(`
        SELECT appointment_date
        FROM vet_appointments
        WHERE clinic_id = $1
        AND DATE(appointment_date) = $2
        AND status != 'cancelled'
        ${veterinarianId ? 'AND veterinarian_id = $3' : ''}
    `, queryParams);
    const occupiedTimes = existingAppointments.rows.map((apt) => {
        const aptDate = new Date(apt.appointment_date);
        return `${aptDate.getHours().toString().padStart(2, '0')}:${aptDate.getMinutes().toString().padStart(2, '0')}`;
    });
    return slots.filter((slot) => !occupiedTimes.includes(slot));
};
exports.findAvailableTimeSlots = findAvailableTimeSlots;
