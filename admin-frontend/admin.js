const hotelFields = [
    { id: "name", label: "Hotelname", type: "text", name: "name" },
    { id: "location", label: "Ort", type: "text", name: "location" },
    { id: "stars", label: "Sterne", type: "select", options: ["3", "4", "5"], name: "stars" },
    { id: "price", label: "Preis/Nacht (€)", type: "number", step: "1.00", name: "price_per_night" },
    { id: "amenities", label: "Ausstattung", type: "text", name: "amenities" },
    { id: "rooms", label: "Verfügbare Zimmer", type: "text", name: "rooms" },
    { id: "description", label: "Beschreibung", type: "text", name: "description" },
    { id: "image", label: "Bild-URL (gekürzt via t1p.de)", type: "url", name: "image_url" }
];
const flightFields = [
    { id: "airline", label: "Airline", type: "text", name: "airline" },
    { id: "flightNumber", label: "Flugnummer", type: "text", name: "flight_number" },
    { id: "departure", label: "Abflugort", type: "text", name: "departure" },
    { id: "arrival", label: "Ankunftsort", type: "text", name: "arrival" },
    { id: "dep_date", label: "Abflug Zeit", type: "date", name: "date" },
    { id: "arr_date", label: "Ankunft Zeit", type: "date", name: "date" },
    { id: "price", label: "Preis", type: "number", name: "airline" },
    { id: "seats", label: "Verfügbare Sitzplätze", type: "number", name: "seats" },
];
const carFields = [
    { id: "brand", label: "Marke", type: "text", name: "brand" },
    { id: "model", label: "Modell", type: "text", name: "model" },
    { id: "power", label: "PS", type: "number", name: "power" },
    { id: "year", label: "Baujahr", type: "number", name: "year" },
    { id: "price", label: "Preis/Tag (€)", type: "number", name: "daily_price" },
    { id: "fuel_type", label: "Kraftstoff", type: "text", name: "fuel" },
    { id: "available", label: "Verfügbar", type: "select", options: ["Ja", "Nein"], name: "available" },
    { id: "occupied", label: "Vergeben bis", type: "date", name: "occupied"},
    { id: "image", label: "Bild-URL (gekürzt via t1p.de)", type: "text", name: "image"},
    { id: "class", label: "Klasse", type: "text", name: "class"}
];

//load and set dynamic form
function openEntityForm(entityName, fields) {
    document.getElementById('modalLabel').innerText = `${entityName} hinzufügen`;
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = "";

    fields.forEach(field => {
        if (field.type === "select") {
            const select = `<div class="col-md-6">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <select class="form-select" id="${field.id}" name="${field.name}">
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join("")}
                    </select>
                </div>`;
            modalBody.innerHTML += select;
        } else if (field.type === "textarea") {
            modalBody.innerHTML += `
                <div class="col-12">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <textarea class="form-control" id="${field.id}" name="${field.name}" rows="3"></textarea>
                </div>`;
        } else {
            modalBody.innerHTML += `
                <div class="col-md-6">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <input type="${field.type}" class="form-control" id="${field.id}" name="${field.name}" ${field.step ? `step="${field.step}"` : ""}>
                </div>`;
        }
    });

    const modal = new bootstrap.Modal(document.getElementById('template-modal'));
    modal.show();
}

//load table data
async function loadHotels() {
    const tbody = document.getElementById('hotels-table');
    tbody.innerHTML = '';
    const res = await fetch('http://localhost:3001/hotels/get');
    const hotels = await res.json();
    hotels.forEach(hotel => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${hotel.name}</td>
      <td>${hotel.location}</td>
      <td>${hotel.price_per_night} €</td>
      <td>${hotel.amenities}</td>
      <td>${hotel.available_rooms}</td>
      <td>${hotel.description}</td>
      <td><a href="${hotel.image_url}" target="_blank">${hotel.image_url}</a></td>
      <td>${hotel.stars}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary" onclick="editHotel('${hotel._id}')"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteHotel('${hotel._id}')"><i class="bi bi-trash"></i></button>
      </td>
    `;
        tbody.appendChild(row);
    });
}
async function loadFlights() {
    const tbody = document.getElementById('flights-table');
    tbody.innerHTML = '';
    const res = await fetch('http://localhost:3000/flights/get');
    const flights = await res.json();
    flights.forEach(flight => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flight.airline}</td>
            <td>${flight.flight_number}</td> 
            <td>${flight.departure_airport}</td>
            <td>${flight.arrival_airport}</td>
            <td>${flight.departure_time}</td>
            <td>${flight.arrival_time}</td>
            <td>${flight.price}&nbsp;&euro;</td>
            <td>${flight.seats_available}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="editFlight('${flight._id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFlight('${flight._id}')"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
async function loadCars() {
    const tbody = document.getElementById('cars-table');
    tbody.innerHTML = '';
    const res = await fetch('http://localhost:3002/cars/get');
    const cars = await res.json();
    cars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car.brand}</td>
            <td>${car.model}</td> 
            <td>${car.power}</td>
            <td>${car.year}</td>
            <td>${car.daily_rate}&nbsp;&euro;</td>
            <td>${car.fuel_type}</td>
            <td>${car.is_available}</td>
            <td>${car.occupied_until}</td>
            <td><a href="${car.imageUrl}" target="_blank">${car.imageUrl}</a></td>
            <td>${car.class}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="editCars('${car._id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCars('${car._id}')"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

//on-load functions
loadHotels();
loadFlights();
loadCars();