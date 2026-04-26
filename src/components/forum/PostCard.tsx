import { MessageCircle, Clock, Loader2 } from "lucide-react";
import { Post, conditionConfig, severityConfig, directionConfig } from "@/data/mockData";

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

  let pressTimer: ReturnType<typeof setTimeout>;

  const handleTouchStart = () => {
    if (onLongPress) {
      pressTimer = setTimeout(() => onLongPress(), 500);
    }
  };
  const handleTouchEnd = () => clearTimeout(pressTimer);

  return (
    <button
      onClick={onTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`w-full bg-card rounded-xl p-4 shadow-sm border border-border text-left active:scale-[0.98] transition-transform duration-150 ${post.isPending ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${severity.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm truncate text-foreground">{boldRoadName(post.road)}</h3>
            {post.isPending && (
              <span className="text-[11px] text-muted-foreground flex-shrink-0 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" /> Uploading...
              </span>
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
