document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const closeModal = document.getElementsByClassName('close')[0];

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        if (email && password) {
            const formData = new FormData();
            formData.append('Email', email);
            formData.append('Password', password);

            try {
                const response = await fetch('http://localhost:5179/api/LogIn/LogInAdmin', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    // Handle successful login
                    alert('Login successful!');
                    console.log(result);
                    // Redirect to the admin dashboard
                    window.location.href = 'home_admin.html'; // Change this to the actual URL of your admin homepage
                } else {
                    // Handle login error
                    showErrorModal(result || 'Invalid email or password.');
                }
            } catch (error) {
                console.error('Error:', error);
                showErrorModal('An error occurred. Please try again.');
            }
        } else {
            showErrorModal('Please fill in both fields.');
        }
    });

    closeModal.onclick = function() {
        errorModal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === errorModal) {
            errorModal.style.display = 'none';
        }
    }

    function showErrorModal(message) {
        errorMessage.textContent = message;
        errorModal.style.display = 'block';
    }
});

