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

export async function getRecentShows(): Promise<Show[]> {
  const response = await fetch('/api/shows/recent');
  return response.json();
}

export async function getSongStats(): Promise<SongStat[]> {
  const response = await fetch('/api/songs/stats');
  return response.json();
}

export async function getRunStats(): Promise<RunStats> {
  const response = await fetch('/api/runs/stats');
  return response.json();
}
