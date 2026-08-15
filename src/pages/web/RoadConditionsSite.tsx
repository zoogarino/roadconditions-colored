import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Search, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import SiteHeader from "@/components/web/SiteHeader";
import WebPostCard from "@/components/web/WebPostCard";
import ReportModal, { type ReportTarget } from "@/components/web/ReportModal";
import SignInPromptModal, { type GuestAction } from "@/components/web/SignInPromptModal";
import { useWebAuthDemo } from "@/hooks/useWebAuthDemo";
import { mockPosts } from "@/data/mockData";
import { computeStatus, relevanceScore } from "@/lib/lifecycle";


interface RoadConditionsSiteProps {
  /** Renders the empty-feed variant of the same page. */
  empty?: boolean;
}

const RoadConditionsSite = ({ empty = false }: RoadConditionsSiteProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, isGuest, toggle, setIsLoggedIn } = useWebAuthDemo();
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [guestAction, setGuestAction] = useState<GuestAction | null>(null);
  const [introDismissed, setIntroDismissed] = useState(false);


  useEffect(() => {
    document.title = "Road Conditions Namibia | Pocket Guide Namibia";
  }, []);

  const posts = useMemo(() => {
    if (empty) return [];
    return mockPosts
      .filter(p => {
        if (p.hiddenFromFeed) return false;
        const status = computeStatus(p);
        return status === "active" || status === "needs_confirmation";
      })
      .sort((a, b) => {
        if (!!b.isPinned !== !!a.isPinned) return b.isPinned ? 1 : -1;
        return relevanceScore(b) - relevanceScore(a);
      });
  }, [empty]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF6EE" }}>
      <SiteHeader isLoggedIn={isLoggedIn} onToggleAccount={toggle} />

      <main className="mx-auto w-full max-w-[640px] px-4 py-8">
        <h1 className="text-xl font-bold text-pgn-navy mb-1">Road Conditions</h1>
        <p className="text-xs text-muted-foreground mb-6">
          Active reports from travellers across Namibia.
        </p>

        {posts.length === 0 ? (
          <div
            className="bg-card border px-6 py-14 text-center"
            style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 4px 16px rgba(27, 63, 143, 0.08)" }}
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#FCE8E3" }}
            >
              <Plus size={24} style={{ color: "#D4854A" }} />
            </div>
            <p className="text-base font-bold text-pgn-navy mb-1">
              Be the first to report a condition!
            </p>
            <p className="text-xs text-muted-foreground mb-5">
              No active road conditions reported right now.
            </p>
            <button
              onClick={() => {
                if (isGuest) {
                  setGuestAction("post");
                  return;
                }
                navigate("/road-conditions/new");
              }}
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-primary text-pgn-navy text-sm font-semibold"
            >
              <Plus size={15} /> Post Condition
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <WebPostCard
                key={post.id}
                post={post}
                onReport={id => setReportTarget({ id, kind: "post" })}
                isGuest={isGuest}
                onRequireSignIn={action => setGuestAction(action)}
              />
            ))}
          </div>
        )}
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
    </div>
  );
};

export default RoadConditionsSite;
