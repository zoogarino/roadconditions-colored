import { Shield, X } from "lucide-react";

const GUIDELINES = [
  "Report what you saw yourself — first-hand, recent observations only.",
  "Be specific: road number, nearest landmark, and how passable it is.",
  "Keep it factual and respectful — no rumours, blame, or personal attacks.",
  "Update or mark your report resolved once conditions change.",
];

interface GuidelinesGateProps {
  onAgree: () => void;
  onDecline: () => void;
}

/** First-time posting gate — community guidelines modal shown before the form. */
const GuidelinesGate = ({ onAgree, onDecline }: GuidelinesGateProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pgn-dark/40">
    <div
      className="w-full max-w-md bg-card p-6 border"
      style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 8px 28px rgba(27, 63, 143, 0.16)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#F5ECD7" }}
          >
            <Shield size={18} style={{ color: "#8B5E3C" }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-pgn-navy leading-tight">Community guidelines</h2>
            <p className="text-[11px] text-muted-foreground">Before your first report</p>
          </div>
        </div>
        <button aria-label="Close" onClick={onDecline} className="text-pgn-muted">
          <X size={16} />
        </button>
      </div>

      <p className="text-[13px] text-foreground mb-4">
        Thousands of travellers rely on these reports to plan their routes safely. Please keep them
        accurate and useful.
      </p>

      <ul className="space-y-2.5 mb-6">
        {GUIDELINES.map(g => (
          <li key={g} className="flex gap-2.5 text-[13px] text-foreground">
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "#D4854A" }}
            />
            <span>{g}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col-reverse sm:flex-row gap-2.5">
        <button
          onClick={onDecline}
          className="flex-1 h-11 rounded-full border text-sm font-semibold text-pgn-navy"
          style={{ borderColor: "#E8D9C8", backgroundColor: "#F5ECD7" }}
        >
          Not Now
        </button>
        <button
          onClick={onAgree}
          className="flex-1 h-11 rounded-full bg-primary text-pgn-navy text-sm font-semibold hover:shadow-md transition-shadow"
        >
          I Agree — Post a Condition
        </button>
      </div>
    </div>
  </div>
);

export default GuidelinesGate;
