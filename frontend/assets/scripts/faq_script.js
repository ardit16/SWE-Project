document.addEventListener('DOMContentLoaded', function() {
    console.log("FAQ page loaded");

    // Function to toggle FAQ visibility
    window.toggleFaq = function(event) {
        const faqElement = event.currentTarget.parentElement;
        faqElement.classList.toggle('show');
        console.log("Toggled FAQ visibility for:", faqElement);
    };
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("Document is ready");

    // Function to toggle the dropdown visibility
    window.toggleDropdown = function(event, dropdownId) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Toggle dropdown called for:", dropdownId);
        
        const dropdown = document.getElementById(dropdownId);
        console.log("Dropdown element:", dropdown);

        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            console.log("Dropdown hidden:", dropdownId);
        } else {
            // Hide any other open dropdowns
            document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                openDropdown.classList.remove('show');
                console.log("Closed other dropdown:", openDropdown.id);
            });
            dropdown.classList.add('show');
            console.log("Dropdown shown:", dropdownId);
        }
    };

    // Close the dropdown if clicked outside of it
    window.addEventListener('click', function(event) {
        console.log("Window click detected");
        if (!event.target.matches('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown-content.show').forEach(dropdown => {
                dropdown.classList.remove('show');
                console.log("Closed dropdown due to outside click:", dropdown.id);
            });
        }
    });
});