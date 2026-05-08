import { ArrowLeft, MoreVertical, Phone, Video, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const WhatsAppPreview = () => {
  return (
    <div className="min-h-screen bg-pgn-warm-border/40 flex items-center justify-center md:p-8">
      <div className="w-full max-w-[390px] bg-[#E5DDD5] min-h-screen flex flex-col shadow-2xl">
        {/* WhatsApp header */}
        <header className="bg-[#075E54] text-white px-3 py-3 flex items-center gap-3 h-14 flex-shrink-0">
          <button className="text-white"><ArrowLeft size={20} /></button>
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">JV</div>
          <div className="flex-1">
            <p className="text-[15px] font-semibold leading-tight">John Vanca</p>
            <p className="text-[11px] opacity-80">online</p>
          </div>
          <Video size={18} />
          <Phone size={18} />
          <MoreVertical size={18} />
        </header>

        {/* Chat area */}
        <div
          className="flex-1 px-3 py-4 space-y-2"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='5' cy='5' r='1' fill='%23d4cfc4'/></svg>\")",
            backgroundColor: "#ECE5DD",
          }}
        >
          <div className="text-center">
            <span className="inline-block bg-white/80 text-[11px] text-gray-600 px-2 py-0.5 rounded">
              Today
            </span>
          </div>

          {/* Sender bubble with link preview */}
          <div className="flex justify-end">
            <div className="max-w-[85%] bg-[#DCF8C6] rounded-lg shadow-sm p-1.5">
              {/* Link preview card */}
              <div className="bg-white/60 rounded-md overflow-hidden mb-1">
                <div className="h-44 bg-gradient-to-br from-[#D4854A] to-[#8B5E3C] relative flex items-center justify-center">
                  <MapPin size={36} className="text-white drop-shadow" />
                  <span className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded">C38 • Etosha</span>
                </div>
                <div className="p-2.5">
                  <p className="text-[14px] font-semibold text-black leading-tight line-clamp-2">
                    C38 near Okaukuejo - Severe Flooding
                  </p>
                  <p className="text-[12px] text-gray-600 mt-1 line-clamp-3 leading-snug">
                    Heavy rains between Okaukuejo and Halali. Road completely washed away at the riverbed crossing...
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1.5">
                    pocketguidenamibia.com
                  </p>
                </div>
              </div>
              <p className="text-[14px] text-black px-2 pb-0.5">Check this road condition 🚨</p>
              <p className="text-[10px] text-gray-500 text-right pr-2">10:42 AM ✓✓</p>
            </div>
          </div>
        </div>

        <Link to="/" className="bg-[#075E54] text-white text-center text-xs py-2 font-medium">
          ← Back to demo
        </Link>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
