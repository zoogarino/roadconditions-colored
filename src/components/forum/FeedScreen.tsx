import { useState, useRef } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Plus, X, Loader2 } from "lucide-react";
import { mockPosts } from "@/data/mockData";
import { computeStatus, relevanceScore } from "@/lib/lifecycle";
import { PostCard } from "./PostCard";
import { FilterModal, ContextMenu, ReportModal, ReportSuccessToast, DeleteConfirmModal, ShareSheet } from "./Overlays";
import type { ScreenState } from "@/pages/Index";

interface FeedScreenProps {
  onNavigate: (s: ScreenState) => void;
  onBack: () => void;
  isOffline: boolean;
  showToast: (msg: string, type: 'success' | 'warning' | 'info') => void;
}

const filterChips = [
  { id: 'near', icon: '📍', label: 'Near Me' },
  { id: 'popular', icon: '🔥', label: 'Popular' },
  { id: 'severe', icon: '⚠️', label: 'Severe' },
  { id: 'active', icon: '💬', label: 'Active' },
];

type FeedTab = 'active' | 'resolved' | 'all';

export const FeedScreen = ({ onNavigate, isOffline, showToast }: FeedScreenProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ postId: string; isOwn: boolean; pinnedOnly: boolean } | null>(null);
  const [shareTarget, setShareTarget] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [tab, setTab] = useState<FeedTab>('active');
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    if (isOffline) {
      showToast("You're offline. Can't check for new posts.", 'warning');
      return;
    }
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Tab filtering by lifecycle status (pinned posts always treated as active)
  const tabPosts = mockPosts.filter(p => !deletedIds.includes(p.id)).filter(p => {
    if (p.isPinned) return tab === 'active' || tab === 'all';
    const status = computeStatus(p);
    if (tab === 'active') return status === 'active' || status === 'needs_confirmation';
    if (tab === 'resolved') return status === 'resolved';
    return true; // all
  });

  const searchFiltered = tabPosts.filter(p =>
    !searchQuery || p.road.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pinned posts always pinned to top of Active tab; otherwise interleave normally
  const pinned = tab === 'active' ? searchFiltered.filter(p => p.isPinned) : [];
  const unpinned = searchFiltered.filter(p => !p.isPinned);

  const sortedUnpinned = [...unpinned].sort((a, b) => {
    if (tab === 'resolved') return (a.resolvedDaysAgo ?? 0) - (b.resolvedDaysAgo ?? 0);
    if (tab === 'all') return (a.daysOld ?? 0) - (b.daysOld ?? 0);
    return relevanceScore(b) - relevanceScore(a);
  });

  const filteredPosts = [...pinned, ...sortedUnpinned];

  return (
    <div className="h-full flex flex-col relative bg-background">
      {/* Offline banner */}
      {isOffline && !bannerDismissed && (
        <div className="bg-pgn-dark px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xs">📡</span>
            <div>
              <p className="text-xs font-semibold">Offline Mode</p>
              <p className="text-[10px] opacity-80">You can view cached posts &amp; create new ones</p>
            </div>
          </div>
          <button onClick={() => setBannerDismissed(true)} className="text-white/70 p-1"><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div className="bg-card px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-pgn-dark text-white flex items-center justify-center">
              <ArrowLeft size={16} />
            </button>
            <h1 className="font-semibold text-[15px] text-primary">Road Conditions</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSearch(!showSearch)} className="p-1">
              <Search size={20} className="text-pgn-blue" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mt-3 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isOffline ? "Search unavailable offline" : "Search roads, places..."}
              disabled={isOffline}
              className="w-full bg-secondary rounded-lg pl-9 pr-9 py-2.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lifecycle tabs */}
      <div className="bg-card px-4 pt-2 border-b border-border">
        <div className="flex items-center gap-1">
          {(['active', 'resolved', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                tab === t ? 'text-pgn-navy' : 'text-muted-foreground'
              }`}
            >
              {t}
              {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
          >
            <SlidersHorizontal size={12} /> Sort & Filter
          </button>
          {filterChips.map(chip => (
            <button
              key={chip.id}
              onClick={() => toggleFilter(chip.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors duration-200 ${
                activeFilters.includes(chip.id)
                  ? 'bg-primary text-pgn-navy'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {chip.icon} {chip.label}
            </button>
          ))}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {activeFilters.map(id => {
              const chip = filterChips.find(c => c.id === id);
              return chip ? (
                <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-pgn-sand text-pgn-warm-brown rounded-full text-[11px] font-medium border border-border">
                  {chip.icon} {chip.label}
                  <button onClick={() => toggleFilter(id)}>
                    <X size={10} />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Post feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
        {/* Pull to refresh indicator */}
        {isRefreshing && (
          <div className="flex justify-center py-2">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        )}

        {/* Refresh hint */}
        <button onClick={handleRefresh} className="w-full text-center text-xs text-muted-foreground py-1 active:text-primary">
          ↓ Pull to refresh
        </button>

        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-foreground mb-1">No posts found</h3>
            <p className="text-xs text-muted-foreground mb-4">Try different keywords or check your filters</p>
            <button onClick={() => { setSearchQuery(''); setActiveFilters([]); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
              Clear Filters
            </button>
          </div>
        ) : (
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onTap={() => onNavigate({ type: 'detail', postId: post.id })}
              onLongPress={() => setContextMenu({ postId: post.id, isOwn: post.author.name === 'You', pinnedOnly: !!post.isPinned })}
            />
          ))
        )}

        {filteredPosts.length > 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            <Loader2 size={14} className="inline animate-spin mr-1.5" />
            Loading more...
          </div>
        )}

        <div className="h-20" /> {/* Space for FAB */}
      </div>

      {/* FAB */}
      <button
        onClick={() => onNavigate({ type: 'create' })}
        className="absolute bottom-6 right-5 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform duration-150 z-20"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Overlays */}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
      {contextMenu && (
        <ContextMenu
          isOwn={contextMenu.isOwn}
          onClose={() => setContextMenu(null)}
          onReport={() => setShowReport(true)}
          onDelete={() => setDeleteTarget(contextMenu.postId)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            setDeletedIds(ids => [...ids, deleteTarget]);
            setDeleteTarget(null);
            showToast('Post deleted', 'success');
          }}
        />
      )}
      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          onSubmit={() => {
            setReportSuccess(true);
            setTimeout(() => setReportSuccess(false), 2500);
          }}
        />
      )}
      <ReportSuccessToast visible={reportSuccess} />
    </div>
  );
};
