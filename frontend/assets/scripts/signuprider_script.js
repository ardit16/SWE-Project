document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const formData = {
            Name: document.getElementById('name').value,
            Surname: document.getElementById('surname').value,
            Email: document.getElementById('email').value,
            Password: document.getElementById('password').value,
            Birthday: document.getElementById('birthday').value,
            Phone: document.getElementById('phone-number').value,
            Two_Fa: document.getElementById('2fa').checked
        };

        let valid = true;

        if (formData.Name.length < 2) {
            showError('name-error', 'Name should be at least 2 characters long');
            valid = false;
        } else {
            hideError('name-error');
        }

        if (formData.Surname.length < 2) {
            showError('surname-error', 'Surname should be at least 2 characters long');
            valid = false;
        } else {
            hideError('surname-error');
        }

        if (!validateEmail(formData.Email)) {
            showError('email-error', 'Invalid email address');
            valid = false;
        } else {
            hideError('email-error');
        }

        if (formData.Password.length < 6 || !/\d/.test(formData.Password) || !/[a-zA-Z]/.test(formData.Password)) {
            showError('password-error', 'Password should be at least 6 characters long with at least one letter and one number');
            valid = false;
        } else {
            hideError('password-error');
        }

        if (formData.Password !== document.getElementById('confirm-password').value) {
            showError('confirm-password-error', 'Passwords do not match');
            valid = false;
        } else {
            hideError('confirm-password-error');
        }

        const age = calculateAge(formData.Birthday);
        if (!formData.Birthday) {
            showError('birthday-error', 'Birthday is required');
            valid = false;
        } else if (age < 18) {
            showError('birthday-error', 'You should be at least 18 years old');
            valid = false;
        } else {
            hideError('birthday-error');
        }

        if (!/^\d{10}$/.test(formData.Phone)) {
            showError('phone-number-error', 'Phone number should have 10 digits');
            valid = false;
        } else {
            hideError('phone-number-error');
        }

        if (!document.getElementById('terms').checked) {
            showError('terms-error', 'You must agree to the Terms and Conditions');
            valid = false;
        } else {
            hideError('terms-error');
        }

        if (!valid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5179/api/SingUp/RiderSignup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showModal('Rider registered successfully.');
            } else {
                showModal('Rider couldn\'t be registered, please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('An error occurred. Please try again later.');
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