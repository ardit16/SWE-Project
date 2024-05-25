document.getElementById('edit-photo').addEventListener('click', function() {
    document.getElementById('profile-upload').click();
});

document.getElementById('profile-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector('.profile-photo img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('edit-license').addEventListener('click', function() {
    document.getElementById('license-upload').click();
});

document.getElementById('license-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector('.license-photo img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('change-password').addEventListener('click', function() {
    document.getElementById('password-fields').style.display = 'flex';
});

document.getElementById('confirm-password-change').addEventListener('click', function() {
    // Add logic to handle password change
    alert('Password change confirmed.');
    document.getElementById('password-fields').style.display = 'none';
});

document.getElementById('change-2fa').addEventListener('click', () => {
    const twoFactorElement = document.getElementById('two-factor');
    if (twoFactorElement.textContent === 'Yes') {
        twoFactorElement.textContent = 'No';
    } else {
        twoFactorElement.textContent = 'Yes';
    }
    // Implement the backend change functionality
});

