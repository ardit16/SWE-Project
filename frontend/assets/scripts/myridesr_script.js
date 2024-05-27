document.addEventListener('DOMContentLoaded', function() {
    const rideData = [
        {
            pickupLocation: "123 Main St",
            dropoffLocation: "456 Elm St",
            distance: "10 km",
            startTime: "08:00 AM",
            arrivalTime: "08:30 AM",
            price: "$20",
            date: "2023-05-25",
            driverName: "John Doe",
            paymentMethod: "Credit Card"
        },
        {
            pickupLocation: "123 Main St",
            dropoffLocation: "456 Elm St",
            distance: "10 km",
            startTime: "08:00 AM",
            arrivalTime: "08:30 AM",
            price: "$20",
            date: "2022-05-25",
            driverName: "John Doe",
            paymentMethod: "Credit Card"
        },
    ];

    function renderRides(rides) {
        const ridesContainer = document.getElementById('rides-container');
        ridesContainer.innerHTML = ''; // Clear previous content

        rides.forEach(ride => {
            const rideBox = document.createElement('div');
            rideBox.className = 'ride-box';

            rideBox.innerHTML = `
                <div class="info-item">
                    <span>Pickup Location:</span>
                    <span class="value">${ride.pickupLocation}</span>
                </div>
                <div class="info-item">
                    <span>Dropoff Location:</span>
                    <span class="value">${ride.dropoffLocation}</span>
                </div>
                <div class="info-item">
                    <span>Distance:</span>
                    <span class="value">${ride.distance}</span>
                </div>
                <div class="info-item">
                    <span>Start Time:</span>
                    <span class="value">${ride.startTime}</span>
                </div>
                <div class="info-item">
                    <span>Arrival Time:</span>
                    <span class="value">${ride.arrivalTime}</span>
                </div>
                <div class="info-item">
                    <span>Price:</span>
                    <span class="value">${ride.price}</span>
                </div>
                <div class="info-item">
                    <span>Date:</span>
                    <span class="value">${ride.date}</span>
                </div>
                <div class="info-item">
                    <span>Driver Name:</span>
                    <span class="value">${ride.driverName}</span>
                </div>
                <div class="info-item">
                    <span>Payment Method:</span>
                    <span class="value">${ride.paymentMethod}</span>
                </div>
            `;

            ridesContainer.appendChild(rideBox);
        });
    }

    function filterRides(timeframe) {
        const now = new Date();
        let filteredRides = rideData;

        if (timeframe !== 'always') {
            filteredRides = rideData.filter(ride => {
                const rideDate = new Date(ride.date);
                switch (timeframe) {
                    case 'week':
                        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                        return rideDate >= oneWeekAgo;
                    case 'month':
                        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        return rideDate >= oneMonthAgo;
                    case 'year':
                        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                        return rideDate >= oneYearAgo;
                    default:
                        return true;
                }
            });
        }

        console.log(`Filtered Rides for timeframe (${timeframe}):`, filteredRides); // Debug output

        renderRides(filteredRides);
    }

    document.getElementById('ride-filter').addEventListener('change', function(event) {
        filterRides(event.target.value);
    });

    // Initial render
    filterRides('always');
});