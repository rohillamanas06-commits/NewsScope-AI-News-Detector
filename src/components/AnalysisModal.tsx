import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink,
  Shield,
  BarChart3
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  verdict: 'real' | 'fake' | 'uncertain' | 'misleading';
  confidence: number;
  summary: string;
  factors: string[];
  sources: { name: string; url: string; credibility: string }[];
  recommendations: string[];
}

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  isLoading?: boolean;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  result,
  isLoading = false
}) => {
  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'real':
        return {
          icon: CheckCircle,
          label: 'Likely Authentic',
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30'
        };
      case 'fake':
        return {
          icon: XCircle,
          label: 'Likely False',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30'
        };
      case 'misleading':
        return {
          icon: AlertTriangle,
          label: 'Misleading Content',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30'
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Uncertain',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30'
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            Analysis Results
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground animate-pulse">Analyzing news content...</p>
          </div>
        ) : result ? (
          <div className="space-y-6 py-4">
            {/* Verdict Banner */}
            {(() => {
              const config = getVerdictConfig(result.verdict);
              const Icon = config.icon;
              return (
                <div className={cn(
                  "p-6 rounded-xl border-2 animate-scale-in",
                  config.bgColor,
                  config.borderColor
                )}>
                  <div className="flex items-center gap-4">
                    <Icon className={cn("w-12 h-12", config.color)} />
                    <div>
                      <h3 className={cn("text-2xl font-display font-bold", config.color)}>
                        {config.label}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Confidence: <span className="font-semibold">{result.confidence}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Summary
              </h4>
              <p className="text-foreground leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Key Factors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Key Factors
              </h4>
              <ul className="space-y-2">
                {result.factors.map((factor, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-sm opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sources */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Sources Checked
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {result.sources.slice(0, 6).map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm group"
                  >
                    <span className="truncate">{source.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Recommendations
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={onClose} variant="default">
                Close Analysis
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
