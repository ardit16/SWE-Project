document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('2faEmail');
    console.log('Retrieved email from local storage:', email); // Debugging line
    if (!email) {
        alert('No email found for 2FA. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    const form = document.querySelector('form');
    const codeInput = document.getElementById('2fa-code');
    const resendButton = document.getElementById('resend-button'); // Added this line

    if (!form || !codeInput || !resendButton) { // Added resendButton check
        alert('Required form elements are missing. Please check the HTML.');
        return;
    }

    resendButton.addEventListener('click', async function() { // Added event listener for resend button
        const faData = {
            Email: email
        };

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/Resend_2FA', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(faData)
            });

            if (response.ok) {
                alert('A new 2FA code has been sent to your email.');
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const code = codeInput.value;

        const faData = {
            Email: email,
            Code: code
        };

        try {
            const response = await fetch('http://localhost:5179/api/LogIn/Check_2FA_Rider', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(faData)
            });

            if (response.ok) {
                alert('2FA verification successful. Login complete.');
                // Redirect or handle successful login
                window.location.href = 'home_rider.html'; // or your intended URL
            } else {
                const errorText = await response.text();
                alert('Error: ' + errorText);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
