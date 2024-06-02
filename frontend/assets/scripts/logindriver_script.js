document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData();
        formData.append('Email', document.getElementById('email').value);
        formData.append('Password', document.getElementById('password').value);

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/LogInDriver', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login result:', result);

                // Store driver's name and ID in local storage
                localStorage.setItem('driverName', result.name);
                localStorage.setItem('driverSurname', result.surname);
                localStorage.setItem('driverId', result.id);

                if (result.verified!=1) {
                    showModal('Login unsuccessful, you haven\'t been verified yet!');
                } else if (result.twoFactorEnabled) {
                    console.log('TwoFactorEnabled is true, redirecting to 2FA');
                    localStorage.setItem('2faEmail', result.email);
                    window.location.href = '2fa_d.html';
                } else {
                    console.log('TwoFactorEnabled is false, redirecting to home');
                    window.location.href = 'home_driver.html'; // or your intended URL
                }
            } else if (response.status === 404) {
                showModal('Email or password is not correct,check and try again.');
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
});