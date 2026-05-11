import { ArrowLeft, Search, SlidersHorizontal, Plus, X, MapPin, CheckCircle2, Filter } from "lucide-react";
import type { ScreenState } from "@/pages/Index";

export type EmptyStateVariant = 'feed' | 'search' | 'resolved' | 'filter';

interface EmptyStateScreenProps {
  variant: EmptyStateVariant;
  onBack: () => void;
  onNavigate: (s: ScreenState) => void;
}

const filterChips = [
  { id: 'near', icon: '📍', label: 'Near Me' },
  { id: 'popular', icon: '🔥', label: 'Popular' },
  { id: 'severe', icon: '⚠️', label: 'Severe' },
  { id: 'active', icon: '💬', label: 'Active' },
];

const SAMPLE_QUERY = 'D826 construction';
const ACTIVE_FILTER_LABEL = 'Flooding';

export const EmptyStateScreen = ({ variant, onBack, onNavigate }: EmptyStateScreenProps) => {
  const showSearch = variant === 'search';
  const activeTab: 'active' | 'resolved' | 'all' = variant === 'resolved' ? 'resolved' : 'active';
  const activeFilterChip = variant === 'filter';

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 rounded-full bg-pgn-dark text-white flex items-center justify-center">
              <ArrowLeft size={16} />
            </button>
            <h1 className="font-semibold text-[15px] text-primary">Road Conditions</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1">
              <Search size={20} className="text-pgn-blue" />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="mt-3 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              readOnly
              value={SAMPLE_QUERY}
              className="w-full bg-secondary rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-card px-4 pt-2 border-b border-border">
        <div className="flex items-center gap-1">
          {(['active', 'resolved', 'all'] as const).map(t => (
            <button
              key={t}
              className={`relative px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                activeTab === t ? 'text-pgn-navy' : 'text-muted-foreground'
              }`}
            >
              {t}
              {activeTab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chip row */}
      <div className="bg-card px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
            <SlidersHorizontal size={12} /> Sort & Filter
          </button>
          {filterChips.map(chip => (
            <button
              key={chip.id}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 bg-secondary text-secondary-foreground"
            >
              {chip.icon} {chip.label}
            </button>
          ))}
        </div>

        {activeFilterChip && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pgn-sand text-pgn-warm-brown rounded-full text-[11px] font-medium border border-border">
              🌊 {ACTIVE_FILTER_LABEL}
              <button><X size={10} /></button>
            </span>
          </div>
        )}
      </div>

      {/* Empty state — vertically centred */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-xs flex flex-col items-center text-center -mt-12">
          {variant === 'feed' && <MapPin size={48} className="text-muted-foreground/60 mb-4" strokeWidth={1.5} />}
          {variant === 'search' && <Search size={48} className="text-muted-foreground/60 mb-4" strokeWidth={1.5} />}
          {variant === 'resolved' && <CheckCircle2 size={48} className="text-muted-foreground/60 mb-4" strokeWidth={1.5} />}
          {variant === 'filter' && <Filter size={48} className="text-muted-foreground/60 mb-4" strokeWidth={1.5} />}

          {variant === 'feed' && (
            <>
              <h2 className="text-[16px] font-medium text-foreground">Be the first to report a condition!</h2>
              <p className="text-[14px] text-muted-foreground mt-1.5">
                Help fellow travelers by sharing what you see on the road.
              </p>
              <button
                onClick={() => onNavigate({ type: 'create' })}
                className="mt-5 w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
              >
                <Plus size={16} strokeWidth={2.5} /> Post Road Condition
              </button>
            </>
          )}

          {variant === 'search' && (
            <>
              <h2 className="text-[16px] font-medium text-foreground">
                No results for &ldquo;{SAMPLE_QUERY}&rdquo;
              </h2>
              <button className="mt-5 w-full py-3 bg-transparent border border-border text-foreground rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform">
                Clear Filters
              </button>
            </>
          )}

          {variant === 'resolved' && (
            <h2 className="text-[16px] font-medium text-foreground">No resolved reports yet.</h2>
          )}

          {variant === 'filter' && (
            <>
              <h2 className="text-[16px] font-medium text-foreground">
                No {ACTIVE_FILTER_LABEL} reports right now.
              </h2>
              <button className="mt-5 w-full py-3 bg-transparent border border-border text-foreground rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform">
                Clear Filters
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
