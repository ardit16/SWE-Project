document.addEventListener('DOMContentLoaded', function() {
    const rideData = [
        {
            pickupLocation: "Rruga Frosina Plaku",
            dropoffLocation: "Rruga Kongresi i Manastirit",
            distance: "10 km",
            date: "2022-05-25",
            startTime: "08:00 AM",
            arrivalTime: "08:30 AM",
            riderName: "John Doe",
            price: "ALL 700",
            paymentMethod: "Credit Card"
        },
        {
            pickupLocation: "123 Main St",
            dropoffLocation: "456 Elm St",
            distance: "10 km",
            date: "2022-05-25",
            startTime: "08:00 AM",
            arrivalTime: "08:30 AM",
            riderName: "John Doe",
            price: "ALL 700",
            paymentMethod: "Credit Card"
        },
    ];

    function renderRides(rides) {
        const ridesContainer = document.getElementById('rides-container');
        ridesContainer.innerHTML = ''; // Clear previous content

        let totalEarnings = 0;

        rides.forEach(ride => {
            totalEarnings += parseFloat(ride.price.replace('ALL', ''));

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
                    <span>Rider Name:</span>
                    <span class="value">${ride.riderName}</span>
                </div>
                <div class="info-item">
                    <span>Payment Method:</span>
                    <span class="value">${ride.paymentMethod}</span>
                </div>
            `;

            ridesContainer.appendChild(rideBox);
        });

        document.getElementById('earnings-amount').textContent = totalEarnings.toFixed(2);
    }

    function filterRides(timeframe) {
        const now = new Date();
        let filteredRides = rideData;

        if (timeframe !== 'always') {
            filteredRides = rideData.filter(ride => {
                const rideDate = new Date(ride.date);
                switch (timeframe) {
                    case 'week':
                        const oneWeekAgo = new Date(now);
                        oneWeekAgo.setDate(now.getDate() - 7);
                        return rideDate >= oneWeekAgo;
                    case 'month':
                        const oneMonthAgo = new Date(now);
                        oneMonthAgo.setMonth(now.getMonth() - 1);
                        return rideDate >= oneMonthAgo;
                    case 'year':
                        const oneYearAgo = new Date(now);
                        oneYearAgo.setFullYear(now.getFullYear() - 1);
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