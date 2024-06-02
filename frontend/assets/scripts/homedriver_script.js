document.addEventListener('DOMContentLoaded', () => {
    const driverName = localStorage.getItem('driverName');
    const driverSurname = localStorage.getItem('driverSurname');
    console.log('Retrieved driver name:', driverName);
    if (driverName && driverSurname) {
        document.getElementById('driver-name').textContent = driverName + ' ' + driverSurname;
        document.getElementById('fullname').textContent = driverName + ' ' + driverSurname;
    }
    
    const changeStatusButton = document.getElementById('change-status');
    const status = document.getElementById('status');
    const requestBoxesContainer = document.getElementById('request-boxes');
    let online = false;

    changeStatusButton.addEventListener('click', () => {
        online = !online;
        status.textContent = online ? 'Online' : 'Offline';
        if (!online) {
            clearRequests();
        }
    });

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
});

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