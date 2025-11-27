const axios = require('axios');

async function reproduceError() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'maikel@vet.com',
            password: '123456',
            userType: 'clinic'
        });

        const token = loginRes.data.data.tokens.accessToken;
        console.log('Logged in. Token obtained.');

        // 2. Create Appointment
        console.log('Creating appointment...');
        const appointmentData = {
            clientName: 'Test Client',
            clientPhone: '11999999999',
            petName: 'Rex',
            petType: 'Dog',
            service: 'Consulta', // Assuming this service exists, or use one that does
            appointmentDate: new Date().toISOString(),
            notes: 'Test note',
            paymentMethod: 'credit_card',
            veterinarianId: null // Testing with null first
        };

        const res = await axios.post('http://localhost:3000/api/clinics/me/appointments', appointmentData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Success:', res.data);

    } catch (error) {
        console.error('Error reproducing:', error.response ? error.response.data : error.message);
    }
}

reproduceError();
