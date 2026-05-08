import { Search, Menu, ThumbsUp, MessageCircle, Share2, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const FacebookPreview = () => {
  return (
    <div className="min-h-screen bg-pgn-warm-border/40 flex items-center justify-center md:p-8">
      <div className="w-full max-w-[390px] bg-[#F0F2F5] min-h-screen flex flex-col shadow-2xl">
        {/* Facebook header */}
        <header className="bg-[#4267B2] text-white px-4 py-3 flex items-center justify-between h-14 flex-shrink-0">
          <span className="text-[26px] font-bold italic leading-none">f</span>
          <div className="flex items-center gap-4">
            <Search size={20} />
            <Menu size={20} />
          </div>
        </header>

        {/* Post */}
        <article className="bg-white border-y border-[#E4E6EB]">
          <div className="px-3 py-3 flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#D4854A] flex items-center justify-center text-white text-sm font-bold">SW</div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-[#050505] leading-tight">Sarah Williams</p>
              <p className="text-[12px] text-[#65676B] flex items-center gap-1">
                2 hours ago · <Globe size={11} />
              </p>
            </div>
          </div>

          <p className="px-3 pb-3 text-[15px] text-[#050505] leading-snug">
            Important road alert for anyone heading to Etosha this week 🚨
          </p>

          {/* Link preview card */}
          <div className="border-y border-[#E4E6EB]">
            <div className="h-56 bg-gradient-to-br from-[#D4854A] to-[#8B5E3C] flex items-center justify-center relative">
              <MapPin size={48} className="text-white drop-shadow-lg" />
              <span className="absolute bottom-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded">
                C38 • Etosha National Park
              </span>
            </div>
            <div className="bg-[#F2F3F5] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[#8A8D91]">
                pocketguidenamibia.com
              </p>
              <p className="text-[16px] font-bold text-[#050505] leading-tight mt-0.5 line-clamp-2">
                C38 near Okaukuejo - Severe Flooding
              </p>
              <p className="text-[14px] text-[#606770] mt-1 line-clamp-3 leading-snug">
                Road completely washed away at riverbed crossing. 4x4 vehicles stuck, recovery team called...
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 border-t border-[#E4E6EB]">
            <button className="flex items-center justify-center gap-2 py-2.5 text-[14px] text-[#606770] font-medium">
              <ThumbsUp size={16} /> Like
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 text-[14px] text-[#606770] font-medium">
              <MessageCircle size={16} /> Comment
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 text-[14px] text-[#606770] font-medium">
              <Share2 size={16} /> Share
            </button>
          </div>
        </article>

        <Link to="/" className="bg-[#4267B2] text-white text-center text-xs py-2 font-medium mt-auto">
          ← Back to demo
        </Link>
      </div>
    </div>
  );
};

export default FacebookPreview;
