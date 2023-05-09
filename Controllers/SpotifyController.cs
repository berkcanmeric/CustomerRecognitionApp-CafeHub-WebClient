using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using CafeHUBWebV2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using CafeHUBWebV2.Models;
using Microsoft.Extensions.Configuration;

namespace CafeHUBWebV2.Controllers
{
    public class SpotifyController : Controller
    {
        private const string BaseUrl = "https://api.spotify.com/v1";
        private const string RedirectUri = "https://localhost:44346/Spotify/Callback";
        private const string Scope = "user-read-private user-read-email user-library-read playlist-read-private";

        private readonly string _clientId;
        private readonly string _clientSecret;

        public SpotifyController(IConfiguration configuration)
        {
            // Get the Spotify API client ID and client secret from your configuration
            _clientId = configuration["Spotify:ClientId"];
            _clientSecret = configuration["Spotify:ClientSecret"];
        }
        // GET
        public IActionResult Index()
        {
            return View();
        }
        // Redirect the user to the Spotify authorization screen
        public IActionResult Authorize()
        {
            var state = Guid.NewGuid().ToString("N");
            HttpContext.Session.SetString("SpotifyState", state);

            var authorizeUrl = "https://accounts.spotify.com/authorize";
            var queryParams = new Dictionary<string, string>
            {
                {"response_type", "code"},
                {"client_id", _clientId},
                {"scope", Scope},
                {"redirect_uri", RedirectUri},
                {"state", state}
            };
            var queryString = ToQueryString(queryParams);

            return Redirect($"{authorizeUrl}{queryString}");
        }

        // Handle the callback from the Spotify authorization screen
        public async Task<IActionResult> Callback(string code, string state)
        {
            if (HttpContext.Session.GetString("SpotifyState") != state)
            {
                return BadRequest("Invalid state parameter");
            }

            try
            {
                var accessToken = await GetAccessToken(code);
                HttpContext.Response.Cookies.Append("accessTokenSpotify", accessToken, new CookieOptions { HttpOnly = true, Secure = true });
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                // Log the exception
                return View("Error");
            }
        }

        // Retrieve the access token from the Spotify API using the authorization code
        private async Task<string> GetAccessToken(string code)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}")));
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", RedirectUri)
            });
            var response = await client.PostAsync("https://accounts.spotify.com/api/token", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Request failed with status code {response.StatusCode}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(jsonResponse);

            return tokenResponse.AccessToken;
        }

        // Retrieve the stored access token from the "accessTokenSpotify" cookie
        private string GetAccessToken()
        {
            return HttpContext.Request.Cookies["accessTokenSpotify"];
        }

        // Fetch the playlists from the Spotify API and render them in the table
        [HttpGet, Route("Spotify/Songs/{id}")]
        public async Task<IActionResult> GetSongs(string id)
        {
            try
            {
                const string fields = "items(track(id,name,href,album(name,images(url),artists(name))))&market=from_token";

                var accessToken = GetAccessToken();
                if (string.IsNullOrEmpty(accessToken))
                {
                    return RedirectToAction("Authorize");
                }

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await client.GetAsync($"{BaseUrl}/playlists/{id}/tracks?fields={fields}");

                if (!response.IsSuccessStatusCode)
                {
                    throw new InvalidOperationException($"Request failed with status code {response.StatusCode}");
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var tracksResponse = JsonConvert.DeserializeObject<PlaylistTracksResponse>(jsonResponse);
                var tracks = new List<Track>();

                foreach (var item in tracksResponse.Items)
                {
                    var trackResponse = await GetTrack(item.Track.Id);
                    tracks.Add(trackResponse);
                }

                return View("Songs", tracks);
            }
            catch (Exception ex)
            {
                // Log the exception
                return View("Error");
            }
        }

        // Fetch a single track from the Spotify API
        [HttpGet, Route("Spotify/Tracks/{id}")]
        public async Task<Track> GetTrack(string id)
        {
            const string fields = "items(track(name, album(images(url)), artists(name)))&market=from_token";
            
            var accessToken = GetAccessToken();
            if (string.IsNullOrEmpty(accessToken))
            {
                throw new InvalidOperationException("Access token not found.");
            }

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            var response = await client.GetAsync($"{BaseUrl}/tracks/{id}?fields={fields}");

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Request failed with status code {response.StatusCode}");
            }

            var jsonResponse = await response.Content.ReadAsStringAsync();
            var track = JsonConvert.DeserializeObject<Track>(jsonResponse);

            return track;
        }

        // Convert a dictionary of query string parameters to a URL-encoded query string
        private static string ToQueryString(Dictionary<string, string> queryParams)
        {
            var queryString = new StringBuilder();

            foreach (var kvp in queryParams)
            {
                if (queryString.Length > 0)
                {
                    queryString.Append("&");
                }

                queryString.Append($"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}");
            }

            return $"?{queryString}";
        }
    }
}