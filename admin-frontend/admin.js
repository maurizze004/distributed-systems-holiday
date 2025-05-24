//load and set dynamic form
const hotelFields = [
    {id: "name", label: "Hotelname", type: "text", name: "name"},
    {id: "location", label: "Ort", type: "text", name: "location"},
    {id: "stars", label: "Sterne", type: "number", name: "stars"},
    {id: "price_per_night", label: "Preis/Nacht (€)", type: "number", name: "price_per_night"},
    {id: "amenities", label: "Ausstattung", type: "text", name: "amenities"},
    {id: "available_rooms", label: "Verfügbare Zimmer", type: "text", name: "available_rooms"},
    {id: "description", label: "Beschreibung", type: "text", name: "description"},
    {id: "image_url", label: "Bild-URL (gekürzt via t1p.de)", type: "url", name: "image_url"}
];
const flightFields = [
    {id: "airline", label: "Airline", type: "text", name: "airline"},
    {id: "flight_number", label: "Flugnummer", type: "text", name: "flight_number"},
    {id: "departure_airport", label: "Abflugort", type: "text", name: "departure_airport"},
    {id: "arrival_airport", label: "Ankunftsort", type: "text", name: "arrival_airport"},
    {id: "departure_date", label: "Abflug Zeit", type: "datetime-local", name: "departure_time"},
    {id: "arrival_date", label: "Ankunft Zeit", type: "datetime-local", name: "arrival_time"},
    {id: "price", label: "Preis", type: "number", name: "price"},
    {id: "seats_available", label: "Verfügbare Sitzplätze", type: "number", name: "seats_available"},
];
const carFields = [
    {id: "brand", label: "Marke", type: "text", name: "brand"},
    {id: "model", label: "Modell", type: "text", name: "model"},
    {id: "power", label: "PS", type: "number", name: "power"},
    {id: "year", label: "Baujahr", type: "number", name: "year"},
    {id: "daily_rate", label: "Preis/Tag (€)", type: "number", name: "daily_rate"},
    {id: "fuel_type", label: "Kraftstoff", type: "text", name: "fuel_type"},
    {id: "is_available", label: "Verfügbar", type: "select", options: ["Ja", "Nein"], name: "is_available"},
    {id: "occupied_until", label: "Vergeben bis", type: "date", name: "occupied_until"},
    {id: "imageUrl", label: "Bild-URL (gekürzt via t1p.de)", type: "text", name: "imageUrl"},
    {id: "class", label: "Klasse", type: "text", name: "class"}
];
const revField = [
    {id: "user", label: "User", type: "text", name: "user"},
    {id: "rating", label: "Rating", type: "number", name: "rating"},
    {id: "hotel_id", label: "Hotel", type: "text", name: "hotel_id"},
];

function openEntityForm(entityName, fields) {
    document.getElementById('modalLabel').innerText = `${entityName} bearbeiten / hinzufügen`;
    const modalBody = document.getElementById('modalBody');
    const form = document.getElementById('entityForm');
    modalBody.innerHTML = "";

    form.onsubmit = null;

    fields.forEach(field => {
        if (field.type === "select") {
            modalBody.innerHTML += `
                <div class="col-md-6">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <select class="form-select" id="${field.id}" name="${field.name}">
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join("")}
                    </select>
                </div>`;
        } else {
            modalBody.innerHTML += `
                <div class="col-md-6">
                    <label for="${field.id}" class="form-label">${field.label}</label>
                    <input type="${field.type}" class="form-control" id="${field.id}" name="${field.name}" ${field.step ? `step="${field.step}"` : ""}>
                </div>`;
        }
    });

    switch (entityName) {
        case "Flug":
            form.onsubmit = handleFlightSave;
            break;
        case "Hotel":
            form.onsubmit = handleHotelSave;
            break;
        case "Mietwagen":
            form.onsubmit = handleCarSave;
            break;
        case "Bewertung":
            form.onsubmit = handleReviewSave;
            break;
    }

    const modal = new bootstrap.Modal(document.getElementById('template-modal'));
    modal.show();
}

