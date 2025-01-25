import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSongStats, getSetlist } from "@/lib/phish-api";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function SongStats() {
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const { data: stats } = useQuery({
    queryKey: ['/api/songs/stats'],
    queryFn: getSongStats
  });

  const { data: setlist } = useQuery({
    queryKey: ['/api/setlist', selectedSong],
    queryFn: () => selectedSong ? getSetlist(selectedSong) : null,
    enabled: !!selectedSong
  });

  const chartData = {
    labels: stats?.map(s => s.name) || [],
    datasets: [{
      label: 'Times Played',
      data: stats?.map(s => s.count) || [],
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
        </CardContent>
      </Card>

      <Dialog open={!!selectedSong} onOpenChange={() => setSelectedSong(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSong}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {setlist?.map((show, index) => (
              <div key={index} className="border-b pb-2">
                <h3 className="font-medium">{show.date}</h3>
                <p className="text-sm text-gray-600">{show.venue}</p>
                <p className="text-sm mt-1">{show.setlist}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}