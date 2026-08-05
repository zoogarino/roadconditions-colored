import { useState } from "react";
import { X } from "lucide-react";

export type ReportTargetKind = "post" | "reply";

export interface ReportTarget {
  id: string;
  kind: ReportTargetKind;
}

const REASONS = [
  "Spam or scam",
  "Harassment or bullying",
  "False information",
  "Duplicate report",
  "Off-topic or inappropriate",
  "Other",
];

interface ReportModalProps {
  target: ReportTarget | null;
  onClose: () => void;
  onSubmit: (target: ReportTarget, reason: string) => void;
}

/** Reusable report modal — works for posts and replies via `target`. */
const ReportModal = ({ target, onClose, onSubmit }: ReportModalProps) => {
  const [reason, setReason] = useState<string | null>(null);
  if (!target) return null;

  const close = () => {
    setReason(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pgn-dark/40">
      <div
        className="w-full max-w-sm bg-card p-5 border"
        style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 8px 28px rgba(27, 63, 143, 0.16)" }}
      >
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-base font-bold text-pgn-navy">Report this post</h2>
          <button aria-label="Close" onClick={close} className="text-pgn-muted">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Why are you reporting this post?</p>

        <div className="space-y-1.5 mb-5">
          {REASONS.map(r => (
            <label
              key={r}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer border transition-colors"
              style={{
                borderColor: reason === r ? "#D4854A" : "#E8D9C8",
                backgroundColor: reason === r ? "#FFFBF5" : "transparent",
              }}
            >
              <input
                type="radio"
                name={`report-${target.id}`}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="accent-primary"
              />
              <span className="text-[13px] text-foreground">{r}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={close}
            className="flex-1 h-10 rounded-full border text-sm font-semibold text-pgn-navy"
            style={{ borderColor: "#E8D9C8", backgroundColor: "#F5ECD7" }}
          >
            Cancel
          </button>
          <button
            disabled={!reason}
            onClick={() => {
              onSubmit(target, reason!);
              close();
            }}
            className="flex-1 h-10 rounded-full bg-primary text-pgn-navy text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
