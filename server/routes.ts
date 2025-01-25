import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  app.get('/api/shows/recent', (_req, res) => {
    // Mocked data - would normally fetch from phish.net API
    res.json([
      {
        id: "1",
        date: "2024-03-15",
        venue: "Madison Square Garden",
        location: "New York, NY",
        rating: 4.8
      },
      {
        id: "2", 
        date: "2024-03-14",
        venue: "TD Garden",
        location: "Boston, MA",
        rating: 4.6
      }
    ]);
  });

  app.get('/api/songs/stats', (_req, res) => {
    res.json([
      { name: "You Enjoy Myself", count: 315 },
      { name: "Mike's Song", count: 285 },
      { name: "Weekapaug Groove", count: 275 },
      { name: "Tweezer", count: 265 },
      { name: "Run Like an Antelope", count: 255 }
    ]);
  });

  app.get('/api/runs/stats', (_req, res) => {
    res.json({
      totalShows: 1750,
      uniqueVenues: 350,
      averageRating: 4.2
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
