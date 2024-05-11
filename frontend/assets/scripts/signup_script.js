document.getElementById('profile-pic').addEventListener('change', function(event) {
    const preview = document.getElementById('profile-pic-preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };

    reader.readAsDataURL(file);
});

document.getElementById('license-pic').addEventListener('change', function(event) {
    const preview = document.getElementById('license-pic-preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
    };

    reader.readAsDataURL(file);
});