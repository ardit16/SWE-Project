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
            if (newStatus) {
                await fetchRideRequests(driverId);
            }
        } catch (error) {
            console.error('Error changing driver status:', error);
        }
    });

    document.getElementById('logout').addEventListener('click', logout);

    // Initial fetch of ride requests
    if (document.getElementById('status').textContent === 'Online') {
        await fetchRideRequests(driverId);
    }
});

async function fetchDriverStatus(driverId) {
    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/status`);
        if (!response.ok) {
            throw new Error(`Failed to fetch driver status. Status: ${response.status}`);
        }
        const { status } = await response.json();
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

async function fetchRideRequests(driverId) {
    try {
        const response = await fetch('http://localhost:5179/api/Driver/riderequests');
        if (!response.ok) {
            throw new Error(`Failed to fetch ride requests. Status: ${response.status}`);
        }
        const rideRequests = await response.json();
        manageRequestQueue(rideRequests, driverId);
    } catch (error) {
        console.error('Error fetching ride requests:', error);
    }
}

async function fetchRiderProfile(riderId) {
    try {
        const response = await fetch(`http://localhost:5179/api/Rider/${riderId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch rider profile. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching rider profile:', error);
        return null;
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
        const { status } = await response.json();
        return status;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const requestQueue = [];

async function manageRequestQueue(rideRequests, driverId) {
    requestQueue.push(...rideRequests);

    const maxRequests = 2;
    const requestBoxesContainer = document.getElementById('request-boxes');
    requestBoxesContainer.innerHTML = ''; // Clear previous requests

    for (let i = 0; i < Math.min(requestQueue.length, maxRequests); i++) {
        const request = requestQueue.shift();
        await addRequestBox(request, driverId, requestBoxesContainer);
    }
}

async function addRequestBox(request, driverId, requestBoxesContainer) {
    const riderProfile = await fetchRiderProfile(request.riderID);
    const riderName = riderProfile ? `${riderProfile.name} ${riderProfile.surname}` : 'Unknown';
    const riderRating = riderProfile ? riderProfile.ovrating : 'N/A';

    // Calculate duration
    const rideStartTime = new Date(request.rideStartTime);
    const rideEndTime = new Date(request.rideEndTime);
    const durationMinutes = Math.round((rideEndTime - rideStartTime) / 60000);

    const requestBox = document.createElement('div');
    requestBox.classList.add('request-box');

    requestBox.innerHTML = `
        <div class="request-header">
            <h3>${riderName}</h3>
            <div class="rating">${riderRating}</div>
        </div>
        <div class="request-details">
            <div class="detail-item">
                <span>Pickup from:</span> <span>${request.pickUpName}</span>
            </div>
            <div class="detail-item">
                <span>Drop off at:</span> <span>${request.dropOffName}</span>
            </div>
            <div class="detail-item">
                <span>Distance:</span> <span>${request.rideDistance} km</span>
            </div>
            <div class="detail-item">
                <span>Duration:</span> <span>${durationMinutes} min</span>
            </div>
            <div class="detail-item">
                <span>Price:</span> <span>${request.amount} ALL</span>
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
        addNextRequest(driverId, requestBoxesContainer);
    });

    const acceptButton = requestBox.querySelector('.accept');
    acceptButton.addEventListener('click', async () => {
        await handleRideAcceptance(request.rideID, driverId);
        requestBox.remove();
        addNextRequest(driverId, requestBoxesContainer);
    });

    setTimeout(() => {
        if (requestBox.parentNode) {
            requestBox.remove();
            addNextRequest(driverId, requestBoxesContainer);
        }
    }, 120000); // Remove request after 2 minutes
}

function addNextRequest(driverId, requestBoxesContainer) {
    if (requestQueue.length > 0) {
        const nextRequest = requestQueue.shift();
        addRequestBox(nextRequest, driverId, requestBoxesContainer);
    }
}

async function handleRideAcceptance(rideId, driverId) {
    try {
        const response = await fetch('http://localhost:5179/api/Driver/assigndriver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ RideID: rideId, DriverID: driverId })
        });

        if (response.ok) {
            console.log('Ride accepted successfully');
            window.location.href = 'onride_driver.html'; // Redirect to ride start page
        } else {
            console.error('Failed to accept ride', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error accepting ride:', error);
    }
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverSurname');
    localStorage.removeItem('driverId');
    window.location.href = 'index.html'; 
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