import { Nav } from "@/components/layout/nav";
import { ShowStats } from "@/components/stats/show-stats";
import { RunStats } from "@/components/stats/run-stats";
import { SongStats } from "@/components/stats/song-stats";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Nav />
      <div className="flex-1 bg-[linear-gradient(45deg,rgba(0,0,0,.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,.1)_50%,rgba(0,0,0,.1)_75%,transparent_75%,transparent)] bg-[size:5px_5px]">
        <main className="container mx-auto px-4 py-6 max-w-[1400px]">
          <div className="grid gap-6">
            <ShowStats />
            <RunStats />
            <SongStats />
          </div>
        </main>
      </div>
      <Card className="bg-black text-white border-white/10 rounded-none mt-auto">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">© 2025 kpow phashboard</p>
            <div>
              <a href="https://phish.net/api" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white/70 transition">API</a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}