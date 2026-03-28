import { Sparkles } from 'lucide-react';

interface AISuggestionBoxProps {
  suggestion: string;
  action?: string;
  onAction?: () => void;
}

export const AISuggestionBox = ({ suggestion, action, onAction }: AISuggestionBoxProps) => (
  <div className="ai-suggestion p-4 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-aura-gold/5 rounded-full blur-2xl pointer-events-none" />
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-aura-gold/10 border border-aura-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={10} className="text-aura-gold" />
      </div>
      <div className="flex-1">
        <p className="section-label mb-2">✦ AURA AI</p>
        <p className="font-syne text-xs text-aura-cream/70 leading-relaxed">{suggestion}</p>
        {action && (
          <button
            onClick={onAction}
            className="mt-3 font-syne text-[9px] tracking-[2.5px] uppercase text-aura-gold hover:text-aura-cream transition-colors border-b border-aura-gold/30 hover:border-aura-cream/30 pb-0.5"
          >
            {action} →
          </button>
        )}
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-aura-gold animate-pulse-gold flex-shrink-0 mt-1.5" />
    </div>
  </div>
);
