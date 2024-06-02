document.addEventListener('DOMContentLoaded', async () => {
    const riderId = localStorage.getItem('riderId');

    try {
        const response = await fetch(`http://localhost:5179/api/Rider/${riderId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch rider profile.');
        }

        const rider = await response.json();
        document.getElementById('fullname').textContent = `${rider.name} ${rider.surname}`;
        document.getElementById('days-using').textContent = `${calculateDaysUsing(rider.dateAdded)} days using Rreze`;
        document.getElementById('contact-info').textContent = `Contact at ${rider.email} or ${rider.phoneNumber}`;
        document.getElementById('rating').innerHTML = `<i class="fas fa-star"></i> ${rider.ovrating.toFixed(1)}`;

        if (rider.profilePicturePath) {
            document.getElementById('profile-photo').src = rider.profilePicturePath;
        }

        const feedbackResponse = await fetch(`http://localhost:5179/api/Rider/${riderId}/feedbacks`);
        if (feedbackResponse.ok) {
            const feedbacks = await feedbackResponse.json();
            const feedbacksContainer = document.getElementById('feedbacks');
            feedbacks.forEach(feedback => addFeedback(feedback.riderComment));
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
