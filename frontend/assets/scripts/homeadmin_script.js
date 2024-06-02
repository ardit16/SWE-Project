document.addEventListener('DOMContentLoaded', function() {
    const adminName = localStorage.getItem('adminName');
    const adminSurname = localStorage.getItem('adminSurname');

    console.log('Retrieved adminName:', adminName);
    console.log('Retrieved adminSurname:', adminSurname);

    if (adminName && adminSurname) {
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = `Welcome Administrator ${adminName} ${adminSurname}!`;
    } else {
        const welcomeMessage = document.getElementById('welcomeMessage');
        welcomeMessage.textContent = 'Welcome Administrator!';
    }
});
