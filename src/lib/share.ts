import type { Post } from "@/data/mockData";
import { conditionConfig, severityConfig } from "@/data/mockData";

export const SHARE_BASE = "www.pocketguidenamibia.com/road-conditions/post";

const severityEmoji: Record<string, string> = {
  severe: "🔴",
  moderate: "🟡",
  minor: "🟢",
};

export const buildShareUrl = (postId: string, source: string) =>
  `${SHARE_BASE}/${postId}?utm_source=${source}&utm_medium=share&utm_campaign=road-conditions`;

export const buildShareText = (post: Post, source: string) => {
  const cond = conditionConfig[post.conditionType];
  const sev = severityConfig[post.severity];
  const emoji = severityEmoji[post.severity] ?? "";
  const headline = `${post.road} - ${sev.label} ${cond.label} ${emoji}`.trim();
  const desc =
    post.description.length > 150
      ? post.description.slice(0, 147).trimEnd() + "..."
      : post.description;
  const url = buildShareUrl(post.id, source);
  return `${headline}\n${desc}\n\nCheck latest reports: ${url}`;
};
