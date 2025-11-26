"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationPreferencesController = exports.getNotificationPreferencesController = exports.getUnreadCountController = exports.markAllAsReadController = exports.markAsReadController = exports.getNotificationsController = void 0;
const Notification_1 = require("../models/Notification");
const NotificationPreferences_1 = require("../models/NotificationPreferences");
const getNotificationsController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const filters = {
            read: req.query.read !== undefined ? req.query.read === 'true' : undefined,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 50,
            offset: req.query.offset ? parseInt(req.query.offset, 10) : 0
        };
        const notifications = await Notification_1.NotificationModel.findByClinicId(clinicId, filters);
        res.status(200).json({
            success: true,
            data: notifications
        });
    }
    catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getNotificationsController = getNotificationsController;
const markAsReadController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { id } = req.params;
        const notification = await Notification_1.NotificationModel.markAsRead(id, clinicId);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notificação não encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: notification
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.markAsReadController = markAsReadController;
const markAllAsReadController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const notifications = await Notification_1.NotificationModel.markAllAsRead(clinicId);
        res.status(200).json({
            success: true,
            data: notifications,
            message: `${notifications.length} notificação(ões) marcada(s) como lida(s)`
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.markAllAsReadController = markAllAsReadController;
const getUnreadCountController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const count = await Notification_1.NotificationModel.getUnreadCount(clinicId);
        res.status(200).json({
            success: true,
            count: count
        });
    }
    catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getUnreadCountController = getUnreadCountController;
const getNotificationPreferencesController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        let preferences = await NotificationPreferences_1.NotificationPreferencesModel.findByClinicId(clinicId);
        if (!preferences) {
            preferences = await NotificationPreferences_1.NotificationPreferencesModel.updateOrCreate(clinicId, {
                email_enabled: true,
                sms_enabled: false,
                push_enabled: true,
                appointments_enabled: true,
                payments_enabled: true,
                reminders_enabled: true,
                marketing_enabled: false
            });
        }
        res.status(200).json({
            success: true,
            data: preferences
        });
    }
    catch (error) {
        console.error('Error retrieving notification preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getNotificationPreferencesController = getNotificationPreferencesController;
const updateNotificationPreferencesController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const preferences = req.body;
        const updatedPreferences = await NotificationPreferences_1.NotificationPreferencesModel.updateOrCreate(clinicId, preferences);
        res.status(200).json({
            success: true,
            data: updatedPreferences
        });
    }
    catch (error) {
        console.error('Error updating notification preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateNotificationPreferencesController = updateNotificationPreferencesController;
