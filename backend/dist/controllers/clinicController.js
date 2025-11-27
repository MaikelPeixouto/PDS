"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchExternalClinicsController = exports.searchClinicsByLocationController = exports.getCepCoordinatesController = exports.getClinicStatisticsController = exports.getClinicByIdController = exports.getClinicsController = void 0;
const Clinic_1 = require("../models/Clinic");
const database_1 = __importDefault(require("../config/database"));
const getClinicsController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const clinics = await Clinic_1.ClinicModel.findAll(limit, offset);
        res.status(200).json({
            success: true,
            data: clinics.map(clinic => {
                const { password_hash, ...clinicResponse } = clinic;
                return clinicResponse;
            })
        });
    }
    catch (error) {
        console.error('Error retrieving clinics:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getClinicsController = getClinicsController;
const getClinicByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const clinic = await Clinic_1.ClinicModel.findById(id);
        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: 'Clínica não encontrada'
            });
        }
        const { password_hash, ...clinicResponse } = clinic;
        res.status(200).json({
            success: true,
            data: clinicResponse
        });
    }
    catch (error) {
        console.error('Error retrieving clinic:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getClinicByIdController = getClinicByIdController;
const getClinicStatisticsController = async (req, res) => {
    try {
        const { id } = req.params;
        const totalAppointmentsResult = await database_1.default.query('SELECT COUNT(*) as total FROM vet_appointments WHERE clinic_id = $1', [id]);
        const totalAppointments = parseInt(totalAppointmentsResult.rows[0].total) || 0;
        const activeClientsResult = await database_1.default.query('SELECT COUNT(DISTINCT user_id) as total FROM vet_appointments WHERE clinic_id = $1', [id]);
        const activeClients = parseInt(activeClientsResult.rows[0].total) || 0;
        const clinic = await Clinic_1.ClinicModel.findById(id);
        const averageRating = clinic ? (parseFloat(clinic.rating) || 0) : 0;
        const totalReviews = clinic ? (parseInt(clinic.total_reviews) || 0) : 0;
        const returnRateResult = await database_1.default.query(`
            SELECT
                COUNT(*) as clients_with_returns
            FROM (
                SELECT user_id, COUNT(*) as appointment_count
                FROM vet_appointments
                WHERE clinic_id = $1
                GROUP BY user_id
                HAVING COUNT(*) > 1
            ) as returning_clients
        `, [id]);
        const clientsWithReturns = parseInt(returnRateResult.rows[0]?.clients_with_returns || 0);
        const returnRate = activeClients > 0 ? Math.round((clientsWithReturns / activeClients) * 100) : 0;
        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                activeClients,
                averageRating,
                totalReviews,
                returnRate
            }
        });
    }
    catch (error) {
        console.error('Error retrieving clinic statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getClinicStatisticsController = getClinicStatisticsController;
const updateClinicProfileController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { name, cnpj, phone, address, email, description, photo_url } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (cnpj !== undefined)
            updateData.cnpj = cnpj;
        if (phone !== undefined)
            updateData.phone = phone;
        if (address !== undefined)
            updateData.address = address;
        if (email !== undefined)
            updateData.email = email;
        if (description !== undefined)
            updateData.description = description;
        if (photo_url !== undefined)
            updateData.photo_url = photo_url;
        const updatedClinic = await Clinic_1.ClinicModel.update(clinicId, updateData);
        if (!updatedClinic) {
            return res.status(404).json({
                success: false,
                message: 'Clínica não encontrada'
            });
        }
        const { password_hash, ...clinicResponse } = updatedClinic;
        res.status(200).json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            data: clinicResponse
        });
    }
    catch (error) {
        console.error('Error updating clinic profile:', error);
        const fs = require('fs');
        try {
            fs.writeFileSync('error.log', `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n`);
        } catch (e) {
            console.error('Failed to write to error.log', e);
        }

        if (error.code === '23505') {
            if (error.constraint === 'clinics_cnpj_key') {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe uma clínica cadastrada com este CNPJ'
                });
            }
            if (error.constraint === 'clinics_email_key') {
                return res.status(409).json({
                    success: false,
                    message: 'Já existe uma clínica cadastrada com este e-mail'
                });
            }
        }

        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.updateClinicProfileController = updateClinicProfileController;
