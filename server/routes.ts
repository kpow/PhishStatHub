import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Proxy routes to Phish.net API
  app.get('/api/shows/recent', async (_req, res) => {
    try {
      const apiKey = process.env.PHISH_API_KEY;
      const response = await fetch(`https://api.phish.net/v5/user/shows/koolyp?apikey=${apiKey}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch shows');
      }

      const shows = data.data
        .slice(0, 5)
        .map((show: any) => ({
          id: show.showid,
          date: show.showdate,
          venue: show.venue,
          location: `${show.city}, ${show.state}`,
          rating: parseFloat(show.rating)
        }));

      res.json(shows);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/songs/stats', async (_req, res) => {
    try {
      const apiKey = process.env.PHISH_API_KEY;
      const response = await fetch(`https://api.phish.net/v5/user/songs/koolyp/1?apikey=${apiKey}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch song stats');
      }

      const songs = data.data
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5)
        .map((song: any) => ({
          name: song.song,
          count: parseInt(song.count)
        }));

      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/runs/stats', async (_req, res) => {
    try {
      const apiKey = process.env.PHISH_API_KEY;
      const response = await fetch(`https://api.phish.net/v5/user/shows/koolyp?apikey=${apiKey}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch run stats');
      }

      const shows = data.data;
      const uniqueVenues = new Set(shows.map((show: any) => show.venueid)).size;
      const totalShows = shows.length;
      const averageRating = shows.reduce((sum: number, show: any) => 
        sum + (parseFloat(show.rating) || 0), 0) / totalShows;

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