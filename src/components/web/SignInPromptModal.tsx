import { LogIn, X } from "lucide-react";

export type GuestAction = "post" | "reply" | "confirm" | "resolve" | "report";

const COPY: Record<GuestAction, { verb: string; body: string }> = {
  post: {
    verb: "post",
    body: "Create a free account to report road conditions for other travellers.",
  },
  reply: {
    verb: "reply",
    body: "Sign in to join the discussion and reply to this report.",
  },
  confirm: {
    verb: "confirm",
    body: "Sign in to confirm whether this condition is still active.",
  },
  resolve: {
    verb: "resolve",
    body: "Sign in to mark this condition as resolved.",
  },
  report: {
    verb: "report",
    body: "Sign in so we can follow up on your report.",
  },
};

interface SignInPromptModalProps {
  action: GuestAction | null;
  onClose: () => void;
  /** Prototype: signs the guest in so the flow can continue. */
  onSignIn: () => void;
}

/** Guest gate — shown when a signed-out visitor tries to take an action. */
const SignInPromptModal = ({ action, onClose, onSignIn }: SignInPromptModalProps) => {
  if (!action) return null;
  const copy = COPY[action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pgn-dark/40">
      <div
        className="w-full max-w-sm bg-card p-5 border"
        style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 8px 28px rgba(27, 63, 143, 0.16)" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5ECD7" }}
            >
              <LogIn size={17} style={{ color: "#8B5E3C" }} />
            </div>
            <h2 className="text-base font-bold text-pgn-navy leading-tight">
              Sign in to {copy.verb}
            </h2>
          </div>
          <button aria-label="Close" onClick={onClose} className="text-pgn-muted">
            <X size={16} />
          </button>
        </div>

        <p className="text-[13px] text-foreground mb-5">{copy.body}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5">
          <button
            onClick={onSignIn}
            className="flex-1 h-10 rounded-full border text-sm font-semibold text-pgn-navy"
            style={{ borderColor: "#E8D9C8", backgroundColor: "#F5ECD7" }}
          >
            Sign In
          </button>
          <button
            onClick={onSignIn}
            className="flex-1 h-10 rounded-full bg-primary text-pgn-navy text-sm font-semibold hover:shadow-md transition-shadow"
          >
            Create Account
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Browsing, reading replies and search stay open to everyone.
        </p>
      </div>
    </div>
  );
};

export default SignInPromptModal;
