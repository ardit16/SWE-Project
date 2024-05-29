document.addEventListener('DOMContentLoaded', function() {
    const paymentMethods = [
        {
            cardNumber: "1234 5678 9876 5432",
            cardName: "John Doe",
            cardExpiration: "12/24",
            cardCvs: "123"
        }
    ];

    function renderPaymentMethods() {
        const leftContainer = document.querySelector('.left-container');
        leftContainer.innerHTML = '<h2>My Payment Methods</h2><div class="payment-method cash-method"><p>Cash</p></div>';

        paymentMethods.forEach((method, index) => {
            const methodBox = document.createElement('div');
            methodBox.className = 'payment-method';

            methodBox.innerHTML = `
                <div>
                    <p>Card Number: ${method.cardNumber}</p>
                    <p>Card Name: ${method.cardName}</p>
                    <p>Expiry Date: ${method.cardExpiration}</p>
                    <p>CVV: ***</p>
                </div>
                <button onclick="deletePaymentMethod(${index})">Delete</button>
            `;

            leftContainer.appendChild(methodBox);
        });

        const form = document.getElementById('add-card-form');
        const warning = document.getElementById('max-payment-warning');
        if (paymentMethods.length >= 1) {
            form.classList.add('disabled');
            warning.classList.add('warning-visible');
        } else {
            form.classList.remove('disabled');
            warning.classList.remove('warning-visible');
        }
    }

    window.deletePaymentMethod = function(index) {
        paymentMethods.splice(index, 1);
        renderPaymentMethods();
    }

    document.getElementById('add-card-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const cardNumber = document.getElementById('card-number').value;
        const cardName = document.getElementById('card-name').value;
        const cardExpiration = document.getElementById('card-expiration').value;
        const cardCvs = document.getElementById('card-cvs').value;

        paymentMethods.push({
            cardNumber,
            cardName,
            cardExpiration,
            cardCvs
        });

        renderPaymentMethods();
        document.getElementById('add-card-form').reset();
    });

    renderPaymentMethods();
});