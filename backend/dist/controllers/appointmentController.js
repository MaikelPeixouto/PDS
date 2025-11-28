"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentController = exports.updateAppointmentController = exports.getAppointmentByIdController = exports.getAvailableTimeSlotsController = exports.getClinicAppointmentsController = exports.getUserAppointmentsController = exports.createAppointmentController = void 0;
const express_validator_1 = require("express-validator");
const Appointment_1 = require("../models/Appointment");
const Pet_1 = require("../models/Pet");
const Clinic_1 = require("../models/Clinic");
const Service_1 = require("../models/Service");
const Veterinarian_1 = require("../models/Veterinarian");
const User_1 = require("../models/User");
const notificationHelper_1 = require("../utils/notificationHelper");
const createAppointmentController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.error('[createAppointmentController] Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { petId, clinicId, veterinarianId, serviceId, appointmentDate, notes, paymentMethod } = req.body;
        console.log(`[createAppointmentController] Request body:`, { petId, clinicId, veterinarianId, serviceId, appointmentDate, paymentMethod });
        const pet = await (0, Pet_1.findPetById)(petId);
        if (!pet || pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Pet not found or access denied' });
        }
        console.log(`[createAppointmentController] Looking for clinic with ID: ${clinicId} (type: ${typeof clinicId})`);
        const clinic = await (0, Clinic_1.findClinicById)(clinicId);
        console.log(`[createAppointmentController] Clinic found:`, clinic ? { id: clinic.id, name: clinic.name } : 'NOT FOUND');
        if (!clinic) {
            console.error(`[createAppointmentController] Clinic with ID ${clinicId} not found in database`);
            return res.status(404).json({ message: 'Clinic not found' });
        }
        const service = await (0, Service_1.findServiceById)(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        if (veterinarianId) {
            const veterinarian = await (0, Veterinarian_1.findVeterinarianById)(veterinarianId);
            if (!veterinarian || veterinarian.clinic_id !== clinicId) {
                return res.status(404).json({ message: 'Veterinarian not found or does not belong to clinic' });
            }
        }
        const appointmentData = {
            user_id: req.user.id,
            pet_id: petId,
            clinic_id: clinicId,
            veterinarian_id: veterinarianId,
            service_id: serviceId,
            appointment_date: new Date(appointmentDate),
            notes: notes,
            status: 'pending',
            payment_method: paymentMethod || null
        };
        const appointment = await (0, Appointment_1.createAppointment)(appointmentData);
        try {
            const user = await User_1.UserModel.findById(req.user.id);
            const appointmentDateTime = new Date(appointment.appointment_date);
            const formattedDate = appointmentDateTime.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            const userName = user ? `${user.first_name} ${user.last_name}` : 'Cliente';
            const petName = pet.name;
            await (0, notificationHelper_1.createNotification)(clinicId, 'appointment', 'Novo Agendamento', `${userName} agendou consulta para ${petName} em ${formattedDate}`, {
                appointment_id: appointment.id,
                user_id: req.user.id,
                pet_id: petId
            });
        }
        catch (notifError) {
            console.error('Error creating notification:', notifError);
        }
        return res.status(201).json({
            message: 'Appointment created successfully',
            appointment: {
                id: appointment.id,
                pet_id: appointment.pet_id,
                clinic_id: appointment.clinic_id,
                veterinarian_id: appointment.veterinarian_id,
                service_id: appointment.service_id,
                appointment_date: appointment.appointment_date,
                notes: appointment.notes,
                status: appointment.status,
                created_at: appointment.created_at
            }
        });
    }
    catch (error) {
        console.error('Error creating appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createAppointmentController = createAppointmentController;
const getUserAppointmentsController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const appointments = await (0, Appointment_1.findAppointmentsByUserId)(req.user.id);
        res.status(200).json({
            message: 'Appointments retrieved successfully',
            appointments: appointments.map(appointment => ({
                id: appointment.id,
                pet_id: appointment.pet_id,
                user_id: appointment.user_id,
                clinic_id: appointment.clinic_id,
                pet_name: appointment.pet_name,
                pet_species: appointment.pet_species,
                clinic_name: appointment.clinic_name,
                veterinarian_name: appointment.veterinarian_name,
                service_name: appointment.service_name,
                service_price: appointment.service_price,
                service_duration: appointment.service_duration,
                appointment_date: appointment.appointment_date,
                notes: appointment.notes,
                status: appointment.status,
                created_at: appointment.created_at,
                updated_at: appointment.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving appointments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserAppointmentsController = getUserAppointmentsController;
const getClinicAppointmentsController = async (req, res) => {
    if (!req.clinic) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const clinicId = req.clinic.id;
        const appointments = await (0, Appointment_1.findAppointmentsByClinicId)(clinicId);
        res.status(200).json({
            message: 'Appointments retrieved successfully',
            appointments: appointments.map(appointment => ({
                id: appointment.id,
                pet_id: appointment.pet_id,
                user_id: appointment.user_id,
                clinic_id: appointment.clinic_id,
                pet_name: appointment.pet_name,
                pet_species: appointment.pet_species,
                clinic_name: appointment.clinic_name,
                veterinarian_name: appointment.veterinarian_name,
                service_name: appointment.service_name,
                service_price: appointment.service_price,
                service_duration: appointment.service_duration,
                appointment_date: appointment.appointment_date,
                notes: appointment.notes,
                status: appointment.status,
                created_at: appointment.created_at,
                updated_at: appointment.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving appointments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getClinicAppointmentsController = getClinicAppointmentsController;
const getAvailableTimeSlotsController = async (req, res) => {
    try {
        const { clinicId, date, veterinarianId } = req.query;
        if (!clinicId || !date) {
            return res.status(400).json({ message: 'Clinic ID and date are required' });
        }
        const slots = await (0, Appointment_1.findAvailableTimeSlots)(clinicId, new Date(date), veterinarianId);
        res.status(200).json({
            message: 'Available time slots retrieved successfully',
            slots
        });
    }
    catch (error) {
        console.error('Error retrieving time slots:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAvailableTimeSlotsController = getAvailableTimeSlotsController;
const getAppointmentByIdController = async (req, res) => {
    if (!req.user && !req.clinic) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const appointment = await (0, Appointment_1.findAppointmentById)(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (req.user && appointment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.clinic && appointment.clinic_id !== req.clinic.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json({
            message: 'Appointment retrieved successfully',
            appointment: {
                id: appointment.id,
                pet_id: appointment.pet_id,
                user_id: appointment.user_id,
                clinic_id: appointment.clinic_id,
                veterinarian_id: appointment.veterinarian_id,
                service_id: appointment.service_id,
                pet_name: appointment.pet_name,
                pet_species: appointment.pet_species,
                pet_age: appointment.pet_age,
                user_first_name: appointment.user_first_name || (appointment.client_name_display ? appointment.client_name_display.split(' ')[0] : ''),
                user_last_name: appointment.user_last_name || (appointment.client_name_display ? appointment.client_name_display.split(' ').slice(1).join(' ') : ''),
                user_email: appointment.user_email,
                user_phone: appointment.user_phone,
                clinic_name: appointment.clinic_name,
                veterinarian_name: appointment.veterinarian_name,
                service_name: appointment.service_name,
                service_price: appointment.service_price,
                service_duration: appointment.service_duration,
                appointment_date: appointment.appointment_date,
                notes: appointment.notes,
                status: appointment.status,
                created_at: appointment.created_at,
                updated_at: appointment.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error retrieving appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAppointmentByIdController = getAppointmentByIdController;
const updateAppointmentController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user && !req.clinic) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const appointment = await (0, Appointment_1.findAppointmentById)(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (req.user && appointment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.clinic && appointment.clinic_id !== req.clinic.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {
            veterinarian_id: req.body.veterinarianId || req.body.veterinarian_id,
            service_id: req.body.serviceId || req.body.service_id,
            appointment_date: (req.body.appointmentDate || req.body.appointment_date) ? new Date(req.body.appointmentDate || req.body.appointment_date) : undefined,
            notes: req.body.notes,
            status: req.body.status,
            payment_method: req.body.paymentMethod || req.body.payment_method
        };
        const updatedAppointment = await (0, Appointment_1.updateAppointment)(id, updateData);
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (req.body.status === 'confirmed' && appointment.status !== 'confirmed') {
            try {
                const appointmentUser = await User_1.UserModel.findById(appointment.user_id);
                const appointmentPet = await (0, Pet_1.findPetById)(appointment.pet_id);
                const appointmentDate = new Date(updatedAppointment.appointment_date);
                const formattedDate = appointmentDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const userName = appointmentUser ? `${appointmentUser.first_name} ${appointmentUser.last_name}` : 'Cliente';
                const petName = appointmentPet ? appointmentPet.name : 'pet';
                await (0, notificationHelper_1.createNotification)(appointment.clinic_id, 'confirmation', 'Consulta Confirmada', `${userName} confirmou a consulta de ${petName} para ${formattedDate}`, {
                    appointment_id: updatedAppointment.id,
                    user_id: appointment.user_id,
                    pet_id: appointment.pet_id
                });
            }
            catch (notifError) {
                console.error('Error creating notification:', notifError);
            }
        }
        res.status(200).json({
            message: 'Appointment updated successfully',
            appointment: {
                id: updatedAppointment.id,
                pet_id: updatedAppointment.pet_id,
                clinic_id: updatedAppointment.clinic_id,
                veterinarian_id: updatedAppointment.veterinarian_id,
                service_id: updatedAppointment.service_id,
                appointment_date: updatedAppointment.appointment_date,
                notes: updatedAppointment.notes,
                status: updatedAppointment.status,
                created_at: updatedAppointment.created_at,
                updated_at: updatedAppointment.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateAppointmentController = updateAppointmentController;
const deleteAppointmentController = async (req, res) => {
    if (!req.user && !req.clinic) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const appointment = await (0, Appointment_1.findAppointmentById)(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (req.user && appointment.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.clinic && appointment.clinic_id !== req.clinic.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const deleted = await (0, Appointment_1.deleteAppointment)(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteAppointmentController = deleteAppointmentController;
