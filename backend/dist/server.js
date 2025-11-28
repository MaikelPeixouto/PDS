"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const petRoutes_1 = __importDefault(require("./routes/petRoutes"));
const vaccineRoutes_1 = __importDefault(require("./routes/vaccineRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const clinicRoutes_1 = __importDefault(require("./routes/clinicRoutes"));
const clinicServiceRoutes = require('./routes/clinicServiceRoutes');
const clinicAppointmentRoutes = require('./routes/clinicAppointmentRoutes');
const veterinarianRoutes_1 = __importDefault(require("./routes/veterinarianRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173', 'http://localhost:8080'];
        // Allow requests with no origin (like mobile apps or curl requests), allowed origins, and any Vercel preview URL
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'VetFinder API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/pets', petRoutes_1.default);
app.use('/api/vaccines', vaccineRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/clinics', clinicRoutes_1.default);
app.use('/api/clinics', clinicServiceRoutes.default || clinicServiceRoutes);
app.use('/api/clinics/me/appointments', clinicAppointmentRoutes);
app.use('/api/veterinarians', veterinarianRoutes_1.default);
app.use('/api/clinics', notificationRoutes_1.default);
app.use('/api/clinics', reportRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint não encontrado'
    });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const fs = require('fs');
    try {
        fs.writeFileSync('error.log', `[${new Date().toISOString()}] Global Error: ${err.message}\nStack: ${err.stack}\n`);
    } catch (e) {
        console.error('Failed to write to error.log', e);
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    const fs = require('fs');
    try {
        fs.writeFileSync('error.log', `[${new Date().toISOString()}] Uncaught Exception: ${error.message}\nStack: ${error.stack}\n`);
    } catch (e) {
        console.error('Failed to write to error.log', e);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    const fs = require('fs');
    try {
        fs.writeFileSync('error.log', `[${new Date().toISOString()}] Unhandled Rejection: ${reason}\n`);
    } catch (e) {
        console.error('Failed to write to error.log', e);
    }
});

app.listen(PORT, () => {
    console.log(`🚀 VetFinder API server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
exports.default = app;
