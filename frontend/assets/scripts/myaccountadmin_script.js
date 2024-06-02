document.addEventListener('DOMContentLoaded', async function() {
    const adminId = localStorage.getItem('adminId'); // Assuming adminId is stored in localStorage

    if (!adminId) {
        alert('Admin ID not found. Please log in again.');
        window.location.href = 'login_admin.html'; // Redirect to login page
        return;
    }

    try {
        const response = await fetch(`http://localhost:5179/api/Admin/${adminId}`, {
            method: 'GET',
        });

        if (response.ok) {
            const admin = await response.json();
            console.log('Admin profile:', admin);

            document.getElementById('name').textContent = admin.name || 'Admin Name';
            document.getElementById('surname').textContent = admin.surname || 'Admin Surname';
            document.getElementById('email').textContent = admin.email || 'admin@example.com';
            document.getElementById('phone-number').textContent = admin.phoneNumber || '+1234567890';
            document.getElementById('birthday').textContent = formatDate(admin.birthday) || '01/01/1980';
        } else {
            const errorText = await response.text();
            console.error('Error fetching profile:', errorText);
            alert('Error fetching profile. Please try again.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred. Please try again.');
    }

    // Show/Hide Password Fields
    document.getElementById('change-password').addEventListener('click', function() {
        const passwordFields = document.getElementById('password-fields');
        passwordFields.style.display = passwordFields.style.display === 'none' ? 'flex' : 'none';
    });

    // Confirm Password Change
    document.getElementById('confirm-password-change').addEventListener('click', async function() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('Id', adminId);
        formData.append('Password', currentPassword);
        formData.append('NewPassword', newPassword);

        try {
            const response = await fetch('http://localhost:5179/api/Admin/Change-Password', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Password change confirmed.');
                document.getElementById('password-fields').style.display = 'none';
            } else {
                const errorText = await response.text();
                console.error('Error changing password:', errorText);
                alert('Error changing password. Please try again.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    function formatDate(dateString) {
        // Remove any non-numeric characters
        const cleaned = ('' + dateString).replace(/\D/g, '');

        // Ensure we have exactly 8 digits
        if (cleaned.length !== 8) {
            return '01/01/1980'; // Default value if the format is incorrect
        }

        // Extract day, month, and year
        const day = cleaned.slice(0, 2);
        const month = cleaned.slice(2, 4);
        const year = cleaned.slice(4, 8);

        return `${day}/${month}/${year}`;
    }
});