const uploadClinicLogoController = async (req, res) => {
    try {
        const clinicId = req.clinic?.id || req.user?.id;
        if (!clinicId) {
            return res.status(401).json({
                success: false,
                message: 'Não autorizado'
            });
        }
        const { photo_url } = req.body;
        if (!photo_url) {
            return res.status(400).json({
                success: false,
                message: 'URL da foto é obrigatória'
            });
        }
        const updatedClinic = await Clinic_1.ClinicModel.update(clinicId, { photo_url });
        if (!updatedClinic) {
            return res.status(404).json({
                success: false,
                message: 'Clínica não encontrada'
            });
        }
        const { password_hash, ...clinicResponse } = updatedClinic;
        res.status(200).json({
            success: true,
            message: 'Logo atualizado com sucesso',
            data: { photo_url: clinicResponse.photo_url }
        });
    }
    catch (error) {
        console.error('Error uploading clinic logo:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.uploadClinicLogoController = uploadClinicLogoController;
const getCepCoordinatesController = async (req, res) => {
    try {
        const { cep } = req.params;
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            return res.status(400).json({
                success: false,
                message: 'CEP inválido. Deve conter 8 dígitos'
            });
        }
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!viaCepResponse.ok) {
            throw new Error('Erro ao consultar ViaCEP');
        }
        const viaCepData = await viaCepResponse.json();
        if (viaCepData.erro) {
            return res.status(404).json({
                success: false,
                message: 'CEP não encontrado'
            });
        }
        const address = `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade}, ${viaCepData.uf}, Brasil`;
        const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!googleApiKey) {
            return res.status(200).json({
                success: true,
                data: {
                    address: address,
                    city: viaCepData.localidade,
                    state: viaCepData.uf,
                    cep: `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`,
                    message: 'Google Maps API key não configurada. Configure GOOGLE_MAPS_API_KEY no .env'
                }
            });
        }
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleApiKey}`;
        const geocodingResponse = await fetch(geocodingUrl);
        if (!geocodingResponse.ok) {
            throw new Error('Erro ao consultar Google Geocoding API');
        }
        const geocodingData = await geocodingResponse.json();
        if (geocodingData.status !== 'OK' || !geocodingData.results || geocodingData.results.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    address: address,
                    city: viaCepData.localidade,
                    state: viaCepData.uf,
                    cep: `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`,
                    message: 'Coordenadas não encontradas para este endereço'
                }
            });
        }
        const location = geocodingData.results[0].geometry.location;
        res.status(200).json({
            success: true,
            data: {
                latitude: location.lat,
                longitude: location.lng,
                address: address,
                city: viaCepData.localidade,
                state: viaCepData.uf,
                cep: `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`
            }
        });
    }
    catch (error) {
        console.error('Error getting CEP coordinates:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.getCepCoordinatesController = getCepCoordinatesController;
const searchClinicsByLocationController = async (req, res) => {
    try {
        const latitude = parseFloat(req.query.lat);
        const longitude = parseFloat(req.query.lng);
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Latitude e longitude são obrigatórias'
            });
        }
        const radius = parseFloat(req.query.radius) || 10;
        const limit = parseInt(req.query.limit) || 3;
        const clinics = await Clinic_1.ClinicModel.findByLocation(latitude, longitude, radius);
        const limitedClinics = clinics.slice(0, limit).map(clinic => {
            const { password_hash, ...clinicResponse } = clinic;
            return {
                ...clinicResponse,
                isRegistered: true,
                distance: clinic.distance ? `${clinic.distance.toFixed(1)} km` : 'N/A'
            };
        });
        res.status(200).json({
            success: true,
            data: limitedClinics
        });
    }
    catch (error) {
        console.error('Error searching clinics by location:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.searchClinicsByLocationController = searchClinicsByLocationController;
const searchExternalClinicsController = async (req, res) => {
    try {
        const latitude = parseFloat(req.query.lat);
        const longitude = parseFloat(req.query.lng);
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Latitude e longitude são obrigatórias'
            });
        }
        const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!googleApiKey) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Google Maps API key não configurada'
            });
        }
        const radius = parseInt(req.query.radius) || 10000;
        const limit = parseInt(req.query.limit) || 3;
        const placeTypes = ['veterinary_care', 'pet_store'];
        const allResults = [];
        for (const type of placeTypes) {
            const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${googleApiKey}`;
            const placesResponse = await fetch(placesUrl);
            if (!placesResponse.ok) {
                console.error(`Error fetching ${type} from Google Places API`);
                continue;
            }
            const placesData = await placesResponse.json();
            if (placesData.status === 'OK' && placesData.results) {
                for (const place of placesData.results) {
                    const existingClinic = await database_1.default.query(
                        'SELECT id FROM clinics WHERE address ILIKE $1 OR name ILIKE $2 LIMIT 1',
                        [`%${place.vicinity || ''}%`, `%${place.name}%`]
                    );
                    if (existingClinic.rows.length === 0) {
                        const R = 6371;
                        const dLat = (place.geometry.location.lat - latitude) * Math.PI / 180;
                        const dLon = (place.geometry.location.lng - longitude) * Math.PI / 180;
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(latitude * Math.PI / 180) * Math.cos(place.geometry.location.lat * Math.PI / 180) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const calculatedDistance = R * c;
                        allResults.push({
                            id: place.place_id,
                            name: place.name,
                            address: place.vicinity || 'Endereço não disponível',
                            rating: place.rating || 0,
                            total_reviews: place.user_ratings_total || 0,
                            latitude: place.geometry.location.lat,
                            longitude: place.geometry.location.lng,
                            isRegistered: false,
                            distance: `${calculatedDistance.toFixed(1)} km`,
                            photo_reference: place.photos && place.photos[0] ? place.photos[0].photo_reference : null
                        });
                    }
                }
            }
        }
        const limitedResults = allResults
            .sort((a, b) => {
                const distA = parseFloat(a.distance.replace(' km', '').replace('N/A', '999999'));
                const distB = parseFloat(b.distance.replace(' km', '').replace('N/A', '999999'));
                return distA - distB;
            })
            .slice(0, limit);
        res.status(200).json({
            success: true,
            data: limitedResults
        });
    }
    catch (error) {
        console.error('Error searching external clinics:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
exports.searchExternalClinicsController = searchExternalClinicsController;
