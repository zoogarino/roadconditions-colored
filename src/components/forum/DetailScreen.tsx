import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Share2, MoreVertical, Send, Check, MapPin, History } from "lucide-react";
import { mockPosts, conditionConfig, severityConfig, directionConfig } from "@/data/mockData";
import type { Reply } from "@/data/mockData";
import { ShareSheet, ContextMenu, ReportModal, ReportSuccessToast } from "./Overlays";
import { computeStatus, getRoadHistory, hasRelatedHistory } from "@/lib/lifecycle";
import type { ScreenState } from "@/pages/Index";

interface DetailScreenProps {
  postId: string;
  onNavigate: (s: ScreenState) => void;
  onBack: () => void;
  isOffline: boolean;
  showToast?: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

const ReplyCard = ({ reply, isThreaded, onLongPress, onReply }: {
  reply: Reply;
  isThreaded?: boolean;
  onLongPress?: () => void;
  onReply?: () => void;
}) => {
  let pressTimer: ReturnType<typeof setTimeout>;
  return (
    <div
      className={`${isThreaded ? 'ml-8 border-l-2 border-primary/20 pl-3' : ''}`}
      onTouchStart={() => { if (onLongPress) pressTimer = setTimeout(onLongPress, 500); }}
      onTouchEnd={() => clearTimeout(pressTimer)}
    >
      <div className="py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-card ${reply.author.color}`}>
            {reply.author.initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{reply.author.name}</p>
            <p className="text-[10px] text-muted-foreground">{reply.timeAgo}</p>
          </div>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">{reply.content}</p>
        <button onClick={onReply} className="mt-2 text-[11px] text-primary font-medium flex items-center gap-1 active:opacity-70">
          ↩ Reply
        </button>
      </div>
    </div>
  );
};

export const DetailScreen = ({ postId, onNavigate, onBack, isOffline, showToast }: DetailScreenProps) => {
  const post = mockPosts.find(p => p.id === postId);
  const [replyText, setReplyText] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ isOwn: boolean } | null>(null);
  const [confirmedNow, setConfirmedNow] = useState(false);
  const [resolvedNow, setResolvedNow] = useState(false);
  const [extraConfirms, setExtraConfirms] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!post) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-8 text-center">
        <p className="text-muted-foreground text-sm mb-4">This post is no longer available</p>
        <button onClick={onBack} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          ← Back to Feed
        </button>
      </div>
    );
  }

  const condition = conditionConfig[post.conditionType];
  const severity = severityConfig[post.severity];
  const direction = directionConfig[post.direction];
  const baseStatus = computeStatus(post);
  const status = resolvedNow ? 'resolved' : confirmedNow ? 'active' : baseStatus;
  const totalConfirms = (post.confirmations ?? 0) + extraConfirms;
  const showRelated = hasRelatedHistory(mockPosts, post);
  const lastRelated = getRoadHistory(mockPosts, post).find(p => p.status === 'resolved');

  return (
    <div className="h-full flex flex-col relative bg-background">
      {/* Header */}
      <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack}><ArrowLeft size={20} className="text-foreground" /></button>
          <h1 className="font-semibold text-[15px] text-foreground">Road Conditions</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowShare(true)} className="p-1.5"><Share2 size={18} className="text-foreground" /></button>
          <button onClick={() => setContextMenu({ isOwn: post.author.name === 'You' })} className="p-1.5"><MoreVertical size={18} className="text-foreground" /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Main post */}
        <div className="bg-card mx-4 mt-4 rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-card ${post.author.color}`}>
              {post.author.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
              <p className="text-[11px] text-muted-foreground">{post.timeAgo}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {(() => {
                const match = post.road.match(/^([A-Z]\d+\b)(.*)/);
                return match ? <><span className="font-bold">{match[1]}</span>{match[2]}</> : post.road;
              })()}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${condition.bg} ${condition.text}`}>
              {condition.icon} {condition.label}
            </span>
            <span className={`text-[11px] font-semibold ${severity.text}`}>{severity.label}</span>
            {direction.icon && <span className="text-[11px] text-muted-foreground">{direction.label} {direction.icon}</span>}
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{post.description}</p>

          {/* Map placeholder */}
          <div className="w-full h-36 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center mb-1">
            <div className="text-center">
              <MapPin size={24} className="text-primary mx-auto mb-1" />
              <span className="text-[11px] text-muted-foreground">{post.location}</span>
            </div>
          </div>
        </div>

        {/* Related history banner */}
        {showRelated && (
          <button
            onClick={() => onNavigate({ type: 'history', road: post.road })}
            className="mx-4 mt-3 w-[calc(100%-2rem)] bg-pgn-sand border border-pgn-warm-border rounded-xl p-3.5 text-left active:scale-[0.99] transition-transform"
          >
            <p className="text-xs font-semibold text-pgn-warm-brown">⚠️ This location has flooded before</p>
            {lastRelated && (
              <p className="text-[11px] text-pgn-warm-brown/80 mt-0.5">
                Last report: {lastRelated.daysOld - (lastRelated.resolvedDaysAgo ?? 0)} days ago (resolved)
              </p>
            )}
            <p className="text-[11px] font-semibold text-pgn-blue mt-1">View road history →</p>
          </button>
        )}

        {/* Needs-confirmation banner with slide-down animation */}
        <AnimatePresence>
          {status === 'needs_confirmation' && !confirmedNow && !resolvedNow && (
            <motion.div
              key="needs-confirm-banner"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mx-4 mt-3 overflow-hidden"
            >
              <div className="rounded-xl p-3.5" style={{ backgroundColor: '#FFF4E6' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#8B5E3C' }}>
                  ⚠️ No recent updates ({post.daysOld} days old)
                </p>
                <p className="text-[11px] mb-3" style={{ color: '#8B5E3C' }}>Is this condition still active?</p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.2 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={() => {
                      setConfirmedNow(true);
                      setExtraConfirms(c => c + 1);
                      showToast?.('Thanks for confirming! Post updated.', 'success');
                    }}
                    className="flex-1 py-2 bg-pgn-sand text-pgn-navy rounded-lg text-xs font-semibold active:scale-95 transition-transform"
                  >
                    <Check size={14} className="inline mr-1" /> Yes, still active
                  </button>
                  <button
                    onClick={() => {
                      setResolvedNow(true);
                      showToast?.('Marked as resolved. Thanks for the update!', 'success');
                    }}
                    className="flex-1 py-2 text-white rounded-lg text-xs font-semibold active:scale-95 transition-transform"
                    style={{ backgroundColor: '#10B981' }}
                  >
                    <Check size={14} className="inline mr-1" /> Resolved
                  </button>
                </motion.div>
                {totalConfirms > 0 && (
                  <p className="text-[11px] mt-3 font-medium text-minor">
                    ✓ {totalConfirms} traveler{totalConfirms === 1 ? '' : 's'} confirmed this is still an issue
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirmedNow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-4 mt-3 bg-minor/10 border border-minor/30 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-foreground">✓ Confirmed still active – thanks!</p>
            </motion.div>
          )}
          {resolvedNow && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-4 mt-3 bg-minor/10 border border-minor/30 rounded-xl p-3 text-center"
            >
              <p className="text-xs text-foreground">✓ Marked as resolved – thanks!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History link (always available when there is history) */}
        {getRoadHistory(mockPosts, post).length > 0 && !showRelated && (
          <button
            onClick={() => onNavigate({ type: 'history', road: post.road })}
            className="mx-4 mt-3 w-[calc(100%-2rem)] flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-pgn-blue active:opacity-70"
          >
            <History size={14} /> View road history
          </button>
        )}

        {/* Replies */}
        <div className="px-4 mt-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">{post.replies.length} Replies</h3>
          <div className="border-t border-border">
            {post.replies.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No replies yet. Be the first to respond!</p>
            ) : (
              post.replies.map(reply => (
                <div key={reply.id}>
                  <ReplyCard
                    reply={reply}
                    onLongPress={() => setContextMenu({ isOwn: false })}
                    onReply={() => { setReplyText(`@${reply.author.name} `); setIsKeyboardOpen(true); }}
                  />
                  {reply.replies?.map(threadedReply => (
                    <ReplyCard
                      key={threadedReply.id}
                      reply={threadedReply}
                      isThreaded
                      onLongPress={() => setContextMenu({ isOwn: false })}
                      onReply={() => { setReplyText(`@${threadedReply.author.name} `); setIsKeyboardOpen(true); }}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Reply input */}
      <div className="bg-card border-t border-border px-4 py-3 flex-shrink-0">
        {isOffline && (
          <div className="mb-2 text-[11px] text-muted-foreground text-center bg-muted rounded-lg py-1.5">
            📡 Replies unavailable offline
          </div>
        )}
        <div className="flex items-end gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground flex-shrink-0">
            ME
          </div>
          <div className="flex-1 relative">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value.slice(0, 1000))}
              onFocus={() => setIsKeyboardOpen(true)}
              onBlur={() => setIsKeyboardOpen(false)}
              placeholder={isOffline ? "You're offline..." : "Add a reply..."}
              disabled={isOffline}
              rows={isKeyboardOpen ? 3 : 1}
              className="w-full bg-secondary rounded-xl px-3.5 py-2.5 text-sm outline-none resize-none placeholder:text-muted-foreground transition-all disabled:opacity-50"
            />
            {replyText.length > 0 && (
              <span className="absolute bottom-1.5 right-3 text-[10px] text-muted-foreground">{replyText.length}/1000</span>
            )}
          </div>
          <button
            disabled={!replyText.trim() || isOffline}
            className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-30 active:scale-90 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Overlays */}
      {showShare && <ShareSheet post={post} onClose={() => setShowShare(false)} />}
      {contextMenu && (
        <ContextMenu
          isOwn={contextMenu.isOwn}
          onClose={() => setContextMenu(null)}
          onReport={() => setShowReport(true)}
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
