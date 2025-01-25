# kpow phashboard

A comprehensive Phish statistics dashboard that provides in-depth insights into the band's live performances through interactive data visualization and API-driven analysis.

## Features

- 📊 Show Statistics: View detailed information about shows, including setlists, venues, and dates
- 🎵 Song Analysis: Track song performances, frequencies, and historical data
- 📍 Venue Tracking: Explore performance locations and venue statistics
- 📈 Interactive Charts: Visual representation of song frequencies and show data
- 🔄 Real-time Data: Integration with Phish.net API v5 for up-to-date information

## Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - Wouter for routing
  - TanStack Query for data fetching and caching
  - Recharts and Chart.js for data visualization
  - Tailwind CSS with shadcn/ui components
  - Custom theme system for consistent styling

- **Backend**:
  - Express.js server
  - API proxy for Phish.net v5 API integration
  - Environment-based configuration

## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and API clients
│   │   └── pages/       # Page components
├── server/               # Backend Express application
│   ├── routes.ts        # API route definitions
│   └── index.ts         # Server configuration
└── db/                  # Database configuration (if needed)
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kpow/PhishStatHub.git
   cd PhishStatHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   PHISH_API_KEY=your_phish_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Manual Deployment

For deployment on other platforms:

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

The application will be available on port 5000.

## API Integration

The application integrates with the Phish.net v5 API. Key endpoints used:

- `/api/shows`: Show statistics and setlists
- `/api/songs/stats`: Song performance statistics
- `/api/runs/stats`: Run and venue statistics

API responses are cached using TanStack Query for optimal performance.

## Development

- The project uses TypeScript for type safety
- Tailwind CSS for styling with a custom theme configuration
- Component library based on shadcn/ui
- Vite for fast development and building

### Adding New Features

1. Frontend components go in `client/src/components`
2. New API endpoints should be added to `server/routes.ts`
3. Update types in relevant files when adding new data structures

## Environment Variables

Required environment variables:

- `PHISH_API_KEY`: Your Phish.net API key
- `DATABASE_URL`: (Optional) Database connection string if using a database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See LICENSE file for details

## Credits

- Data provided by [Phish.net](https://phish.net)
- Built with [React](https://reactjs.org/) and [Express](https://expressjs.com/)
