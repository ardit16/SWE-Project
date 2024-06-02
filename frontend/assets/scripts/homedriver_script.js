document.addEventListener('DOMContentLoaded', async function() {
    const driverName = localStorage.getItem('driverName');
    const driverSurname = localStorage.getItem('driverSurname');
    const driverId = localStorage.getItem('driverId');
    console.log('Retrieved driver name:', driverName);
    if (driverName && driverSurname) {
        document.getElementById('driver-name').textContent = driverName + ' ' + driverSurname;
        document.getElementById('fullname').textContent = driverName + ' ' + driverSurname;
    }

    try {
        const driverStatus = await fetchDriverStatus(driverId);
        updateStatusText(driverStatus);
        const vehicles = await fetchDriverVehicles(driverId);
        populateVehicleDropdown(vehicles);
    } catch (error) {
        console.error('Error:', error);
    }

    const changeStatusButton = document.getElementById('change-status');
    changeStatusButton.addEventListener('click', async () => {
        try {
            const newStatus = await toggleDriverStatus(driverId);
            updateStatusText(newStatus);
        } catch (error) {
            console.error('Error changing driver status:', error);
        }
    });
    document.getElementById('logout').addEventListener('click', logout);
});

async function fetchDriverStatus(driverId) {
    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/status`);
        if (!response.ok) {
            throw new Error(`Failed to fetch driver status. Status: ${response.status}`);
        }
        const status = await response.json();
        return status;
    } catch (error) {
        console.error('Error:', error);
        return false; // Default to offline if there's an error
    }
}

async function fetchDriverVehicles(driverId) {
    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/view-cars`);
        if (!response.ok) {
            throw new Error(`Failed to fetch driver vehicles. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function populateVehicleDropdown(vehicles) {
    const vehicleDropdown = document.getElementById('vehicle-dropdown');
    vehicleDropdown.innerHTML = '';
    const verifiedVehicles = vehicles.filter(vehicle => vehicle.vehicleStatus === "Verified");

    if (verifiedVehicles.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No verified vehicles';
        vehicleDropdown.appendChild(option);
    } else {
        verifiedVehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.licensePlateNumber;
            option.textContent = vehicle.licensePlateNumber;
            vehicleDropdown.appendChild(option);
        });
    }
}

function updateStatusText(status) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = status ? 'Online' : 'Offline';
}

async function toggleDriverStatus(driverId) {
    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/toggle-status`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`Failed to change driver status. Status: ${response.status}`);
        }
        const status = await response.json();
        return status;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverSurname');
    localStorage.removeItem('driverId');
    window.location.href = 'index.html'; 
}

    // Simulate receiving ride requests
    setInterval(() => {
        if (online) {
            addRideRequest();
        }
    }, 10000); // Simulate new request every 10 seconds

    function addRideRequest() {
        const currentRequests = requestBoxesContainer.children.length;

        if (currentRequests < 2) {
            const requestBox = document.createElement('div');
            requestBox.classList.add('request-box');

            requestBox.innerHTML = `
                <div class="request-header">
                    <h3>Rider Name</h3>
                    <div class="rating">4.3</div>
                </div>
                <div class="request-details">
                    <div class="detail-item">
                        <span>Pickup from:</span> <span>Location A</span>
                    </div>
                    <div class="detail-item">
                        <span>Drop off at:</span> <span>Location B</span>
                    </div>
                    <div class="detail-item">
                        <span>Distance:</span> <span>5 km</span>
                    </div>
                    <div class="detail-item">
                        <span>Duration:</span> <span>10 min</span>
                    </div>
                    <div class="detail-item">
                        <span>Price:</span> <span>500 ALL</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="accept">Accept</button>
                    <button class="reject">Reject</button>
                </div>
            `;

            requestBoxesContainer.appendChild(requestBox);

            const rejectButton = requestBox.querySelector('.reject');
            rejectButton.addEventListener('click', () => {
                requestBox.remove();
            });

            const acceptButton = requestBox.querySelector('.accept');
            acceptButton.addEventListener('click', () => {
                // Handle ride acceptance
                requestBox.remove();
                window.location.href = 'start_ride.html'; // Redirect to ride start page
            });

            setTimeout(() => {
                if (requestBox.parentNode) {
                    requestBox.remove();
                }
            }, 60000); // Remove request after 1 minute
        }
    }

    function clearRequests() {
        while (requestBoxesContainer.firstChild) {
            requestBoxesContainer.removeChild(requestBoxesContainer.firstChild);
        }
    }

async function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(41.328971, 19.819183),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,  
        streetViewControl: false,  
        fullscreenControl: true 
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}