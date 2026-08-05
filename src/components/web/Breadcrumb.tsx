import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  /** Label of the current (non-clickable) page — e.g. the road name. */
  current: string;
}

/** Feed › current-page breadcrumb, matching the Web Fallback View pattern. */
const Breadcrumb = ({ current }: BreadcrumbProps) => (
  <nav aria-label="Breadcrumb">
    <ol
      className="flex items-center gap-1.5 flex-wrap px-3 py-2 rounded-xl border bg-card/60"
      style={{ borderColor: "#E8D9C8" }}
    >
      <li>
        <Link
          to="/road-conditions"
          className="text-[13px] font-semibold text-pgn-blue rounded-sm hover:underline hover:text-pgn-navy transition-colors"
        >
          Road Conditions
        </Link>
      </li>
      <li aria-hidden="true" className="flex items-center text-pgn-muted">
        <ChevronRight size={14} />
      </li>
      <li>
        <span aria-current="page" className="text-[13px] font-semibold text-pgn-navy">
          {current}
        </span>
      </li>
    </ol>
  </nav>
);

export default Breadcrumb;
