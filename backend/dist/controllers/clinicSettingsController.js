"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeamMemberPermissionsController = exports.deleteTeamMemberController = exports.updateTeamMemberController = exports.createTeamMemberController = exports.getTeamMembersController = exports.updateBillingInfoController = exports.getBillingInfoController = exports.updatePaymentMethodsController = exports.getPaymentMethodsController = exports.updateAppointmentDurationsController = exports.getAppointmentDurationsController = exports.updateOperatingHoursController = exports.getOperatingHoursController = void 0;
const OperatingHours_1 = require("../models/OperatingHours");
const AppointmentDuration_1 = require("../models/AppointmentDuration");
const PaymentMethod_1 = require("../models/PaymentMethod");
const BillingInfo_1 = require("../models/BillingInfo");
const TeamMember_1 = require("../models/TeamMember");
const getOperatingHoursController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const hours = await OperatingHours_1.OperatingHoursModel.findByClinicId(clinicId);
        res.status(200).json({
            success: true,
            data: hours
        });
    }
    catch (error) {
        console.error('Error retrieving operating hours:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getOperatingHoursController = getOperatingHoursController;
const updateOperatingHoursController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { hours } = req.body;
        if (!Array.isArray(hours)) {
            return res.status(400).json({
                success: false,
                message: 'Horários devem ser um array'
            });
        }
        const updatedHours = await OperatingHours_1.OperatingHoursModel.upsert(clinicId, hours);
        res.status(200).json({
            success: true,
            message: 'Horários atualizados com sucesso',
            data: updatedHours
        });
    }
    catch (error) {
        console.error('Error updating operating hours:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateOperatingHoursController = updateOperatingHoursController;
const getAppointmentDurationsController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const durations = await AppointmentDuration_1.AppointmentDurationModel.findByClinicId(clinicId);
        res.status(200).json({
            success: true,
            data: durations
        });
    }
    catch (error) {
        console.error('Error retrieving appointment durations:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getAppointmentDurationsController = getAppointmentDurationsController;
const updateAppointmentDurationsController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { durations } = req.body;
        if (!Array.isArray(durations)) {
            return res.status(400).json({
                success: false,
                message: 'Durações devem ser um array'
            });
        }
        const updatedDurations = await AppointmentDuration_1.AppointmentDurationModel.upsert(clinicId, durations);
        res.status(200).json({
            success: true,
            message: 'Durações atualizadas com sucesso',
            data: updatedDurations
        });
    }
    catch (error) {
        console.error('Error updating appointment durations:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateAppointmentDurationsController = updateAppointmentDurationsController;
const getPaymentMethodsController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const methods = await PaymentMethod_1.PaymentMethodModel.findByClinicId(clinicId);
        res.status(200).json({
            success: true,
            data: methods
        });
    }
    catch (error) {
        console.error('Error retrieving payment methods:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getPaymentMethodsController = getPaymentMethodsController;
const updatePaymentMethodsController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { methods } = req.body;
        if (!Array.isArray(methods)) {
            return res.status(400).json({
                success: false,
                message: 'Métodos de pagamento devem ser um array'
            });
        }
        const updatedMethods = await PaymentMethod_1.PaymentMethodModel.upsert(clinicId, methods);
        res.status(200).json({
            success: true,
            message: 'Métodos de pagamento atualizados com sucesso',
            data: updatedMethods
        });
    }
    catch (error) {
        console.error('Error updating payment methods:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updatePaymentMethodsController = updatePaymentMethodsController;
const getBillingInfoController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const info = await BillingInfo_1.BillingInfoModel.findByClinicId(clinicId);
        res.status(200).json({
            success: true,
            data: info || {
                pix_key: '',
                bank_name: '',
                bank_agency: '',
                bank_account: ''
            }
        });
    }
    catch (error) {
        console.error('Error retrieving billing info:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getBillingInfoController = getBillingInfoController;
const updateBillingInfoController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { pix_key, bank_name, bank_agency, bank_account } = req.body;
        const updatedInfo = await BillingInfo_1.BillingInfoModel.upsert(clinicId, {
            pix_key,
            bank_name,
            bank_agency,
            bank_account
        });
        res.status(200).json({
            success: true,
            message: 'Informações de cobrança atualizadas com sucesso',
            data: updatedInfo
        });
    }
    catch (error) {
        console.error('Error updating billing info:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateBillingInfoController = updateBillingInfoController;
const updateTwoFactorController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { enabled } = req.body;
        const Clinic_1 = require("../models/Clinic");
        const updatedClinic = await Clinic_1.ClinicModel.update(clinicId, { two_factor_enabled: enabled !== undefined ? enabled : false });
        if (!updatedClinic) {
            return res.status(404).json({
                success: false,
                message: 'Clínica não encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: `Autenticação em dois fatores ${enabled ? 'ativada' : 'desativada'} com sucesso`,
            data: { two_factor_enabled: updatedClinic.two_factor_enabled }
        });
    }
    catch (error) {
        console.error('Error updating two-factor authentication:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateTwoFactorController = updateTwoFactorController;
const getTeamMembersController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const members = await TeamMember_1.TeamMemberModel.findByClinicId(clinicId);
        const formattedMembers = members.map(member => ({
            ...member,
            permissions: typeof member.permissions === 'string' ? JSON.parse(member.permissions) : member.permissions
        }));
        res.status(200).json({
            success: true,
            data: formattedMembers
        });
    }
    catch (error) {
        console.error('Error retrieving team members:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getTeamMembersController = getTeamMembersController;
const createTeamMemberController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { email, name, role, permissions, user_id } = req.body;
        if (!email || !name || !role) {
            return res.status(400).json({
                success: false,
                message: 'Email, nome e função são obrigatórios'
            });
        }
        const member = await TeamMember_1.TeamMemberModel.create({
            clinic_id: clinicId,
            user_id: user_id || null,
            email,
            name,
            role,
            permissions: permissions || []
        });
        res.status(201).json({
            success: true,
            message: 'Membro da equipe adicionado com sucesso',
            data: {
                ...member,
                permissions: typeof member.permissions === 'string' ? JSON.parse(member.permissions) : member.permissions
            }
        });
    }
    catch (error) {
        console.error('Error creating team member:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.createTeamMemberController = createTeamMemberController;
const updateTeamMemberController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { memberId } = req.params;
        const { email, name, role } = req.body;
        const member = await TeamMember_1.TeamMemberModel.findById(memberId);
        if (!member || member.clinic_id !== clinicId) {
            return res.status(404).json({
                success: false,
                message: 'Membro da equipe não encontrado'
            });
        }
        const updateData = {};
        if (email !== undefined)
            updateData.email = email;
        if (name !== undefined)
            updateData.name = name;
        if (role !== undefined)
            updateData.role = role;
        const updatedMember = await TeamMember_1.TeamMemberModel.update(memberId, updateData);
        res.status(200).json({
            success: true,
            message: 'Membro da equipe atualizado com sucesso',
            data: {
                ...updatedMember,
                permissions: typeof updatedMember.permissions === 'string' ? JSON.parse(updatedMember.permissions) : updatedMember.permissions
            }
        });
    }
    catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateTeamMemberController = updateTeamMemberController;
const deleteTeamMemberController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { memberId } = req.params;
        const member = await TeamMember_1.TeamMemberModel.findById(memberId);
        if (!member || member.clinic_id !== clinicId) {
            return res.status(404).json({
                success: false,
                message: 'Membro da equipe não encontrado'
            });
        }
        await TeamMember_1.TeamMemberModel.delete(memberId);
        res.status(200).json({
            success: true,
            message: 'Membro da equipe removido com sucesso'
        });
    }
    catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.deleteTeamMemberController = deleteTeamMemberController;
const updateTeamMemberPermissionsController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { memberId } = req.params;
        const { permissions } = req.body;
        if (!Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: 'Permissões devem ser um array'
            });
        }
        const member = await TeamMember_1.TeamMemberModel.findById(memberId);
        if (!member || member.clinic_id !== clinicId) {
            return res.status(404).json({
                success: false,
                message: 'Membro da equipe não encontrado'
            });
        }
        const updatedMember = await TeamMember_1.TeamMemberModel.update(memberId, { permissions });
        res.status(200).json({
            success: true,
            message: 'Permissões atualizadas com sucesso',
            data: {
                ...updatedMember,
                permissions: typeof updatedMember.permissions === 'string' ? JSON.parse(updatedMember.permissions) : updatedMember.permissions
            }
        });
    }
    catch (error) {
        console.error('Error updating team member permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateTeamMemberPermissionsController = updateTeamMemberPermissionsController;
