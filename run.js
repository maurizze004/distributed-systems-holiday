import {spawn} from 'child_process';
import open from 'open';
import path from 'path';

// Paths to server files
const services = [
    {path: './services/flight-service/server.js', name: 'Flüge'},
    {path: './services/hotel-service/server.js', name: 'Hotels'},
    {path: './services/rentalcar-service/server.js', name: 'Mietwagen'}
].map(service => ({
    ...service,
    path: path.resolve(service.path)
}));

// Start a service
function startService({path: servicePath, name: serviceName}) {
    const service = spawn('node', [servicePath], {stdio: 'inherit'});

    service.on('error', (error) => {
        console.error(`[${serviceName}] Fehler beim Starten des Services:`, error);
    });

    service.on('close', (code) => {
        console.log(`[${serviceName}] Service beendet mit Code ${code}`);
    });

    return service;
}

// Start all services
console.log('Start all services...');
services.forEach(startService);

// Open the browser to load index.html
(async () => {
    try {
        await open('./user-frontend/index.html');
    } catch (error) {
        console.error('Fehler beim Öffnen des Browsers:', error);
    }
})();