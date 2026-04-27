import { useState } from "react";
import { X, Share2, Flag, Trash2, Bookmark, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Backdrop = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <div className="absolute inset-0 z-50">
    <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
    {children}
  </div>
);

export const ShareSheet = ({ onClose }: { onClose: () => void }) => {
  // Brand colors per spec
  const options = [
    { icon: '💬', label: 'WhatsApp', bg: '#25D366' },
    { icon: '✉️', label: 'Messages', bg: '#29ABE2' },
    { icon: '🔗', label: 'Copy Link', bg: '#8B5E3C' },
    { icon: '📸', label: 'Instagram', bg: '#E4405F' },
    { icon: '👤', label: 'Facebook', bg: '#1877F2' },
  ];

  return (
    <Backdrop onClose={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-5 z-50"
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-foreground">Share</h3>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>
        <div className="grid grid-cols-5 gap-3 text-center">
          {options.map(opt => (
            <button key={opt.label} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
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
      </motion.div>
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
  onClose,
  onReport,
}: {
  isOwn: boolean;
  onClose: () => void;
  onReport?: () => void;
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
        { key: 'share', icon: <Share2 size={18} />, label: 'Share', show: true, danger: false, onClick: onClose },
        { key: 'save', icon: <Bookmark size={18} />, label: 'Save for Later', show: true, danger: false, onClick: onClose },
        { key: 'report', icon: <Flag size={18} />, label: 'Report', show: true, danger: true, onClick: () => { onClose(); onReport?.(); } },
        { key: 'delete', icon: <Trash2 size={18} />, label: 'Delete', show: isOwn, danger: true, onClick: onClose },
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
