document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        const formData = new FormData();
        formData.append('Name', document.getElementById('name').value);
        formData.append('Surname', document.getElementById('surname').value);
        formData.append('Email', document.getElementById('email').value);
        formData.append('Password', document.getElementById('password').value);
        formData.append('Birthday', document.getElementById('birthday').value);
        formData.append('Phone', document.getElementById('phone-number').value);
        formData.append('Two_Fa', document.getElementById('2fa').checked);
        formData.append('photo', document.getElementById('profile-pic').files[0]);
        formData.append('DriverLicense', document.getElementById('license-pic').files[0]);

        try {
            const response = await fetch('http://localhost:5179/api/SingUp/DriverSignup', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Driver registered successfully.');
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    document.getElementById('profile-pic').addEventListener('change', function(event) {
        const preview = document.getElementById('profile-pic-preview');
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    });

    document.getElementById('license-pic').addEventListener('change', function(event) {
        const preview = document.getElementById('license-pic-preview');
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    });
});