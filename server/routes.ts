import type { Express } from "express";
import { createServer, type Server } from "http";

const PHISH_API_BASE = 'https://api.phish.net/v5';

async function fetchPhishData(endpoint: string) {
  try {
    const apiKey = process.env.PHISH_API_KEY;
    const response = await fetch(`${PHISH_API_BASE}${endpoint}.json?apikey=${apiKey}`);

    // Add debug logging
    console.log(`Fetching from: ${PHISH_API_BASE}${endpoint}.json`);
    const responseText = await response.text();
    console.log('Response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      throw new Error(`Failed to parse response: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch data from Phish.net API');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching from Phish.net:', error);
    throw error;
  }
}

export function registerRoutes(app: Express): Server {
  app.get('/api/shows/recent', async (_req, res) => {
    try {
      const shows = await fetchPhishData('/attendance/username/koolyp');
      const formattedShows = shows
        .slice(0, 5)
        .map((show: any) => ({
          id: show.showid,
          date: show.showdate,
          venue: show.venue,
          location: `${show.city}, ${show.state}`,
          rating: parseFloat(show.rating) || 0
        }));

      res.json(formattedShows);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/songs/stats', async (_req, res) => {
    try {
      const songs = await fetchPhishData('/attendance/username/koolyp');
      const songCounts: { [key: string]: number } = {};

      // Count songs from all shows
      songs.forEach((show: any) => {
        if (show.songdata) {
          const showSongs = show.songdata.split(', ');
          showSongs.forEach((song: string) => {
            songCounts[song] = (songCounts[song] || 0) + 1;
          });
        }
      });

      // Convert to array and sort by count
      const formattedSongs = Object.entries(songCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      res.json(formattedSongs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/setlist/:songName', async (req, res) => {
    try {
      const shows = await fetchPhishData('/attendance/username/koolyp');
      const songName = req.params.songName;

      const showsWithSong = shows
        .filter((show: any) => show.songdata && show.songdata.includes(songName))
        .map((show: any) => ({
          date: show.showdate,
          venue: show.venue,
          setlist: show.setlist_notes || 'No setlist notes available'
        }));

      res.json(showsWithSong);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/runs/stats', async (_req, res) => {
    try {
      const shows = await fetchPhishData('/attendance/username/koolyp');

      const uniqueVenues = new Set(shows.map((show: any) => show.venueid)).size;
      const totalShows = shows.length;
      const ratings = shows.map((show: any) => parseFloat(show.rating) || 0);
      const validRatings = ratings.filter((r: number) => r > 0);
      const averageRating = validRatings.length > 0 
        ? validRatings.reduce((sum: number, r: number) => sum + r, 0) / validRatings.length
        : 0;

      res.json({
        totalShows,
        uniqueVenues,
        averageRating
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}