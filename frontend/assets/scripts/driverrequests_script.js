document.addEventListener('DOMContentLoaded', () => {
    const driverRequestsContent = document.getElementById('driver-requests-content');
    const searchNameInput = document.getElementById('search-name');
    const sortOrderSelect = document.getElementById('sort-order');
    const searchButton = document.getElementById('search-button');
    const modal = document.getElementById('errorModal');
    const modalBody = document.getElementById('errorMessage');
    const closeButton = document.querySelector('.close');

    if (!driverRequestsContent) {
        console.error("driver-requests-content not found");
        return;
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    async function fetchAllDrivers() {
        try {
            const response = await fetch('http://localhost:5179/api/Admin/Get-All-Drivers');
            if (!response.ok) {
                throw new Error('Failed to fetch drivers');
            }
            const drivers = await response.json();
            console.log('Fetched drivers:', drivers);
            localStorage.setItem('drivers', JSON.stringify(drivers)); // Save drivers to local storage
            filterAndRenderDrivers(); // Render after fetching
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    }

    function renderDriverRequests(drivers) {
        driverRequestsContent.innerHTML = ''; // Clear current content

        if (!drivers || drivers.length === 0) {
            const noDataDiv = document.createElement('div');
            noDataDiv.classList.add('no-data');
            noDataDiv.textContent = 'No driver requests available';
            driverRequestsContent.appendChild(noDataDiv);
            return;
        }

        drivers.forEach(driver => {
            if (driver.verified) {
                return; // Skip verified drivers
            }

            console.log('Rendering driver:', driver); // Log the driver being rendered

            // Check if driver.driverID exists and log it
            if (!driver.driverID) {
                console.error('Driver ID is missing for driver:', driver);
                return;
            }

            const driverRequestDiv = document.createElement('div');
            driverRequestDiv.classList.add('driver-request');

            driverRequestDiv.innerHTML = `
                <div class="driver-info">
                    <img src="./assets/images/${driver.profilePicturePath || 'default-profile.png'}" alt="Profile Photo" class="profile-photo">
                    <div class="info">
                        <p><strong>Name:</strong> ${driver.name}</p>
                        <p><strong>Surname:</strong> ${driver.surname}</p>
                        <p><strong>Birthday:</strong> ${driver.birthday}</p>
                        <p><strong>Email:</strong> ${driver.email}</p>
                        <p><strong>Phone:</strong> ${driver.phoneNumber}</p>
                    </div>
                </div>
                <div class="driver-docs">
                    <img src="./assets/images/${driver.driverLicensePath || 'default-license.png'}" alt="License Photo" class="license-photo">
                </div>
                <div class="actions">
                    <button class="accept-button" data-driver-id="${driver.driverID}">Accept</button>
                    <button class="reject-button" data-driver-id="${driver.driverID}">Reject</button>
                </div>
            `;

            driverRequestsContent.appendChild(driverRequestDiv);
        });

        // Adding event listeners for the Accept and Reject buttons after rendering
        document.querySelectorAll('.accept-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const driverId = event.target.getAttribute('data-driver-id');
                console.log('Accepting driver with ID:', driverId); // Log the driver ID
                handleAccept(driverId);
            });
        });

        document.querySelectorAll('.reject-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const driverId = event.target.getAttribute('data-driver-id');
                console.log('Rejecting driver with ID:', driverId); // Log the driver ID
                handleReject(driverId);
            });
        });
    }

    // Function to handle accepting a driver
    async function handleAccept(driverId) {
        try {
            const response = await fetch(`http://localhost:5179/api/Admin/Accept-Driver/${driverId}`, {
                method: 'POST'
            });
            const result = await response.text();
            if (response.ok) {
                showModal('Driver accepted successfully.');
                fetchAllDrivers(); // Re-fetch drivers to update the list
            } else {
                showModal(result);
            }
        } catch (error) {
            console.error('Error accepting driver:', error);
        }
    }

    // Function to handle rejecting a driver
    async function handleReject(driverId) {
        try {
            const response = await fetch(`http://localhost:5179/api/Admin/Delete-Driver/${driverId}`, {
                method: 'DELETE'
            });
            const result = await response.text();
            if (response.ok) {
                showModal('Driver rejected successfully.');
                fetchAllDrivers(); // Re-fetch drivers to update the list
            } else {
                showModal(result);
            }
        } catch (error) {
            console.error('Error rejecting driver:', error);
        }
    }

    // Function to render driver requests based on search and sort
    function filterAndRenderDrivers() {
        const searchValue = searchNameInput.value.toLowerCase();
        const sortOrder = sortOrderSelect.value;

        let drivers = JSON.parse(localStorage.getItem('drivers')) || [];

        let filteredRequests = drivers.filter(driver => 
            (driver.name.toLowerCase().includes(searchValue) || 
            driver.surname.toLowerCase().includes(searchValue)) &&
            !driver.verified // Exclude verified drivers
        );

        if (sortOrder === 'newest') {
            filteredRequests.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        } else {
            filteredRequests.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        }

        renderDriverRequests(filteredRequests);
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
    fetchAllDrivers();

    // Add event listeners
    searchButton.addEventListener('click', filterAndRenderDrivers);
    sortOrderSelect.addEventListener('change', filterAndRenderDrivers);
});
