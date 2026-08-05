import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapPin,
  MessageCircle,
  MoreHorizontal,
  CheckCircle2,
  Link2,
  Flag,
  Share2,
  Trash2,
  History,
  Send,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/web/SiteHeader";
import Breadcrumb from "@/components/web/Breadcrumb";
import ReportModal, { type ReportTarget } from "@/components/web/ReportModal";

import SignInPromptModal, { type GuestAction } from "@/components/web/SignInPromptModal";
import { useWebAuthDemo } from "@/hooks/useWebAuthDemo";
import {
  mockPosts,
  CURRENT_USER_NAME,
  conditionConfig,
  severityConfig,
  directionConfig,
  type Reply,
} from "@/data/mockData";
import { computeStatus, hasRelatedHistory, getRoadHistory } from "@/lib/lifecycle";

const statusBadge: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "#E6F7EE", text: "#0E7A4F" },
  needs_confirmation: { label: "Needs Confirmation", bg: "#F5ECD7", text: "#8B5E3C" },
  resolved: { label: "Resolved", bg: "#E8EEF9", text: "#1B3F8F" },
  archived: { label: "Archived", bg: "#EFEDEA", text: "#3D3530" },
};

/** Flatten nested mock replies into a chronological, tag-based flat list. */
const flatten = (replies: Reply[]): Reply[] =>
  replies.flatMap(r => [r, ...(r.replies ? flatten(r.replies) : [])]);

const WebPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = mockPosts.find(p => p.id === slug) ?? mockPosts[1] ?? mockPosts[0];

  const { isLoggedIn, isGuest, toggle, setIsLoggedIn } = useWebAuthDemo();
  const [guestAction, setGuestAction] = useState<GuestAction | null>(null);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [resolvedNow, setResolvedNow] = useState(false);
  const [confirmedBanner, setConfirmedBanner] = useState(false);
  const [draft, setDraft] = useState("");
  const [extraReplies, setExtraReplies] = useState<Reply[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${post.road} | Road Conditions | Pocket Guide Namibia`;
  }, [post]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
  const computed = computeStatus(post);
  const status = resolvedNow ? "resolved" : confirmedBanner && computed === "needs_confirmation" ? "active" : computed;
  const badge = statusBadge[status] ?? statusBadge.active;

  const replies = useMemo(
    () => [...flatten(post.replies ?? []), ...extraReplies],
    [post, extraReplies],
  );
  const showBanner = computed === "needs_confirmation" && !confirmedBanner && !resolvedNow;
  const isAuthor = isLoggedIn && post.author.name === CURRENT_USER_NAME;
  const history = getRoadHistory(mockPosts, post);
  const showHistory = hasRelatedHistory(mockPosts, post);

  const shareUrl = `${window.location.origin}/road-conditions/post/${post.id}`;

  const handleDelete = () => {
    if (replies.length > 0) {
      toast.error("Posts with replies can't be deleted.");
      return;
    }
    if (status === "resolved" || status === "archived") {
      toast.error("Resolved or archived posts can't be deleted.");
      return;
    }
    setConfirmDelete(true);
  };

  const submitReply = () => {
    if (isGuest) {
      setGuestAction("reply");
      return;
    }
    const content = draft.trim();
    if (!content) return;
    setExtraReplies(prev => [
      ...prev,
      {
        id: `new-${prev.length + 1}`,
        author: { name: "You", initials: "YO", color: "bg-pgn-navy" },
        content: content.slice(0, 280),
        timeAgo: "Just now",
      },
    ]);
    setDraft("");
    toast.success("Reply posted");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF6EE" }}>
      <SiteHeader isLoggedIn={isLoggedIn} onToggleAccount={toggle} />

      <main className="mx-auto w-full max-w-[640px] px-4 py-8 space-y-4">
        <Breadcrumb current={post.road} />


        {/* Post card */}

        <article
          className="bg-card p-5 border relative"
          style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 4px 16px rgba(27, 63, 143, 0.10)" }}
        >
          <div ref={menuRef} className="absolute top-4 right-4 flex items-center gap-1">
            {isAuthor && (
              <button
                aria-label="Delete post"
                onClick={handleDelete}
                className="w-8 h-8 rounded-full flex items-center justify-center text-destructive hover:bg-pgn-parchment"
              >
                <Trash2 size={16} />
              </button>
            )}
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
                className="absolute right-0 top-9 w-44 bg-card border py-1 z-20"
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
                    if (isGuest) {
                      setGuestAction("report");
                      return;
                    }
                    setReportTarget({ id: post.id, kind: "post" });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-destructive hover:bg-pgn-parchment"
                >
                  <Flag size={14} /> Report
                </button>
              </div>
            )}

            {shareOpen && (
              <div
                className="absolute right-0 top-9 w-44 bg-card border py-1 z-20"
                style={{ borderRadius: 12, borderColor: "#E8D9C8", boxShadow: "0 6px 20px rgba(27, 63, 143, 0.14)" }}
              >
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(shareUrl);
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

          {/* Road + status */}
          <div className="flex items-center gap-2 mb-2 pr-20 flex-wrap">
            <MapPin size={15} className="text-primary" />
            <h1 className="text-base font-semibold text-foreground">
              {(() => {
                const m = post.road.match(/^([A-Z]\d+\b)(.*)/);
                return m ? (
                  <>
                    <span className="font-bold">{m[1]}</span>
                    {m[2]}
                  </>
                ) : (
                  post.road
                );
              })()}
            </h1>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
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

          <p className="text-sm leading-relaxed mb-4" style={{ color: "#3D3530" }}>
            {post.description}
          </p>

          {/* Location card */}
          <div
            className="w-full h-36 rounded-lg flex items-center justify-center mb-4"
            style={{
              backgroundColor: "#FDF6EE",
              border: "1px solid #E8D9C8",
              boxShadow: "inset 0 1px 3px rgba(139, 94, 60, 0.05)",
            }}
          >
            <div className="text-center">
              <div
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: "#FCE8E3" }}
              >
                <MapPin size={20} style={{ color: "#D4854A" }} />
              </div>
              <span className="text-[11px] text-muted-foreground">{post.location}</span>
            </div>
          </div>

          {/* Author + meta */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-card ${post.author.color}`}>
              {post.author.initials}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Posted by {post.author.name}</p>
              <p className="text-[11px] text-muted-foreground">{post.timeAgo}</p>
            </div>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <CheckCircle2 size={13} /> {post.confirmations ?? 0} confirmations
            </span>
          </div>

          {/* Persistent Mark Resolved */}
          <button
            onClick={() => {
              if (isGuest) {
                setGuestAction("resolve");
                return;
              }
              setResolvedNow(true);
              toast.success("Marked as resolved. Thanks for the update!");
            }}
            disabled={status === "resolved"}
            className="w-full h-10 rounded-full border text-sm font-semibold text-pgn-navy bg-card disabled:opacity-50"
            style={{ borderColor: "#D4854A" }}
          >
            {status === "resolved" ? "Resolved" : "Mark Resolved"}
          </button>

          {/* Needs Confirmation banner */}
          {showBanner && (
            <div
              className="p-3 mt-4"
              style={{ backgroundColor: "#F5ECD7", borderRadius: 12, border: "1px solid #E8D9C8" }}
            >
              <p className="text-xs font-semibold text-pgn-warm-brown mb-2.5">
                No recent updates ({post.daysOld} days old) — Is this still active?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isGuest) {
                      setGuestAction("confirm");
                      return;
                    }
                    setConfirmedBanner(true);
                    toast.success("Thanks — marked still active.");
                  }}
                  className="h-8 px-3 rounded-full bg-primary text-pgn-navy text-[11px] font-semibold"
                >
                  Yes, still active
                </button>
                <button
                  onClick={() => {
                    if (isGuest) {
                      setGuestAction("resolve");
                      return;
                    }
                    setResolvedNow(true);
                    toast.success("Marked as resolved. Thanks for the update!");
                  }}
                  className="h-8 px-3 rounded-full border text-[11px] font-semibold text-pgn-navy bg-card"
                  style={{ borderColor: "#E8D9C8" }}
                >
                  Resolved
                </button>
              </div>
            </div>
          )}

          {/* Road history note */}
          {showHistory && (
            <div
              className="mt-4 p-3 flex items-start gap-2"
              style={{ backgroundColor: "#FDF6EE", borderRadius: 12, border: "1px solid #E8D9C8" }}
            >
              <History size={14} className="text-pgn-blue mt-0.5 shrink-0" />
              <p className="text-[11px] text-foreground/80 leading-relaxed">
                This location has {history.length} previous report{history.length === 1 ? "" : "s"} on{" "}
                <span className="font-bold">{post.roadKey ?? post.road}</span> — a recurring issue.
              </p>
            </div>
          )}
        </article>

        {/* Reply thread */}
        <section
          className="bg-card p-5 border"
          style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 4px 16px rgba(27, 63, 143, 0.10)" }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">{replies.length} Replies</h2>

          <div className="space-y-3">
            {replies.map(r => (
              <div key={r.id} className="flex gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-card shrink-0 ${r.author.color}`}>
                  {r.author.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{r.author.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.timeAgo}</p>
                    <button
                      aria-label="Report reply"
                      onClick={() => {
                        if (isGuest) {
                          setGuestAction("report");
                          return;
                        }
                        setReportTarget({ id: r.id, kind: "reply" });
                      }}
                      className="ml-auto text-pgn-muted hover:text-destructive"
                    >
                      <Flag size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-foreground/85 leading-relaxed mt-0.5">
                    {r.content.slice(0, 280)}
                  </p>
                  <button
                    onClick={() => {
                      if (isGuest) {
                        setGuestAction("reply");
                        return;
                      }
                      setDraft(d => (d.startsWith(`@${r.author.name}`) ? d : `@${r.author.name} ${d}`.trim()));
                      inputRef.current?.focus();
                    }}
                    className="text-[11px] font-semibold text-pgn-blue mt-1"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reply input — always visible */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid #E8D9C8" }}>
            <div
              className="flex items-end gap-2 p-2 border rounded-xl"
              style={{ borderColor: "#E8D9C8", backgroundColor: "#FDF6EE" }}
            >
              <textarea
                ref={inputRef}
                value={draft}
                maxLength={280}
                onChange={e => setDraft(e.target.value)}
                rows={2}
                placeholder="Add a reply…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-pgn-muted outline-none resize-none"
              />
              <button
                aria-label="Post reply"
                onClick={submitReply}
                disabled={!draft.trim()}
                className="w-9 h-9 rounded-full bg-primary text-pgn-navy flex items-center justify-center disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-right mt-1">{draft.length}/280</p>
          </div>
        </section>
      </main>

      <SignInPromptModal
        action={guestAction}
        onClose={() => setGuestAction(null)}
        onSignIn={() => {
          setIsLoggedIn(true);
          setGuestAction(null);
          toast.success("Signed in — you're all set.");
        }}
      />

      <ReportModal
        target={reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={() => toast.success("Thanks for reporting. We'll review this.")}
      />

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pgn-dark/40">
          <div
            className="w-full max-w-sm bg-card p-5 border"
            style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 8px 28px rgba(27, 63, 143, 0.16)" }}
          >
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-base font-bold text-pgn-navy">Delete this post?</h2>
              <button aria-label="Close" onClick={() => setConfirmDelete(false)} className="text-pgn-muted">
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-5">This can't be undone.</p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 h-10 rounded-full border text-sm font-semibold text-pgn-navy"
                style={{ borderColor: "#E8D9C8", backgroundColor: "#F5ECD7" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  toast.success("Post deleted");
                  navigate("/road-conditions");
                }}
                className="flex-1 h-10 rounded-full bg-destructive text-white text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebPostDetail;
