interface Show {
  id: string;
  date: string;
  venue: string;
  location: string;
  rating: number;
}

interface SongStat {
  name: string;
  count: number;
}

interface RunStats {
  totalShows: number;
  uniqueVenues: number;
  averageRating: number;
}

const API_BASE = 'https://api.phish.net/v5';

async function apiRequest(endpoint: string) {
  const url = new URL(`${API_BASE}${endpoint}`);
  url.searchParams.append('apikey', import.meta.env.VITE_PHISH_API_KEY);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
}

export async function getRecentShows(): Promise<Show[]> {
  const data = await apiRequest('/user/shows/user');
  return data.map((show: any) => ({
    id: show.showid,
    date: show.showdate,
    venue: show.venue,
    location: `${show.city}, ${show.state}`,
    rating: parseFloat(show.rating)
  })).slice(0, 5); // Get 5 most recent shows
}

export async function getSongStats(): Promise<SongStat[]> {
  const data = await apiRequest('/user/songs/artist/1/user');
  return data
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5)
    .map((song: any) => ({
      name: song.song,
      count: parseInt(song.count)
    }));
}

export async function getRunStats(): Promise<RunStats> {
  const showData = await apiRequest('/user/shows/user');
  const uniqueVenues = new Set(showData.map((show: any) => show.venueid)).size;
  const totalShows = showData.length;
  const averageRating = showData.reduce((sum: number, show: any) => 
    sum + (parseFloat(show.rating) || 0), 0) / totalShows;

  return {
    totalShows,
    uniqueVenues,
    averageRating
  };
}