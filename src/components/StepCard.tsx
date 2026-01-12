import React from 'react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  delay?: number;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  title,
  description,
  delay = 0
}) => {
  return (
    <div 
      className={cn(
        "relative flex gap-4 md:gap-6 opacity-0 animate-slide-up group"
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
          {step}
        </div>
        {step < 3 && <div className="h-16 w-0.5 bg-primary/20 mt-2" />}
        {step === 3 && <div className="h-16 w-0.5 opacity-0" />} {/* Invisible spacer to maintain layout */}
      </div>
      <div className={`flex-1 ${step < 3 ? 'pb-8' : ''}`}>
        <h3 className="font-bold text-lg mb-1 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};