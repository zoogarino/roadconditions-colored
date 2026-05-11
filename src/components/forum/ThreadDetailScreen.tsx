import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import type { ScreenState } from "@/pages/Index";

export type ThreadInitialState =
  | { kind: 'none' }
  | { kind: 'inputOpen'; replyId: string }
  | { kind: 'limitReached'; replyId: string };

interface ThreadDetailScreenProps {
  onBack: () => void;
  onNavigate: (s: ScreenState) => void;
  initial?: ThreadInitialState;
  stateLabel: string;
}

interface ThreadReply {
  id: string;
  author: { name: string; initials: string; color: string };
  timeAgo: string;
  content: string;
  children?: ThreadReply[];
}

const samplePost = {
  road: 'C38 between Otjiwarongo and Outjo',
  location: 'Approx. 45 km north of Otjiwarongo',
  description:
    'Heavy rains last night washed sections of the gravel road. Two corrugated dips full of water, deep enough to scrape a sedan. 4x4 fine, sedans should turn back at the Okakarara turnoff.',
  author: { name: 'Tangeni S.', initials: 'TS', color: 'bg-pgn-terracotta' },
  timeAgo: '5 hours ago',
};

const sampleThread: ThreadReply[] = [
  {
    id: 'r1',
    author: { name: 'Maria N.', initials: 'MN', color: 'bg-pgn-blue' },
    timeAgo: '3 hours ago',
    content:
      'Just came through with my Hilux — water still standing across the road around the 47 km mark. Drove through slowly in low range, no issues but definitely not safe for low-clearance vehicles.',
    children: [
      {
        id: 'r1a',
        author: { name: 'Johannes K.', initials: 'JK', color: 'bg-emerald-600' },
        timeAgo: '2 hours ago',
        content:
          'Thanks Maria — was about to leave Otjiwarongo with the bakkie. Will detour via the D2483 instead. Anyone know if that one is open?',
      },
      {
        id: 'r1b',
        author: { name: 'Helena P.', initials: 'HP', color: 'bg-amber-600' },
        timeAgo: '1 hour ago',
        content:
          'D2483 was fine when I passed at midday — slow but passable. Watch the cattle near the kraal at the junction.',
      },
    ],
  },
  {
    id: 'r2',
    author: { name: 'Petrus H.', initials: 'PH', color: 'bg-pgn-warm-brown' },
    timeAgo: '45 minutes ago',
    content:
      'Roads Authority grader truck just turned in from the Outjo side. Conditions should improve by tomorrow morning. Will update once I see them working the affected section.',
  },
];

const formatRoad = (road: string) => {
  const m = road.match(/^([A-Z]\d+\b)(.*)/);
  return m ? (
    <>
      <span className="font-bold">{m[1]}</span>
      {m[2]}
    </>
  ) : (
    road
  );
};

const MAX = 280;

const ReplyItem = ({
  reply,
  level,
  openInputId,
  limitReachedId,
  onReplyClick,
  onCancel,
}: {
  reply: ThreadReply;
  level: 1 | 2;
  openInputId: string | null;
  limitReachedId: string | null;
  onReplyClick: (reply: ThreadReply, level: 1 | 2) => void;
  onCancel: () => void;
}) => {
  const [text, setText] = useState('');
  const isInputOpen = openInputId === reply.id && level === 1;
  const isLimit = limitReachedId === reply.id && level === 2;

  return (
    <div
      className={
        level === 2
          ? 'ml-5 pl-3 border-l-2 border-primary/40 mt-3'
          : 'mt-4 first:mt-0'
      }
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 ${reply.author.color}`}
        >
          {reply.author.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-[13px] font-semibold text-foreground">{reply.author.name}</p>
            <p className="text-[11px] text-muted-foreground">{reply.timeAgo}</p>
          </div>
          <p className="text-[13px] text-foreground/85 leading-relaxed mt-0.5">
            {reply.content}
          </p>
          <button
            onClick={() => onReplyClick(reply, level)}
            className="mt-1.5 text-[12px] text-primary font-medium active:opacity-70"
          >
            Reply
          </button>

          {/* Inline input (level 1 only) */}
          {isInputOpen && (
            <div className="mt-2.5 bg-secondary/60 rounded-lg p-2.5 border border-border">
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX))}
                placeholder="Add a reply... (280 characters max)"
                rows={2}
                className="w-full bg-card rounded-md px-2.5 py-2 text-[13px] outline-none resize-none placeholder:text-muted-foreground border border-border"
              />
              <div className="flex items-center justify-between mt-1.5">
                <span
                  className={`text-[11px] ${
                    text.length > MAX - 20 ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {text.length} / {MAX}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onCancel}
                    className="text-[12px] text-muted-foreground font-medium px-2 py-1.5 active:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!text.trim()}
                    className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[12px] font-semibold disabled:opacity-40 active:scale-95 transition-transform"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Limit reached message (level 2) */}
          {isLimit && (
            <p className="mt-2 text-[11px] text-muted-foreground italic">
              Reply limit reached. Add a new comment to the post instead.
            </p>
          )}

          {/* Children */}
          {reply.children?.map((child) => (
            <ReplyItem
              key={child.id}
              reply={child}
              level={2}
              openInputId={openInputId}
              limitReachedId={limitReachedId}
              onReplyClick={onReplyClick}
              onCancel={onCancel}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ThreadDetailScreen = ({
  onBack,
  initial,
  stateLabel,
}: ThreadDetailScreenProps) => {
  const [openInputId, setOpenInputId] = useState<string | null>(
    initial?.kind === 'inputOpen' ? initial.replyId : null,
  );
  const [limitReachedId, setLimitReachedId] = useState<string | null>(
    initial?.kind === 'limitReached' ? initial.replyId : null,
  );

  const handleReplyClick = (reply: ThreadReply, level: 1 | 2) => {
    if (level === 2) {
      setOpenInputId(null);
      setLimitReachedId(reply.id);
      return;
    }
    setLimitReachedId(null);
    setOpenInputId((cur) => (cur === reply.id ? null : reply.id));
  };

  const handleCancel = () => setOpenInputId(null);

  const totalReplies = sampleThread.reduce(
    (n, r) => n + 1 + (r.children?.length ?? 0),
    0,
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="font-semibold text-[15px] text-foreground">Road Conditions</h1>
        </div>
        <span className="text-[10px] uppercase tracking-wide font-semibold text-pgn-terracotta">
          {stateLabel}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
        {/* Main post */}
        <div className="bg-card mx-4 mt-4 rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${samplePost.author.color}`}
            >
              {samplePost.author.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{samplePost.author.name}</p>
              <p className="text-[11px] text-muted-foreground">{samplePost.timeAgo}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={14} className="text-primary" />
            <span className="text-sm font-medium text-foreground">{formatRoad(samplePost.road)}</span>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700">
              🌊 Flooding
            </span>
            <span className="text-[11px] font-semibold text-moderate">Moderate</span>
            <span className="text-[11px] text-muted-foreground">Northbound ⬆️</span>
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">{samplePost.description}</p>
        </div>

        {/* Replies */}
        <div className="px-4 mt-5">
          <h3 className="text-sm font-semibold text-foreground mb-2">{totalReplies} Replies</h3>
          <div className="border-t border-border pt-1">
            {sampleThread.map((r) => (
              <ReplyItem
                key={r.id}
                reply={r}
                level={1}
                openInputId={openInputId}
                limitReachedId={limitReachedId}
                onReplyClick={handleReplyClick}
                onCancel={handleCancel}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
