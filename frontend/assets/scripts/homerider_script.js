document.addEventListener('DOMContentLoaded', async function() {
    const riderName = localStorage.getItem('riderName');
    const riderSurname = localStorage.getItem('riderSurname');
    const riderId = localStorage.getItem('riderId');
    console.log('Retrieved rider name:', riderName);
    
    if (riderName && riderSurname) {
        document.getElementById('rider-name').textContent = riderName + ' ' + riderSurname;
    }

    try {
        const paymentMethods = await fetchPaymentMethods(riderId);
        console.log('Payment Methods:', paymentMethods);
        populatePaymentMethods(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
    }

    document.getElementById('logout').addEventListener('click', logout);
});

async function fetchPaymentMethods(riderId) {
    try {
        const response = await fetch(`http://localhost:5179/api/Rider/${riderId}/paymentmethods`);
        if (!response.ok) {
            throw new Error(`Failed to fetch payment methods. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [{ paymentType: 'Cash' }];
    }
}

function populatePaymentMethods(paymentMethods) {
    const paymentSelect = document.getElementById('payment-method');
    paymentSelect.innerHTML = '';

    paymentMethods.forEach(method => {
        if (method && method.paymentType) {
            const option = document.createElement('option');
            if (method.paymentType.toLowerCase() === 'cash') {
                option.value = 'cash';
                option.textContent = 'Cash';
            } else if (method.paymentType.toLowerCase() === 'creditcard') {
                const lastFourDigits = method.cardNumber.slice(-4);
                option.value = method.paymentType.toLowerCase().replace(' ', '-');
                option.textContent = `** ${lastFourDigits}`;
            }
            paymentSelect.appendChild(option);
        } else {
            console.error('Invalid payment method format:', method);
        }
    });

    // Ensure Cash is always an option
    if (!paymentMethods.some(method => method && method.paymentType && method.paymentType.toLowerCase() === 'cash')) {
        const cashOption = document.createElement('option');
        cashOption.value = 'cash';
        cashOption.textContent = 'Cash';
        paymentSelect.appendChild(cashOption);
    }

    console.log('Payment methods populated:', paymentSelect.innerHTML);
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
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    var autocompleteOptions = {
        componentRestrictions: { country: "al" }
    };

    var pickupInput = document.getElementById("pickup");
    var dropoffInput = document.getElementById("dropoff");

    var pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput, autocompleteOptions);
    var dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInput, autocompleteOptions);

    var pickupLocation = null;
    var dropoffLocation = null;

    google.maps.event.addListener(pickupAutocomplete, 'place_changed', function () {
        var place = pickupAutocomplete.getPlace();
        if (place.geometry) {
            pickupLocation = place.geometry.location;
            map.setCenter(pickupLocation);
            if (dropoffLocation) {
                calculateAndDisplayRoute(directionsService, directionsRenderer, pickupLocation, dropoffLocation);
            }
        }
    });

    google.maps.event.addListener(dropoffAutocomplete, 'place_changed', function () {
        var place = dropoffAutocomplete.getPlace();
        if (place.geometry) {
            dropoffLocation = place.geometry.location;
            if (pickupLocation) {
                calculateAndDisplayRoute(directionsService, directionsRenderer, pickupLocation, dropoffLocation);
            }
        }
    });

    document.getElementById("ride-form").addEventListener("submit", function(event) {
        event.preventDefault();
        if (pickupLocation && dropoffLocation) {
            calculateAndDisplayRoute(directionsService, directionsRenderer, pickupLocation, dropoffLocation);
        } else {
            alert("Please select both pickup and dropoff locations.");
        }
    });

    document.getElementById("choose-ride").addEventListener("click", async function() {
        await submitRideRequest(pickupLocation, dropoffLocation);
    });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, pickupLocation, dropoffLocation) {
    directionsService.route({
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === "OK") {
            directionsRenderer.setDirections(response);
            var route = response.routes[0];
            var distance = route.legs[0].distance.text;
            var duration = route.legs[0].duration.text;
            var price = calculatePrice(route.legs[0].distance.value);

            document.getElementById("distance").textContent = distance;
            document.getElementById("duration").textContent = duration;
            document.getElementById("price").textContent = price;

            document.getElementById("return-box").style.display = "block";
        } else {
            window.alert("Directions request failed due to " + status);
        }
    });
}

function calculatePrice(distanceInMeters) {
    var baseFare = 300;
    var rateTier1 = 100;
    var rateTier2 = 80;
    var rateTier3 = 65;

    var distanceInKm = distanceInMeters / 1000;

    if (distanceInKm <= 1.5) {
        return baseFare.toFixed(2);
    } else if (distanceInKm <= 6.5) {
        return (baseFare + rateTier1 * (distanceInKm - 1.5)).toFixed(2);
    } else if (distanceInKm <= 16.5) {
        return (baseFare + rateTier1 * 5 + rateTier2 * (distanceInKm - 6.5)).toFixed(2);
    } else {
        return (baseFare + rateTier1 * 5 + rateTier2 * 10 + rateTier3 * (distanceInKm - 16.5)).toFixed(2);
    }
}

async function submitRideRequest(pickupLocation, dropoffLocation) {
    const riderId = localStorage.getItem('riderId');

    // Check for existing pending ride request and delete if found
    try {
        const existingRidesResponse = await fetch(`http://localhost:5179/api/Rider/${riderId}/pendingrides`);
        if (existingRidesResponse.ok) {
            const pendingRides = await existingRidesResponse.json();
            for (const ride of pendingRides) {
                await fetch(`http://localhost:5179/api/Rider/${ride.rideID}`, {
                    method: 'DELETE'
                });
            }
        }
    } catch (error) {
        console.error('Error checking for existing pending rides:', error);
    }

    const pickup = document.getElementById("pickup").value.split(' ').slice(0, 2).join(' ');
    const dropoff = document.getElementById("dropoff").value.split(' ').slice(0, 2).join(' ');
    const paymentMethod = document.getElementById("payment-method").value;
    const amount = parseFloat(document.getElementById("price").textContent);
    const rideDistance = parseFloat(document.getElementById("distance").textContent.split(' ')[0]);
    const rideDuration = document.getElementById("duration").textContent;

    const rideStartTime = new Date();
    const durationInMinutes = parseFloat(rideDuration.split(' ')[0]);
    const rideEndTime = new Date(rideStartTime.getTime() + durationInMinutes * 60000);

    const rideRequestDto = {
        pickupLocationLONG: pickupLocation.lng(),
        pickupLocationLAT: pickupLocation.lat(),
        pickUpName: pickup,
        dropOffLocationLONG: dropoffLocation.lng(),
        dropOffLocationLAT: dropoffLocation.lat(),
        dropOffName: dropoff,
        rideDate: rideStartTime.toISOString(),
        rideStartTime: rideStartTime.toISOString(),
        rideEndTime: rideEndTime.toISOString(),
        rideStatus: false,
        rideDistance: rideDistance,
        amount: amount,
        driverId: 1, // initial value, will be updated later
        riderID: parseInt(riderId)
    };

    console.log('Sending ride request:', rideRequestDto);

    try {
        const response = await fetch('http://localhost:5179/api/Rider/requestride', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rideRequestDto)
        });

        if (response.ok) {
            const rideResponse = await response.json(); // Assuming the response contains the created ride object with the rideID
            const rideId = rideResponse.rideID;
            console.log('Ride request successful with ID:', rideId);
            
            var statusMessage = document.getElementById("status-message");
            statusMessage.style.display = "block";
            statusMessage.innerHTML = 'Searching for drivers<span class="dot-one">.</span><span class="dot-two">.</span><span class="dot-three">.</span>';

            setTimeout(async () => {
                try {
                    const checkResponse = await fetch(`http://localhost:5179/api/Rider/${rideId}/checkstatus`);
                    if (checkResponse.ok) {
                        const rideStatus = await checkResponse.json();
                        if (!rideStatus.rideStatus) {
                            statusMessage.innerHTML = 'No drivers available at this moment.';
                            await fetch(`http://localhost:5179/api/Rider/${rideId}`, {
                                method: 'DELETE'
                            });
                        } else {
                            window.location.href = 'onride_rider.html'; // Redirect to ride start page
                        }
                    } else {
                        console.error('Failed to check ride status');
                    }
                } catch (error) {
                    console.error('Error checking ride status:', error);
                }
            }, 240000); // 4 minutes
        } else {
            let errorResponse;
            try {
                errorResponse = await response.json();
            } catch (e) {
                errorResponse = await response.text();
            }
            console.error('Ride request failed', response.status, response.statusText, errorResponse);
            showModal(`Ride request failed: ${errorResponse.title || errorResponse || 'Unknown error occurred.'}`);
        }
    } catch (error) {
        console.error('Error requesting ride:', error);
        showModal('An error occurred while requesting the ride');
    }
}

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

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('riderName');
    localStorage.removeItem('riderSurname');
    localStorage.removeItem('riderId');
    window.location.href = 'index.html'; 
}