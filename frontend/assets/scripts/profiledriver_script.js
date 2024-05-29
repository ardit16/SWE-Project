document.addEventListener('DOMContentLoaded', () => {
    const feedbacksContainer = document.getElementById('feedbacks');
    
    const exampleFeedbacks = [
        'Driver was on time and very professional.',
        'Safe and smooth driving, highly recommended!',
        'Car was clean and comfortable, excellent service.',
        'Friendly driver, made the ride enjoyable.',
        'Great communication and very polite.',
        'I had an exceptional experience with this driver. They were punctual, polite, and extremely friendly. The car was spotless and well-maintained, and the ride was incredibly smooth and comfortable. The driver made sure to take the best routes, avoiding traffic and ensuring a timely arrival. I highly recommend this driver for anyone seeking a top-notch ride-sharing experience. I would gladly ride with them again in the future.'
    ];    

    exampleFeedbacks.forEach(feedback => addFeedback(feedback));

    function addFeedback(feedback) {
        const feedbackBox = document.createElement('div');
        feedbackBox.classList.add('feedback-box');
        feedbackBox.textContent = feedback;

        feedbacksContainer.appendChild(feedbackBox);
    }
});