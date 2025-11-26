"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVeterinarianController = exports.updateVeterinarianController = exports.createVeterinarianController = exports.getVeterinariansController = void 0;
const express_validator_1 = require("express-validator");
const Veterinarian_1 = require("../models/Veterinarian");
const getVeterinariansController = async (req, res) => {
    try {
        const clinicId = req.query.clinicId;
        if (clinicId) {
            const veterinarians = await Veterinarian_1.findVeterinariansByClinicId(clinicId);
            return res.status(200).json({
                success: true,
                data: veterinarians
            });
        }
        res.status(200).json({
            success: true,
            data: []
        });
    }
    catch (error) {
        console.error('Error retrieving veterinarians:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getVeterinariansController = getVeterinariansController;
const createVeterinarianController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors.array()
        });
    }
    if (!req.clinic) {
        return res.status(401).json({
            success: false,
            message: 'Apenas clínicas podem criar veterinários'
        });
    }
    try {
        const { first_name, last_name, crmv, specialty, email, phone } = req.body;
        const existingVet = await Veterinarian_1.findVeterinarianByCrmv(crmv);
        if (existingVet) {
            return res.status(409).json({
                success: false,
                message: 'CRMV já está em uso'
            });
        }
        const veterinarianData = {
            clinic_id: req.clinic.id,
            first_name,
            last_name,
            crmv,
            specialty,
            email: email || undefined,
            phone: phone || undefined,
        };
        const veterinarian = await Veterinarian_1.createVeterinarian(veterinarianData);
        res.status(201).json({
            success: true,
            message: 'Veterinário criado com sucesso',
            data: veterinarian
        });
    }
    catch (error) {
        console.error('Error creating veterinarian:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.createVeterinarianController = createVeterinarianController;
const updateVeterinarianController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors.array()
        });
    }
    if (!req.clinic) {
        return res.status(401).json({
            success: false,
            message: 'Apenas clínicas podem atualizar veterinários'
        });
    }
    try {
        const { id } = req.params;
        const veterinarian = await Veterinarian_1.findVeterinarianById(id);
        if (!veterinarian) {
            return res.status(404).json({
                success: false,
                message: 'Veterinário não encontrado'
            });
        }
        if (veterinarian.clinic_id !== req.clinic.id) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }
        const updateData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            crmv: req.body.crmv,
            specialty: req.body.specialty,
            email: req.body.email,
            phone: req.body.phone,
        };
        if (updateData.crmv && updateData.crmv !== veterinarian.crmv) {
            const existingVet = await Veterinarian_1.findVeterinarianByCrmv(updateData.crmv);
            if (existingVet) {
                return res.status(409).json({
                    success: false,
                    message: 'CRMV já está em uso'
                });
            }
        }
        const updatedVeterinarian = await Veterinarian_1.updateVeterinarian(id, updateData);
        if (!updatedVeterinarian) {
            return res.status(404).json({
                success: false,
                message: 'Veterinário não encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Veterinário atualizado com sucesso',
            data: updatedVeterinarian
        });
    }
    catch (error) {
        console.error('Error updating veterinarian:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateVeterinarianController = updateVeterinarianController;
const deleteVeterinarianController = async (req, res) => {
    if (!req.clinic) {
        return res.status(401).json({
            success: false,
            message: 'Apenas clínicas podem excluir veterinários'
        });
    }
    try {
        const { id } = req.params;
        const veterinarian = await Veterinarian_1.findVeterinarianById(id);
        if (!veterinarian) {
            return res.status(404).json({
                success: false,
                message: 'Veterinário não encontrado'
            });
        }
        if (veterinarian.clinic_id !== req.clinic.id) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }
        const deleted = await Veterinarian_1.deleteVeterinarian(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Veterinário não encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Veterinário excluído com sucesso'
        });
    }
    catch (error) {
        console.error('Error deleting veterinarian:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.deleteVeterinarianController = deleteVeterinarianController;
