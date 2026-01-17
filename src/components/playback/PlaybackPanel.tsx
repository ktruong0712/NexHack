import React, { useEffect, useRef } from 'react';
import { useDiagramStore } from '@/store/diagramStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Rewind,
  FastForward
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export const PlaybackPanel: React.FC = () => {
  const {
    actions,
    currentActionIndex,
    isPlaying,
    playbackSpeed,
    setIsPlaying,
    setPlaybackSpeed,
    stepForward,
    stepBackward,
    goToAction,
    rewind,
  } = useDiagramStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const state = useDiagramStore.getState();
        if (state.currentActionIndex < state.actions.length - 1) {
          stepForward();
        } else {
          setIsPlaying(false);
        }
      }, 1000 / playbackSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, stepForward, setIsPlaying]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getActionIcon = (type: string) => {
    if (type.includes('ADD')) return '➕';
    if (type.includes('UPDATE')) return '✏️';
    if (type.includes('DELETE')) return '🗑️';
    if (type.includes('MOVE')) return '↔️';
    return '•';
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <span>Playback</span>
        <span className="text-xs font-mono text-muted-foreground">
          {currentActionIndex + 1} / {actions.length}
        </span>
      </div>

      {/* Controls */}
      <div className="p-3 border-b border-border space-y-3">
        {/* Main controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={rewind}
            disabled={actions.length === 0}
            className="playback-control"
          >
            <Rewind className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={stepBackward}
            disabled={currentActionIndex < 0}
            className="playback-control"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={actions.length === 0 || currentActionIndex >= actions.length - 1}
            className="h-10 w-10"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={stepForward}
            disabled={currentActionIndex >= actions.length - 1}
            className="playback-control"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToAction(actions.length - 1)}
            disabled={actions.length === 0}
            className="playback-control"
          >
            <FastForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed control */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Speed</span>
            <span className="font-mono">{playbackSpeed}x</span>
          </div>
          <Slider
            value={[playbackSpeed]}
            onValueChange={([v]) => setPlaybackSpeed(v)}
            min={0.25}
            max={4}
            step={0.25}
            className="w-full"
          />
        </div>

        {/* Timeline scrubber */}
        {actions.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Timeline</span>
            </div>
            <Slider
              value={[currentActionIndex + 1]}
              onValueChange={([v]) => goToAction(v - 1)}
              min={0}
              max={actions.length}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Action log */}
      <div className="panel-header text-xs">
        Action Log
      </div>
      <ScrollArea className="flex-1">
        <div className="p-1">
          {actions.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No actions recorded yet.
              <br />
              <span className="text-xs">Start creating your diagram!</span>
            </div>
          ) : (
            actions.map((action, idx) => (
              <button
                key={action.id}
                onClick={() => goToAction(idx)}
                className={cn(
                  'action-log-item w-full text-left rounded transition-colors',
                  idx === currentActionIndex && 'current',
                  idx > currentActionIndex && 'opacity-50'
                )}
              >
                <span className="text-base">{getActionIcon(action.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-foreground">{action.description}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {formatTime(action.timestamp)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
