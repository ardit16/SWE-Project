document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const loginData = {
            Email: email,
            Password: password
        };

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/LogInRider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login result:', result); // Log the entire response

                // Check if the Name property is present
                console.log('Name:', result.name);

                // Store rider's name and ID in local storage
                localStorage.setItem('riderName', result.name);
                localStorage.setItem('riderSurname', result.surname);
                localStorage.setItem('riderId', result.id);

                if (result.twoFactorEnabled) { // Check for 'twoFactorEnabled' with lowercase
                    console.log('twoFactorEnabled is true, redirecting to 2FA'); // Debugging line
                    console.log('Result email:', result.email); // Debugging line
                    // Store email in local storage and redirect to 2FA page
                    localStorage.setItem('2faEmail', result.email);
                    console.log('Email stored in local storage:', result.email); // Debugging line
                    window.location.href = '2fa_r.html';
                } else {
                    console.log('twoFactorEnabled is false, redirecting to home'); // Debugging line
                    alert('Login successful');
                    // Redirect or handle successful login
                    window.location.href = 'home_rider.html'; // or your intended URL
                }
            } else {
                const errorText = await response.text();
                console.error('Login error:', errorText); // Log errors
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error); // Log exceptions
            alert('An error occurred. Please try again.');
        }
    });
});