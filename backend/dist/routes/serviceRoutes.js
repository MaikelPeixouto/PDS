"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Service_1 = require("../models/Service");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const services = await (0, Service_1.findAllServices)();
        res.status(200).json({
            message: 'Services retrieved successfully',
            services: services.map(service => ({
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price,
                duration_minutes: service.duration_minutes,
                created_at: service.created_at,
                updated_at: service.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid service ID is required'),
], async (req, res) => {
    try {
        const { id } = req.params;
        const service = await (0, Service_1.findServiceById)(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({
            message: 'Service retrieved successfully',
            service: {
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price,
                duration_minutes: service.duration_minutes,
                created_at: service.created_at,
                updated_at: service.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error retrieving service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Service name is required'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('price').optional().isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('duration_minutes').optional().isInt().withMessage('Duration must be an integer'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const serviceData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price ? parseFloat(req.body.price) : undefined,
            duration_minutes: req.body.duration_minutes ? parseInt(req.body.duration_minutes) : undefined
        };
        const service = await (0, Service_1.createService)(serviceData);
        res.status(201).json({
            message: 'Service created successfully',
            service: {
                id: service.id,
                name: service.name,
                description: service.description,
                price: service.price,
                duration_minutes: service.duration_minutes,
                created_at: service.created_at
            }
        });
    }
    catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid service ID is required'),
    (0, express_validator_1.body)('name').optional().notEmpty(),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('price').optional().isNumeric(),
    (0, express_validator_1.body)('duration_minutes').optional().isInt(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const service = await (0, Service_1.findServiceById)(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price ? parseFloat(req.body.price) : undefined,
            duration_minutes: req.body.duration_minutes ? parseInt(req.body.duration_minutes) : undefined
        };
        const updatedService = await (0, Service_1.updateService)(id, updateData);
        if (!updatedService) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({
            message: 'Service updated successfully',
            service: {
                id: updatedService.id,
                name: updatedService.name,
                description: updatedService.description,
                price: updatedService.price,
                duration_minutes: updatedService.duration_minutes,
                created_at: updatedService.created_at,
                updated_at: updatedService.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.delete('/:id', [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid service ID is required'),
], async (req, res) => {
    try {
        const { id } = req.params;
        const service = await (0, Service_1.findServiceById)(id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        const deleted = await (0, Service_1.deleteService)(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;