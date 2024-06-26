document.addEventListener('DOMContentLoaded', async () => {
    const riderId = localStorage.getItem('riderId');
    console.log('Retrieved rider ID:', riderId);
    if (!riderId) {
        window.location.href = 'login_rider.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5179/api/Rider/${riderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch rider profile.');
        }

        const rider = await response.json();
        document.getElementById('name').textContent = rider.name;
        document.getElementById('surname').textContent = rider.surname;
        document.getElementById('email').textContent = rider.email;
        document.getElementById('phone-number').textContent = rider.phoneNumber;
        document.getElementById('two-factor').textContent = rider.twoFactorEnabled ? 'Yes' : 'No';

        const profilePhoto = rider.profilePicturePath ? rider.profilePicturePath : './assets/images/user.jpg';
        document.getElementById('profile-photo').src = profilePhoto;
    } catch (error) {
        console.error('Error:', error);
    }
});

// Profile Photo Upload
document.getElementById('edit-photo').addEventListener('click', function() {
    document.getElementById('profile-upload').click();
});

document.getElementById('profile-upload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const riderId = localStorage.getItem('riderId');
    if (file) {
        const formData = new FormData();
        formData.append('RiderId', riderId);
        formData.append('ProfilePicture', file);

        try {
            const response = await fetch(`http://localhost:5179/api/Rider/profilepicture`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile picture.');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profile-photo').src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error:', error);
            showModal('Error uploading profile picture.');
        }
    }
});

// Show/Hide Password Fields
document.getElementById('change-password').addEventListener('click', function() {
    const passwordFields = document.getElementById('password-fields');
    passwordFields.style.display = passwordFields.style.display === 'none' ? 'flex' : 'none';
});

// Toggle 2FA Status
document.getElementById('change-2fa').addEventListener('click', async function() {
    const riderId = localStorage.getItem('riderId');
    const twoFactorElement = document.getElementById('two-factor');
    const enable2FA = twoFactorElement.textContent === 'No';

    const formData = new FormData();
    formData.append('TwoFactorEnabled', enable2FA);

    try {
        const response = await fetch(`http://localhost:5179/api/Rider/${riderId}/change-two-factor`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        showModal('Two-factor authentication updated successfully.');
        twoFactorElement.textContent = enable2FA ? 'Yes' : 'No';
    } catch (error) {
        console.error('Error:', error);
        showModal(`Error: ${error.message}`);
    }
});

// Confirm Password Change
document.getElementById('confirm-password-change').addEventListener('click', async function() {
    const riderId = localStorage.getItem('riderId');
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
        showModal('New passwords do not match.');
        return;
    }

    const formData = new FormData();
    formData.append('Id', riderId);
    formData.append('Password', currentPassword);
    formData.append('NewPassword', newPassword);

    try {
        const response = await fetch(`http://localhost:5179/api/Rider/${riderId}/change-password`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            showModal(`Error: ${errorText}`);
            return;
        }

        showModal('Password changed successfully.');
        document.getElementById('password-fields').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        showModal(`Error: ${error.message}`);
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