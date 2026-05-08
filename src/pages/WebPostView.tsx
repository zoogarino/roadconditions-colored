import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, MessageCircle, Apple, Play, ArrowLeft, Lock, MoreVertical } from "lucide-react";
import { mockPosts, conditionConfig, severityConfig, directionConfig } from "@/data/mockData";

const WebPostView = () => {
  const { id } = useParams<{ id: string }>();
  // Match by id, or fall back to first post for any shared id (prototype)
  const post = mockPosts.find(p => p.id === id) ?? mockPosts[0];

  useEffect(() => {
    if (post) {
      document.title = `${post.road} - ${severityConfig[post.severity].label} ${conditionConfig[post.conditionType].label} | Pocket Guide Namibia`;
    }
  }, [post]);

  if (!post) return null;
  const cond = conditionConfig[post.conditionType];
  const sev = severityConfig[post.severity];
  const dir = directionConfig[post.direction];

  return (
    <div className="min-h-screen bg-pgn-warm-border/40">
      <div className="mx-auto w-full max-w-[480px] bg-background min-h-screen pb-24 shadow-xl">
        {/* Website header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <div className="flex-1">
            <p className="font-semibold text-pgn-navy text-sm leading-tight">Pocket Guide Namibia</p>
            <p className="text-[10px] text-muted-foreground">Road Conditions</p>
          </div>
          <Link to="/" className="text-xs text-pgn-blue font-medium flex items-center gap-1">
            <ArrowLeft size={12} /> App
          </Link>
        </header>

        {/* Breadcrumb */}
        <div className="px-4 pt-4 text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">Road Conditions Forum</Link>
          <span className="mx-1">/</span>
          <span>Post</span>
        </div>

        {/* Post card */}
        <article className="bg-card mx-4 mt-3 rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-card ${post.author.color}`}>
              {post.author.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
              <p className="text-[11px] text-muted-foreground">{post.timeAgo}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={14} className="text-primary" />
            <h1 className="text-sm font-medium text-foreground">
              {(() => {
                const m = post.road.match(/^([A-Z]\d+\b)(.*)/);
                return m ? <><span className="font-bold">{m[1]}</span>{m[2]}</> : post.road;
              })()}
            </h1>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${cond.bg} ${cond.text}`}>
              {cond.icon} {cond.label}
            </span>
            <span className={`text-[11px] font-semibold ${sev.text}`}>{sev.label}</span>
            {dir.icon && <span className="text-[11px] text-muted-foreground">{dir.label} {dir.icon}</span>}
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{post.description}</p>

          <div className="w-full h-36 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin size={24} className="text-primary mx-auto mb-1" />
              <span className="text-[11px] text-muted-foreground">{post.location}</span>
            </div>
          </div>
        </article>

        {/* Download CTA banner */}
        <section
          className="mx-4 mt-4 rounded-xl p-5 border"
          style={{ backgroundColor: '#F5ECD7', borderColor: '#D4854A' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={20} className="text-pgn-navy" />
            <h2 className="font-bold text-pgn-navy text-base">Join the Discussion</h2>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed mb-4">
            Download Pocket Guide Namibia to reply, post updates, and get real-time road alerts.
          </p>
          <div className="flex flex-col gap-2">
            <a href="#" className="flex items-center justify-center gap-2 bg-pgn-dark text-white rounded-lg py-2.5 text-xs font-semibold active:opacity-80">
              <Apple size={16} /> Download on the App Store
            </a>
            <a href="#" className="flex items-center justify-center gap-2 bg-pgn-dark text-white rounded-lg py-2.5 text-xs font-semibold active:opacity-80">
              <Play size={16} /> Get it on Google Play
            </a>
          </div>
        </section>

        {/* Replies (read-only) */}
        <section className="px-4 mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">{post.replies.length} Replies</h3>
          <div className="space-y-2 opacity-85">
            {post.replies.slice(0, 3).map(r => (
              <div key={r.id} className="bg-card rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-card ${r.author.color}`}>
                    {r.author.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{r.author.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.timeAgo}</p>
                  </div>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{r.content}</p>
              </div>
            ))}
          </div>
          {post.replies.length > 3 && (
            <button className="mt-3 w-full text-center text-xs text-primary font-semibold py-2">
              Show more replies (download app)
            </button>
          )}
        </section>
      </div>

      {/* Sticky bottom CTA */}
      <a
        href="#"
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] h-14 flex items-center justify-center text-white font-bold text-sm shadow-2xl active:opacity-90 z-40"
        style={{ backgroundColor: '#D4854A' }}
      >
        Download App to Reply
      </a>
    </div>
  );
};

export default WebPostView;
