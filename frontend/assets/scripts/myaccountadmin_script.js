// Show/Hide Password Fields
document.getElementById('change-password').addEventListener('click', function() {
    const passwordFields = document.getElementById('password-fields');
    passwordFields.style.display = passwordFields.style.display === 'none' ? 'flex' : 'none';
});

// Confirm Password Change
document.getElementById('confirm-password-change').addEventListener('click', function() {
    // Add logic to handle password change
    alert('Password change confirmed.');
    document.getElementById('password-fields').style.display = 'none';
});