interface Show {
  id: string;
  date: string;
  venue: string;
  location: string;
  showday: number;
  tour: string;
  url: string;
}

interface SongStat {
  name: string;
  count: number;
}

interface RunStats {
  totalShows: number;
  uniqueVenues: number;
}

interface VenueStat {
  venue: string;
  count: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
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

export async function getVenueStats(page: number): Promise<PaginatedResponse<VenueStat>> {
  const response = await fetch(`/api/venues/stats?page=${page}`);
  return response.json();
}

export async function getSetlist(songName: string): Promise<SetlistShow[]> {
  const response = await fetch(`/api/setlist/${encodeURIComponent(songName)}`);
  return response.json();
}

interface SetlistShow {
  date: string;
  venue: string;
  setlist: string;
}

interface Setlist {
  showdate: string;
  venue: string;
  location: string;
  setlistdata: string;
  setlistnotes: string;
}

export async function getShowSetlist(showId: string): Promise<Setlist> {
  const response = await fetch(`/api/setlists/${showId}`);
  return response.json();
}