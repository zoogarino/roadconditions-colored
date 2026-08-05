import { useState } from "react";
import { FlaskConical, X, ExternalLink, Info, Layers, Home } from "lucide-react";
import { mockPosts } from "@/data/mockData";
import type { ScreenState } from "@/pages/Index";

interface PrototypeStateLink {
  label: string;
  desc: string;
  state: ScreenState;
}

interface DemoLinksMenuProps {
  onSelectState?: (state: ScreenState) => void;
  states?: PrototypeStateLink[];
}

/**
 * DemoLinksMenu
 * ----------------------------------------------------------------
 * DEV/PROTOTYPE ONLY — not part of the production app.
 * Exposes external preview routes AND in-app prototype states for
 * stakeholder walkthroughs. Remove before shipping.
 */
export const DemoLinksMenu = ({ onSelectState, states = [] }: DemoLinksMenuProps) => {
  const [open, setOpen] = useState(false);
  const samplePostId = mockPosts[0]?.id ?? "1";

  const links = [
    {
      label: "Web fallback view",
      desc: "Shared post landing page (non-app users)",
      href: `/share/road-conditions/post/${samplePostId}`,
    },
    {
      label: "Web feed",
      desc: "Full site feed with global nav",
      href: "/road-conditions",
    },
    {
      label: "Web post detail",
      desc: "Full site post page with replies",
      href: `/road-conditions/post/${samplePostId}`,
    },
    {
      label: "Feed — includes your own post",
      desc: "Populated web feed with a post authored by you",
      href: "/road-conditions",
    },
    {
      label: "Your post — not deletable (has replies)",
      desc: "Delete click shows the blocked toast",
      href: "/road-conditions/post/own-1",
    },
    {
      label: "Your post — deletable (zero replies)",
      desc: "Trash icon opens the delete confirmation dialog",
      href: "/road-conditions/post/own-3",
    },


    {
      label: "WhatsApp link preview",
      desc: "How the share appears in WhatsApp",
      href: "/previews/whatsapp",
    },
    {
      label: "Facebook link preview",
      desc: "How the share appears in Facebook",
      href: "/previews/facebook",
    },
    {
      label: "Open Graph image",
      desc: "Auto-generated share image variations",
      href: "/previews/og-image",
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-[100] hidden md:block">
      {open ? (
        <div className="w-72 bg-card border border-pgn-warm-border rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-pgn-navy text-white">
            <div className="flex items-center gap-2">
              <FlaskConical size={14} />
              <span className="text-xs font-semibold">Demo Links</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close demo menu">
              <X size={14} />
            </button>
          </div>

          <div className="p-2 space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-pgn-warm-border/40 transition-colors group"
              >
                <ExternalLink size={14} className="text-pgn-blue mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-pgn-navy leading-tight">{l.label}</p>
                  <p className="text-[11px] text-foreground/60 leading-snug mt-0.5">{l.desc}</p>
                </div>
              </a>
            ))}
          </div>

          {onSelectState && (
            <div className="px-2 pt-2 border-t border-pgn-warm-border">
              <button
                onClick={() => { onSelectState({ type: 'feed' }); setOpen(false); }}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg bg-pgn-warm-border/30 hover:bg-pgn-warm-border/60 transition-colors text-left"
              >
                <Home size={14} className="text-pgn-navy flex-shrink-0" />
                <span className="text-xs font-semibold text-pgn-navy">Back to main mockup</span>
              </button>
            </div>
          )}

          {states.length > 0 && onSelectState && (
            <div className="px-2 pb-2 pt-1 border-t border-pgn-warm-border">
              <p className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-wide font-semibold text-foreground/50">
                Prototype states
              </p>
              {states.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { onSelectState(s.state); setOpen(false); }}
                  className="w-full flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-pgn-warm-border/40 transition-colors text-left"
                >
                  <Layers size={14} className="text-pgn-terracotta mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-pgn-navy leading-tight">{s.label}</p>
                    <p className="text-[11px] text-foreground/60 leading-snug mt-0.5">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="px-3 py-2 bg-pgn-warm-border/30 border-t border-pgn-warm-border flex gap-2">
            <Info size={12} className="text-foreground/60 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-foreground/70 leading-snug">
              Dev note: this menu exists only for testing within the mockup. Remove
              <code className="mx-1 px-1 bg-card rounded">DemoLinksMenu</code>
              before production.
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-pgn-navy text-white px-3 py-2 rounded-full shadow-lg hover:opacity-90"
        >
          <FlaskConical size={14} />
          <span className="text-xs font-semibold">Demo Links</span>
        </button>
      )}
    </div>
  );
};

export default DemoLinksMenu;
