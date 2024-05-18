document.addEventListener('DOMContentLoaded', () => {
    const pickingUpBox = document.querySelector('.pickingup-box');
    const droppingOffBox = document.querySelector('.droppingoff-box');
    const feedbackBox = document.querySelector('.feedback-box');

    // Show the picking up box initially
    pickingUpBox.style.display = 'inline-block';

    // Example of how to switch to the dropping off box
    setTimeout(() => {
        pickingUpBox.style.display = 'none';
        droppingOffBox.style.display = 'inline-block';
    }, 10000); // Switch after 5 seconds for demonstration

    // Example of how to switch to the feedback box
    setTimeout(() => {
        droppingOffBox.style.display = 'none';
        feedbackBox.style.display = 'inline-block';
    }, 20000); // Switch after another 5 seconds for demonstration

    document.querySelectorAll('.cancel-ride-button').forEach(button => {
        button.addEventListener('click', function() {
            // Logic to cancel the ride
            alert('Ride cancelled successfully.');
        });
    });
});

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