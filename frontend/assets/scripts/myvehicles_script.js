document.addEventListener('DOMContentLoaded', () => {
    const vehiclesContainer = document.getElementById('vehicles-container');
    const addVehicleForm = document.getElementById('add-vehicle-form');

    const exampleVehicles = [
        {
            model: 'Model S',
            make: 'Tesla',
            year: 2020,
            color: 'Red',
            licenseplatenumber: 'ABC123',
            numberofseats: 5,
            insuranceexpirydate: '2023-12-31',
            registrationexpirydate: '2023-12-31',
            photos: [
                'assets/images/1.jpg', 
                'assets/images/2.jpg'
            ],
            documents: [
                'https://example.com/document1.pdf',
                'https://example.com/document2.pdf'
            ]
        },
        {
            model: 'Civic',
            make: 'Honda',
            year: 2018,
            color: 'Blue',
            licenseplatenumber: 'XYZ456',
            numberofseats: 5,
            insuranceexpirydate: '2024-05-10',
            registrationexpirydate: '2024-05-10',
            photos: [
                'https://via.placeholder.com/100', 
                'https://via.placeholder.com/100'
            ],
            documents: [
                'https://example.com/document3.pdf',
                'https://example.com/document4.pdf'
            ]
        }
    ];

    exampleVehicles.forEach(vehicle => addVehicle(vehicle));

    addVehicleForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const vehicle = {
            model: addVehicleForm['model'].value,
            make: addVehicleForm['make'].value,
            year: addVehicleForm['year'].value,
            color: addVehicleForm['color'].value,
            licenseplatenumber: addVehicleForm['licenseplatenumber'].value,
            numberofseats: addVehicleForm['numberofseats'].value,
            insuranceexpirydate: addVehicleForm['insuranceexpirydate'].value,
            registrationexpirydate: addVehicleForm['registrationexpirydate'].value,
            photos: Array.from(addVehicleForm['photos'].files).map(file => URL.createObjectURL(file)),
            documents: Array.from(addVehicleForm['documents'].files).map(file => URL.createObjectURL(file))
        };

        addVehicle(vehicle);
        addVehicleForm.reset();
    });

    function addVehicle(vehicle) {
        const vehicleBox = document.createElement('div');
        vehicleBox.classList.add('vehicle-box');

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
                    <div class="value">${vehicle.licenseplatenumber}</div>
                </div>
                <div class="info-item">
                    <span>Seats:</span>
                    <div class="value">${vehicle.numberofseats}</div>
                </div>
                <div class="info-item">
                    <span>Insurance Expiry:</span>
                    <div class="value">${vehicle.insuranceexpirydate}</div>
                </div>
                <div class="info-item">
                    <span>Registration Expiry:</span>
                    <div class="value">${vehicle.registrationexpirydate}</div>
                </div>
            </div>
            <div class="media-container">
                <div class="photos">
                    <span>Photos:</span>
                    <div class="value">${vehicle.photos.map(photo => `<img src="${photo}" class="vehicle-photo" />`).join('')}</div>
                </div>
                <div class="documents">
                    <span>Documents:</span>
                    <div class="value">${vehicle.documents.map(doc => `<a href="${doc}" target="_blank">View</a>`).join('<br>')}</div>
                </div>
            </div>
        `;

        vehiclesContainer.appendChild(vehicleBox);
    }
});