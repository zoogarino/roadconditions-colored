import { useState } from "react";
import { X, Share2, Flag, Trash2, Bookmark, Check, MapPin, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "@/data/mockData";
import { conditionConfig, severityConfig } from "@/data/mockData";
import { buildShareText, buildShareUrl, SHARE_BASE } from "@/lib/share";

const Backdrop = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <div className="absolute inset-0 z-50">
    <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
    {children}
  </div>
);

const severityEmoji: Record<string, string> = { severe: '🔴', moderate: '🟡', minor: '🟢' };

const LinkPreviewCard = ({ post, variant }: { post: Post; variant: 'whatsapp' | 'facebook' }) => {
  const cond = conditionConfig[post.conditionType];
  const sev = severityConfig[post.severity];
  const title = `${post.road} - ${sev.label} ${cond.label}`;
  const desc = post.description.length > 110 ? post.description.slice(0, 107) + '...' : post.description;

  if (variant === 'whatsapp') {
    return (
      <div className="rounded-lg overflow-hidden border border-border bg-white shadow-sm">
        <div className="h-20 bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
          <MapPin size={20} className="text-primary" />
        </div>
        <div className="p-2.5">
          <p className="text-[11px] font-semibold text-pgn-navy leading-tight line-clamp-2">{title}</p>
          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{desc}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-1.5">pocketguidenamibia.com</p>
        </div>
      </div>
    );
  }
  // Facebook
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-white">
      <div className="h-24 bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
        <MapPin size={24} className="text-primary" />
      </div>
      <div className="p-2.5 bg-secondary/50">
        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">pocketguidenamibia.com</p>
        <p className="text-[12px] font-semibold text-pgn-navy leading-tight mt-0.5">{title}</p>
        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{desc}</p>
      </div>
    </div>
  );
};

