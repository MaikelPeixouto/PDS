"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomReport =
    exports.getFinancialReport =
    exports.getClientsReport =
    exports.getMonthlyReport =
        void 0;
const database_1 = __importDefault(require("../config/database"));
const getMonthlyReport = async (clinicId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const appointmentsResult = await database_1.default.query(
        `
        SELECT COUNT(*) as total
        FROM vet_appointments
        WHERE clinic_id = $1
        AND appointment_date >= $2
        AND appointment_date <= $3
    `,
        [clinicId, startDate, endDate]
    );
    const totalAppointments = parseInt(appointmentsResult.rows[0].total);
    const revenueResult = await database_1.default.query(
        `
        SELECT COALESCE(SUM(s.price), 0) as total_revenue
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
    `,
        [clinicId, startDate, endDate]
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue || 0);
    const newClientsResult = await database_1.default.query(
        `
        SELECT COUNT(DISTINCT u.id) as new_clients
        FROM vet_appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND u.id NOT IN (
            SELECT DISTINCT user_id
            FROM vet_appointments
            WHERE clinic_id = $1
            AND appointment_date < $2
        )
    `,
        [clinicId, startDate, endDate]
    );
    const newClients = parseInt(newClientsResult.rows[0].new_clients || 0);
    const returnRateResult = await database_1.default.query(
        `
        SELECT
            COUNT(DISTINCT CASE
                WHEN EXISTS (
                    SELECT 1 FROM vet_appointments a2
                    WHERE a2.user_id = a.user_id
                    AND a2.clinic_id = $1
                    AND a2.appointment_date < $2
                ) THEN a.user_id
            END) as returning_clients,
            COUNT(DISTINCT a.user_id) as total_clients
        FROM vet_appointments a
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
    `,
        [clinicId, startDate, endDate]
    );
    const returningClients = parseInt(
        returnRateResult.rows[0].returning_clients || 0
    );
    const totalClients = parseInt(returnRateResult.rows[0].total_clients || 0);
    const returnRate =
        totalClients > 0
            ? Math.round((returningClients / totalClients) * 100)
            : 0;
    const appointmentsByTypeResult = await database_1.default.query(
        `
        SELECT
            s.name as type,
            COUNT(a.id) as count,
            COALESCE(SUM(s.price), 0) as revenue
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
        GROUP BY s.name
        ORDER BY count DESC
    `,
        [clinicId, startDate, endDate]
    );
    const appointmentsByType = appointmentsByTypeResult.rows.map((row) => ({
        type: row.type,
        count: parseInt(row.count),
        revenue: parseFloat(row.revenue),
    }));
    const weeklyData = [];
    const weeksInMonth = Math.ceil(endDate.getDate() / 7);
    for (let week = 1; week <= weeksInMonth; week++) {
        const weekStart = new Date(year, month - 1, (week - 1) * 7 + 1);
        const weekEnd = new Date(
            year,
            month - 1,
            Math.min(week * 7, endDate.getDate()),
            23,
            59,
            59
        );
        const weekResult = await database_1.default.query(
            `
            SELECT
                COUNT(a.id) as appointments,
                COALESCE(SUM(s.price), 0) as revenue
            FROM vet_appointments a
            JOIN vet_services s ON a.service_id = s.id
            WHERE a.clinic_id = $1
            AND a.appointment_date >= $2
            AND a.appointment_date <= $3
            AND a.status != 'cancelled'
        `,
            [clinicId, weekStart, weekEnd]
        );
        weeklyData.push({
            week: `Semana ${week}`,
            appointments: parseInt(weekResult.rows[0].appointments || 0),
            revenue: parseFloat(weekResult.rows[0].revenue || 0),
        });
    }
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);
    const prevAppointmentsResult = await database_1.default.query(
        `
        SELECT COUNT(*) as total
        FROM vet_appointments
        WHERE clinic_id = $1
        AND appointment_date >= $2
        AND appointment_date <= $3
    `,
        [clinicId, prevStartDate, prevEndDate]
    );
    const prevAppointments = parseInt(
        prevAppointmentsResult.rows[0].total || 0
    );
    const prevRevenueResult = await database_1.default.query(
        `
        SELECT COALESCE(SUM(s.price), 0) as total_revenue
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
    `,
        [clinicId, prevStartDate, prevEndDate]
    );
    const prevRevenue = parseFloat(
        prevRevenueResult.rows[0].total_revenue || 0
    );
    const prevNewClientsResult = await database_1.default.query(
        `
        SELECT COUNT(DISTINCT u.id) as new_clients
        FROM vet_appointments a
        JOIN users u ON a.user_id = u.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND u.id NOT IN (
            SELECT DISTINCT user_id
            FROM vet_appointments
            WHERE clinic_id = $1
            AND appointment_date < $2
        )
    `,
        [clinicId, prevStartDate, prevEndDate]
    );
    const prevNewClients = parseInt(
        prevNewClientsResult.rows[0].new_clients || 0
    );
    const comparison = {
        appointments:
            prevAppointments > 0
                ? Math.round(
                      ((totalAppointments - prevAppointments) /
                          prevAppointments) *
                          100
                  )
                : 0,
        revenue:
            prevRevenue > 0
                ? parseFloat(
                      (
                          ((totalRevenue - prevRevenue) / prevRevenue) *
                          100
                      ).toFixed(1)
                  )
                : 0,
        clients:
            prevNewClients > 0
                ? Math.round(
                      ((newClients - prevNewClients) / prevNewClients) * 100
                  )
                : 0,
    };
    return {
        totalAppointments,
        totalRevenue,
        newClients,
        returnRate,
        appointmentsByType,
        weeklyData,
        comparison,
    };
};
exports.getMonthlyReport = getMonthlyReport;
const getClientsReport = async (clinicId, searchTerm = "") => {
    let query = `
        SELECT DISTINCT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            COUNT(DISTINCT a.id) as appointments_count,
            COALESCE(SUM(CASE WHEN a.status != 'cancelled' THEN s.price ELSE 0 END), 0) as total_spent,
            MAX(a.appointment_date) as last_visit,
            MIN(a.appointment_date) as first_visit
        FROM users u
        JOIN vet_appointments a ON u.id = a.user_id
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
    `;
    const params = [clinicId];
    if (searchTerm) {
        query += ` AND (u.first_name ILIKE $2 OR u.last_name ILIKE $2 OR u.email ILIKE $2)`;
        params.push(`%${searchTerm}%`);
    }
    query += `
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
        ORDER BY total_spent DESC
    `;
    const clientsResult = await database_1.default.query(query, params);
    const clients = await Promise.all(
        clientsResult.rows.map(async (client) => {
            const petsResult = await database_1.default.query(
                `
            SELECT DISTINCT p.name
            FROM vet_pets p
            JOIN vet_appointments a ON p.id = a.pet_id
            WHERE a.user_id = $1 AND a.clinic_id = $2
            ORDER BY p.name
        `,
                [client.id, clinicId]
            );
            const pets = petsResult.rows.map((row) => row.name);
            const isNew =
                new Date(client.first_visit) >=
                new Date(new Date().setMonth(new Date().getMonth() - 1));
            return {
                id: client.id,
                name: `${client.first_name} ${client.last_name}`,
                email: client.email,
                phone: client.phone,
                pets: pets,
                appointments: parseInt(client.appointments_count),
                lastVisit: client.last_visit
                    ? new Date(client.last_visit).toISOString()
                    : null,
                totalSpent: parseFloat(client.total_spent),
                status: isNew ? "new" : "active",
            };
        })
    );
    const total = clients.length;
    const active = clients.filter((c) => c.status === "active").length;
    const newClients = clients.filter((c) => c.status === "new").length;
    const returning = clients.filter((c) => {
        const lastVisit = c.lastVisit ? new Date(c.lastVisit) : null;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return lastVisit && lastVisit >= oneMonthAgo;
    }).length;
    return {
        total,
        active,
        new: newClients,
        returning,
        clients,
    };
};
exports.getClientsReport = getClientsReport;
const getFinancialReport = async (clinicId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const revenueResult = await database_1.default.query(
        `
        SELECT COALESCE(SUM(s.price), 0) as total_revenue
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
    `,
        [clinicId, startDate, endDate]
    );
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue || 0);
    const paymentMethodResult = await database_1.default.query(
        `
        SELECT
            COALESCE(a.payment_method, 'other') as method,
            COALESCE(SUM(s.price), 0) as amount
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
        GROUP BY a.payment_method
    `,
        [clinicId, startDate, endDate]
    );
    const revenueByPaymentMethod = paymentMethodResult.rows.map((row) => {
        const methodNames = {
            credit_card: "Cartão de Crédito",
            debit_card: "Cartão de Débito",
            cash: "Dinheiro",
            pix: "PIX",
            other: "Outros",
        };
        return {
            method: methodNames[row.method] || "Outros",
            amount: parseFloat(row.amount),
            percentage:
                totalRevenue > 0
                    ? parseFloat(((row.amount / totalRevenue) * 100).toFixed(1))
                    : 0,
        };
    });
    const dailyRevenueResult = await database_1.default.query(
        `
        SELECT
            DATE(a.appointment_date) as date,
            COALESCE(SUM(s.price), 0) as revenue
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
        GROUP BY DATE(a.appointment_date)
        ORDER BY DATE(a.appointment_date) DESC
        LIMIT 7
    `,
        [clinicId, startDate, endDate]
    );
    const dailyRevenue = dailyRevenueResult.rows.map((row) => ({
        date: new Date(row.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        }),
        revenue: parseFloat(row.revenue),
    }));
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);
    const prevRevenueResult = await database_1.default.query(
        `
        SELECT COALESCE(SUM(s.price), 0) as total_revenue
        FROM vet_appointments a
        JOIN vet_services s ON a.service_id = s.id
        WHERE a.clinic_id = $1
        AND a.appointment_date >= $2
        AND a.appointment_date <= $3
        AND a.status != 'cancelled'
    `,
        [clinicId, prevStartDate, prevEndDate]
    );
    const prevRevenue = parseFloat(
        prevRevenueResult.rows[0].total_revenue || 0
    );
    const comparison = {
        revenue:
            prevRevenue > 0
                ? parseFloat(
                      (
                          ((totalRevenue - prevRevenue) / prevRevenue) *
                          100
                      ).toFixed(1)
                  )
                : 0,
    };
    return {
        totalRevenue,
        revenueByPaymentMethod,
        dailyRevenue,
        comparison,
    };
};
exports.getFinancialReport = getFinancialReport;
const getCustomReport = async (clinicId, startDate, endDate, reportTypes) => {
    const report = {};
    if (reportTypes.includes("appointments")) {
        const appointmentsResult = await database_1.default.query(
            `
            SELECT
                a.id,
                a.appointment_date,
                TO_CHAR(a.appointment_date, 'HH24:MI') as appointment_time,
                a.status,
                a.payment_method,
                u.first_name || ' ' || u.last_name as client_name,
                u.email as client_email,
                u.phone as client_phone,
                p.name as pet_name,
                s.name as service_name,
                s.price as service_price,
                v.first_name || ' ' || v.last_name as veterinarian_name
            FROM vet_appointments a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN vet_pets p ON a.pet_id = p.id
            JOIN vet_services s ON a.service_id = s.id
            LEFT JOIN vet_veterinarians v ON a.veterinarian_id = v.id
            WHERE a.clinic_id = $1
            AND a.appointment_date >= $2
            AND a.appointment_date <= $3
            ORDER BY a.appointment_date DESC
        `,
            [clinicId, startDate, endDate]
        );
        report.appointments = appointmentsResult.rows.map((row) => ({
            id: row.id,
            date: new Date(row.appointment_date).toISOString(),
            time: row.appointment_time,
            status: row.status,
            paymentMethod: row.payment_method,
            clientName: row.client_name,
            clientEmail: row.client_email,
            clientPhone: row.client_phone,
            petName: row.pet_name,
            serviceName: row.service_name,
            servicePrice: parseFloat(row.service_price || 0),
            veterinarianName: row.veterinarian_name,
        }));
    }
    if (reportTypes.includes("revenue")) {
        const revenueResult = await database_1.default.query(
            `
            SELECT
                COALESCE(SUM(s.price), 0) as total_revenue,
                COUNT(a.id) as total_appointments,
                COUNT(DISTINCT a.user_id) as unique_clients
            FROM vet_appointments a
            JOIN vet_services s ON a.service_id = s.id
            WHERE a.clinic_id = $1
            AND a.appointment_date >= $2
            AND a.appointment_date <= $3
            AND a.status != 'cancelled'
        `,
            [clinicId, startDate, endDate]
        );
        const revenueData = revenueResult.rows[0];
        const paymentMethodResult = await database_1.default.query(
            `
            SELECT
                COALESCE(a.payment_method, 'unspecified') as method,
                COALESCE(SUM(s.price), 0) as amount,
                COUNT(a.id) as count
            FROM vet_appointments a
            JOIN vet_services s ON a.service_id = s.id
            WHERE a.clinic_id = $1
            AND a.appointment_date >= $2
            AND a.appointment_date <= $3
            AND a.status != 'cancelled'
            GROUP BY a.payment_method
        `,
            [clinicId, startDate, endDate]
        );
        const methodNames = {
            credit_card: "Cartão de Crédito",
            debit_card: "Cartão de Débito",
            cash: "Dinheiro",
            pix: "PIX",
            unspecified: "Não especificado",
        };
        report.revenue = {
            totalRevenue: parseFloat(revenueData.total_revenue || 0),
            totalAppointments: parseInt(revenueData.total_appointments || 0),
            uniqueClients: parseInt(revenueData.unique_clients || 0),
            byPaymentMethod: paymentMethodResult.rows.map((row) => ({
                method: methodNames[row.method] || "Outros",
                amount: parseFloat(row.amount),
                count: parseInt(row.count),
                percentage:
                    parseFloat(revenueData.total_revenue) > 0
                        ? parseFloat(
                              (
                                  (row.amount /
                                      parseFloat(revenueData.total_revenue)) *
                                  100
                              ).toFixed(1)
                          )
                        : 0,
            })),
        };
    }
    if (reportTypes.includes("clients")) {
        const clientsResult = await database_1.default.query(
            `
            SELECT DISTINCT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                COUNT(DISTINCT a.id) as appointments_count,
                COALESCE(SUM(CASE WHEN a.status != 'cancelled' THEN s.price ELSE 0 END), 0) as total_spent,
                MAX(a.appointment_date) as last_visit,
                MIN(a.appointment_date) as first_visit
            FROM users u
            JOIN vet_appointments a ON u.id = a.user_id
            JOIN vet_services s ON a.service_id = s.id
            WHERE a.clinic_id = $1
            AND a.appointment_date >= $2
            AND a.appointment_date <= $3
            GROUP BY u.id, u.first_name, u.last_name, u.email, u.phone
            ORDER BY total_spent DESC
        `,
            [clinicId, startDate, endDate]
        );
        const clients = await Promise.all(
            clientsResult.rows.map(async (client) => {
                const petsResult = await database_1.default.query(
                    `
                SELECT DISTINCT p.name
                FROM vet_pets p
                JOIN vet_appointments a ON p.id = a.pet_id
                WHERE a.user_id = $1 AND a.clinic_id = $2
                ORDER BY p.name
            `,
                    [client.id, clinicId]
                );
                const pets = petsResult.rows.map((row) => row.name);
                return {
                    id: client.id,
                    name: `${client.first_name} ${client.last_name}`,
                    email: client.email,
                    phone: client.phone,
                    pets: pets,
                    appointments: parseInt(client.appointments_count),
                    lastVisit: client.last_visit
                        ? new Date(client.last_visit).toISOString()
                        : null,
                    firstVisit: client.first_visit
                        ? new Date(client.first_visit).toISOString()
                        : null,
                    totalSpent: parseFloat(client.total_spent),
                };
            })
        );
        report.clients = {
            total: clients.length,
            clients: clients,
        };
    }
    if (reportTypes.includes("services")) {
        const servicesResult = await database_1.default.query(
            `
            SELECT
                s.id,
                s.name,
                s.price,
                COUNT(a.id) as appointments_count,
                COALESCE(SUM(CASE WHEN a.status != 'cancelled' THEN s.price ELSE 0 END), 0) as total_revenue,
                AVG(CASE WHEN a.status != 'cancelled' THEN s.price ELSE NULL END) as avg_price
            FROM vet_services s
            LEFT JOIN vet_appointments a ON s.id = a.service_id
                AND a.clinic_id = $1
                AND a.appointment_date >= $2
                AND a.appointment_date <= $3
            GROUP BY s.id, s.name, s.price
            HAVING COUNT(a.id) > 0
            ORDER BY appointments_count DESC
        `,
            [clinicId, startDate, endDate]
        );
        report.services = servicesResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
            price: parseFloat(row.price || 0),
            appointmentsCount: parseInt(row.appointments_count || 0),
            totalRevenue: parseFloat(row.total_revenue || 0),
            avgPrice: parseFloat(row.avg_price || 0),
        }));
    }
    if (reportTypes.includes("veterinarians")) {
        const veterinariansResult = await database_1.default.query(
            `
            SELECT
                v.id,
                v.first_name || ' ' || v.last_name as name,
                COUNT(a.id) as appointments_count,
                COALESCE(SUM(CASE WHEN a.status != 'cancelled' THEN s.price ELSE 0 END), 0) as total_revenue,
                COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_count,
                COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled_count
            FROM vet_veterinarians v
            LEFT JOIN vet_appointments a ON v.id = a.veterinarian_id
                AND a.clinic_id = $1
                AND a.appointment_date >= $2
                AND a.appointment_date <= $3
            LEFT JOIN vet_services s ON a.service_id = s.id
            WHERE v.clinic_id = $1
            GROUP BY v.id, v.first_name, v.last_name
            HAVING COUNT(a.id) > 0
            ORDER BY appointments_count DESC
        `,
            [clinicId, startDate, endDate]
        );
        report.veterinarians = veterinariansResult.rows.map((row) => ({
            id: row.id,
            name: row.name,
            appointmentsCount: parseInt(row.appointments_count || 0),
            totalRevenue: parseFloat(row.total_revenue || 0),
            completedCount: parseInt(row.completed_count || 0),
            cancelledCount: parseInt(row.cancelled_count || 0),
            completionRate:
                parseInt(row.appointments_count) > 0
                    ? Math.round(
                          (parseInt(row.completed_count) /
                              parseInt(row.appointments_count)) *
                              100
                      )
                    : 0,
        }));
    }
    if (reportTypes.includes("expenses")) {
        report.expenses = {
            total: 0,
            expenses: [],
        };
    }
    return report;
};
exports.getCustomReport = getCustomReport;
