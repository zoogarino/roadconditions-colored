import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, MessageCircle, MoreHorizontal, CheckCircle2, Link2, Flag, Share2 } from "lucide-react";
import { toast } from "sonner";
import { conditionConfig, severityConfig, directionConfig, type Post } from "@/data/mockData";
import { computeStatus } from "@/lib/lifecycle";

interface WebPostCardProps {
  post: Post;
  onReport: (postId: string) => void;
}

const BoldRoad = ({ road }: { road: string }) => {
  const m = road.match(/^([A-Z]\d+\b)(.*)/);
  return m ? (
    <>
      <span className="font-bold">{m[1]}</span>
      {m[2]}
    </>
  ) : (
    <>{road}</>
  );
};

const WebPostCard = ({ post, onReport }: WebPostCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<null | "active" | "resolved">(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const cond = conditionConfig[post.conditionType];
  const sev = severityConfig[post.severity];
  const dir = directionConfig[post.direction];
  const status = computeStatus(post);
  const needsConfirmation = status === "needs_confirmation" && !confirmed;

  return (
    <article
      className="bg-card p-4 border relative"
      style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 4px 16px rgba(27, 63, 143, 0.10)" }}
    >
      {/* menu */}
      <div ref={wrapRef} className="absolute top-3 right-3">
        <button
          aria-label="Post options"
          onClick={() => {
            setMenuOpen(v => !v);
            setShareOpen(false);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-pgn-muted hover:bg-pgn-parchment"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuOpen && !shareOpen && (
          <div
            className="absolute right-0 mt-1 w-44 bg-card border py-1 z-20"
            style={{ borderRadius: 12, borderColor: "#E8D9C8", boxShadow: "0 6px 20px rgba(27, 63, 143, 0.14)" }}
          >
            <button
              onClick={() => setShareOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-pgn-parchment"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                onReport(post.id);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-destructive hover:bg-pgn-parchment"
            >
              <Flag size={14} /> Report
            </button>
          </div>
        )}

        {shareOpen && (
          <div
            className="absolute right-0 mt-1 w-44 bg-card border py-1 z-20"
            style={{ borderRadius: 12, borderColor: "#E8D9C8", boxShadow: "0 6px 20px rgba(27, 63, 143, 0.14)" }}
          >
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `${window.location.origin}/road-conditions/post/${post.id}`,
                );
                setShareOpen(false);
                setMenuOpen(false);
                toast.success("Link copied!");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-pgn-parchment"
            >
              <Link2 size={14} /> Copy Link
            </button>
            <button
              onClick={() => {
                setShareOpen(false);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-pgn-parchment"
            >
              <MessageCircle size={14} style={{ color: "#25D366" }} /> WhatsApp
            </button>
            <button
              onClick={() => {
                setShareOpen(false);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-foreground hover:bg-pgn-parchment"
            >
              <span
                className="w-3.5 h-3.5 rounded-[3px] flex items-center justify-center text-[9px] font-bold text-white"
                style={{ backgroundColor: "#1877F2" }}
              >
                f
              </span>
              Facebook
            </button>
          </div>
        )}
      </div>

      {/* author */}
      <div className="flex items-center gap-2.5 mb-3 pr-10">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-card ${post.author.color}`}>
          {post.author.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
          <p className="text-[11px] text-muted-foreground">{post.timeAgo}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <MapPin size={14} className="text-primary" />
        <h2 className="text-sm font-medium text-foreground">
          <Link to={`/road-conditions/post/${post.id}`} className="hover:text-primary">
            <BoldRoad road={post.road} />
          </Link>
        </h2>
      </div>


      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${cond.bg} ${cond.text}`}>
          {cond.icon} {cond.label}
        </span>
        <span className={`text-[11px] font-semibold ${sev.text}`}>{sev.label}</span>
        {post.direction !== "na" && dir.icon && (
          <span className="text-[11px] text-muted-foreground">
            {dir.label} {dir.icon}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed mb-3 line-clamp-3" style={{ color: "#3D3530" }}>
        {post.description}
      </p>

      {needsConfirmation && (
        <div
          className="p-3 mb-3"
          style={{ backgroundColor: "#F5ECD7", borderRadius: 12, border: "1px solid #E8D9C8" }}
        >
          <p className="text-xs font-semibold text-pgn-warm-brown mb-2.5">
            No recent updates ({post.daysOld} days old) — Is this still active?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setConfirmed("active");
                toast.success("Thanks — marked still active.");
              }}
              className="h-8 px-3 rounded-full bg-primary text-pgn-navy text-[11px] font-semibold"
            >
              Yes, still active
            </button>
            <button
              onClick={() => {
                setConfirmed("resolved");
                toast.success("Thanks — marked resolved.");
              }}
              className="h-8 px-3 rounded-full border text-[11px] font-semibold text-pgn-navy bg-card"
              style={{ borderColor: "#E8D9C8" }}
            >
              Resolved
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageCircle size={13} /> {post.replyCount} replies
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 size={13} /> {post.confirmations ?? 0} confirmations
        </span>
        <span className="ml-auto">{post.timeAgo}</span>
      </div>
    </article>
  );
};

export default WebPostCard;
