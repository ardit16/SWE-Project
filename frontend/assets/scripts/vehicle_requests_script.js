document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const vehicleRequestsContent = document.getElementById('vehicle-requests-content');
    const searchDriverIdInput = document.getElementById('search-driver-id');
    const sortOrderSelect = document.getElementById('sort-order');
    const searchButton = document.getElementById('search-button');

    if (!vehicleRequestsContent) {
        console.error("vehicle-requests-content not found");
        return;
    }

    // Example vehicle requests data
    const exampleVehicleRequests = [
        {
            driverId: '12345',
            model: 'Model S',
            make: 'Tesla',
            year: '2020',
            color: 'Red',
            licensePlateNumber: 'ABC123',
            numberOfSeats: 5,
            insuranceExpiryDate: '2024-05-30',
            registrationExpiryDate: '2023-12-31',
            photos: ['assets/images/1.jpg', 'assets/images/2.jpg'],
            documents: ['https://via.placeholder.com/document.pdf','https://via.placeholder.com/document.pdf'],
            timestamp: new Date('2023-01-01')
        },
        {
            driverId: '67890',
            model: 'Civic',
            make: 'Honda',
            year: '2018',
            color: 'Blue',
            licensePlateNumber: 'XYZ789',
            numberOfSeats: 4,
            insuranceExpiryDate: '2024-11-30',
            registrationExpiryDate: '2023-06-30',
            photos: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
            documents: ['https://via.placeholder.com/document.pdf'],
            timestamp: new Date('2023-02-01')
        }
    ];

    // Function to add a vehicle request to the content
    function addVehicleRequest(request) {
        console.log("Adding vehicle request", request);
        const vehicleRequestDiv = document.createElement('div');
        vehicleRequestDiv.classList.add('vehicle-request');

        vehicleRequestDiv.innerHTML = `
            <div class="info-container">
                <div class="info-item">
                    <span>Driver ID:</span>
                    <div class="value">${request.driverId}</div>
                </div>
                <div class="info-item">
                    <span>License Plate:</span>
                    <div class="value">${request.licensePlateNumber}</div>
                </div>
                <div class="info-item">
                    <span>Model:</span>
                    <div class="value">${request.model}</div>
                </div>
                <div class="info-item">
                <span>Seats:</span>
                <div class="value">${request.numberOfSeats}</div>
                </div>
                <div class="info-item">
                    <span>Make:</span>
                    <div class="value">${request.make}</div>
                </div>
                <div class="info-item">
                <span>Insurance Expiry:</span>
                <div class="value">${request.insuranceExpiryDate}</div>
                </div>
                <div class="info-item">
                    <span>Year:</span>
                    <div class="value">${request.year}</div>
                </div>
                <div class="info-item">
                <span>Registration Expiry:</span>
                <div class="value">${request.registrationExpiryDate}</div>
                </div>
                <div class="info-item">
                    <span>Color:</span>
                    <div class="value">${request.color}</div>
                </div>
            </div>
            <div class="media-container">
                <div class="photos">
                    <span>Photos:</span>
                    <div class="value">${request.photos.map(photo => `<img src="${photo}" class="vehicle-photo" />`).join('')}</div>
                </div>
                <div class="documents">
                    <span>Documents:</span>
                    <div class="value">${request.documents.map(doc => `<a href="${doc}" target="_blank">View</a>`).join('<br>')}</div>
                </div>
            </div>
            <div class="actions">
                <button class="accept-button">Accept</button>
                <button class="reject-button">Reject</button>
            </div>
        `;

        vehicleRequestsContent.appendChild(vehicleRequestDiv);
    }

    // Function to render vehicle requests based on search and sort
    function renderVehicleRequests() {
        vehicleRequestsContent.innerHTML = ''; // Clear current content

        const searchValue = searchDriverIdInput.value.toLowerCase();
        const sortOrder = sortOrderSelect.value;

        let filteredRequests = exampleVehicleRequests.filter(request => 
            request.driverId.toLowerCase().includes(searchValue)
        );

        if (sortOrder === 'newest') {
            filteredRequests.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            filteredRequests.sort((a, b) => a.timestamp - b.timestamp);
        }

        filteredRequests.forEach(addVehicleRequest);
    }

    // Initial render
    renderVehicleRequests();

    // Add event listeners
    searchButton.addEventListener('click', renderVehicleRequests);
    sortOrderSelect.addEventListener('change', renderVehicleRequests);
});