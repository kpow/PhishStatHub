import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSongStats, getSetlistOccurrences } from "@/lib/phish-api";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ExternalLink } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function SongStats() {
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/songs/stats'],
    queryFn: getSongStats
  });

  const { data: occurrences, isLoading: isLoadingOccurrences } = useQuery({
    queryKey: ['/api/setlist/occurrences', selectedSong],
    queryFn: () => selectedSong ? getSetlistOccurrences(selectedSong) : null,
    enabled: !!selectedSong
  });

  // Calculate pagination
  const totalPages = stats ? Math.ceil(stats.length / itemsPerPage) : 0;
  const paginatedStats = stats?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Data for the bar chart - show top 20 songs
  const chartData = {
    labels: stats?.slice(0, 20).map(s => s.name) || [],
    datasets: [{
      label: 'Times Played',
      data: stats?.slice(0, 20).map(s => s.count) || [],
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: 'rgba(0, 0, 0, 0.8)',
      borderWidth: 1
    }]
  };

  return (
    <>
      <Card className="bg-white/50 backdrop-blur-sm border-black/10">
        <CardHeader>
          <CardTitle className="font-slackey">Song Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart showing top 20 songs */}
            <div className="h-[300px]">
              <Bar 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  onClick: (event, elements) => {
                    if (elements.length > 0) {
                      const songIndex = elements[0].index;
                      setSelectedSong(stats?.[songIndex].name || null);
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: 'black' }
                    },
                    y: {
                      ticks: { color: 'black' }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'black'
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Paginated table of all songs */}
            <div className="relative">
              <h3 className="text-sm font-medium text-black/70 mb-4">All Songs</h3>
              <div className="space-y-3">
                {isLoading ? (
                  // Loading skeleton
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <div key={index} className="flex justify-between items-center p-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[40px]" />
                    </div>
                  ))
                ) : (
                  paginatedStats?.map((song, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5 cursor-pointer"
                      onClick={() => setSelectedSong(song.name)}
                    >
                      <span className="text-sm">{song.name}</span>
                      <span className="text-sm font-mono">{song.count}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination controls */}
              {stats && (
                <div className="mt-4 flex justify-between items-center py-2 bg-white/50 backdrop-blur-sm border-t border-black/5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages || isLoading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSong} onOpenChange={() => setSelectedSong(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>{selectedSong}</span>
                {occurrences?.[0]?.url && (
                  <a 
                    href={occurrences[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black/50 hover:text-black transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {occurrences && <span className="text-sm font-normal">Played {occurrences.length} times</span>}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {isLoadingOccurrences ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="border-b pb-2">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ))}
              </div>
            ) : occurrences && occurrences.length > 0 ? (
              <div className="space-y-4">
                {occurrences.map((occurrence, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="font-medium">{occurrence.date}</p>
                    <p className="text-sm text-black/70">{occurrence.venue}</p>
                    <p className="text-sm mt-1">{occurrence.setlist}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-black/70">No occurrences found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}