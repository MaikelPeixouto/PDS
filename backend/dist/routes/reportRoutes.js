"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get(
    "/me/reports/monthly",
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    reportController_1.getMonthlyReportController
);
router.get(
    "/me/reports/clients",
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    reportController_1.getClientsReportController
);
router.get(
    "/me/reports/financial",
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    reportController_1.getFinancialReportController
);
router.get(
    "/me/reports/custom",
    authMiddleware_1.authenticateToken,
    authMiddleware_1.requireClinicAuth,
    reportController_1.getCustomReportController
);
exports.default = router;
