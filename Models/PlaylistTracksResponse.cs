namespace CafeHUBWebV2.Models;

using System.Collections.Generic;
using Newtonsoft.Json;

public class PlaylistTracksResponse
{
    [JsonProperty("items")]
    public List<PlaylistTrackItem> Items { get; set; }
}

public class PlaylistTrackItem
{
    [JsonProperty("track")]
    public Track Track { get; set; }
}

public class Track
{
    [JsonProperty("id")]
    public string Id { get; set; }

    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("href")]
    public string Href { get; set; }
    
    [JsonProperty("artists")]
    public List<Artist> Artists { get; set; }

    [JsonProperty("album")]
    public Album Album { get; set; }

    [JsonProperty("duration_ms")]
    public int Duration { get; set; }
}

public class Album
{
    [JsonProperty("images")]
    public List<AlbumImage> Images { get; set; }
    
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("release_date")]
    public string ReleaseDate { get; set; }
}
public class Artist
{
    [JsonProperty("name")]
    public string Name { get; set; }
}

public class AlbumImage
{
    [JsonProperty("url")]
    public string Url { get; set; }
}