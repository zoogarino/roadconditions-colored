import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";

interface SiteHeaderProps {
  /** Visual toggle only — no real auth yet */
  isLoggedIn?: boolean;
  onToggleAccount?: () => void;
}

const SiteHeader = ({ isLoggedIn = false, onToggleAccount }: SiteHeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ backgroundColor: "#FDF6EE", borderColor: "#E8D9C8" }}
    >
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center gap-3">
        {/* Logo / name */}
        <Link to="/road-conditions" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-pgn-navy font-bold text-sm">
            P
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-pgn-navy text-sm leading-tight">Pocket Guide Namibia</p>
            <p className="text-[10px] text-muted-foreground">Road Conditions</p>
          </div>
        </Link>

        <div className="flex-1 flex justify-end items-center gap-2">
          {/* Inline search */}
          {searchOpen ? (
            <div
              className="flex items-center gap-2 px-3 h-10 rounded-full border bg-card flex-1 max-w-xs"
              style={{ borderColor: "#E8D9C8" }}
            >
              <Search size={15} className="text-pgn-muted shrink-0" />
              <input
                autoFocus
                placeholder="Search roads, e.g. C38"
                className="flex-1 bg-transparent text-sm text-pgn-navy placeholder:text-pgn-muted outline-none"
              />
              <button
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="w-9 h-9 -mr-1.5 rounded-full flex items-center justify-center text-pgn-muted hover:bg-pgn-sand hover:text-pgn-navy transition-colors"
              >
                <X size={15} />
              </button>

            </div>
          ) : (
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full border flex items-center justify-center bg-card text-pgn-navy hover:shadow-sm transition-shadow"
              style={{ borderColor: "#E8D9C8" }}
            >
              <Search size={16} />
            </button>
          )}

          {/* Post condition */}
          <Link
            to="/road-conditions/new"
            className="hidden sm:flex items-center gap-1.5 h-10 px-4 rounded-full bg-primary text-pgn-navy text-sm font-semibold active:opacity-90 hover:shadow-md transition-shadow"
          >
            <Plus size={15} /> Post Condition
          </Link>
          <Link
            to="/road-conditions/new"
            aria-label="Post Condition"
            className="sm:hidden w-10 h-10 rounded-full bg-primary text-pgn-navy flex items-center justify-center"
          >
            <Plus size={17} />
          </Link>

          {/* Account state */}
          {isLoggedIn ? (
            <button
              onClick={onToggleAccount}
              aria-label="Account"
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: "#1B3F8F" }}
            >
              JM
            </button>
          ) : (
            <button
              onClick={onToggleAccount}
              className="h-10 px-3 text-sm font-semibold text-pgn-blue shrink-0"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
