document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const vehicleRequestsContent = document.getElementById('vehicle-requests-content');
    const searchDriverIdInput = document.getElementById('search-driver-id');
    const sortOrderSelect = document.getElementById('sort-order');
    const searchButton = document.getElementById('search-button');
    const modal = document.getElementById('errorModal');
    const modalBody = document.getElementById('errorMessage');
    const closeButton = document.querySelector('.close');

    if (!vehicleRequestsContent) {
        console.error("vehicle-requests-content not found");
        return;
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = "none";
        });
    } else {
        console.error("close button not found");
    }

    async function fetchAllVehicles() {
        try {
            const response = await fetch('http://localhost:5179/api/Admin/Get-All-Vehicles');
            if (!response.ok) {
                throw new Error('Failed to fetch vehicles');
            }
            const vehicles = await response.json();
            console.log('Fetched vehicles:', vehicles);
            localStorage.setItem('vehicles', JSON.stringify(vehicles)); // Save vehicles to local storage
            filterAndRenderVehicles(); // Render after fetching
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }

    function renderVehicleRequests(vehicles) {
        vehicleRequestsContent.innerHTML = ''; // Clear current content

        if (!vehicles || vehicles.length === 0) {
            const noDataDiv = document.createElement('div');
            noDataDiv.classList.add('no-data');
            noDataDiv.textContent = 'No vehicle requests available';
            vehicleRequestsContent.appendChild(noDataDiv);
            return;
        }

        vehicles.forEach(vehicle => {
            if (!vehicle.driverID) {
                console.error('Driver ID is missing for vehicle:', vehicle);
                return;
            }

            if (vehicle.vehicleStatus === 'Verified') {
                return; // Skip verified vehicles
            }

            console.log('Rendering vehicle:', vehicle); // Log the vehicle being rendered

            const vehicleRequestDiv = document.createElement('div');
            vehicleRequestDiv.classList.add('vehicle-request');

            vehicleRequestDiv.innerHTML = `
                <div class="info-container">
                    <div class="info-item">
                        <span>Driver ID:</span>
                        <div class="value">${vehicle.driverID}</div>
                    </div>
                    <div class="info-item">
                        <span>License Plate:</span>
                        <div class="value">${vehicle.licensePlateNumber}</div>
                    </div>
                    <div class="info-item">
                        <span>Model:</span>
                        <div class="value">${vehicle.model}</div>
                    </div>
                    <div class="info-item">
                        <span>Seats:</span>
                        <div class="value">${vehicle.numberOfSeats}</div>
                    </div>
                    <div class="info-item">
                        <span>Make:</span>
                        <div class="value">${vehicle.make}</div>
                    </div>
                    <div class="info-item">
                        <span>Insurance Expiry:</span>
                        <div class="value">${vehicle.insuranceExpiryDate}</div>
                    </div>
                    <div class="info-item">
                        <span>Year:</span>
                        <div class="value">${vehicle.year}</div>
                    </div>
                    <div class="info-item">
                        <span>Registration Expiry:</span>
                        <div class="value">${vehicle.registrationExpiryDate}</div>
                    </div>
                    <div class="info-item">
                        <span>Color:</span>
                        <div class="value">${vehicle.color}</div>
                    </div>
                </div>
                <div class="media-container">
                    <div class="photos">
                        <span>Photos:</span>
                        <div class="value">${vehicle.profilePicture1Path || 'No photos available'}</div>
                    </div>
                    <div class="documents">
                        <span>Documents:</span>
                        <div class="value">${vehicle.profilePicture2Path || 'No documents available'}</div>
                    </div>
                </div>
                <div class="actions">
                    <button class="accept-button" data-vehicle-id="${vehicle.vehicleID}">Accept</button>
                    <button class="reject-button" data-vehicle-id="${vehicle.vehicleID}">Reject</button>
                </div>
            `;

            vehicleRequestsContent.appendChild(vehicleRequestDiv);
        });

        // Adding event listeners for the Accept and Reject buttons after rendering
        document.querySelectorAll('.accept-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const vehicleId = event.target.getAttribute('data-vehicle-id');
                console.log('Accepting vehicle with ID:', vehicleId); // Log the vehicle ID
                handleAccept(vehicleId);
            });
        });

        document.querySelectorAll('.reject-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const vehicleId = event.target.getAttribute('data-vehicle-id');
                console.log('Rejecting vehicle with ID:', vehicleId); // Log the vehicle ID
                handleReject(vehicleId);
            });
        });
    }

    // Function to handle accepting a vehicle
    async function handleAccept(vehicleId) {
        try {
            const response = await fetch(`http://localhost:5179/api/Admin/verify/${vehicleId}`, {
                method: 'POST'
            });
            const result = await response.text();
            if (response.ok) {
                showModal('Vehicle accepted successfully.');
                fetchAllVehicles(); // Re-fetch vehicles to update the list
            } else {
                showModal(result);
            }
        } catch (error) {
            console.error('Error accepting vehicle:', error);
        }
    }

    // Function to handle rejecting a vehicle
    async function handleReject(vehicleId) {
        try {
            const response = await fetch(`http://localhost:5179/api/Admin/Delete-Vehicle/${vehicleId}`, {
                method: 'DELETE'
            });
            const result = await response.text();
            if (response.ok) {
                showModal('Vehicle rejected successfully.');
                fetchAllVehicles(); // Re-fetch vehicles to update the list
            } else {
                showModal(result);
            }
        } catch (error) {
            console.error('Error rejecting vehicle:', error);
        }
    }

    // Function to render vehicle requests based on search and sort
    function filterAndRenderVehicles() {
        const searchValue = searchDriverIdInput.value.toLowerCase();
        const sortOrder = sortOrderSelect.value;

        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        console.log('Vehicles from storage:', vehicles);

        let filteredRequests = vehicles.filter(vehicle => {
            if (!vehicle.driverID) {
                console.error('Driver ID is missing for vehicle:', vehicle);
                return false;
            }
            return vehicle.driverID.toString().toLowerCase().includes(searchValue) && vehicle.vehicleStatus !== 'Verified';
        });

        if (sortOrder === 'newest') {
            filteredRequests.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        } else {
            filteredRequests.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        }

        renderVehicleRequests(filteredRequests);
    }

    // Function to show modal
    function showModal(message) {
        modalBody.textContent = message;
        modal.style.display = "block";
        setTimeout(() => {
            modal.style.display = "none";
        }, 2000);
    }

    // Initial fetch and render
    fetchAllVehicles();

    // Add event listeners
    searchButton.addEventListener('click', filterAndRenderVehicles);
    sortOrderSelect.addEventListener('change', filterAndRenderVehicles);
});
