const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.use(cookieParser());
app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/login', (req, res) => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify email`;
    res.redirect(discordAuthUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenUrl = 'https://discord.com/api/oauth2/token';
    const userUrl = 'https://discord.com/api/users/@me';

    try {
        const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get(userUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const user = userResponse.data;

        // Save user info in a cookie (for simplicity)
        res.cookie('user', JSON.stringify(user), { maxAge: 900000, httpOnly: true });
        res.redirect('/');
    } catch (error) {
        console.error('Error during OAuth2 flow:', error);
        res.send('An error occurred during the OAuth2 flow. Check the server logs for more details.');
    }
});

app.get('/', (req, res) => {
    const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Super Hot Community</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <header class="top-bar">
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="reviews.html">Reviews</a></li>
                    <li class="logo-container"><img src="superhot-logo.png" alt="Super Hot Logo"></li>
                    <li><a href="#">Events</a></li>
                    <li><a href="#">About</a></li>
                    ${user ? `<li class="welcome-container" id="welcomeContainer"><span id="welcomeMessage">Welcome, ${user.username}!</span></li>` : `<li class="login-container" id="loginContainer"><a href="/login" class="login-button" id="loginButton">Login with Discord</a></li>`}
                </ul>
            </header>
            <div class="container">
                <h1>Welcome to Super Hot Community</h1>
                <p>Your one-stop destination for everything Super Hot.</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
