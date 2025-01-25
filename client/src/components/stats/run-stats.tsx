import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRunStats } from "@/lib/phish-api";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface VenueStatsResponse {
  venues: Array<{venue: string, count: number}>;
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
}

export function RunStats() {
  const [page, setPage] = useState(1);
  const { data: stats } = useQuery({
    queryKey: ['/api/runs/stats'],
    queryFn: getRunStats
  });

  const { data: venueStats } = useQuery<VenueStatsResponse>({
    queryKey: ['/api/venues/stats', page],
    queryFn: async () => {
      const response = await fetch(`/api/venues/stats?page=${page}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch venue stats');
      return response.json();
    }
  });

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-black/10">
      <CardHeader>
        <CardTitle className="font-slackey">Run Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-black/70">Total Shows</h3>
              <p className="text-3xl font-mono">{stats?.totalShows || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-black/70">Unique Venues</h3>
              <p className="text-3xl font-mono">{stats?.uniqueVenues || 0}</p>
            </div>
          </div>

          {/* Venue Statistics */}
          <div>
            <h3 className="text-sm font-medium text-black/70 mb-4">Most Visited Venues</h3>
            <div className="space-y-3">
              {venueStats?.venues.map((venue, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5"
                >
                  <span className="text-sm">{venue.venue}</span>
                  <span className="text-sm font-mono">{venue.count}</span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {venueStats && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {venueStats.pagination.total}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!venueStats.pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}