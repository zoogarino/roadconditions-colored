import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Variant {
  road: string;
  condition: string;
  conditionColor: string;
  severity: string;
  severityColor: string;
  circleColor: string;
}

const variants: Variant[] = [
  { road: 'C38 NEAR OKAUKUEJO', condition: 'FLOODING',     conditionColor: '#FFD700', severity: 'SEVERE',   severityColor: '#EF4444', circleColor: '#EF4444' },
  { road: 'B2 AT KARIBIB',      condition: 'CONSTRUCTION', conditionColor: '#FFFFFF', severity: 'MODERATE', severityColor: '#F59E0B', circleColor: '#F59E0B' },
  { road: 'B1 OKAHANDJA',       condition: 'POTHOLES',     conditionColor: '#FFFFFF', severity: 'MINOR',    severityColor: '#10B981', circleColor: '#10B981' },
];

const OGCard = ({ v }: { v: Variant }) => (
  <div
    className="relative w-full overflow-hidden rounded-lg border-2 border-pgn-warm-border shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
    style={{ aspectRatio: '1200 / 630', backgroundColor: '#3D3530' }}
  >
    {/* Map texture overlay */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #5a4a3a 0%, #3D3530 100%), repeating-linear-gradient(45deg, transparent 0 20px, rgba(255,255,255,0.04) 20px 21px)",
        backgroundBlendMode: 'overlay',
      }}
    />
    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />

    {/* Severity circle */}
    <div
      className="absolute rounded-full"
      style={{
        top: '6.3%', left: '3.3%',
        width: '15.8%', aspectRatio: '1 / 1',
        backgroundColor: v.circleColor,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    />

    {/* Text block */}
    <div className="absolute" style={{ top: '9.5%', left: '22%', right: '4%' }}>
      <p
        className="font-extrabold uppercase leading-[1.05] text-white"
        style={{ fontSize: 'clamp(14px, 5cqw, 60px)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        {v.road}
      </p>
      <p
        className="font-extrabold uppercase mt-2"
        style={{ fontSize: 'clamp(11px, 3.75cqw, 45px)', color: v.conditionColor, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        {v.condition}
      </p>
      <p
        className="font-extrabold uppercase mt-1"
        style={{ fontSize: 'clamp(11px, 3.75cqw, 45px)', color: v.severityColor, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        {v.severity}
      </p>
    </div>

    {/* Branding bottom-left */}
    <div className="absolute" style={{ bottom: '6.3%', left: '3.3%' }}>
      <p
        className="font-bold"
        style={{ color: '#29ABE2', fontSize: 'clamp(8px, 2.3cqw, 28px)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        POCKET GUIDE NAMIBIA
      </p>
      <p
        className="text-white"
        style={{ fontSize: 'clamp(7px, 1.8cqw, 22px)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        Real-time Road Conditions
      </p>
    </div>
  </div>
);

export default function OGImagePreview() {
  return (
    <div className="min-h-screen bg-pgn-parchment">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-pgn-blue text-sm font-semibold mb-6 hover:opacity-80">
          <ArrowLeft size={16} /> Back to prototype
        </Link>

        <h1 className="text-2xl font-bold text-pgn-navy mb-2">Share Preview Image (Open Graph)</h1>
        <p className="text-sm text-pgn-warm-brown mb-8 leading-relaxed">
          This is the image that appears when a road condition is shared on social media.
          Generated dynamically for each post.
        </p>

        <div className="space-y-10" style={{ containerType: 'inline-size' as const }}>
          {variants.map((v, i) => (
            <div key={i} style={{ containerType: 'inline-size' as const }}>
              <OGCard v={v} />
              <p className="text-xs text-pgn-muted text-center mt-3">
                Variation {i + 1}: {v.severity.charAt(0) + v.severity.slice(1).toLowerCase()} {v.condition.toLowerCase()}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm text-pgn-muted text-center mt-10 max-w-xl mx-auto leading-relaxed">
          These images are generated automatically when a post is shared. The map shows the
          exact location, and colors indicate severity. This makes shares more engaging and
          professional on social media.
        </p>
      </div>
    </div>
  );
}
