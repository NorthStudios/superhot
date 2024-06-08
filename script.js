// Discord OAuth2 configuration
const DISCORD_CLIENT_ID = '1249013783637000252';
const DISCORD_REDIRECT_URI = 'https://northstudios.github.io/superhot/'; // Replace with your redirect URI
const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email%20connections%20guilds`;

// Event listener for login with Discord button
document.getElementById('login-discord').addEventListener('click', () => {
    window.location.href = DISCORD_OAUTH_URL;
});

// Function to handle Discord login callback
function handleDiscordLoginCallback() {
    const params = new URLSearchParams(window.location.hash.slice(1)); // Extract parameters from URL hash
    if (params.has('access_token')) {
        const accessToken = params.get('access_token');
        // Use the access token for further operations (e.g., fetch user data)
        console.log('Access Token:', accessToken);
        // Redirect back to homepage or desired page
        window.location.href = '/';
    }
}

// Check if this is a Discord login callback
if (window.location.hash.includes('access_token')) {
    handleDiscordLoginCallback();
}

// Simulated posts data
let postsData = [];

// Function to simulate fetching posts from the server
function fetchPosts() {
    // Simulate fetching posts from the server
    // Here, we're just using sample data
    postsData = [
        { id: 1, title: "First Post", content: "This is the first post!", likes: 0, comments: [] },
        { id: 2, title: "Second Post", content: "This is the second post!", likes: 0, comments: [] },
        { id: 3, title: "Third Post", content: "This is the third post!", likes: 0, comments: [] }
    ];

    // Render the posts
    renderPosts();
}

// Function to render posts
function renderPosts() {
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
}

// Function to simulate real-time updates (increase likes every 5 seconds)
function simulateRealTimeUpdates() {
    setInterval(() => {
        postsData.forEach(post => {
            post.likes += Math.floor(Math.random() * 3); // Simulate random likes
        });
        renderPosts(); // Re-render posts with updated likes
    }, 5000); // Every 5 seconds
}

// Function to handle liking a post
function likePost(postId) {
    const post = postsData.find(p => p.id === postId);
    if (post) {
        post.likes++;
        renderPosts(); // Re-render posts with updated likes
    }
}

// Function to handle commenting on a
