document.addEventListener('click', function (e) {
    const target = e.target;
    const dropdowns = document.querySelectorAll('.dropdown-content');

    if (target.classList.contains('dropdown-toggle')) {
        const dropdownContent = target.nextElementSibling;
        const isVisible = dropdownContent.style.display === 'block';

        dropdowns.forEach(d => d.style.display = 'none');

        if (!isVisible) {
            dropdownContent.style.display = 'block';
        }
    } else {
        dropdowns.forEach(d => d.style.display = 'none');
    }
});
