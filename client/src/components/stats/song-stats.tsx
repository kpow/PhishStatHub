import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getSongStats } from "@/lib/phish-api";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export function SongStats() {
  const { data: stats } = useQuery({
    queryKey: ['/api/songs/stats'],
    queryFn: getSongStats
  });

  const chartData = {
    labels: stats?.map(s => s.name) || [],
    datasets: [{
      label: 'Times Played',
      data: stats?.map(s => s.count) || [],
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1
    }]
  };

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="font-mono">Song Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  ticks: { color: 'white' }
                },
                y: {
                  ticks: { color: 'white' }
                }
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
