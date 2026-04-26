import { X, Share2, Flag, Trash2, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Backdrop = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => (
  <div className="absolute inset-0 z-50">
    <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
    {children}
  </div>
);

export const ShareSheet = ({ onClose }: { onClose: () => void }) => {
  const options = [
    { icon: '💬', label: 'WhatsApp' },
    { icon: '✉️', label: 'Messages' },
    { icon: '🔗', label: 'Copy Link' },
    { icon: '📸', label: 'Instagram' },
    { icon: '👤', label: 'Facebook' },
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
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
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
            <button key={opt} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${i === 0 ? 'bg-accent text-accent-foreground font-medium' : 'text-foreground'}`}>
              {i === 0 ? '● ' : '○ '}{opt}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Region</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {regionFilters.map(r => (
            <button key={r} className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground active:bg-primary active:text-primary-foreground transition-colors">
              {r}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Condition</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {conditionFilters.map(c => (
            <button key={c} className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground active:bg-primary active:text-primary-foreground transition-colors">
              {c}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Severity</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {severityFilters.map(s => (
            <button key={s.key} className="px-3 py-1.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground active:bg-primary active:text-primary-foreground transition-colors">
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-border rounded-xl text-sm font-medium text-foreground">
            Clear All
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform">
            Apply
          </button>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export const ContextMenu = ({ isOwn, onClose }: { isOwn: boolean; onClose: () => void }) => (
  <Backdrop onClose={onClose}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl py-2 z-50 border-t border-border"
    >
      <div className="w-10 h-1 bg-border rounded-full mx-auto mb-2" />
      {[
        { icon: <Share2 size={18} />, label: 'Share', show: true },
        { icon: <Bookmark size={18} />, label: 'Save for Later', show: true },
        { icon: <Flag size={18} />, label: 'Report', show: true },
        { icon: <Trash2 size={18} />, label: 'Delete', show: isOwn },
      ]
        .filter(item => item.show)
        .map(item => (
          <button
            key={item.label}
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm active:bg-secondary transition-colors ${
              item.label === 'Delete' ? 'text-destructive' : 'text-foreground'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
    </motion.div>
  </Backdrop>
);
