const DISCORD_CLIENT_ID = '1249013783637000252';
const DISCORD_REDIRECT_URI = 'https://northstudios.github.io/superhot/';
const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20connections%20guilds`;

// Elements
const loginButton = document.getElementById('login-discord');
const logoutButton = document.getElementById('logout');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const submitSection = document.getElementById('submit');
const submitPostButton = document.getElementById('submit-post');

// Event listener for login with Discord button
loginButton.addEventListener('click', () => {
    window.location.href = DISCORD_OAUTH_URL;
});

// Event listener for logout button
logoutButton.addEventListener('click', () => {
    logout();
});

// Function to handle Discord login callback
function handleDiscordLoginCallback() {
    const params = new URLSearchParams(window.location.search); // Extract parameters from URL
    if (params.has('code')) {
        const code = params.get('code');
        // Exchange the authorization code for an access token
        fetch(`https://discord.com/api/oauth2/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': DISCORD_CLIENT_ID,
                'client_secret': 'YOUR_DISCORD_CLIENT_SECRET', // Replace with your Discord Client Secret
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': DISCORD_REDIRECT_URI
            })
        })
        .then(response => response.json())
        .then(data => {
            const { access_token } = data;
            fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(response => response.json())
            .then(user => {
                localStorage.setItem('discordUser', JSON.stringify(user));
                updateUIForLoggedInUser(user);
                // Redirect to remove code from URL
                window.history.replaceState({}, document.title, "/superhot/");
            });
        });
    }
}

// Function to update the UI for a logged-in user
function updateUIForLoggedInUser(user) {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'inline';
    userInfo.style.display = 'flex';
    userName.textContent = `Logged in as ${user.username}#${user.discriminator}`;
    userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    submitSection.style.display = 'block';
}

// Function to logout the user
function logout() {
    localStorage.removeItem('discordUser');
    loginButton.style.display = 'inline';
    logoutButton.style.display = 'none';
    userInfo.style.display = 'none';
    submitSection.style.display = 'none';
    window.location.href = '/superhot/';
}

// Check if user is already logged in
const storedUser = localStorage.getItem('discordUser');
if (storedUser) {
    updateUIForLoggedInUser(JSON.parse(storedUser));
}

// Check if this is a Discord login callback
if (window.location.search.includes('code')) {
    handleDiscordLoginCallback();
}

// Simulated posts data
let postsData = [
    { id: 1, title: "First Post", content: "This is the first post!", likes: 0, comments: [] },
    { id: 2, title: "Second Post", content: "This is the second post!", likes: 0, comments: [] },
    { id: 3, title: "Third Post", content: "This is the third post!", likes: 0, comments: [] }
];

// Function to render posts
function renderPosts(postsData) {
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '';

    postsData.forEach(post => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button class="like-btn" data-id="${post.id}">Like (${post.likes})</button>
                <button class="comment-btn" data-id="${post.id}">Comment</button>
            </div>
            <ul id="comments-${post.id}"></ul>
        `;
        postsList.appendChild(listItem);
    });

    // Add event listeners for like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (storedUser) {
                const postId = parseInt(event.target.getAttribute('data-id'));
                const post = postsData.find(p => p.id === postId);
                post.likes += 1;
                renderPosts(postsData);
            } else {
                alert('You need to be logged in to like posts.');
            }
        });
    });
}

// Fetch and render initial posts
renderPosts(postsData);
