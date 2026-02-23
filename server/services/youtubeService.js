import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

async function getYoutubeVideos() {
  if (!API_KEY || !PLAYLIST_ID) {
    console.error("YOUTUBE ENV NOT SET");
    return [];
  }

  try {
    const res = await axios.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet",
          playlistId: PLAYLIST_ID,
          maxResults: 10,
          key: API_KEY,
        },
      }
    );

    return res.data.items.map(item => ({
      id: `yt-${item.snippet.resourceId.videoId}`,
      source: "youtube",
      title: item.snippet.title,
      type: "video",
      game: "YouTube",
      tags: ["youtube"],
      views: 0,
      thumbnail: item.snippet.thumbnails?.medium?.url ?? "",
      youtubeId: item.snippet.resourceId.videoId,
      createdAt: item.snippet.publishedAt,
    }));
  } catch (err) {
    console.error(
      "YOUTUBE ERROR:",
      err.response?.data || err.message
    );
    return [];
  }
}

export default getYoutubeVideos;
