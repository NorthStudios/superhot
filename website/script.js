// Get the login button element
const loginButton = document.getElementById('loginButton');

// Check if the user is logged in
const isLoggedIn = /* Your logic to check if the user is logged in with Discord */;

// If the user is logged in, hide the login button
if (isLoggedIn) {
    loginButton.style.display = 'none';
}
