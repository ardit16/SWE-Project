document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signup-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData();
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const birthday = document.getElementById('birthday').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const terms = document.getElementById('terms').checked;

        let valid = true;

        // Validation rules
        if (name.length < 2) {
            showError('name-error', 'Name should be at least 2 characters long');
            valid = false;
        } else {
            hideError('name-error');
        }

        if (surname.length < 2) {
            showError('surname-error', 'Surname should be at least 2 characters long');
            valid = false;
        } else {
            hideError('surname-error');
        }

        if (!validateEmail(email)) {
            showError('email-error', 'Invalid email address');
            valid = false;
        } else {
            hideError('email-error');
        }

        if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            showError('password-error', 'Password should be at least 6 characters long with at least one letter and one number');
            valid = false;
        } else {
            hideError('password-error');
        }

        if (confirmPassword !== password) {
            showError('confirm-password-error', 'Passwords do not match');
            valid = false;
        } else {
            hideError('confirm-password-error');
        }

        const age = calculateAge(birthday);
        if (!birthday) {
            showError('birthday-error', 'Birthday is required');
            valid = false;
        } else if (age < 21) {
            showError('birthday-error', 'You should be at least 21 years old');
            valid = false;
        } else {
            hideError('birthday-error');
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            showError('phone-number-error', 'Phone number should have 10 digits');
            valid = false;
        } else {
            hideError('phone-number-error');
        }

        if (!terms) {
            showError('terms-error', 'You must agree to the Terms and Conditions');
            valid = false;
        } else {
            hideError('terms-error');
        }

        if (!valid) {
            return;
        }

        formData.append('Name', name);
        formData.append('Surname', surname);
        formData.append('Email', email);
        formData.append('Password', password);
        formData.append('Birthday', birthday);
        formData.append('Phone', phoneNumber);

        try {
            const response = await fetch('http://localhost:5179/api/SingUp/AdminSignup', {
                method: 'POST',
                body: formData
            });

            const responseBody = await response.text();
            console.log("Response Status:", response.status);
            console.log("Response Body:", responseBody);

            if (response.ok) {
                showModal('Admin registered successfully.', 1);
            } else {
                showModal(responseBody, 0);
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('An error occurred. Please try again later.');
        }
    });

    function showModal(message, okv) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;

        if (okv == 1) {
            const homepageButton = document.createElement('button');
            homepageButton.textContent = 'Log in';
            homepageButton.onclick = function () {
                window.location.href = 'login_adm.html';
            };
            modalMessage.appendChild(document.createElement('br')); // Add a line break
            modalMessage.appendChild(homepageButton);
        }

        modal.style.display = 'block';

        const closeButton = document.getElementById('close-button');
        closeButton.onclick = function () {
            modal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }

    function showError(id, message) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideError(id) {
        const errorElement = document.getElementById(id);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function calculateAge(birthday) {
        const birthDate = new Date(birthday);
        const difference = Date.now() - birthDate.getTime();
        const age = new Date(difference).getUTCFullYear() - 1970;
        return age;
    }
});
