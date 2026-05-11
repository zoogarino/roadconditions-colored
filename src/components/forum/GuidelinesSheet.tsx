import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface GuidelinesSheetProps {
  onAgree: () => void;
  onDismiss: () => void;
}

const items: Array<{ ok: boolean; text: string }> = [
  { ok: true, text: "Only post real, firsthand road conditions" },
  { ok: true, text: "Be specific — road name, location, direction" },
  { ok: true, text: "Confirm or resolve posts you have information about" },
  { ok: true, text: "Be respectful to other community members" },
  { ok: false, text: "No spam, false reports, or duplicate posts" },
  { ok: false, text: "No personal attacks or inappropriate content" },
];

export const GuidelinesSheet = ({ onAgree, onDismiss }: GuidelinesSheetProps) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="absolute inset-0 z-50">
      {/* Dimmed backdrop — NOT dismissible on tap */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl shadow-2xl flex flex-col"
        style={{ height: "68%", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        {/* Drag handle */}
        <div className="pt-2.5 pb-1 flex justify-center flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-foreground/20" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-3 flex-shrink-0">
          <h2 className="text-[18px] font-medium text-pgn-navy">Community Guidelines</h2>
          <p className="text-[13px] text-muted-foreground mt-1">
            Before you post, please read our community standards.
          </p>
        </div>

        <div className="border-t border-border" />

        {/* Guidelines list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                }`}
              >
                {item.ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
              </div>
              <p className="text-[14px] text-foreground leading-snug">{item.text}</p>
            </div>
          ))}

          <button
            onClick={() => setShowFull(true)}
            className="text-[13px] text-pgn-blue underline-offset-2 hover:underline mt-2 block"
          >
            View full Community Guidelines →
          </button>
        </div>

        <div className="border-t border-border" />

        {/* Buttons */}
        <div className="px-5 pt-4 pb-6 space-y-2 flex-shrink-0">
          <button
            onClick={onAgree}
            className="w-full py-3.5 rounded-xl bg-pgn-dark text-white text-[15px] font-semibold active:opacity-90 transition"
          >
            I Agree — Post a Condition
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-3 text-[14px] text-muted-foreground font-medium active:opacity-70"
          >
            Not Now
          </button>
        </div>
      </motion.div>

      {/* Full guidelines placeholder modal */}
      <AnimatePresence>
        {showFull && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center p-6"
            onClick={() => setShowFull(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-5 max-w-sm w-full max-h-[80%] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-semibold text-pgn-navy">Full Community Guidelines</h3>
                <button onClick={() => setShowFull(false)}>
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed">
                Placeholder — full community guidelines content would appear here in the production
                app, including detailed posting rules, content moderation policies, and links to
                terms of service.
              </p>
              <button
                onClick={() => setShowFull(false)}
                className="mt-4 w-full py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
