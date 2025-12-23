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
        "relative flex gap-4 md:gap-6 opacity-0 animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Step number */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          <span className="font-display text-xl md:text-2xl font-bold text-primary-foreground">
            {step}
          </span>
        </div>
        {/* Connecting line */}
        <div className="hidden md:block w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent mx-auto mt-2" />
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8 md:pb-12">
        <h3 className="font-display text-lg md:text-xl font-semibold mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
