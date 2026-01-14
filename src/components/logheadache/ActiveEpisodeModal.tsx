import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Calendar } from 'lucide-react';
import { HeadacheEpisode } from '@/types/episode';
import { formatDistanceToNow } from 'date-fns';

interface ActiveEpisodeModalProps {
  episode: HeadacheEpisode;
  onContinue: () => void;
  onStartNew: () => void;
  open: boolean;
}

export const ActiveEpisodeModal = ({ episode, onContinue, onStartNew, open }: ActiveEpisodeModalProps) => {
  const duration = formatDistanceToNow(new Date(episode.start_time), { addSuffix: true });

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Active Episode Detected</DialogTitle>
          <DialogDescription>
            You have an ongoing headache episode. Would you like to continue logging it or start a new one?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Started {duration}</span>
            </div>
            {episode.pain_intensity && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Pain Intensity: {episode.pain_intensity}/10</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button 
              onClick={onContinue}
              className="w-full"
            >
              Continue Current Episode
            </Button>
            <Button 
              onClick={onStartNew}
              variant="outline"
              className="w-full"
            >
              Start New Episode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
