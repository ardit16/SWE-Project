document.addEventListener('DOMContentLoaded', function() {
    const userTypeSelect = document.getElementById('user-type');
    const sortOrderSelect = document.getElementById('sort-order');
    const searchButton = document.getElementById('search-button');
    const searchIdInput = document.getElementById('search-id');
    const ratingsTableBody = document.getElementById('ratings-table').querySelector('tbody');

    // Example data for drivers and riders
    const driversData = [
        { id: 1, fullName: 'John Doe', email: 'john@example.com', phoneNumber: '+123456789', rating: 4.5 },
        { id: 2, fullName: 'Sam Brown', email: 'sam@example.com', phoneNumber: '+5647382910', rating: 4.9 },
        // Add more example driver data as needed
    ];

    const ridersData = [
        { id: 3, fullName: 'Jane Smith', email: 'jane@example.com', phoneNumber: '+987654321', rating: 3.7 },
        { id: 4, fullName: 'Alice Johnson', email: 'alice@example.com', phoneNumber: '+4321567890', rating: 2.5 },
        // Add more example rider data as needed
    ];

    function renderTable(data) {
        ratingsTableBody.innerHTML = ''; // Clear existing rows

        data.forEach(item => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.fullName}</td>
                <td>${item.email}</td>
                <td>${item.phoneNumber}</td>
                <td>${item.rating}</td>
                <td>
                    <button class="btn btn-view">View Profile</button>
                    <button class="btn btn-delete">Delete</button>
                </td>
            `;

            ratingsTableBody.appendChild(row);

            // Add event listeners for buttons
            row.querySelector('.btn-view').addEventListener('click', () => viewProfile(item.id));
            row.querySelector('.btn-delete').addEventListener('click', () => deleteUser(item.id));
        });
    }

    function filterAndSortData() {
        const userType = userTypeSelect.value;
        const sortOrder = sortOrderSelect.value;
        const searchId = searchIdInput.value.trim();

        let data = userType === 'drivers' ? driversData : ridersData;

        if (searchId) {
            data = data.filter(item => item.id.toString() === searchId);
        }

        data.sort((a, b) => {
            if (sortOrder === 'highest') {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });

        renderTable(data);
    }

    function viewProfile(id) {
        // Logic to view profile
        alert(`Viewing profile of user with ID: ${id}`);
        // Redirect or display profile information
    }

    function deleteUser(id) {
        // Logic to delete user
        const confirmDelete = confirm(`Are you sure you want to delete the user with ID: ${id}?`);
        if (confirmDelete) {
            // Remove user from the appropriate data set
            const data = userTypeSelect.value === 'drivers' ? driversData : ridersData;
            const index = data.findIndex(item => item.id === id);
            if (index !== -1) {
                data.splice(index, 1);
                filterAndSortData(); // Re-render table after deletion
            }
        }
    }

    searchButton.addEventListener('click', filterAndSortData);
    userTypeSelect.addEventListener('change', filterAndSortData);
    sortOrderSelect.addEventListener('change', filterAndSortData);

    // Initial render
    filterAndSortData();
});