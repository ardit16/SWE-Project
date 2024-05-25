// Profile Photo Upload
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

// Show/Hide Password Fields
document.getElementById('change-password').addEventListener('click', function() {
    const passwordFields = document.getElementById('password-fields');
    passwordFields.style.display = passwordFields.style.display === 'none' ? 'flex' : 'none';
});

// Toggle 2FA Status
document.getElementById('change-2fa').addEventListener('click', function() {
    const twoFactorElement = document.getElementById('two-factor');
    twoFactorElement.textContent = twoFactorElement.textContent === 'Yes' ? 'No' : 'Yes';
});

// Confirm Password Change
document.getElementById('confirm-password-change').addEventListener('click', function() {
    // Add logic to handle password change
    alert('Password change confirmed.');
    document.getElementById('password-fields').style.display = 'none';
});