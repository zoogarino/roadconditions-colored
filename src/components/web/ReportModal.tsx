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
          <h2 className="text-base font-bold text-pgn-navy">
            Report this {target.kind === "reply" ? "reply" : "post"}
          </h2>
          <button
            aria-label="Close"
            onClick={close}
            className="w-9 h-9 -mt-1 -mr-1 rounded-full flex items-center justify-center text-pgn-muted hover:bg-pgn-sand hover:text-pgn-navy transition-colors"
          >
            <X size={16} />
          </button>

        </div>
        <p className="text-xs text-muted-foreground mb-4">Why are you reporting this {target.kind === "reply" ? "reply" : "post"}?</p>

        <div className="space-y-1.5 mb-5">
          {REASONS.map(r => (
            <label
              key={r}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer border transition-colors"
              style={{
                borderColor: reason === r ? "#EF4444" : "#E8D9C8",
                backgroundColor: reason === r ? "#FEF2F2" : "transparent",
              }}
            >
              <input
                type="radio"
                name={`report-${target.id}`}
                checked={reason === r}
                onChange={() => setReason(r)}
                style={{ accentColor: "#EF4444" }}
              />
              <span className="text-[13px]" style={{ color: "#3D3530" }}>{r}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={close}
            className="flex-1 h-10 rounded-full border text-sm font-semibold text-pgn-navy hover:brightness-95 hover:shadow-sm transition-all"
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
            className="flex-1 h-10 rounded-full bg-primary text-pgn-navy text-sm font-semibold hover:brightness-95 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportModal;
