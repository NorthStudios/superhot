const DISCORD_CLIENT_ID = '1249013783637000252';
const DISCORD_REDIRECT_URI = 'https://northstudios.github.io/superhot/';
const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20connections%20guilds`;

const LOGIN_BUTTON_ID = 'login';
const USER_PROFILE_ID = 'user-profile';
const DISCORD_API_URL = 'https://discord.com/api';

// Function to generate the Discord OAuth2 login URL
function getLoginUrl() {
    return `${DISCORD_API_URL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
}

// Function to handle login button click event
function handleLogin() {
    window.location.href = getLoginUrl();
}

// Function to fetch user data after successful authentication
async function fetchUserData(code) {
    const response = await fetch(`${DISCORD_API_URL}/users/@me`, {
        headers: {
            Authorization: `Bearer ${code}`
        }
    });
    const userData = await response.json();
    return userData;
}

// Function to display user profile picture and username
function displayUserProfile(userData) {
    const userProfileElement = document.getElementById(USER_PROFILE_ID);
    userProfileElement.innerHTML = `
        <img src="https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png" alt="Profile Picture">
        <span>Logged in as: ${userData.username}</span>
    `;
}

// Check if the user is already authenticated
const code = new URLSearchParams(window.location.search).get('code');
if (code) {
    fetchUserData(code)
        .then(userData => displayUserProfile(userData))
        .catch(error => console.error('Error fetching user data:', error));
} else {
    // Render the login button if the user is not authenticated
    const loginButtonElement = document.getElementById(LOGIN_BUTTON_ID);
    loginButtonElement.innerHTML = '<button onclick="handleLogin()">Login with Discord</button>';
}