export const ShareSheet = ({ post, onClose }: { post?: Post; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<null | 'whatsapp' | 'facebook'>(null);

  const options = [
    { icon: '💬', label: 'WhatsApp', bg: '#25D366', source: 'whatsapp' },
    { icon: '✉️', label: 'Messages', bg: '#34C759', source: 'messages' },
    { icon: '🔗', label: 'Copy Link', bg: '#8B5E3C', source: 'copy' },
    { icon: '📸', label: 'Instagram', bg: '#E4405F', source: 'instagram' },
    { icon: '👤', label: 'Facebook', bg: '#1877F2', source: 'facebook' },
  ];

  const handleSelect = async (source: string) => {
    if (!post) { onClose(); return; }
    const url = buildShareUrl(post.id, source);
    const text = buildShareText(post, source);
    try {
      if (source === 'copy') {
        await navigator.clipboard.writeText(url);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose(); }, 1400);
    } catch {
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose(); }, 1400);
    }
  };

  return (
    <Backdrop onClose={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-5 z-50 max-h-[85%] overflow-y-auto scrollbar-hide"
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Share</h3>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>

        <div className="grid grid-cols-5 gap-3 text-center mb-4">
          {options.map(opt => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.source)}
              className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white shadow-sm"
                style={{ backgroundColor: opt.bg }}
              >
                {opt.icon}
              </div>
              <span className="text-[10px] text-muted-foreground">{opt.label}</span>
            </button>
          ))}
        </div>

        {post && (
          <>
            {/* Formatted share text preview */}
            <div className="bg-secondary/60 border border-border rounded-lg p-3 mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Message preview</p>
              <pre className="text-[11px] text-foreground/85 whitespace-pre-wrap font-sans leading-relaxed">
{`${post.road} - ${severityConfig[post.severity].label} ${conditionConfig[post.conditionType].label} ${severityEmoji[post.severity] ?? ''}
${post.description.length > 150 ? post.description.slice(0,147)+'...' : post.description}

Check latest reports:
${SHARE_BASE}/${post.id}`}
              </pre>
            </div>

            {/* Link preview tabs */}
            <div className="flex items-center gap-2 mb-2">
              <Eye size={12} className="text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Link preview</span>
              <div className="ml-auto flex gap-1">
                {(['whatsapp','facebook'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setPreviewMode(previewMode === v ? null : v)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      previewMode === v ? 'bg-primary text-pgn-navy' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {v === 'whatsapp' ? 'WhatsApp' : 'Facebook'}
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence initial={false}>
              {previewMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1 pb-1">
                    <LinkPreviewCard post={post} variant={previewMode} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>

      {/* Copied toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-12 left-4 right-4 z-[80]"
          >
            <div
              className="rounded-xl px-4 py-3 shadow-lg text-sm font-medium text-center text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: '#10B981' }}
            >
              <Check size={16} strokeWidth={3} />
              Link copied!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Backdrop>
  );
};

export const FilterModal = ({ onClose }: { onClose: () => void }) => {
  const sortOptions = [
    'Recent Activity',
    'Newest First',
    'Oldest First',
    'Most Replies',
    'Severity (High→Low)',
  ];

  const regionFilters = ['Northern', 'Central', 'Southern', 'Coastal'];
  const conditionFilters = ['Flooding', 'Construction', 'Closed', 'Potholes', 'Wildlife'];
  const severityFilters = [
    { label: '🔴 Severe', key: 'severe' },
    { label: '🟡 Moderate', key: 'moderate' },
    { label: '🟢 Minor', key: 'minor' },
  ];

  // Local selection state so we can show the navy-on-terracotta selected style
  const [regions, setRegions] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [severities, setSeverities] = useState<string[]>([]);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const chipClass = (selected: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
      selected
        ? 'bg-primary text-pgn-navy border border-pgn-navy/30'
        : 'bg-secondary text-secondary-foreground'
    }`;

  return (
    <Backdrop onClose={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-5 z-50 max-h-[80%] overflow-y-auto scrollbar-hide"
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Sort & Filter</h3>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sort by</p>
        <div className="space-y-1 mb-5">
          {sortOptions.map((opt, i) => (
            <button
              key={opt}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${
                i === 0 ? 'bg-primary text-pgn-navy font-medium' : 'text-foreground'
              }`}
            >
              {i === 0 ? '● ' : '○ '}{opt}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Region</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {regionFilters.map(r => (
            <button
              key={r}
              onClick={() => toggle(regions, r, setRegions)}
              className={chipClass(regions.includes(r))}
            >
              {r}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Condition</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {conditionFilters.map(c => (
            <button
              key={c}
              onClick={() => toggle(conditions, c, setConditions)}
              className={chipClass(conditions.includes(c))}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Severity</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {severityFilters.map(s => (
            <button
              key={s.key}
              onClick={() => toggle(severities, s.key, setSeverities)}
              className={chipClass(severities.includes(s.key))}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setRegions([]); setConditions([]); setSeverities([]); }}
            className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-foreground"
          >
            Clear All
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-primary text-pgn-navy rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform">
            Apply
          </button>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export const ContextMenu = ({
  isOwn,
  pinnedOnly = false,
  onClose,
  onShare,
  onReport,
  onDelete,
}: {
  isOwn: boolean;
  pinnedOnly?: boolean;
  onClose: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onDelete?: () => void;
}) => (
  <Backdrop onClose={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl py-2 z-50 border-t border-border"
    >
      <div className="w-10 h-1 bg-border rounded-full mx-auto mb-2" />
      {([
        { key: 'share', icon: <Share2 size={18} />, label: 'Share', show: true, danger: false, onClick: () => { onClose(); onShare?.(); } },
        { key: 'save', icon: <Bookmark size={18} />, label: 'Save for Later', show: !pinnedOnly, danger: false, onClick: onClose },
        { key: 'report', icon: <Flag size={18} />, label: 'Report', show: !pinnedOnly, danger: true, onClick: () => { onClose(); onReport?.(); } },
        { key: 'delete', icon: <Trash2 size={18} />, label: 'Delete', show: !pinnedOnly && isOwn, danger: true, onClick: () => { onClose(); onDelete?.(); } },
      ])
        .filter(item => item.show)
        .map(item => (
          <button
            key={item.key}
            onClick={item.onClick}
            className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm active:bg-secondary transition-colors ${
              item.danger ? 'text-severe' : 'text-foreground'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
    </motion.div>
  </Backdrop>
);

export const DeleteConfirmModal = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <Backdrop onClose={onCancel}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="absolute top-1/2 left-4 right-4 -translate-y-1/2 bg-card rounded-2xl p-5 z-50 shadow-xl"
    >
      <h3 className="font-semibold text-pgn-navy text-base mb-1">Delete this post?</h3>
      <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-medium bg-secondary text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white active:scale-[0.98] transition-transform"
          style={{ backgroundColor: '#EF4444' }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  </Backdrop>
);

const reportReasons = [
  'Spam or scam',
  'Harassment or bullying',
  'False information',
  'Off-topic or inappropriate',
  'Other',
];

export const ReportModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');

  const canSubmit = selected !== null && (selected !== 'Other' || otherText.trim().length > 0);

  return (
    <Backdrop onClose={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-5 z-50 max-h-[85%] overflow-y-auto scrollbar-hide"
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-pgn-navy text-base">Report Post</h3>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">Why are you reporting this post?</p>

        <div className="space-y-1.5 mb-4">
          {reportReasons.map(reason => {
            const isSelected = selected === reason;
            return (
              <button
                key={reason}
                onClick={() => setSelected(reason)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-sm text-foreground active:bg-secondary transition-colors"
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'border-severe' : 'border-border'
                  }`}
                >
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-severe" />}
                </span>
                <span className={isSelected ? 'font-medium' : ''}>{reason}</span>
              </button>
            );
          })}
        </div>

        {selected === 'Other' && (
          <textarea
            value={otherText}
            onChange={e => setOtherText(e.target.value.slice(0, 300))}
            placeholder="Please describe the issue..."
            rows={3}
            autoFocus
            className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-severe/30 placeholder:text-muted-foreground mb-4"
          />
        )}

        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-muted-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (canSubmit) { onSubmit(); onClose(); } }}
            disabled={!canSubmit}
            className="flex-1 py-3 bg-severe text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            Submit Report
          </button>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export const ReportSuccessToast = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-12 left-4 right-4 z-[70]"
      >
        <div
          className="rounded-xl px-4 py-3 shadow-lg text-sm font-medium text-center text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: '#10B981' }}
        >
          <Check size={16} strokeWidth={3} />
          Report submitted. Thank you.
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
