import type { Express } from "express";
import { createServer, type Server } from "http";

const PHISH_API_BASE = 'https://api.phish.net/v5';

async function fetchPhishData(endpoint: string) {
  try {
    const apiKey = process.env.PHISH_API_KEY;
    const response = await fetch(`${PHISH_API_BASE}${endpoint}.json?apikey=${apiKey}`);
    const data = await response.json();

    // Add debug logging
    console.log(`API Response for ${endpoint}:`, JSON.stringify(data, null, 2));

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

  app.get('/api/setlists/:showId', async (req, res) => {
    try {
      const { showId } = req.params;
      const setlistData = await fetchPhishData(`/setlists/showid/${showId}`);

      // Add debug logging for setlist data structure
      console.log('Setlist data structure:', {
        raw: setlistData,
        isArray: Array.isArray(setlistData),
        length: Array.isArray(setlistData) ? setlistData.length : 0,
        firstItem: Array.isArray(setlistData) && setlistData.length > 0 ? setlistData[0] : null,
        keys: Array.isArray(setlistData) && setlistData.length > 0 ? Object.keys(setlistData[0]) : []
      });

      // The API returns an array, we want the first item
      if (Array.isArray(setlistData) && setlistData.length > 0) {
        const setlist = setlistData[0];

        // Format and return both setlist data and notes
        res.json({
          showdate: setlist.showdate,
          venue: setlist.venue,
          location: `${setlist.city}, ${setlist.state}`,
          setlistdata: setlist.setlistdata || '',
          setlistnotes: setlist.setlistnotes || ''
        });
      } else {
        res.status(404).json({ message: 'Setlist not found' });
      }
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