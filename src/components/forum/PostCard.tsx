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

  // Status-driven left indicator
  const dotClass =
    status === 'resolved'
      ? 'bg-minor'
      : status === 'archived'
      ? 'bg-pgn-muted'
      : status === 'needs_confirmation'
      ? 'bg-moderate'
      : severity.dot;

  // Status badge in top-right
  let statusBadge: React.ReactNode = null;
  if (post.isPinned) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pgn-blue bg-pgn-blue/10 px-2 py-0.5 rounded-full">
        <Pin size={10} /> Pinned
      </span>
    );
  } else if (status === 'resolved') {
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
      className={`w-full bg-card rounded-xl p-4 shadow-sm border text-left active:scale-[0.98] transition-transform duration-150 ${
        post.isPinned ? 'border-pgn-blue/40' : 'border-border'
      } ${post.isPending ? 'opacity-60' : ''} ${status === 'archived' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${dotClass}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm truncate text-foreground">
              {post.isPinned && <Pin size={12} className="inline mr-1 text-pgn-blue" />}
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
          {post.isPinned && post.pinnedBy && (
            <p className="text-[10px] text-muted-foreground mt-0.5">Created by {post.pinnedBy}</p>
          )}
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

          {/* Needs-confirmation inline confirmation count */}
          {status === 'needs_confirmation' && (post.confirmations ?? 0) > 0 && (
            <p className="text-[11px] text-minor mt-2 font-medium">
              ✓ {post.confirmations} traveler{post.confirmations === 1 ? '' : 's'} confirmed this is still an issue
            </p>
          )}

          {post.isPinned && post.pinnedSeasonalUpdates ? (
            <p className="text-[11px] text-pgn-blue mt-2 font-medium">
              💬 {post.pinnedSeasonalUpdates} updates this season
            </p>
          ) : null}

          <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle size={12} /> {post.replyCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.timeAgo}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
