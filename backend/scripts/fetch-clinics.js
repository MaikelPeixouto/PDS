const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/clinics',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Success:', json.success);
            if (json.data && json.data.length > 0) {
                console.log('First item ID:', json.data[0].id);
                console.log('First item Name:', json.data[0].name);
                console.log('First item Lat:', json.data[0].latitude);
                console.log('First item Lng:', json.data[0].longitude);
                console.log('First item Address:', json.data[0].address);
            } else {
                console.log('No data found');
            }
        } catch (e) {
            console.log('Error parsing JSON');
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
