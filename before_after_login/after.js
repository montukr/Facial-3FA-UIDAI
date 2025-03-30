// Optional JS if you want to add more functionality on hover
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        console.log('Card hovered');
    });
    card.addEventListener('mouseleave', () => {
        console.log('Card left');
    });
});

const userIcon = document.querySelector('.user-icon');
const profile = document.getElementById('profile');

// Toggle the display of the profile when the user icon is clicked
userIcon.addEventListener('click', function () {
    if (profile.style.display === 'none' || profile.style.display === '') {
        profile.style.display = 'block';
        userIcon.classList.add('active');
    } else {
        profile.style.display = 'none';
        userIcon.classList.remove('active');
    }
});

// Retrieve the user's name from localStorage and display it in the profile section
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the stored user name from localStorage
    const userName = localStorage.getItem('userName');

    // If userName exists, update the profile section with the user name
    if (userName) {
        const profileName = document.querySelector('.profile h2');
        profileName.textContent = userName;
    } else {
        console.error("User name not found in localStorage");
    }
});
