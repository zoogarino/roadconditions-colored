import { useEffect, useState } from "react";
import SiteHeader from "@/components/web/SiteHeader";

const RoadConditionsSite = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.title = "Road Conditions Namibia | Pocket Guide Namibia";
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF6EE" }}>
      <SiteHeader isLoggedIn={isLoggedIn} onToggleAccount={() => setIsLoggedIn(v => !v)} />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-pgn-navy">Road Conditions</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Navigation shell only — feed content comes in the next step. Scroll to see the sticky
          header, tap search to expand it, and tap the account control to toggle guest / signed-in.
        </p>
        <div className="h-[140vh]" />
      </main>
    </div>
  );
};

export default RoadConditionsSite;
