import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRunStats } from "@/lib/phish-api";

export function RunStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/runs/stats'],
    queryFn: getRunStats
  });

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-black/10">
      <CardHeader>
        <CardTitle className="font-slackey">Run Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-black/70">Total Shows</h3>
            <p className="text-3xl font-mono">{stats?.totalShows || 0}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-black/70">Unique Venues</h3>
            <p className="text-3xl font-mono">{stats?.uniqueVenues || 0}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-black/70">Average Rating</h3>
            <p className="text-3xl font-mono">{stats?.averageRating?.toFixed(2) || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}