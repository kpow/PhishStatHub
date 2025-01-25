import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getShowSetlist } from "@/lib/phish-api";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface Show {
  id: string;
  date: string;
  venue: string;
  location: string;
  showday: number;
  tour: string;
  url: string;
}

interface ShowsResponse {
  shows: Show[];
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export function ShowStats() {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: showsData } = useQuery<ShowsResponse>({
    queryKey: ['/api/shows', page],
    queryFn: async () => {
      const response = await fetch(`/api/shows?page=${page}&limit=12`);
      if (!response.ok) throw new Error('Failed to fetch shows');
      return response.json();
    }
  });

  const { data: setlist } = useQuery({
    queryKey: ['/api/setlists', selectedShow],
    queryFn: () => selectedShow ? getShowSetlist(selectedShow) : null,
    enabled: !!selectedShow
  });

  const formatSetlist = (setlist: string) => {
    return setlist.split('\n').map((line, i) => (
      <p key={i} className="text-sm">{line}</p>
    ));
  };

  return (
    <>
      <Card className="bg-white/50 backdrop-blur-sm border-black/10">
        <CardHeader>
          <CardTitle className="font-slackey">Shows</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {showsData?.shows.map((show) => (
              <Card 
                key={show.id} 
                className="hover:bg-black/5 cursor-pointer transition-colors border border-black/10 h-full"
                onClick={() => setSelectedShow(show.id)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium truncate flex-1 pr-2">{show.venue}</h3>
                      <a 
                        href={show.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-black/50 hover:text-black transition-colors shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-sm text-black/70">{show.date} • {DAYS_OF_WEEK[show.showday]}</p>
                    <p className="text-sm text-black/70 mt-1">{show.location}</p>
                    {show.tour && <p className="text-xs text-black/60 mt-auto pt-2">{show.tour}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {showsData && (
            <div className="mt-6 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {page} of {showsData.pagination.total}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={!showsData.pagination.hasMore}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedShow} onOpenChange={() => setSelectedShow(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showsData?.shows.find(s => s.id === selectedShow)?.venue}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {(() => {
              const show = showsData?.shows.find(s => s.id === selectedShow);
              if (!show) return null;
              return (
                <>
                  <div>
                    <p className="text-sm font-medium text-black/70">
                      {show.date} • {DAYS_OF_WEEK[show.showday]}
                    </p>
                    <p className="text-sm text-black/70">{show.location}</p>
                    {show.tour && <p className="text-sm text-black/60 mt-1">{show.tour}</p>}
                  </div>
                  {/* Setlist */}
                  {setlist?.setlistdata && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Setlist</h3>
                      <div className="text-sm whitespace-pre-line font-mono bg-black/5 p-4 rounded-lg">
                        {formatSetlist(setlist.setlistdata)}
                      </div>
                    </div>
                  )}
                  {/* Notes */}
                  {setlist?.setlistnotes && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notes</h3>
                      <p className="text-sm text-gray-600" 
                         dangerouslySetInnerHTML={{ __html: setlist.setlistnotes }} 
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}