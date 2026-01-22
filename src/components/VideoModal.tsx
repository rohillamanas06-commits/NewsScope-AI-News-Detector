import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            How NewsScope Works
          </DialogTitle>
          <DialogDescription>
            Watch a demonstration of how NewsScope analyzes news articles and detects misinformation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="aspect-video bg-muted relative">
          {/* Placeholder for video - in production, embed actual video */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center px-8">
              <h3 className="font-display text-xl font-semibold mb-2">Demo Video Coming Soon</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Our demo video will showcase how NewsScope analyzes news articles 
                and detects misinformation in real-time.
              </p>
            </div>
          </div>
          
          {/* When you have a real video, use this: */}
          {/* 
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="NewsScope Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          */}
        </div>
        
        <div className="p-4 bg-muted/30 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Live Demo Available
            </span>
            <span>•</span>
            <span>2 min walkthrough</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
