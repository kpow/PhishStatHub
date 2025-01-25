import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getShowSetlist } from "@/lib/phish-api";
import { useState } from "react";

interface Show {
  id: string;
  date: string;
  venue: string;
  location: string;
}

interface ShowsResponse {
  shows: Show[];
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
}

export function ShowStats() {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: showsData } = useQuery<ShowsResponse>({
    queryKey: ['/api/shows', page],
    queryFn: async () => {
      const response = await fetch(`/api/shows?page=${page}&limit=10`);
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
        <CardContent>
          <div className="space-y-4">
            {showsData?.shows.map((show) => (
              <div 
                key={show.id} 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-black/5 cursor-pointer transition-colors"
                onClick={() => setSelectedShow(show.id)}
              >
                <div>
                  <h3 className="font-medium">{show.venue}</h3>
                  <p className="text-sm text-black/70">{show.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{show.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {showsData && (
            <div className="flex justify-between items-center mt-6">
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
                    <p className="text-sm font-medium text-black/70">{show.date}</p>
                    <p className="text-sm text-black/70">{show.location}</p>
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