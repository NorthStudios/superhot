// Simulated function to check if the user is logged in
function isLoggedIn() {
    // Replace with actual logic to check if user is logged in
    return localStorage.getItem('userLoggedIn') === 'true';
}

// Simulated function to get the user's name
function getUserName() {
    // Replace with actual logic to get user's name
    return localStorage.getItem('userName') || 'User';
}

document.addEventListener('DOMContentLoaded', (event) => {
    if (isLoggedIn()) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('welcomeContainer').style.display = 'inline';
        document.getElementById('welcomeMessage').textContent = `Welcome, ${getUserName()}!`;
    }
});

// Example: Simulate user login (for testing)
document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault();
    // Simulate login action
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', 'John Doe');
    // Refresh page
    window.location.reload();
});
