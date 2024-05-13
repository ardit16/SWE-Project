async function initMap() {
    var mapOptions = {
        center: new google.maps.LatLng(41.328971, 19.819183),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    var autocompleteOptions = {
        componentRestrictions: {
            country: "al" 
        }
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

    document.getElementById("ride-form").addEventListener("submit", function (event) {
        event.preventDefault();
        if (pickupLocation && dropoffLocation) {
            calculateAndDisplayRoute(directionsService, directionsRenderer, pickupLocation, dropoffLocation);
        } else {
            alert("Please select both pickup and dropoff locations.");
        }
    });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer, pickupLocation, dropoffLocation) {
    directionsService.route(
        {
            origin: pickupLocation,
            destination: dropoffLocation,
            travelMode: google.maps.TravelMode.DRIVING
        },
        function(response, status) {
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
        }
    );
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