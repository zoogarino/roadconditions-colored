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
    <div className="min-h-screen" style={{ backgroundColor: '#FDF6EE' }}>
      <div className="mx-auto w-full max-w-[480px] min-h-screen pb-24 shadow-xl" style={{ backgroundColor: '#FDF6EE' }}>
        {/* Mobile browser chrome */}
        <div className="bg-[#F5F5F5] h-14 flex items-center gap-2 px-3 border-b border-[#E4E6EB] sticky top-0 z-40">
          <Lock size={12} className="text-[#3D3530]" />
          <span className="text-[13px] text-[#3D3530] truncate flex-1">
            pocketguidenamibia.com/road-conditions/post/{post.id}
          </span>
          <MoreVertical size={16} className="text-[#3D3530]" />
        </div>
        {/* Website header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-14 z-30">
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
        <article
          className="bg-card mx-4 mt-3 p-4 border border-border"
          style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(27, 63, 143, 0.10)' }}
        >
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

          <p className="text-sm leading-relaxed mb-4" style={{ color: '#3D3530' }}>{post.description}</p>

          <div
            className="w-full h-36 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FDF6EE', border: '1px solid #E8D9C8', boxShadow: 'inset 0 1px 3px rgba(139, 94, 60, 0.05)' }}
          >
            <div className="text-center">
              <div
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: '#FCE8E3' }}
              >
                <MapPin size={20} style={{ color: '#D4854A' }} />
              </div>
              <span className="text-[11px] text-muted-foreground">{post.location}</span>
            </div>
          </div>
        </article>

        {/* Download CTA banner */}
        <section
          className="mx-4 mt-4 p-5"
          style={{ backgroundColor: '#F5ECD7', borderRadius: 12, boxShadow: '0 2px 8px rgba(139, 94, 60, 0.06)' }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
              <MessageCircle size={18} style={{ color: '#D4854A' }} />
            </div>
            <h2 className="font-bold text-pgn-navy text-base">Join the Discussion</h2>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed mb-4">
            Download Pocket Guide Namibia to reply, post updates, and get real-time road alerts.
          </p>
          <div className="flex gap-2.5">
            <a href="#" className="flex-1 flex items-center justify-center gap-1.5 bg-pgn-dark text-white py-2.5 px-2 text-[11px] font-semibold text-center active:opacity-80 transition-shadow hover:shadow-md" style={{ borderRadius: 10 }}>
              <Apple size={14} className="shrink-0" /> Download on the App Store
            </a>
            <a href="#" className="flex-1 flex items-center justify-center gap-1.5 bg-pgn-dark text-white py-2.5 px-2 text-[11px] font-semibold text-center active:opacity-80 transition-shadow hover:shadow-md" style={{ borderRadius: 10 }}>
              <Play size={14} className="shrink-0" /> Get it on Google Play
            </a>
          </div>
        </section>

        {/* Replies (read-only) */}
        <section className="px-4 mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-2 pt-4" style={{ borderTop: '1px solid #E8D9C8' }}>{post.replies.length} Replies</h3>
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
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-[480px] h-14 flex items-center justify-center text-white font-bold text-sm active:opacity-90 z-40"
        style={{ backgroundColor: '#D4854A', boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)' }}
      >
        Download App to Reply
      </a>
    </div>
  );
};

export default WebPostView;
