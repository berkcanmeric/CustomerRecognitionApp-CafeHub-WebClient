

// // Function to get the user's profile information
// async function getUserProfile(accessToken) {
//     const response = await fetch('https://api.spotify.com/v1/me', {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//
//     const data = await response.json();
//
//     return data;
// }

// Function to create a new playlist for the user
// async function createPlaylist(accessToken, name, description) {
//     const userId = await getUserId(accessToken);
//
//     const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             name,
//             description,
//         }),
//     });
//
//     const data = await response.json();
//
//     return data;
// }

// Function to get the user's Spotify user ID
// async function getUserId(accessToken) {
//     const response = await fetch('https://api.spotify.com/v1/me', {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//
//     const data = await response.json();
//
//     return data.id;
// }

// // Function to search for tracks by keyword
// async function searchTracks(accessToken, keyword) {
//     const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURI(keyword)}&type=track`, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//
//     const data = await response.json();
//
//     return data.tracks.items;
// }
//
// // Function to add a track to a playlist
// async function addTrackToPlaylist(accessToken, playlistId, trackId) {
//     const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//         method: 'POST',
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             uris: [`spotify:track:${trackId}`],
//         }),
//     });
//
//     const data = await response.json();
//
//     return data;
// }