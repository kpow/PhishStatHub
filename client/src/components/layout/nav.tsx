import { Card } from "@/components/ui/card";

export function Nav() {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-black/10 rounded-none">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-slackey tracking-tight">phashboard</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:text-black/70 transition">Stats</a>
            <a href="https://phish.net" target="_blank" rel="noopener noreferrer" className="hover:text-black/70 transition">Phish.net</a>
          </nav>
        </div>
      </div>
    </Card>
  );
}