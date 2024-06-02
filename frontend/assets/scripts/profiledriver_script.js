document.addEventListener('DOMContentLoaded', async () => {
    const driverId = localStorage.getItem('driverId');
    console.log('Retrieved driver ID:', driverId);

    try {
        const response = await fetch(`http://localhost:5179/api/Driver/${driverId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch driver profile.');
        }

        const driver = await response.json();
        document.getElementById('fullname').textContent = `${driver.name} ${driver.surname}`;
        document.getElementById('days-using').textContent = `${calculateDaysUsing(driver.dateAdded)} days using Rreze`;
        document.getElementById('contact-info').textContent = `Contact at ${driver.email} or ${driver.phoneNumber}`;
        document.getElementById('rating').innerHTML = `<i class="fas fa-star"></i> ${driver.ovrating.toFixed(1)}`;

        const profilePhoto = driver.profilePicturePath ? driver.profilePicturePath : './assets/images/user.jpg';
        document.getElementById('profile-photo').src = profilePhoto;

        const feedbackResponse = await fetch(`http://localhost:5179/api/Driver/${driverId}/feedbacks`);
        if (feedbackResponse.ok) {
            const feedbacks = await feedbackResponse.json();
            const feedbacksContainer = document.getElementById('feedbacks');
            feedbacks.forEach(feedback => addFeedback(feedback.driverComment));
        } else {
            console.error('Failed to fetch feedbacks.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function addFeedback(feedback) {
    const feedbackBox = document.createElement('div');
    feedbackBox.classList.add('feedback-box');
    feedbackBox.textContent = feedback;

    const feedbacksContainer = document.getElementById('feedbacks');
    feedbacksContainer.appendChild(feedbackBox);
}

function calculateDaysUsing(dateAdded) {
    const addedDate = new Date(dateAdded);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - addedDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}