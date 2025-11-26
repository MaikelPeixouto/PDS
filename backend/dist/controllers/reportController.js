"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomReportController =
    exports.getFinancialReportController =
    exports.getClientsReportController =
    exports.getMonthlyReportController =
        void 0;
const Report_1 = require("../models/Report");
const getMonthlyReportController = async (req, res) => {
    if (!req.clinic) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        if (month < 1 || month > 12) {
            return res
                .status(400)
                .json({ message: "Invalid month. Must be between 1 and 12" });
        }
        const report = await (0, Report_1.getMonthlyReport)(
            req.clinic.id,
            year,
            month
        );
        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Error retrieving monthly report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMonthlyReportController = getMonthlyReportController;
const getClientsReportController = async (req, res) => {
    if (!req.clinic) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const searchTerm = req.query.search || "";
        const report = await (0, Report_1.getClientsReport)(
            req.clinic.id,
            searchTerm
        );
        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Error retrieving clients report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getClientsReportController = getClientsReportController;
const getFinancialReportController = async (req, res) => {
    if (!req.clinic) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        if (month < 1 || month > 12) {
            return res
                .status(400)
                .json({ message: "Invalid month. Must be between 1 and 12" });
        }
        const report = await (0, Report_1.getFinancialReport)(
            req.clinic.id,
            year,
            month
        );
        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Error retrieving financial report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFinancialReportController = getFinancialReportController;
const getCustomReportController = async (req, res) => {
    if (!req.clinic) {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const reportTypes = req.query.types ? req.query.types.split(",") : [];
        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ message: "startDate and endDate are required" });
        }
        if (!Array.isArray(reportTypes) || reportTypes.length === 0) {
            return res
                .status(400)
                .json({
                    message: "At least one report type must be specified",
                });
        }
        const validTypes = [
            "appointments",
            "revenue",
            "clients",
            "services",
            "veterinarians",
            "expenses",
        ];
        const invalidTypes = reportTypes.filter(
            (type) => !validTypes.includes(type)
        );
        if (invalidTypes.length > 0) {
            return res
                .status(400)
                .json({
                    message: `Invalid report types: ${invalidTypes.join(", ")}`,
                });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const report = await (0, Report_1.getCustomReport)(
            req.clinic.id,
            start,
            end,
            reportTypes
        );
        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Error retrieving custom report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCustomReportController = getCustomReportController;
