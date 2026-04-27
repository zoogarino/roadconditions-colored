import { useState } from "react";
import { ArrowLeft, Search, MapPin, X, Check, ChevronRight, Navigation } from "lucide-react";
import { conditionConfig, severityConfig, directionConfig, conditionTypes, searchSuggestions, popularRoutes } from "@/data/mockData";
import type { ConditionType, Severity, Direction } from "@/data/mockData";
import type { ScreenState } from "@/pages/Index";

interface CreateScreenProps {
  onNavigate: (s: ScreenState) => void;
  onBack: () => void;
  isOffline: boolean;
}

export const CreateScreen = ({ onBack, isOffline }: CreateScreenProps) => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionType, setConditionType] = useState<ConditionType | null>(null);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [description, setDescription] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapPin, setMapPin] = useState(false);
  const [posted, setPosted] = useState(false);

  const canNext = () => {
    if (step === 1) return !!location;
    if (step === 2) return !!conditionType;
    if (step === 3) return !!severity;
    if (step === 4) return description.length > 0;
    return false;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      setPosted(true);
      setTimeout(() => onBack(), 1500);
    }
  };

  if (posted) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background p-8">
        <div className="w-16 h-16 bg-minor/20 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-minor" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          {isOffline ? 'Post Queued!' : 'Post Published!'}
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          {isOffline
            ? 'Your post will be uploaded when you\'re back online.'
            : 'Your road condition report has been shared with the community.'}
        </p>
        {isOffline && (
          <div className="mt-3 px-3 py-1.5 bg-moderate/15 rounded-lg text-xs text-foreground">
            ⏳ Pending upload
          </div>
        )}
      </div>
    );
  }

  // Full-screen map view
  if (showMap) {
    return (
      <div className="h-full flex flex-col relative bg-background">
        <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between z-10">
          <button onClick={() => setShowMap(false)} className="text-sm text-foreground font-medium">← Cancel</button>
          <span className="text-xs text-muted-foreground">Drop a Pin</span>
          <button
            onClick={() => { setLocation('C34, 2.3km from Okaukuejo'); setMapPin(true); setShowMap(false); }}
            className="text-sm text-primary font-semibold"
          >
            Confirm
          </button>
        </div>
        
        {/* Map placeholder */}
        <div
          className="flex-1 bg-gradient-to-br from-emerald-100 via-amber-50 to-orange-100 relative cursor-crosshair"
          onClick={() => setMapPin(true)}
        >
          {/* Grid lines to simulate map */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute border-b border-foreground/30" style={{ top: `${(i + 1) * 12}%`, left: 0, right: 0 }} />
            ))}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute border-r border-foreground/30" style={{ left: `${(i + 1) * 18}%`, top: 0, bottom: 0 }} />
            ))}
          </div>

          {/* Simulated roads */}
          <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-foreground/20 rotate-12" />
          <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-foreground/15 -rotate-6" />
          <div className="absolute top-1/2 left-1/4 right-1/4 h-[2px] bg-foreground/20 -rotate-3" />

          {/* Road labels */}
          <span className="absolute top-[22%] left-[10%] text-[10px] text-foreground/40 font-medium">C38</span>
          <span className="absolute top-[48%] left-[28%] text-[10px] text-foreground/40 font-medium">C34</span>
          <span className="absolute top-[30%] left-[60%] text-[10px] text-foreground/40 font-medium">B2</span>

          {/* Place labels */}
          <span className="absolute top-[36%] left-[30%] text-[9px] text-foreground/30">Okaukuejo</span>
          <span className="absolute top-[55%] right-[20%] text-[9px] text-foreground/30">Halali</span>

          {mapPin && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="relative">
                <MapPin size={36} className="text-primary drop-shadow-lg" fill="hsl(var(--primary))" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/20 rounded-full blur-sm" />
              </div>
            </div>
          )}

          {!mapPin && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-foreground/40 bg-card/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                Tap to drop a pin
              </p>
            </div>
          )}

          {/* GPS button */}
          <button className="absolute bottom-20 right-4 w-10 h-10 bg-card rounded-full shadow-md flex items-center justify-center">
            <Navigation size={18} className="text-primary" />
          </button>
        </div>

        {/* Bottom sheet */}
        {mapPin && (
          <div className="bg-card rounded-t-2xl p-4 border-t border-border shadow-lg">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">C34, 2.3km from Okaukuejo</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">-15.9167, 18.8145</p>
                <p className="text-[11px] text-primary mt-1.5 font-medium">↔ Drag pin to adjust location</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} className="text-sm text-foreground font-medium flex items-center gap-1">
          <ArrowLeft size={18} /> {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <span className="text-sm font-semibold text-foreground">Create Post</span>
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className="text-sm font-semibold text-primary disabled:text-muted-foreground"
        >
          {step === 4 ? 'Post' : 'Next'}
        </button>
      </div>

      {/* Progress */}
      <div className="bg-card px-4 py-2 border-b border-border flex-shrink-0">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {/* Step 1: Location */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">Where is the issue?</h2>
            <p className="text-xs text-muted-foreground mb-4">Search for a road or drop a pin on the map</p>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search roads, places..."
                className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
            </div>

            {searchQuery ? (
              <div className="space-y-1 mb-6">
                {searchSuggestions
                  .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(s => (
                    <button
                      key={s}
                      onClick={() => { setLocation(s); setSearchQuery(s); }}
                      className="w-full flex items-center justify-between px-3 py-3 bg-card rounded-lg text-sm text-foreground hover:bg-accent"
                    >
                      <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {s}</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                  ))}
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Searches</h3>
                  {searchSuggestions.slice(0, 3).map(s => (
                    <button
                      key={s}
                      onClick={() => { setLocation(s); setSearchQuery(s); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-foreground"
                    >
                      <span>• {s}</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Popular Routes</h3>
                  {popularRoutes.map(r => (
                    <button
                      key={r}
                      onClick={() => { setLocation(r); setSearchQuery(r); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-foreground"
                    >
                      <span>• {r}</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={() => setShowMap(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground active:scale-[0.98] transition-transform"
            >
              <MapPin size={18} className="text-primary" />
              Drop a pin on the map
            </button>

            {location && (
              <div className="mt-4 p-3 bg-accent rounded-xl flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                <span className="text-sm font-medium text-accent-foreground">{location}</span>
                <button onClick={() => { setLocation(''); setSearchQuery(''); }} className="ml-auto"><X size={14} className="text-muted-foreground" /></button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Condition type */}
        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">What's the condition?</h2>
            <p className="text-xs text-muted-foreground mb-4">Select the type of road condition</p>
            <div className="grid grid-cols-2 gap-3">
              {conditionTypes.map(type => {
                const config = conditionConfig[type];
                const isSelected = conditionType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setConditionType(type)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all active:scale-95 ${
                      isSelected
                        ? 'border-pgn-navy bg-primary shadow-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <span className="text-xl">{config.icon}</span>
                    <span className={`text-sm font-medium ${isSelected ? 'text-pgn-navy' : 'text-foreground'}`}>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Severity + Direction */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">How severe is it?</h2>
            <p className="text-xs text-muted-foreground mb-4">Select severity level</p>
            <div className="space-y-2.5 mb-8">
              {(['severe', 'moderate', 'minor'] as Severity[]).map(sev => {
                const config = severityConfig[sev];
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all active:scale-[0.98] ${
                      isSelected ? 'border-primary bg-accent' : 'border-border bg-card'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${config.dot}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>{config.fullLabel}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="text-base font-semibold text-foreground mb-1">Direction (optional)</h2>
            <p className="text-xs text-muted-foreground mb-4">Which direction is affected?</p>
            <div className="grid grid-cols-3 gap-2">
              {(['north', 'south', 'east', 'west', 'both', 'na'] as Direction[]).map(dir => {
                const config = directionConfig[dir];
                const isSelected = direction === dir;
                return (
                  <button
                    key={dir}
                    onClick={() => setDirection(dir)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all active:scale-95 ${
                      isSelected ? 'border-primary bg-accent' : 'border-border bg-card'
                    }`}
                  >
                    <span className="text-base">{config.icon || '❓'}</span>
                    <p className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                      {dir === 'na' ? 'N/A' : config.label.replace('bound', '')}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Description + Preview */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">Describe the condition</h2>
            <p className="text-xs text-muted-foreground mb-4">Include details like alternative routes, vehicle requirements, expected duration</p>

            <div className="relative mb-2">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, 1000))}
                placeholder="What's happening? Include as much detail as possible..."
                rows={5}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-[11px] text-muted-foreground text-right mb-6">{description.length}/1000</p>

            <h3 className="text-sm font-semibold text-foreground mb-3">Preview</h3>
            <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${severity ? severityConfig[severity].dot : 'bg-border'}`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {(() => {
                      const loc = location || 'Location';
                      const match = loc.match(/^([A-Z]\d+\b)(.*)/);
                      return match ? <><span className="font-bold">{match[1]}</span>{match[2]}</> : loc;
                    })()}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {conditionType && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${conditionConfig[conditionType].bg} ${conditionConfig[conditionType].text}`}>
                        {conditionConfig[conditionType].icon} {conditionConfig[conditionType].label}
                      </span>
                    )}
                    {severity && <span className={`text-[11px] font-medium ${severityConfig[severity].text}`}>{severityConfig[severity].label}</span>}
                    {direction && <span className="text-[11px] text-muted-foreground">{directionConfig[direction].label} {directionConfig[direction].icon}</span>}
                  </div>
                  {description && <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{description}</p>}
                </div>
              </div>
            </div>

            {isOffline && (
              <div className="mt-4 flex items-center gap-2 bg-moderate/10 border border-moderate/20 rounded-xl px-4 py-3">
                <span className="text-sm">⏳</span>
                <p className="text-xs text-foreground">Post will upload when you're back online</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
