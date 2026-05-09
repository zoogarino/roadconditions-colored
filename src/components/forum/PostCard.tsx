import { MessageCircle, Clock, Loader2, Pin, Check, Archive } from "lucide-react";
import { Post, conditionConfig, severityConfig, directionConfig } from "@/data/mockData";
import { computeStatus } from "@/lib/lifecycle";

const boldRoadName = (road: string) => {
  const match = road.match(/^([A-Z]\d+\b)(.*)/);
  if (!match) return <span>{road}</span>;
  return <><span className="font-bold">{match[1]}</span>{match[2]}</>;
};

interface PostCardProps {
  post: Post;
  onTap: () => void;
  onLongPress?: () => void;
}

export const PostCard = ({ post, onTap, onLongPress }: PostCardProps) => {
  const condition = conditionConfig[post.conditionType];
  const severity = severityConfig[post.severity];
  const dir = directionConfig[post.direction];
  const status = computeStatus(post);

  let pressTimer: ReturnType<typeof setTimeout>;
  const handleTouchStart = () => {
    if (onLongPress) pressTimer = setTimeout(() => onLongPress(), 500);
  };
  const handleTouchEnd = () => clearTimeout(pressTimer);

  // ====== PINNED POST VARIANT ======
  if (post.isPinned) {
    return (
      <button
        onClick={onTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className="relative w-full text-left rounded-xl p-4 border-2 border-pgn-terracotta active:scale-[0.99] transition-transform"
        style={{ backgroundColor: '#FFFBF5', boxShadow: '0 2px 8px rgba(212, 133, 74, 0.15)' }}
      >
        {/* Pin badge */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-pgn-blue text-white text-[10px] font-bold uppercase px-2 py-1 rounded">
          <Pin size={10} strokeWidth={3} /> Pinned
        </span>

        <h3 className="text-[18px] font-bold text-pgn-navy pr-20 leading-tight">
          {boldRoadName(post.pinnedTitle ?? post.road)}
        </h3>
        <p className="text-[13px] text-pgn-muted mt-1">
          Created by <span className="text-pgn-terracotta font-semibold">{post.pinnedBy ?? 'PGN Team'}</span> • Updated 2 days ago
        </p>

        <p className="text-[15px] text-pgn-dark mt-3 leading-relaxed">{post.description}</p>

        <div className="my-3 h-px bg-pgn-warm-border" />

        <p className="text-sm font-bold text-pgn-warm-brown mb-3">Latest traveler updates:</p>

        <div className="space-y-2">
          {(post.pinnedMiniReplies ?? []).map((r, i) => (
            <div key={i} className="rounded-lg p-2.5 border border-pgn-warm-border" style={{ backgroundColor: '#FDF6EE' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-pgn-navy">{r.name}</span>
                <span className="text-[11px] text-pgn-muted">{r.timeAgo}</span>
              </div>
              <p className="text-sm text-pgn-dark leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-[13px] text-pgn-muted">💬 {post.pinnedSeasonalUpdates ?? post.replyCount} updates this season</span>
          <span className="text-[13px] font-semibold text-pgn-blue">Add your update →</span>
        </div>
      </button>
    );
  }

  // ====== STANDARD POST CARD ======
  const dotClass =
    status === 'resolved'
      ? 'bg-minor'
      : status === 'archived'
      ? 'bg-pgn-muted'
      : status === 'needs_confirmation'
      ? 'bg-moderate'
      : severity.dot;

  let statusBadge: React.ReactNode = null;
  if (status === 'resolved') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-minor bg-minor/10 px-2 py-0.5 rounded-full">
        <Check size={10} strokeWidth={3} /> Resolved
      </span>
    );
  } else if (status === 'archived') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pgn-muted bg-pgn-muted/10 px-2 py-0.5 rounded-full">
        <Archive size={10} /> Archived
      </span>
    );
  }

  return (
    <button
      onClick={onTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`w-full bg-card rounded-xl p-4 shadow-sm border text-left active:scale-[0.98] transition-transform duration-150 border-border ${
        post.isPending ? 'opacity-60' : ''
      } ${status === 'archived' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${dotClass} transition-colors duration-300`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm truncate text-foreground">
              {boldRoadName(post.road)}
            </h3>
            {post.isPending ? (
              <span className="text-[11px] text-muted-foreground flex-shrink-0 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> Uploading...
              </span>
            ) : (
              statusBadge
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${condition.bg} ${condition.text}`}>
              {condition.icon} {condition.label}
            </span>
            <span className={`text-[11px] font-medium ${severity.text}`}>{severity.label}</span>
            {dir.icon && <span className="text-[11px] text-muted-foreground">{dir.label} {dir.icon}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {post.isPending ? '⏳ Uploading...' : post.description}
          </p>

          {status === 'needs_confirmation' && (post.confirmations ?? 0) > 0 && (
            <p className="text-[11px] text-minor mt-2 font-medium">
              ✓ {post.confirmations} traveler{post.confirmations === 1 ? '' : 's'} confirmed this is still an issue
            </p>
          )}

          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle size={12} /> {post.replyCount}
            </span>
            <span className={`flex items-center gap-1 ${status === 'resolved' ? 'text-minor font-semibold' : ''}`}>
              <Clock size={12} /> {status === 'resolved' && post.resolvedDaysAgo != null
                ? `Resolved ${post.resolvedDaysAgo === 1 ? '1 day' : post.resolvedDaysAgo < 7 ? `${post.resolvedDaysAgo} days` : post.resolvedDaysAgo < 14 ? '1 week' : `${Math.floor(post.resolvedDaysAgo/7)} weeks`} ago`
                : post.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
