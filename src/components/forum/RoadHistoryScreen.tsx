import { ArrowLeft, Check, Archive, MessageCircle } from "lucide-react";
import { mockPosts, conditionConfig, severityConfig } from "@/data/mockData";
import { computeStatus, getRoadHistory } from "@/lib/lifecycle";
import type { ScreenState } from "@/pages/Index";

interface RoadHistoryScreenProps {
  road: string;
  onNavigate: (s: ScreenState) => void;
  onBack: () => void;
}

const roadKey = (road: string) => road.match(/^([A-Z]\d+)/)?.[1] ?? road;

export const RoadHistoryScreen = ({ road, onNavigate, onBack }: RoadHistoryScreenProps) => {
  const key = roadKey(road);
  const all = mockPosts
    .filter(p => (p.roadKey ?? p.road) === key)
    .sort((a, b) => (a.daysOld ?? 0) - (b.daysOld ?? 0));

  // pick a representative current post (or first) for the related-history helper
  const reference = all[0];
  const history = reference ? [reference, ...getRoadHistory(all, reference)] : [];

  const floodingCount = all.filter(p => p.conditionType === 'flooding').length;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-card px-4 py-3 border-b border-border flex items-center gap-3 flex-shrink-0">
        <button onClick={onBack}><ArrowLeft size={20} className="text-foreground" /></button>
        <div>
          <h1 className="font-semibold text-[15px] text-foreground">
            <span className="font-bold">{key}</span> — Road History
          </h1>
          <p className="text-[11px] text-muted-foreground">All reports for this road</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
        {floodingCount > 0 && (
          <div className="bg-pgn-sand border border-pgn-warm-border rounded-xl p-3 mb-3">
            <p className="text-xs font-semibold text-pgn-warm-brown">
              📊 {floodingCount} flooding report{floodingCount === 1 ? '' : 's'} in 6 months
            </p>
          </div>
        )}

        <ol className="space-y-3">
          {history.map(p => {
            const status = computeStatus(p);
            const cond = conditionConfig[p.conditionType];
            const sev = severityConfig[p.severity];
            const Icon =
              status === 'resolved' ? Check : status === 'archived' ? Archive : null;
            const iconColor =
              status === 'resolved' ? 'text-minor' : status === 'archived' ? 'text-pgn-muted' : 'text-severe';
            const tag =
              status === 'resolved'
                ? `Resolved ${p.resolvedDaysAgo ?? '?'} days ago`
                : status === 'archived'
                ? `Archived (${p.daysOld} days old)`
                : 'Active now';

            return (
              <li key={p.id} className="bg-card rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  {Icon ? <Icon size={14} strokeWidth={2.5} className={iconColor} /> : <span className={`w-2.5 h-2.5 rounded-full ${sev.dot}`} />}
                  <p className="text-xs font-semibold text-foreground">
                    {tag}
                  </p>
                </div>
                <p className="text-[13px] font-medium text-foreground">
                  {cond.icon} {cond.label} — <span className={sev.text}>{sev.label}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MessageCircle size={12} /> {p.replyCount} replies
                  </span>
                  <button
                    onClick={() => onNavigate({ type: 'detail', postId: p.id })}
                    className="text-[11px] font-semibold text-pgn-blue active:opacity-70"
                  >
                    View post →
                  </button>
                </div>
              </li>
            );
          })}
          {history.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-12">No previous reports for this road.</p>
          )}
        </ol>
      </div>
    </div>
  );
};
