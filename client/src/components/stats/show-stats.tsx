import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRecentShows } from "@/lib/phish-api";

export function ShowStats() {
  const { data: shows } = useQuery({
    queryKey: ['/api/shows/recent'],
    queryFn: getRecentShows
  });

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="font-mono">Recent Shows</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shows?.map((show) => (
            <div key={show.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{show.venue}</h3>
                <p className="text-sm text-white/70">{show.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{show.location}</p>
                <p className="text-sm text-white/70">{show.rating} avg rating</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
