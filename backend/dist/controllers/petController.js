"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePetController = exports.updatePetController = exports.getPetByIdController = exports.getPetsController = exports.createPetController = void 0;
const express_validator_1 = require("express-validator");
const Pet_1 = require("../models/Pet");
const createPetController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const petData = {
            user_id: req.user.id,
            name: req.body.name,
            species: req.body.species,
            breed: req.body.breed,
            age: req.body.age,
            weight: req.body.weight,
            gender: req.body.gender,
            microchip: req.body.microchip && req.body.microchip.trim() !== '' ? req.body.microchip.trim() : null,
            image_url: req.body.image_url,
            status: req.body.status || 'Saudável'
        };
        if (petData.microchip) {
            const existingPet = await (0, Pet_1.findPetByMicrochip)(petData.microchip);
            if (existingPet) {
                return res.status(409).json({ message: 'Pet with this microchip already exists' });
            }
        }
        const pet = await (0, Pet_1.createPet)(petData);
        res.status(201).json({
            message: 'Pet created successfully',
            pet: {
                id: pet.id,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age,
                weight: pet.weight,
                gender: pet.gender,
                microchip: pet.microchip,
                image_url: pet.image_url,
                status: pet.status,
                created_at: pet.created_at
            }
        });
    }
    catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createPetController = createPetController;
const getPetsController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const pets = await (0, Pet_1.findPetsByUserId)(req.user.id);
        res.status(200).json({
            message: 'Pets retrieved successfully',
            pets: pets.map(pet => ({
                id: pet.id,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age,
                weight: pet.weight,
                gender: pet.gender,
                microchip: pet.microchip,
                image_url: pet.image_url,
                status: pet.status,
                created_at: pet.created_at,
                updated_at: pet.updated_at
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving pets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPetsController = getPetsController;
const getPetByIdController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const pet = await (0, Pet_1.findPetById)(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json({
            message: 'Pet retrieved successfully',
            pet: {
                id: pet.id,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age,
                weight: pet.weight,
                gender: pet.gender,
                microchip: pet.microchip,
                image_url: pet.image_url,
                status: pet.status,
                created_at: pet.created_at,
                updated_at: pet.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error retrieving pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPetByIdController = getPetByIdController;
const updatePetController = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const pet = await (0, Pet_1.findPetById)(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const updateData = {
            name: req.body.name,
            species: req.body.species,
            breed: req.body.breed,
            age: req.body.age,
            weight: req.body.weight,
            gender: req.body.gender,
            microchip: req.body.microchip,
            image_url: req.body.image_url,
            status: req.body.status
        };
        if (updateData.microchip && updateData.microchip !== pet.microchip) {
            const existingPet = await (0, Pet_1.findPetByMicrochip)(updateData.microchip);
            if (existingPet) {
                return res.status(409).json({ message: 'Pet with this microchip already exists' });
            }
        }
        const updatedPet = await (0, Pet_1.updatePet)(id, updateData);
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({
            message: 'Pet updated successfully',
            pet: {
                id: updatedPet.id,
                name: updatedPet.name,
                species: updatedPet.species,
                breed: updatedPet.breed,
                age: updatedPet.age,
                weight: updatedPet.weight,
                gender: updatedPet.gender,
                microchip: updatedPet.microchip,
                image_url: updatedPet.image_url,
                status: updatedPet.status,
                created_at: updatedPet.created_at,
                updated_at: updatedPet.updated_at
            }
        });
    }
    catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updatePetController = updatePetController;
const deletePetController = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { id } = req.params;
        const pet = await (0, Pet_1.findPetById)(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        if (pet.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const deleted = await (0, Pet_1.deletePet)(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deletePetController = deletePetController;
