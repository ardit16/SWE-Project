document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('2faEmail');
    console.log('Retrieved email from local storage:', email); // Debugging line
    if (!email) {
        alert('No email found for 2FA. Please log in again.');
        window.location.href = 'login_driver.html';
        return;
    }

    const form = document.querySelector('form');
    const codeInput = document.getElementById('code');
    const resendButton = document.getElementById('resend-button'); // Added this line

    resendButton.addEventListener('click', async function() {
        const formData = new FormData();
        formData.append('Email', email);

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/Resend_2FA', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                showModal('A new 2FA code has been sent to your email.');
            } else {
                const errorText = await response.text();
                showModal('Error: ' + errorText, 0);
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('An error occurred. Please try again.');
        }
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const code = codeInput.value;

        const formData = new FormData();
        formData.append('Email', email);
        formData.append('Code', code);

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/Check_2FA_Driver', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                window.location.href = 'home_driver.html'; // or your intended URL
            } else if (response.status === 404) {
                showModal('Code is not correct,check and try again.');
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