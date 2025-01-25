import { Nav } from "@/components/layout/nav";
import { ShowStats } from "@/components/stats/show-stats";
import { SongStats } from "@/components/stats/song-stats";
import { RunStats } from "@/components/stats/run-stats";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[linear-gradient(45deg,rgba(255,255,255,.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.1)_50%,rgba(255,255,255,.1)_75%,transparent_75%,transparent)] bg-[size:5px_5px]">
        <Nav />
        <main className="container mx-auto p-4">
          <div className="grid gap-6">
            <ShowStats />
            <SongStats />
            <RunStats />
          </div>
        </main>
      </div>
    </div>
  );
}
