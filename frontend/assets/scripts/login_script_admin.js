document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData();
        formData.append('Email', document.getElementById('email').value);
        formData.append('Password', document.getElementById('password').value);

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/LogInAdmin', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {  // Fix the condition here
                const result = await response.json();
                console.log('Login result:', result);

                // Check the structure of the result object
                if (result.name && result.surname) {                    
                    // Store admin's name and ID in local storage
                    localStorage.setItem('adminName', result.name);
                    localStorage.setItem('adminSurname', result.surname);
                    localStorage.setItem('adminId', result.id);

                    window.location.href = 'home_admin.html'; // Change this to the actual URL of your admin homepage
                } else {
                    console.error('API response does not contain name or surname.');
                    showModal('An error occurred. Please try again.');
                }
            } else if (response.status === 404) {
                showModal('Email or password is not correct, check and try again.');
            } else {
                const errorText = await response.text();
                console.error('Login error:', errorText); // Log errors
                showModal('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error); // Log exceptions
            showModal('An error occurred. Please try again.');
        }
    });

    function showModal(message) {
        const modal = document.getElementById('errorModal');
        const modalMessage = document.getElementById('errorMessage');
        modalMessage.textContent = message;

        modal.style.display = 'block';

        const closeButton = document.getElementsByClassName('close')[0];
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
});
