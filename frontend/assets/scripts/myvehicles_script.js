document.addEventListener('DOMContentLoaded', async () => {
    const driverId = localStorage.getItem('driverId');
    console.log('Retrieved driver ID:', driverId);

    const vehiclesContainer = document.getElementById('vehicles-container');
    const addVehicleForm = document.getElementById('add-vehicle-form');

    async function fetchVehicles() {
        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/view-cars`);
            if (!response.ok) {
                throw new Error('Failed to fetch vehicles.');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    function renderVehicles(vehicles) {
        vehiclesContainer.innerHTML = '';

        vehicles.forEach(vehicle => {
            const vehicleBox = document.createElement('div');
            vehicleBox.classList.add('vehicle-box');

            if (vehicle.vehicleStatus === "Verified") {
                vehicleBox.classList.add('verified'); // Add verified class for green background
            } else {
                vehicleBox.classList.add('unverified'); // Add unverified class for red background
            }

            const photos = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos : ['assets/images/car1.jpg', 'assets/images/car2.jpg'];
            const documents = vehicle.documents && vehicle.documents.length > 0 ? vehicle.documents : ['https://example.com/document1.pdf', 'https://example.com/document2.pdf'];

            vehicleBox.innerHTML = `
                <div class="info-container">
                    <div class="info-item">
                        <span>Model:</span>
                        <div class="value">${vehicle.model}</div>
                    </div>
                    <div class="info-item">
                        <span>Make:</span>
                        <div class="value">${vehicle.make}</div>
                    </div>
                    <div class="info-item">
                        <span>Year:</span>
                        <div class="value">${vehicle.year}</div>
                    </div>
                    <div class="info-item">
                        <span>Color:</span>
                        <div class="value">${vehicle.color}</div>
                    </div>
                    <div class="info-item">
                        <span>License Plate:</span>
                        <div class="value">${vehicle.licensePlateNumber}</div>
                    </div>
                    <div class="info-item">
                        <span>Seats:</span>
                        <div class="value">${vehicle.numberOfSeats}</div>
                    </div>
                    <div class="info-item">
                        <span>Insurance Expiry:</span>
                        <div class="value">${vehicle.insuranceExpiryDate}</div>
                    </div>
                    <div class="info-item">
                        <span>Registration Expiry:</span>
                        <div class="value">${vehicle.registrationExpiryDate}</div>
                    </div>
                </div>
                <div class="media-container">
                    <div class="photos">
                        <span>Photos:</span>
                        <div class="value">${photos.map(photo => `<img src="${photo}" class="vehicle-photo" />`).join('')}</div>
                    </div>
                    <div class="documents">
                        <span>Documents:</span>
                        <div class="value">${documents.map(doc => `<a href="${doc}" target="_blank">View</a>`).join('<br>')}</div>
                    </div>
                </div>
            `;

            vehiclesContainer.appendChild(vehicleBox);
        });
    }

    addVehicleForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const model = document.getElementById('vehicle-model').value;
        const make = document.getElementById('vehicle-make').value;
        const year = document.getElementById('vehicle-year').value;
        const color = document.getElementById('vehicle-color').value;
        const licensePlateNumber = document.getElementById('vehicle-license').value;
        const numberOfSeats = document.getElementById('vehicle-seats').value;
        const insuranceExpiryDate = document.getElementById('vehicle-insurance').value;
        const registrationExpiryDate = document.getElementById('vehicle-registration').value;
        const photos = document.getElementById('vehicle-photos').files;
        const documents = document.getElementById('vehicle-documents').files;

        const formData = new FormData();
        formData.append('DriverID', driverId);
        formData.append('Model', model);
        formData.append('Make', make);
        formData.append('Year', year);
        formData.append('Color', color);
        formData.append('LicensePlateNumber', licensePlateNumber);
        formData.append('NumberOfSeats', numberOfSeats);
        formData.append('InsuranceExpiryDate', insuranceExpiryDate);
        formData.append('RegistrationExpiryDate', registrationExpiryDate);
        formData.append('VehicleStatus', 'unverified'); // Set default vehicle status

        // Append photos
        for (let i = 0; i < photos.length; i++) {
            formData.append('Photos', photos[i]);
        }

        // Append documents
        for (let i = 0; i < documents.length; i++) {
            formData.append('Documents', documents[i]);
        }

        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/add-new-car`, {
                method: 'POST',
                body: formData
            });

            const responseBody = await response.text();
            console.log("Response Status:", response.status);
            console.log("Response Body:", responseBody);

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error Response:', errorResponse);
                throw new Error('Failed to add vehicle.');
            }

            const vehicles = await fetchVehicles();
            renderVehicles(vehicles);
            addVehicleForm.reset();
            showModal('Vehicle added successfully.');
        } catch (error) {
            console.error('Error:', error);
            showModal('Failed to add vehicle.');
        }
    });

    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;

        modal.style.display = 'block';

        const closeButton = document.getElementById('close-button');
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    const vehicles = await fetchVehicles();
    renderVehicles(vehicles);
});