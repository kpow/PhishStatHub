import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRunStats } from "@/lib/phish-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

  const { data: venueStats, isLoading } = useQuery<VenueStatsResponse>({
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
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-sm font-medium text-black/70 mb-2">Total Shows</h3>
              <p className="text-3xl font-mono">{stats?.totalShows || 0}</p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-black/70 mb-2">Unique Venues</h3>
              <p className="text-3xl font-mono">{stats?.uniqueVenues || 0}</p>
            </div>
          </div>

          {/* Venue Statistics */}
          <div className="relative">
            <h3 className="text-sm font-medium text-black/70 mb-4">Most Visited Venues</h3>
            {/* Fixed height container for venue list with consistent height during loading */}
            <div className="h-[240px] overflow-auto">
              <div className="space-y-3 pb-16">
                {isLoading ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, index) => (
                    <div key={index} className="flex justify-between items-center p-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[40px]" />
                    </div>
                  ))
                ) : (
                  venueStats?.venues.map((venue, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5"
                    >
                      <span className="text-sm">{venue.venue}</span>
                      <span className="text-sm font-mono">{venue.count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination with fixed position */}
            {venueStats && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center py-2 bg-white/50 backdrop-blur-sm border-t border-black/5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
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
                  disabled={!venueStats.pagination.hasMore || isLoading}
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