document.addEventListener('DOMContentLoaded', function() {
    const timePeriodSelect = document.getElementById('time-period');
    const updateChartButton = document.getElementById('update-chart');

    // Sample data
    const sampleData = {
        days: [5000, 1900, 3600, 50000, 2000, 300, 1000],
        months: [100000, 15000, 20000, 25000, 30000, 35000, 40000],
    };

    const sampleLabels = {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    };

    const paymentMethodsData = {
        cash: 45,
        creditCard: 55
    };

    const paymentsChartCtx = document.getElementById('paymentsChart').getContext('2d');
    const paymentMethodsChartCtx = document.getElementById('paymentMethodsChart').getContext('2d');

    let paymentsChart = new Chart(paymentsChartCtx, {
        type: 'line',
        data: {
            labels: sampleLabels.days,
            datasets: [{
                label: 'Payments',
                data: sampleData.days,
                borderColor: '#0A174E',
                backgroundColor: 'rgba(10, 23, 78, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });

    let paymentMethodsChart = new Chart(paymentMethodsChartCtx, {
        type: 'doughnut',
        data: {
            labels: ['Cash', 'Credit Card'],
            datasets: [{
                label: 'Payment Methods',
                data: [paymentMethodsData.cash, paymentMethodsData.creditCard],
                backgroundColor: ['#F5D042', '#0A174E'],
                borderColor: ['#F5D042', '#0A174E'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    updateChartButton.addEventListener('click', function() {
        const selectedPeriod = timePeriodSelect.value;
        paymentsChart.data.labels = sampleLabels[selectedPeriod];
        paymentsChart.data.datasets[0].data = sampleData[selectedPeriod];
        paymentsChart.update();
    });
});