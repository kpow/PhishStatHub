import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getRecentShows } from "@/lib/phish-api";
import { useState } from "react";

export function ShowStats() {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const { data: shows } = useQuery({
    queryKey: ['/api/shows/recent'],
    queryFn: getRecentShows
  });

  const formatSetlist = (setlist: string) => {
    // Split the setlist into lines for better formatting
    return setlist.split('\n').map((line, i) => (
      <p key={i} className="text-sm">{line}</p>
    ));
  };

  return (
    <>
      <Card className="bg-white/50 backdrop-blur-sm border-black/10">
        <CardHeader>
          <CardTitle className="font-slackey">Recent Shows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shows?.map((show) => (
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
                  <p className="text-sm text-black/70">{show.rating.toFixed(1)} avg rating</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedShow} onOpenChange={() => setSelectedShow(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {shows?.find(s => s.id === selectedShow)?.venue}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {(() => {
              const show = shows?.find(s => s.id === selectedShow);
              if (!show) return null;
              return (
                <>
                  <div>
                    <p className="text-sm font-medium text-black/70">{show.date}</p>
                    <p className="text-sm text-black/70">{show.location}</p>
                  </div>
                  {/* Setlist */}
                  {show.setlist && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Setlist</h3>
                      <div className="text-sm whitespace-pre-line font-mono bg-black/5 p-4 rounded-lg">
                        {formatSetlist(show.setlist)}
                      </div>
                    </div>
                  )}
                  {/* Notes */}
                  {show.setlist_notes && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notes</h3>
                      <p className="text-sm text-gray-600" 
                         dangerouslySetInnerHTML={{ __html: show.setlist_notes }} 
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