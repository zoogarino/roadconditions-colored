import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SiteHeader from "@/components/web/SiteHeader";
import GuidelinesGate from "@/components/web/GuidelinesGate";
import {
  conditionConfig,
  conditionTypes,
  directionConfig,
  severityConfig,
  type ConditionType,
  type Direction,
  type Severity,
} from "@/data/mockData";

const GUIDELINES_KEY = "pgn-web-guidelines-accepted";
const DIRECTIONS: Direction[] = ["north", "south", "east", "west", "both"];
const SEVERITIES: Severity[] = ["severe", "moderate", "minor"];

const label = "block text-xs font-semibold text-pgn-navy mb-1.5";
const fieldStyle = { borderColor: "#E8D9C8", borderRadius: 12 };

const WebCreatePost = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [showGuidelines, setShowGuidelines] = useState(
    () => localStorage.getItem(GUIDELINES_KEY) !== "true",
  );

  const [roadName, setRoadName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [conditionType, setConditionType] = useState<ConditionType | "">("");
  const [severity, setSeverity] = useState<Severity | "">("");
  const [direction, setDirection] = useState<Direction | "">("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    document.title = "Report a Road Condition | Pocket Guide Namibia";
  }, []);

  const descLen = description.trim().length;
  const errors = useMemo(
    () => ({
      roadName: roadName.trim().length === 0,
      conditionType: conditionType === "",
      severity: severity === "",
      description: descLen < 20 || descLen > 500,
    }),
    [roadName, conditionType, severity, descLen],
  );
  const isValid = !Object.values(errors).some(Boolean);

  const acceptGuidelines = () => {
    localStorage.setItem(GUIDELINES_KEY, "true");
    setShowGuidelines(false);
  };

  const submit = () => {
    if (!isValid) return;
    toast.success("Condition posted. Thanks for keeping travellers informed!");
    navigate("/road-conditions");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF6EE" }}>
      <SiteHeader isLoggedIn={isLoggedIn} onToggleAccount={() => setIsLoggedIn(v => !v)} />

      <main className="mx-auto w-full max-w-[640px] px-4 py-8">
        <h1 className="text-xl font-bold text-pgn-navy mb-1">Post a road condition</h1>
        <p className="text-xs text-muted-foreground mb-6">
          Share what you saw so other travellers can plan ahead.
        </p>

        <div
          className="bg-card border p-5 sm:p-6"
          style={{ borderRadius: 16, borderColor: "#E8D9C8", boxShadow: "0 4px 16px rgba(27, 63, 143, 0.10)" }}
        >
          {/* Road name */}
          <div className="mb-4">
            <label className={label} htmlFor="road">
              Road name <span style={{ color: "#D4854A" }}>*</span>
            </label>
            <input
              id="road"
              value={roadName}
              maxLength={40}
              onChange={e => setRoadName(e.target.value)}
              placeholder="e.g. C38"
              className="w-full h-11 px-3.5 border bg-background text-sm text-foreground placeholder:text-pgn-muted outline-none focus:border-primary"
              style={fieldStyle}
            />
          </div>

          {/* Location name */}
          <div className="mb-4">
            <label className={label} htmlFor="location">
              Location name <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="location"
              value={locationName}
              maxLength={60}
              onChange={e => setLocationName(e.target.value)}
              placeholder="e.g. 12 km south of Solitaire"
              className="w-full h-11 px-3.5 border bg-background text-sm text-foreground placeholder:text-pgn-muted outline-none focus:border-primary"
              style={fieldStyle}
            />
          </div>

          {/* Condition type */}
          <div className="mb-4">
            <label className={label} htmlFor="condition">
              Condition type <span style={{ color: "#D4854A" }}>*</span>
            </label>
            <select
              id="condition"
              value={conditionType}
              onChange={e => setConditionType(e.target.value as ConditionType)}
              className="w-full h-11 px-3 border bg-background text-sm text-foreground outline-none focus:border-primary"
              style={fieldStyle}
            >
              <option value="">Select a condition…</option>
              {conditionTypes.map(c => (
                <option key={c} value={c}>
                  {conditionConfig[c].icon} {conditionConfig[c].label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="mb-4">
            <span className={label}>
              Severity <span style={{ color: "#D4854A" }}>*</span>
            </span>
            <div className="grid gap-2 sm:grid-cols-3">
              {SEVERITIES.map(s => (
                <label
                  key={s}
                  className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer border transition-colors"
                  style={{
                    borderRadius: 12,
                    borderColor: severity === s ? "#D4854A" : "#E8D9C8",
                    backgroundColor: severity === s ? "#FFFBF5" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="severity"
                    checked={severity === s}
                    onChange={() => setSeverity(s)}
                    className="accent-primary"
                  />
                  <span className={`w-2 h-2 rounded-full ${severityConfig[s].dot}`} />
                  <span className={`text-[13px] font-semibold ${severityConfig[s].text}`}>
                    {severityConfig[s].label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="mb-4">
            <label className={label} htmlFor="direction">
              Direction <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <select
              id="direction"
              value={direction}
              onChange={e => setDirection(e.target.value as Direction)}
              className="w-full h-11 px-3 border bg-background text-sm text-foreground outline-none focus:border-primary"
              style={fieldStyle}
            >
              <option value="">Not specified</option>
              {DIRECTIONS.map(d => (
                <option key={d} value={d}>
                  {directionConfig[d].label} {directionConfig[d].icon}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className={label} htmlFor="description">
              Description <span style={{ color: "#D4854A" }}>*</span>
            </label>
            <textarea
              id="description"
              value={description}
              maxLength={500}
              rows={5}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you saw — how deep, how passable, and where exactly."
              className="w-full px-3.5 py-3 border bg-background text-sm text-foreground placeholder:text-pgn-muted outline-none focus:border-primary resize-none"
              style={fieldStyle}
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-muted-foreground">
                {descLen < 20 ? `At least 20 characters (${20 - descLen} to go)` : "Looks good"}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: descLen > 500 ? "#DC2626" : "#8B9EB0" }}
              >
                {descLen}/500
              </span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2.5">
            <button
              onClick={() => navigate("/road-conditions")}
              className="flex-1 h-11 rounded-full border text-sm font-semibold text-pgn-navy"
              style={{ borderColor: "#E8D9C8", backgroundColor: "#F5ECD7" }}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!isValid}
              className="flex-1 h-11 rounded-full bg-primary text-pgn-navy text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
            >
              Post Condition
            </button>
          </div>
        </div>
      </main>

      {showGuidelines && (
        <GuidelinesGate onAgree={acceptGuidelines} onDecline={() => navigate("/road-conditions")} />
      )}
    </div>
  );
};

export default WebCreatePost;
