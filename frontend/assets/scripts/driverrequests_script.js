document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    const driverRequestsContent = document.getElementById('driver-requests-content');
    const searchNameInput = document.getElementById('search-name');
    const sortOrderSelect = document.getElementById('sort-order');
    const searchButton = document.getElementById('search-button');

    if (!driverRequestsContent) {
        console.error("driver-requests-content not found");
        return;
    }

    // Example driver requests data
    const exampleDriverRequests = [
        {
            name: 'John',
            surname: 'Doe',
            birthday: '01/01/1990',
            email: 'johndoe@example.com',
            phone: '123-456-7890',
            profilePhoto: 'https://via.placeholder.com/100',
            licensePhoto: 'https://via.placeholder.com/100',
            timestamp: new Date('2023-01-01')
        },
        {
            name: 'Jane',
            surname: 'Smith',
            birthday: '02/02/1985',
            email: 'janesmith@example.com',
            phone: '098-765-4321',
            profilePhoto: 'https://via.placeholder.com/100',
            licensePhoto: 'https://via.placeholder.com/100',
            timestamp: new Date('2023-02-01')
        }
    ];

    // Function to add a driver request to the content
    function addDriverRequest(request) {
        console.log("Adding driver request", request);
        const driverRequestDiv = document.createElement('div');
        driverRequestDiv.classList.add('driver-request');

        driverRequestDiv.innerHTML = `
            <div class="driver-info">
                <img src="${request.profilePhoto}" alt="Profile Photo" class="profile-photo">
                <div class="info">
                    <p><strong>Name:</strong> ${request.name}</p>
                    <p><strong>Surname:</strong> ${request.surname}</p>
                    <p><strong>Birthday:</strong> ${request.birthday}</p>
                    <p><strong>Email:</strong> ${request.email}</p>
                    <p><strong>Phone:</strong> ${request.phone}</p>
                </div>
            </div>
            <div class="driver-docs">
                <img src="${request.licensePhoto}" alt="License Photo" class="license-photo">
            </div>
            <div class="actions">
                <button class="accept-button">Accept</button>
                <button class="reject-button">Reject</button>
            </div>
        `;

        driverRequestsContent.appendChild(driverRequestDiv);
    }

    // Function to render driver requests based on search and sort
    function renderDriverRequests() {
        driverRequestsContent.innerHTML = ''; // Clear current content

        const searchValue = searchNameInput.value.toLowerCase();
        const sortOrder = sortOrderSelect.value;

        let filteredRequests = exampleDriverRequests.filter(request => 
            request.name.toLowerCase().includes(searchValue) || 
            request.surname.toLowerCase().includes(searchValue)
        );

        if (sortOrder === 'newest') {
            filteredRequests.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            filteredRequests.sort((a, b) => a.timestamp - b.timestamp);
        }

        filteredRequests.forEach(addDriverRequest);
    }

    // Initial render
    renderDriverRequests();

    // Add event listeners
    searchButton.addEventListener('click', renderDriverRequests);
    sortOrderSelect.addEventListener('change', renderDriverRequests);
});