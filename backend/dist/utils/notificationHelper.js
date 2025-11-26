"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const Notification_1 = require("../models/Notification");
const NotificationPreferences_1 = require("../models/NotificationPreferences");
async function createNotification(clinicId, type, title, message, metadata = {}) {
    try {
        const preferences = await NotificationPreferences_1.NotificationPreferencesModel.findByClinicId(clinicId);
        let shouldCreate = true;
        if (preferences) {
            if (type === 'appointment' && !preferences.appointments_enabled) {
                shouldCreate = false;
            }
            else if (type === 'payment' && !preferences.payments_enabled) {
                shouldCreate = false;
            }
            else if (type === 'reminder' && !preferences.reminders_enabled) {
                shouldCreate = false;
            }
            if (type === 'marketing' && !preferences.marketing_enabled) {
                shouldCreate = false;
            }
        }
        if (!preferences) {
            await NotificationPreferences_1.NotificationPreferencesModel.updateOrCreate(clinicId, {
                email_enabled: true,
                sms_enabled: false,
                push_enabled: true,
                appointments_enabled: true,
                payments_enabled: true,
                reminders_enabled: true,
                marketing_enabled: false
            });
        }
        if (shouldCreate) {
            const notification = await Notification_1.NotificationModel.create({
                clinic_id: clinicId,
                type: type,
                title: title,
                message: message,
                metadata: metadata
            });
            return notification;
        }
        return null;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
}
exports.createNotification = createNotification;
