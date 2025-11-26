"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVaccineController = exports.updateVaccineController = exports.getUpcomingVaccinesController = exports.getVaccinesController = exports.createVaccineController = void 0;
const express_validator_1 = require("express-validator");
const Vaccine_1 = require("../models/Vaccine");
const Pet_1 = require("../models/Pet");
const createVaccineController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { petId } = req.params;
        const pet = await (0, Pet_1.findPetById)(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const vaccineData = {
            pet_id: petId,
            name: req.body.name,
            vaccination_date: new Date(req.body.vaccination_date),
            next_vaccination_date: req.body.next_vaccination_date ? new Date(req.body.next_vaccination_date) : undefined
        };
        const vaccine = await (0, Vaccine_1.createVaccine)(vaccineData);
        res.status(201).json({
            message: 'Vaccine record created successfully',
            vaccine: {
                id: vaccine.id,
                pet_id: vaccine.pet_id,
                name: vaccine.name,
                vaccination_date: vaccine.vaccination_date,
                next_vaccination_date: vaccine.next_vaccination_date,
                created_at: vaccine.created_at
            }
        });
    }
    catch (error) {
        console.error('Error creating vaccine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createVaccineController = createVaccineController;
const getVaccinesController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { petId } = req.params;
        const pet = await (0, Pet_1.findPetById)(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const vaccines = await (0, Vaccine_1.findVaccinesByPetId)(petId);
        res.status(200).json({
            message: 'Vaccines retrieved successfully',
            vaccines: vaccines.map(vaccine => ({
                id: vaccine.id,
                pet_id: vaccine.pet_id,
                name: vaccine.name,
                vaccination_date: vaccine.vaccination_date,
                next_vaccination_date: vaccine.next_vaccination_date,
                created_at: vaccine.created_at,
                updated_at: vaccine.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving vaccines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getVaccinesController = getVaccinesController;
const getUpcomingVaccinesController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { petId } = req.params;
        const daysAhead = parseInt(req.query.days) || 30;
        const pet = await (0, Pet_1.findPetById)(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const upcomingVaccines = await (0, Vaccine_1.findUpcomingVaccines)(petId, daysAhead);
        res.status(200).json({
            message: 'Upcoming vaccines retrieved successfully',
            vaccines: upcomingVaccines.map(vaccine => ({
                id: vaccine.id,
                pet_id: vaccine.pet_id,
                name: vaccine.name,
                vaccination_date: vaccine.vaccination_date,
                next_vaccination_date: vaccine.next_vaccination_date,
                created_at: vaccine.created_at,
                updated_at: vaccine.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving upcoming vaccines:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUpcomingVaccinesController = getUpcomingVaccinesController;
const updateVaccineController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const vaccine = await (0, Vaccine_1.findVaccineById)(id);
        if (!vaccine) {
            return res.status(404).json({ message: 'Vaccine record not found' });
        }
        const pet = await (0, Pet_1.findPetById)(vaccine.pet_id);
        if (!pet || pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {
            name: req.body.name,
            vaccination_date: req.body.vaccination_date ? new Date(req.body.vaccination_date) : undefined,
            next_vaccination_date: req.body.next_vaccination_date ? new Date(req.body.next_vaccination_date) : undefined
        };
        const updatedVaccine = await (0, Vaccine_1.updateVaccine)(id, updateData);
        if (!updatedVaccine) {
            return res.status(404).json({ message: 'Vaccine record not found' });
        }
        res.status(200).json({
            message: 'Vaccine record updated successfully',
            vaccine: {
                id: updatedVaccine.id,
                pet_id: updatedVaccine.pet_id,
                name: updatedVaccine.name,
                vaccination_date: updatedVaccine.vaccination_date,
                next_vaccination_date: updatedVaccine.next_vaccination_date,
                created_at: updatedVaccine.created_at,
                updated_at: updatedVaccine.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error updating vaccine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateVaccineController = updateVaccineController;
const deleteVaccineController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const vaccine = await (0, Vaccine_1.findVaccineById)(id);
        if (!vaccine) {
            return res.status(404).json({ message: 'Vaccine record not found' });
        }
        const pet = await (0, Pet_1.findPetById)(vaccine.pet_id);
        if (!pet || pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const deleted = await (0, Vaccine_1.deleteVaccine)(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Vaccine record not found' });
        }
        res.status(200).json({ message: 'Vaccine record deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting vaccine:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteVaccineController = deleteVaccineController;