import { ArrowLeft, Check, Archive, MessageCircle, BarChart3, MapIcon } from "lucide-react";
import { mockPosts, conditionConfig, severityConfig } from "@/data/mockData";
import { computeStatus } from "@/lib/lifecycle";
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

  const floodingCount = all.filter(p => p.conditionType === 'flooding').length;
  const resolvedDurations = all
    .filter(p => p.status === 'resolved' && p.resolvedDaysAgo != null)
    .map(p => Math.max(1, (p.daysOld ?? 0) - (p.resolvedDaysAgo ?? 0)));
  const avgDuration = resolvedDurations.length
    ? Math.round(resolvedDurations.reduce((a, b) => a + b, 0) / resolvedDurations.length)
    : null;
  const mostRecent = all[0];
  const mostRecentStatus = mostRecent ? computeStatus(mostRecent) : null;

  const isEmpty = all.length <= 1;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card px-4 py-3 border-b border-pgn-warm-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBack} className="flex items-center gap-1 text-pgn-blue active:opacity-70">
            <ArrowLeft size={18} />
            <span className="text-xs font-semibold">Back</span>
          </button>
          <span className="text-xs text-pgn-muted ml-2">Road History</span>
        </div>
        <h1 className="text-xl font-bold text-pgn-navy">{key} <span className="font-normal text-pgn-warm-brown text-base">{road.replace(key, '').trim()}</span></h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {/* Summary card */}
        <div className="bg-pgn-sand border border-pgn-warm-border rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={20} className="text-pgn-navy" />
            <h2 className="text-base font-bold text-pgn-navy">Condition History</h2>
          </div>
          <ul className="text-sm text-pgn-dark space-y-1 leading-relaxed">
            {floodingCount > 0 && (
              <li>{floodingCount} flooding report{floodingCount === 1 ? '' : 's'} in 6 months</li>
            )}
            <li>{all.length} total report{all.length === 1 ? '' : 's'} on this road</li>
            {avgDuration != null && <li>Average duration: {avgDuration} day{avgDuration === 1 ? '' : 's'}</li>}
            {mostRecentStatus && (
              <li>
                Most recent:{' '}
                <span className={
                  mostRecentStatus === 'resolved' ? 'text-minor font-semibold' :
                  mostRecentStatus === 'archived' ? 'text-pgn-muted font-semibold' :
                  'text-severe font-semibold'
                }>
                  {mostRecentStatus === 'resolved' ? 'Resolved' : mostRecentStatus === 'archived' ? 'Archived' : 'Active now'}
                </span>
              </li>
            )}
          </ul>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <MapIcon size={48} className="text-pgn-muted mb-3" />
            <h3 className="font-bold text-pgn-navy mb-1">No Previous Reports</h3>
            <p className="text-xs text-pgn-muted max-w-[240px]">This is the first report for this road section.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-base font-bold text-pgn-warm-brown">Timeline</h3>
              <div className="flex-1 h-px bg-pgn-warm-border" />
            </div>

            {/* Timeline with vertical connector */}
            <div className="relative">
              <div className="absolute left-[20px] top-2 bottom-2 w-0.5 bg-pgn-warm-border" />
              <ol className="space-y-3 relative">
                {all.map(p => {
                  const status = computeStatus(p);
                  const cond = conditionConfig[p.conditionType];
                  const sev = severityConfig[p.severity];

                  const isResolved = status === 'resolved';
                  const isArchived = status === 'archived';
                  const isActive = !isResolved && !isArchived;

                  const borderColor = isActive ? 'border-l-severe' : isResolved ? 'border-l-minor' : 'border-l-pgn-muted';
                  const badgeBg = isActive ? 'bg-severe' : isResolved ? 'bg-minor' : 'bg-pgn-muted';
                  const badgeLabel = isActive ? 'Active now' : isResolved ? 'Resolved' : 'Archived';
                  const Icon = isResolved ? Check : isArchived ? Archive : null;

                  const startedDays = p.daysOld ?? 0;
                  const resolvedDate = isResolved ? `Resolved ${p.resolvedDaysAgo} day${p.resolvedDaysAgo === 1 ? '' : 's'} ago` : null;
                  const duration = isResolved && p.resolvedDaysAgo != null
                    ? Math.max(1, startedDays - p.resolvedDaysAgo)
                    : null;

                  return (
                    <li
                      key={p.id}
                      className={`relative ml-9 bg-card border border-pgn-warm-border ${borderColor} border-l-4 rounded-lg p-3 shadow-sm ${isArchived ? 'opacity-90 bg-[#FAFAFA]' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {Icon && <Icon size={14} strokeWidth={2.5} className={isResolved ? 'text-minor' : 'text-pgn-muted'} />}
                          {isActive && <span className="w-2.5 h-2.5 rounded-full bg-severe inline-block" />}
                          <span className="text-xs text-pgn-muted truncate">
                            Posted {startedDays === 0 ? 'today' : `${startedDays} day${startedDays === 1 ? '' : 's'} ago`}
                          </span>
                        </div>
                        <span className={`text-[10px] font-semibold text-white px-2 py-0.5 rounded ${badgeBg} flex-shrink-0`}>
                          {badgeLabel}
                        </span>
                      </div>
                      <p className="text-[15px] font-bold text-pgn-navy">
                        {cond.icon} {cond.label} — <span className={sev.text}>{sev.label}</span>
                      </p>
                      {duration != null && (
                        <p className="text-xs text-pgn-muted mt-0.5">Duration: {duration} day{duration === 1 ? '' : 's'}</p>
                      )}
                      <p className="text-sm text-pgn-dark mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-pgn-muted flex items-center gap-1">
                          <MessageCircle size={12} /> {p.replyCount} replies
                          {resolvedDate && <span className="ml-1">• {resolvedDate}</span>}
                        </span>
                        <button
                          onClick={() => onNavigate({ type: 'detail', postId: p.id })}
                          className="text-xs font-semibold text-pgn-blue active:opacity-70"
                        >
                          View post →
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
