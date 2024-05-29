document.addEventListener('DOMContentLoaded', () => {
    const feedbacksContainer = document.getElementById('feedbacks');
    
    const exampleFeedbacks = [
        'Great rider, very punctual.',
        'Pleasant experience, very polite.',
        'Enjoyed the ride, good communication.',
        'Would love to ride again, very friendly.',
        'Had a great conversation during the ride.',
        'I had an exceptional experience with this rider. They were punctual, polite, and extremely friendly. The car was clean and well-maintained, and the ride was smooth and comfortable. We had a great conversation during the trip, which made the journey even more enjoyable. This rider truly goes above and beyond to ensure a pleasant experience for their passengers. I highly recommend them to anyone looking for a reliable and friendly ride-sharing experience. I would not hesitate to ride with them again in the future.'
    ];

    exampleFeedbacks.forEach(feedback => addFeedback(feedback));

    function addFeedback(feedback) {
        const feedbackBox = document.createElement('div');
        feedbackBox.classList.add('feedback-box');
        feedbackBox.textContent = feedback;

        feedbacksContainer.appendChild(feedbackBox);
    }
});