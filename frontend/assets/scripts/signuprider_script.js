document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way
    
    const formData = {
        Name: document.getElementById('name').value,
        Surname: document.getElementById('surname').value,
        Email: document.getElementById('email').value,
        Password: document.getElementById('password').value,
        Birthday: document.getElementById('birthday').value,
        Phone: document.getElementById('phone-number').value,
        Two_Fa: document.getElementById('2fa').checked
    };

    try {
        const response = await fetch('http://localhost:5179/api/SingUp/RiderSignup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Rider registered successfully.');
        } else {
            const errorText = await response.text();
            alert('Error: ' + errorText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});