//CRUD operations - FLIGHT
async function handleFlightSave(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const flightData = Object.fromEntries(formData.entries());

    // Convert datetime-local to ISO 8601
    if (flightData.departure_time) {
        flightData.departure_time = new Date(flightData.departure_time).toISOString();
    }
    if (flightData.arrival_time) {
        flightData.arrival_time = new Date(flightData.arrival_time).toISOString();
    }

    try {
        const response = await fetch('http://localhost:3000/flights/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flightData)
        });

        if (response.ok) {
            await loadFlights();
            const modal = bootstrap.Modal.getInstance(document.getElementById('template-modal'));
            modal.hide();
            alert('Flug erfolgreich hinzugefügt');
        } else {
            alert('Fehler beim Hinzufügen des Flugs');
        }
    } catch (error) {
        console.error('Fehler beim Speichern des Flugs:', error);
        alert('Es gab ein Problem beim Speichern');
    }
}
async function deleteFlight(flightId) {
    if (!confirm('Möchten Sie diesen Flug wirklich löschen?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/flights/delete/${flightId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Flug erfolgreich gelöscht');
            await loadFlights();
        } else {
            const error = await response.json();
            alert(`Fehler beim Löschen des Flugs: ${error.message || 'Unbekannter Fehler'}`);
        }
    } catch (err) {
        console.error('Fehler beim Löschen des Flugs:', err);
        alert(`Es gab ein Problem beim Löschen des Flugs: ${err.message}`);
    }
}
async function editFlight(flightId) {
    try {
        const response = await fetch(`http://localhost:3000/flights/get/${flightId}`);
        const flight = await response.json();

        openEntityForm("Flug", flightFields);

        const form = document.getElementById("entityForm");

        Object.keys(flight).forEach((key) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === "datetime-local") {
                    input.value = new Date(flight[key]).toISOString().slice(0, 16);
                } else {
                    input.value = flight[key];
                }
            }
        });

        form.onsubmit = async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const updatedFlight = Object.fromEntries(formData.entries());

            if (updatedFlight.departure_time) {
                updatedFlight.departure_time = new Date(updatedFlight.departure_time).toISOString();
            }
            if (updatedFlight.arrival_time) {
                updatedFlight.arrival_time = new Date(updatedFlight.arrival_time).toISOString();
            }

            try {
                const updateResponse = await fetch(`http://localhost:3000/flights/update/${flightId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedFlight),
                });

                if (updateResponse.ok) {
                    await loadFlights();
                    const modal = bootstrap.Modal.getInstance(document.getElementById("template-modal"));
                    modal.hide();
                    alert("Flug erfolgreich aktualisiert");
                } else {
                    alert("Fehler beim Aktualisieren des Flugs");
                }
            } catch (error) {
                console.error("Fehler beim Aktualisieren des Flugs:", error);
                alert("Es gab ein Problem beim Aktualisieren des Flugs");
            }
        };
    } catch (error) {
        console.error("Fehler beim Laden des Flugs:", error);
        alert("Es gab ein Problem beim Laden des Flugs");
    }
}

//CRUD operations - HOTEL
async function handleHotelSave(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const hotelData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3001/hotels/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hotelData)
        });

        if (response.ok) {
            await loadHotels();
            const modal = bootstrap.Modal.getInstance(document.getElementById('template-modal'));
            modal.hide();
            alert('Hotel erfolgreich hinzugefügt');
        } else {
            alert('Fehler beim Hinzufügen des Hotels');
        }
    } catch (error) {
        console.error('Fehler beim Speichern des Hotels:', error);
        alert('Es gab ein Problem beim Speichern');
    }
}
async function deleteHotel(hotelId) {
    if (!confirm('Möchten Sie dieses Hotel wirklich löschen?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/hotels/delete/${hotelId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Flug erfolgreich gelöscht');
            await loadHotels();
        } else {
            const error = await response.json();
            alert(`Fehler beim Löschen des Hotels: ${error.message || 'Unbekannter Fehler'}`);
        }
    } catch (err) {
        console.error('Fehler beim Löschen des Hotels:', err);
        alert(`Es gab ein Problem beim Löschen des Hotels: ${err.message}`);
    }
}
async function editHotel(hotelId) {
    try {
        const response = await fetch(`http://localhost:3001/hotels/get/${hotelId}`);
        const hotel = await response.json();

        openEntityForm("Hotel", hotelFields);

        const form = document.getElementById("entityForm");
        Object.keys(hotel).forEach((key) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = hotel[key];
            }
        });

        form.onsubmit = async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const updatedHotel = Object.fromEntries(formData.entries());

            try {
                const updateResponse = await fetch(`http://localhost:3001/hotels/update/${hotelId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedHotel),
                });

                if (updateResponse.ok) {
                    await loadHotels();
                    const modal = bootstrap.Modal.getInstance(document.getElementById("template-modal"));
                    modal.hide();
                    alert("Flug erfolgreich aktualisiert");
                } else {
                    alert("Fehler beim Aktualisieren des Hotels");
                }
            } catch (error) {
                console.error("Fehler beim Aktualisieren des Hotels:", error);
                alert("Es gab ein Problem beim Aktualisieren des Hotels");
            }
        };
    } catch (error) {
        console.error("Fehler beim Laden des Hotels:", error);
        alert("Es gab ein Problem beim Laden des Hotels");
    }
}

//CRUD operations - CARS
async function handleCarSave(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const carData = Object.fromEntries(formData.entries());

    // Convert UI data to database data
    if (carData.occupied_until) {
        carData.occupied_until = new Date(carData.occupied_until).toISOString();
    } else {
        carData.occupied_until = null;
    }
    if (carData.is_available === "Ja") {
        carData.is_available = true;
    } else {
        carData.is_available = false;
    }

    try {
        const response = await fetch('http://localhost:3002/cars/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carData)
        });

        if (response.ok) {
            await loadCars();
            const modal = bootstrap.Modal.getInstance(document.getElementById('template-modal'));
            modal.hide();
            alert('Auto erfolgreich hinzugefügt');
        } else {
            alert('Fehler beim Hinzufügen des Autos');
        }
    } catch (error) {
        console.error('Fehler beim Speichern des Autos:', error);
        alert('Es gab ein Problem beim Speichern');
    }
}
async function deleteCar(carId) {
    if (!confirm('Möchten Sie dieses Auto wirklich löschen?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3002/cars/delete/${carId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Auto erfolgreich gelöscht');
            await loadCars();
        } else {
            const error = await response.json();
            alert(`Fehler beim Löschen des Autos: ${error.message || 'Unbekannter Fehler'}`);
        }
    } catch (err) {
        console.error('Fehler beim Löschen des Autos:', err);
        alert(`Es gab ein Problem beim Löschen des Autos: ${err.message}`);
    }
}
async function editCar(carId) {
    try {
        const response = await fetch(`http://localhost:3002/cars/get/${carId}`);
        const car = await response.json();

        openEntityForm("Mietwagen", carFields);

        const form = document.getElementById("entityForm");

        Object.keys(car).forEach((key) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === "datetime-local") {
                    input.value = new Date(car[key]).toISOString().slice(0, 16);
                } else {
                    input.value = car[key];
                }
            }
        });

        form.onsubmit = async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const updatedCar = Object.fromEntries(formData.entries());

            if (updatedCar.occupied_until) {
                updatedCar.occupied_until = new Date(updatedCar.occupied_until).toISOString();
            } else {
                updatedCar.occupied_until = null;
            }
            if (updatedCar.is_available === "Ja") {
                updatedCar.is_available = true;
            } else {
                updatedCar.is_available = false;
            }

            try {
                const updateResponse = await fetch(`http://localhost:3002/cars/update/${carId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCar),
                });

                if (updateResponse.ok) {
                    await loadCars();
                    const modal = bootstrap.Modal.getInstance(document.getElementById("template-modal"));
                    modal.hide();
                    alert("Flug erfolgreich aktualisiert");
                } else {
                    alert("Fehler beim Aktualisieren des Autos");
                }
            } catch (error) {
                console.error("Fehler beim Aktualisieren des Autos:", error);
                alert("Es gab ein Problem beim Aktualisieren des Autos");
            }
        };
    } catch (error) {
        console.error("Fehler beim Laden des Autos:", error);
        alert("Es gab ein Problem beim Laden des Autos");
    }
}

//CRUD operations - REVIEWS
async function handleReviewSave(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reviewData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3003/reviews/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            await loadReviews();
            const modal = bootstrap.Modal.getInstance(document.getElementById('template-modal'));
            modal.hide();
            alert('Bewertung erfolgreich hinzugefügt');
        } else {
            alert('Bewertung beim Hinzufügen des Autos');
        }
    } catch (error) {
        console.error('Fehler beim Speichern der Bewertung:', error);
        alert('Es gab ein Problem beim Speichern');
    }
}
async function deleteReview(revId) {
    if (!confirm('Möchten Sie diese Bewertung wirklich löschen?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3003/reviews/delete/${revId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Bewertung erfolgreich gelöscht');
            await loadReviews();
        } else {
            const error = await response.json();
            alert(`Fehler beim Löschen der Bewertung: ${error.message || 'Unbekannter Fehler'}`);
        }
    } catch (err) {
        console.error('Fehler beim Löschen der Bewertung:', err);
        alert(`Es gab ein Problem beim Löschen der Bewertung: ${err.message}`);
    }
}
async function editReview(revId) {
    try {
        const response = await fetch(`http://localhost:3003/reviews/get/${revId}`);
        const rev = await response.json();

        openEntityForm("Bewertung", revField);

        const form = document.getElementById("entityForm");
        Object.keys(rev).forEach((key) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = rev[key];
            }
        });

        form.onsubmit = async function (event) {
            event.preventDefault();

            const formData = new FormData(form);
            const updatedReview = Object.fromEntries(formData.entries());

            try {
                const updateResponse = await fetch(`http://localhost:3002/reviews/update/${revId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedReview),
                });

                if (updateResponse.ok) {
                    await loadReviews();
                    const modal = bootstrap.Modal.getInstance(document.getElementById("template-modal"));
                    modal.hide();
                    alert("Bewertung erfolgreich aktualisiert");
                } else {
                    alert("Fehler beim Aktualisieren der Bewertung");
                }
            } catch (error) {
                console.error("Fehler beim Aktualisieren der Bewertung:", error);
                alert("Es gab ein Problem beim Aktualisieren der Bewertung");
            }
        };
    } catch (error) {
        console.error("Fehler beim Laden der Bewertung:", error);
        alert("Es gab ein Problem beim Laden der Bewertung");
    }
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
      <td>${hotel.price_per_night} €</td>
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
        const departureTime = new Date(flight.departure_time).toLocaleString();
        const arrivalTime = new Date(flight.arrival_time).toLocaleString();
        row.innerHTML = `
            <td>${flight.airline}</td>
            <td>${flight.flight_number}</td> 
            <td>${flight.departure_airport}</td>
            <td>${flight.arrival_airport}</td>
            <td>${departureTime}</td>
            <td>${arrivalTime}</td>
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
async function loadCars(){
    const tbody = document.getElementById('cars-table');
    tbody.innerHTML = '';
    const res = await fetch('http://localhost:3002/cars/get');
    const cars = await res.json();
    cars.forEach(car => {
        const row = document.createElement('tr');
        if (car.occupied_until) {
            var occupied_until = new Date(car.occupied_until).toLocaleString();
        } else {
            occupied_until = null;
        }
        row.innerHTML = `
            <td>${car.brand}</td>
            <td>${car.model}</td> 
            <td>${car.power}</td>
            <td>${car.year}</td>
            <td>${car.daily_rate}&nbsp;&euro;</td>
            <td>${car.fuel_type}</td>
            <td>${car.is_available}</td>
            <td>${occupied_until}</td>
            <td><a href="${car.imageUrl}" target="_blank">${car.imageUrl}</a></td>
            <td>${car.class}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="editCar('${car._id}')"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCar('${car._id}')"><i class="bi bi-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
async function loadReviews() {
    const tbody = document.getElementById('revs-table');
    tbody.innerHTML = '';

    try {
        const [reviewsRes, hotelsRes] = await Promise.all([
            fetch('http://localhost:3003/reviews/get'),
            fetch('http://localhost:3001/hotels/get'),
        ]);

        const reviews = await reviewsRes.json();
        const hotels = await hotelsRes.json();

        const hotelMap = hotels.reduce((map, hotel) => {
            map[hotel._id] = hotel.name;
            return map;
        }, {});

        reviews.forEach(rev => {
            const hotelName = hotelMap[rev.hotel_id] || 'Unbekanntes Hotel';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${hotelName}</td>
                <td>${rev.rating}</td> 
                <td>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editReview('${rev._id}')"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteReview('${rev._id}')"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Fehler beim Laden der Bewertungen:', error);
        alert('Es gab ein Problem beim Laden der Bewertungen');
    }
}

//on-load functions
loadHotels();
loadFlights();
loadCars();
loadReviews();
