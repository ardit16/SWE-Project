document.addEventListener('DOMContentLoaded', async () => {
    const driverId = localStorage.getItem('driverId');
    console.log('Retrieved driver ID:', driverId);

    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch driver profile.');
        }

        const driver = await response.json();
        document.getElementById('name').textContent = driver.name;
        document.getElementById('surname').textContent = driver.surname;
        document.getElementById('email').textContent = driver.email;
        document.getElementById('phone-number').textContent = driver.phoneNumber;
        document.getElementById('two-factor').textContent = driver.twoFactorEnabled ? 'Yes' : 'No';

        const profilePhoto = driver.profilePicturePath ? driver.profilePicturePath : './assets/images/user.jpg';
        document.getElementById('profile-photo').src = profilePhoto;

        const licensePhoto = driver.licensePhotoPath ? driver.licensePhotoPath : './assets/images/license.jpg';
        document.getElementById('license-photo').src = licensePhoto;
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
    const driverId = localStorage.getItem('driverId');
    if (file) {
        const formData = new FormData();
        formData.append('newProfilePicture', file);

        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/change-profile-picture`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile picture.');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.profile-photo img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error:', error);
        }
    }
});

// License Photo Upload
document.getElementById('edit-license').addEventListener('click', function() {
    document.getElementById('license-upload').click();
});

document.getElementById('license-upload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const driverId = localStorage.getItem('driverId');
    if (file) {
        const formData = new FormData();
        formData.append('newDriverLicense', file);

        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/change-driver-license`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload driver license photo.');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.license-photo img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error:', error);
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
    const driverId = localStorage.getItem('driverId');
    const twoFactorElement = document.getElementById('two-factor');
    const enable2FA = twoFactorElement.textContent === 'No';

    const formData = new FormData();
    formData.append('TwoFactorEnabled', enable2FA);

    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/change-two-factor`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to change two-factor authentication.');
        }

        showModal('Two-factor authentication updated successfully.');
        twoFactorElement.textContent = enable2FA ? 'Yes' : 'No';
    } catch (error) {
        console.error('Error:', error);
    }
});

// Confirm Password Change
document.getElementById('confirm-password-change').addEventListener('click', async function() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    const driverId = localStorage.getItem('driverId');

    if (newPassword !== confirmNewPassword) {
        showModal('New passwords do not match.');
        return;
    }

    const formData = new FormData();
    formData.append('Id', driverId);
    formData.append('Password', currentPassword);
    formData.append('NewPassword', newPassword);

    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/change-password`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to change password.');
        }

        showModal('Password changed successfully.');
        document.getElementById('password-fields').style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
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