function initMap() {
    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(41.328971, 19.819183), // Default center
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var marker = new google.maps.Marker({
        map: map,
        title: 'Your Location'
    });

    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({
        map: map
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Set marker position
            marker.setPosition(pos);
            // Center the map on the new position
            map.setCenter(pos);

            // Calculate and display the route
            calculateAndDisplayRoute(directionsService, directionsRenderer, pos);

        }, function(error) {
            handleLocationError(true, map.getCenter());
        }, {
            enableHighAccuracy: true, 
            maximumAge: 100000, 
            timeout: 1000000
        });        
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, pos) {
    var destination = { lat: 41.327846, lng: 19.821429 }; // Example coordinates for a destination
    directionsService.route({
        origin: pos,
        destination: destination,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    alert(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function rateStar(starNum) {
    const stars = document.querySelectorAll('.stars-rating svg');
    stars.forEach((star, index) => {
        if (index < starNum) {
            star.classList.add('selected'); 
        } else {
            star.classList.remove('selected');
        }
    });
}

document.querySelectorAll('.cancel-ride-button').forEach(button => {
    button.addEventListener('click', function() {
        // Logic to cancel the ride
        alert('Ride cancelled successfully.');
    });
});