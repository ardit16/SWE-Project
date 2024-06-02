document.addEventListener('DOMContentLoaded', async function() {
    const driverId = localStorage.getItem('driverId');
    console.log('Retrieved driver ID:', driverId);

    async function fetchPaymentMethods() {
        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/paymentmethods`);
            if (!response.ok) {
                throw new Error('Failed to fetch payment methods.');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    function renderPaymentMethods(paymentMethods) {
        const leftContainer = document.querySelector('.left-container');
        leftContainer.innerHTML = '<h2>My Payment Methods</h2><div class="payment-method cash-method"><p>Cash</p></div>';

        paymentMethods.forEach((method) => {
            const formattedCardNumber = formatCardNumber(method.cardNumber);
            const formattedExpiryDate = formatExpiryDate(method.expiryDate);

            const methodBox = document.createElement('div');
            methodBox.className = 'payment-method';

            methodBox.innerHTML = `
                <div>
                    <p>Card Number: ${formattedCardNumber}</p>
                    <p>Card Name: ${method.cardName}</p>
                    <p>Expiry Date: ${formattedExpiryDate}</p>
                    <p>CVV: ***</p>
                </div>
                <button class="delete-button" data-id="${method.paymentId}">Delete</button>
            `;

            leftContainer.appendChild(methodBox);
        });

        // Attach delete event handlers
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async function() {
                const paymentMethodId = this.getAttribute('data-id');
                await deletePaymentMethod(paymentMethodId);
            });
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

    async function deletePaymentMethod(paymentMethodId) {
        console.log('Deleting payment method with ID:', paymentMethodId);
        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/paymentmethods/${paymentMethodId}`, {
                method: 'DELETE'
            });
            console.log('Delete response status:', response.status);
            if (!response.ok) {
                throw new Error('Failed to delete payment method.');
            }
            const paymentMethods = await fetchPaymentMethods();
            renderPaymentMethods(paymentMethods);
            showModal('Payment method deleted successfully.');
        } catch (error) {
            console.error('Error:', error);
            showModal('Failed to delete payment method.');
        }
    }

    document.getElementById('add-card-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
        const cardName = document.getElementById('card-name').value;
        const cardExpiration = document.getElementById('card-expiration').value;
        const cardCvs = document.getElementById('card-cvs').value;

        clearErrors();

        if (!validateCardNumber(cardNumber)) {
            showError('Invalid card number.', 'card-number');
            return;
        }
        if (!validateExpiryDate(cardExpiration)) {
            showError('Invalid expiration date.', 'card-expiration');
            return;
        }
        if (!validateCVV(cardCvs)) {
            showError('Invalid CVV.', 'card-cvs');
            return;
        }

        const formData = new FormData();
        formData.append('DriverID', driverId);
        formData.append('PaymentType', 'CreditCard');
        formData.append('CardNumber', cardNumber);
        formData.append('CardName', cardName);
        formData.append('ExpiryDate', cardExpiration);
        formData.append('CVV', cardCvs);

        try {
            const response = await fetch(`http://localhost:5179/api/Driver/${driverId}/paymentmethod`, {
                method: 'POST',
                body: formData
            });

            const responseBody = await response.text();
            console.log("Response Status:", response.status);
            console.log("Response Body:", responseBody);

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error Response:', errorResponse);
                throw new Error('Failed to add payment method.');
            }

            const paymentMethods = await fetchPaymentMethods();
            renderPaymentMethods(paymentMethods);
            document.getElementById('add-card-form').reset();
            showModal('Payment method added successfully.');
        } catch (error) {
            console.error('Error:', error);
            showModal('Failed to add payment method.');
        }
    });

    document.getElementById('card-number').addEventListener('input', function(event) {
        event.target.value = formatCardNumber(event.target.value);
    });

    document.getElementById('card-expiration').addEventListener('input', function(event) {
        event.target.value = formatExpiryDate(event.target.value);
    });

    function formatCardNumber(value) {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    function formatExpiryDate(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').trim();
    }

    function validateCardNumber(number) {
        const regex = /^\d{16}$/;
        return regex.test(number);
    }

    function validateExpiryDate(date) {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(date)) return false;

        const [month, year] = date.split('/').map(Number);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }

        return true;
    }

    function validateCVV(cvv) {
        const regex = /^\d{3}$/;
        return regex.test(cvv);
    }

    function showError(message, field) {
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        document.getElementById(field).insertAdjacentElement('afterend', errorElement);
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
    }

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

    const paymentMethods = await fetchPaymentMethods();
    renderPaymentMethods(paymentMethods);
});