import type { Post, PostStatus, Severity } from "@/data/mockData";

const severityWeight: Record<Severity, number> = {
  severe: 10,
  moderate: 5,
  minor: 2,
};

/** Compute lifecycle status from age + confirmations (no override). */
export function computeStatus(post: Post): PostStatus {
  if (post.status === 'resolved' || post.status === 'archived') return post.status;
  const age = post.daysOld ?? 0;
  if (age >= 14 && (post.confirmations ?? 0) === 0) return 'archived';
  if (age >= 8) return 'needs_confirmation';
  return 'active';
}

/** Higher score = higher in feed. */
export function relevanceScore(post: Post): number {
  return (
    severityWeight[post.severity] * 3 +
    (post.confirmations ?? 0) * 2 +
    post.replyCount * 1 -
    (post.daysOld ?? 0) * 0.5
  );
}

/** Posts on the same road, excluding the given post. */
export function getRoadHistory(posts: Post[], post: Post): Post[] {
  const key = post.roadKey ?? post.road;
  return posts
    .filter(p => p.id !== post.id && (p.roadKey ?? p.road) === key)
    .sort((a, b) => (a.daysOld ?? 0) - (b.daysOld ?? 0));
}

/** True when this location has prior resolved/archived posts to surface. */
export function hasRelatedHistory(posts: Post[], post: Post): boolean {
  return getRoadHistory(posts, post).some(
    p => p.status === 'resolved' || p.status === 'archived',
  );
}
