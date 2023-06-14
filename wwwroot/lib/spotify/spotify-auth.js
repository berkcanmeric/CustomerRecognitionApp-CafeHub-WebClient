const AUTHORIZE = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_API = 'https://accounts.spotify.com/api/token';
const redirect_uri = 'https://localhost:7252/Spotify'; // change this to your value

const clientId = "66ece2d4f8484e30af4fbce390bae1c9";
const clientSecret = "491497f6b5774c2ab3ac4b746dead0cb";

// Get the stored access token and refresh token from localStorage
function getStoredAccessToken() {
    return localStorage.getItem('accessTokenSpotify');
}

// Set the access token cookie
function setAccessTokenCookie(accessToken) {
    document.cookie = `accessTokenSpotify=${accessToken}; path=/; secure`;
}

// Get the access token from the Spotify API
async function getAccessToken(code) {
    const response = await fetch(SPOTIFY_TOKEN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(
            redirect_uri
        )}&client_id=${clientId}&client_secret=${clientSecret}`,
    });
    const data = await response.json();
    const accessToken = data.access_token;
    return accessToken;
}

// Initialize the table
async function initTable() {
    try {
        // Call the fetchPlaylists function to load the initial table data
        await fetchPlaylists();

        // Get the user's information from the Spotify API
        const storedAccessToken = getStoredAccessToken();
        if (!storedAccessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${storedAccessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user information');
        }

        const user = await response.json();

        // Update the title to include the user's name
        document.querySelector('.table-title h1').textContent = `Merhaba ${user.display_name}!`;
    } catch (error) {
        console.error('Error in initTable:', error);
        alert('Error initializing table. Please try again later.');
    }
}

// Check if the user is authorized and get the access token if not
async function authorizeUser() {
    try {
        const storedAccessToken = getStoredAccessToken();
        if (storedAccessToken) {
            setAccessTokenCookie(storedAccessToken);
            initTable(); // Initialize the table if the access token is present
        } else if (window.location.pathname === '/Spotify/Index') {
            // Redirect the user to the Spotify authorization screen
            let url = AUTHORIZE;
            url += `?client_id=${clientId}`;
            url += '&response_type=code';
            url += `&redirect_uri=${encodeURI(redirect_uri)}`;
            url += '&show_dialog=true';
            url +=
                '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
            window.location.href = url;
        } else if (window.location.href.includes('code=')) {
            const code = new URLSearchParams(window.location.search).get('code');
            const accessToken = await getAccessToken(code);
            localStorage.setItem('accessTokenSpotify', accessToken);
            setAccessTokenCookie(accessToken);
            
            // // Use the updateDoc function to add a new field to the existing document
            // await updateDoc(cafeDocRef, {
            //     spotifyAccessToken: accessToken
            // });
            // console.log(cafeDocRef)
            
            initTable();
        }
    } catch (error) {
        console.error('Error in authorizeUser:', error);
        alert('Error authorizing user. Please try again later.');
    }
}

// Fetch the playlists from the Spotify API and render them in the table
async function fetchPlaylists() {
    try {
        const storedAccessToken = getStoredAccessToken();
        if (!storedAccessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Authorization: `Bearer ${storedAccessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch playlists');
        }

        const playlists = await response.json();

        // Clear the table before adding new data (except for the headers)
        $('#playlist-table').DataTable().clear();

        // Loop through the playlists and append the playlist data to the table
        playlists.items.forEach((playlist) => {
            $('#playlist-table')
                .DataTable()
                .row.add([
                `<img src="${playlist.images[0].url}" alt="Playlist Cover" class="playlist-cover" width="100" height="100"/>`,
                playlist.name,
                playlist.owner.display_name,
                playlist.tracks.total,
            ])
                .draw()
                .nodes()
                .to$()
                .last()
                .click(function () {
                    location.href = `/Spotify/Songs/${playlist.id}`; // Add the playlist ID to the URL that the user will be redirected to
                });
        });

        // Redraw the table to update the pagination
        $('#playlist-table').DataTable().draw();
    } catch (err) {
        console.error('Error fetching playlists:', err);
        alert('Error fetching playlists. Please try again later.');
    }
}

// Check for Spotify authorization success and set the access token cookie
async function checkSpotifyAuthorizationSuccess() {
    try {
        await authorizeUser();
    } catch (error) {
        console.error('Error in checkSpotifyAuthorizationSuccess:', error);
        alert('Error authorizing user. Please try again later.');
    }
}

// Call the checkSpotifyAuthorizationSuccess function after the page is redirected
checkSpotifyAuthorizationSuccess();