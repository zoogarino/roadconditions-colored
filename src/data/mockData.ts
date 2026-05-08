export type ConditionType = 'flooding' | 'construction' | 'accident' | 'closed' | 'potholes' | 'wildlife' | 'sand' | 'other';
export type Severity = 'severe' | 'moderate' | 'minor';
export type Direction = 'north' | 'south' | 'east' | 'west' | 'both' | 'na';
export type PostStatus = 'active' | 'needs_confirmation' | 'resolved' | 'archived';

export interface Author {
  name: string;
  initials: string;
  color: string;
}

export interface Reply {
  id: string;
  author: Author;
  content: string;
  timeAgo: string;
  replies?: Reply[];
}

export interface Post {
  id: string;
  road: string;
  /** Normalized road key used to group history (e.g. "C38") */
  roadKey?: string;
  location: string;
  conditionType: ConditionType;
  severity: Severity;
  direction: Direction;
  description: string;
  author: Author;
  timeAgo: string;
  /** Days since the post was created (used by lifecycle logic). */
  daysOld: number;
  replyCount: number;
  isPending?: boolean;
  isStale?: boolean;
  status?: PostStatus;
  confirmations?: number;
  /** When status === 'resolved': how many days ago it was resolved. */
  resolvedDaysAgo?: number;
  /** Pinned reference post (admin/PGN team). */
  isPinned?: boolean;
  pinnedBy?: string;
  pinnedSummary?: string;
  pinnedSeasonalUpdates?: number;
  pinnedTitle?: string;
  pinnedMiniReplies?: { name: string; timeAgo: string; content: string }[];
  replies: Reply[];
}

export const conditionConfig: Record<ConditionType, { icon: string; label: string; bg: string; text: string }> = {
  flooding: { icon: '🌊', label: 'Flooding', bg: 'bg-blue-100', text: 'text-blue-700' },
  construction: { icon: '🚧', label: 'Construction', bg: 'bg-orange-100', text: 'text-orange-700' },
  accident: { icon: '🚗', label: 'Accident', bg: 'bg-red-100', text: 'text-red-700' },
  closed: { icon: '⛔', label: 'Road Closed', bg: 'bg-red-100', text: 'text-red-700' },
  potholes: { icon: '🕳️', label: 'Potholes', bg: 'bg-amber-100', text: 'text-amber-700' },
  wildlife: { icon: '🦁', label: 'Wildlife', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  sand: { icon: '🏜️', label: 'Sand/Terrain', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  other: { icon: '⚠️', label: 'Other', bg: 'bg-gray-100', text: 'text-gray-600' },
};

export const severityConfig: Record<Severity, { label: string; fullLabel: string; dot: string; text: string }> = {
  severe: { label: 'Severe', fullLabel: 'Severe - Impassable', dot: 'bg-severe', text: 'text-severe' },
  moderate: { label: 'Moderate', fullLabel: 'Moderate - Use caution', dot: 'bg-moderate', text: 'text-moderate' },
  minor: { label: 'Minor', fullLabel: 'Minor - FYI', dot: 'bg-minor', text: 'text-minor' },
};

export const directionConfig: Record<Direction, { label: string; icon: string }> = {
  north: { label: 'Northbound', icon: '⬆️' },
  south: { label: 'Southbound', icon: '⬇️' },
  east: { label: 'Eastbound', icon: '➡️' },
  west: { label: 'Westbound', icon: '⬅️' },
  both: { label: 'Both directions', icon: '↕️' },
  na: { label: 'N/A', icon: '' },
};

export const conditionTypes: ConditionType[] = ['flooding', 'construction', 'accident', 'closed', 'potholes', 'wildlife', 'sand', 'other'];

export const mockPosts: Post[] = [
  // Pinned reference post (PGN Team)
  {
    id: 'pin-c34',
    road: 'C34 Seasonal Sand Conditions',
    roadKey: 'C34',
    location: 'Skeleton Coast route',
    conditionType: 'sand',
    severity: 'moderate',
    direction: 'both',
    description: 'The C34 between Solitaire and Sesriem experiences deep sand drifts during winter months (May-August). 4x4 with high clearance recommended.',
    author: { name: 'PGN Team', initials: 'PG', color: 'bg-pgn-blue' },
    timeAgo: 'Pinned',
    daysOld: 60,
    replyCount: 23,
    status: 'active',
    isPinned: true,
    pinnedBy: 'PGN Team',
    pinnedTitle: 'C34 Seasonal Sand Conditions',
    pinnedSummary: 'Sarah K. • 2 days ago — Sand very deep at km 78. Deflated to 1.2 bar.',
    pinnedSeasonalUpdates: 23,
    pinnedMiniReplies: [
      { name: 'Sarah K.', timeAgo: '2 days ago', content: 'Sand very deep at km 78. Deflated to 1.2 bar.' },
      { name: 'Mike T.', timeAgo: '1 week ago', content: 'Passable but slow going. Took 90 minutes extra.' },
    ],
    replies: [],
  },
  {
    id: '1',
    road: 'C38 near Okaukuejo',
    roadKey: 'C38',
    location: 'Etosha National Park',
    conditionType: 'flooding',
    severity: 'severe',
    direction: 'both',
    description: 'Heavy rains between Okaukuejo and Halali. Road completely washed away at the riverbed crossing. 4x4 vehicles stuck, recovery team called. Avoid this section entirely.',
    author: { name: 'Gerd Byron', initials: 'GB', color: 'bg-blue-500' },
    timeAgo: '2 days ago',
    daysOld: 2,
    replyCount: 5,
    status: 'active',
    confirmations: 0,
    replies: [
      {
        id: 'r1',
        author: { name: 'John Smith', initials: 'JS', color: 'bg-emerald-500' },
        content: 'Most years this road gets washed away, and then repaired by August. Regardless of the state of repairs, 4x4 is always recommended for this stretch.',
        timeAgo: '3 hours ago',
        replies: [
          {
            id: 'r1a',
            author: { name: 'Sarah Keller', initials: 'SK', color: 'bg-purple-500' },
            content: '@John I agree, usually cleared by August. The Parks Board has been good about repairs lately.',
            timeAgo: '2 hours ago',
          },
        ],
      },
      {
        id: 'r2',
        author: { name: 'Mike Thompson', initials: 'MT', color: 'bg-orange-500' },
        content: 'I was there last week. Still completely impassable. The water level hasn\'t dropped at all. Take the alternative route via C35 instead.',
        timeAgo: '1 day ago',
      },
      {
        id: 'r3',
        author: { name: 'Lisa van der Berg', initials: 'LV', color: 'bg-pink-500' },
        content: 'Thanks for the update! We rerouted through Anderson Gate and it was fine. Added about 45 minutes to our journey.',
        timeAgo: '1 day ago',
      },
    ],
  },
  {
    id: '2',
    road: 'B2 at Karibib',
    roadKey: 'B2',
    location: 'Windhoek to Swakopmund',
    conditionType: 'construction',
    severity: 'moderate',
    direction: 'east',
    description: 'Road work delays of approximately 20 minutes. Single lane traffic with stop-go control. Expected to continue until end of March.',
    author: { name: 'Anna Mueller', initials: 'AM', color: 'bg-teal-500' },
    timeAgo: '5 hours ago',
    daysOld: 0,
    replyCount: 2,
    status: 'active',
    replies: [
      {
        id: 'r4',
        author: { name: 'Peter Schultz', initials: 'PS', color: 'bg-indigo-500' },
        content: 'Can confirm, we waited about 25 minutes. The workers are very helpful though.',
        timeAgo: '3 hours ago',
      },
    ],
  },
  {
    id: '3',
    road: 'D826 Sossusvlei entrance',
    roadKey: 'D826',
    location: 'Namib-Naukluft Park',
    conditionType: 'sand',
    severity: 'minor',
    direction: 'both',
    description: 'Sand drifts across the road near the Sesriem canyon turnoff. All vehicles can pass but reduce speed. Beautiful driving conditions otherwise.',
    author: { name: 'Hans Becker', initials: 'HB', color: 'bg-amber-600' },
    timeAgo: '9 days ago',
    daysOld: 9,
    replyCount: 8,
    isStale: true,
    status: 'needs_confirmation',
    confirmations: 2,
    replies: [
      {
        id: 'r5',
        author: { name: 'Emma Wilson', initials: 'EW', color: 'bg-rose-500' },
        content: 'We drove through yesterday, the sand has been partially cleared. Still bumpy but no issues with a normal sedan.',
        timeAgo: '3 days ago',
      },
    ],
  },
  {
    id: '4',
    road: 'B1 Windhoek–Okahandja',
    roadKey: 'B1',
    location: 'Central Namibia',
    conditionType: 'potholes',
    severity: 'moderate',
    direction: 'north',
    description: 'Multiple potholes on the northbound lane between Brakwater and Okahandja. Particularly bad near the Elephant Junction turnoff.',
    author: { name: 'David Nghimtina', initials: 'DN', color: 'bg-cyan-600' },
    timeAgo: '3 days ago',
    daysOld: 3,
    replyCount: 1,
    status: 'active',
    replies: [],
  },
  {
    id: '5',
    road: 'D3901 Sesriem',
    roadKey: 'D3901',
    location: 'Southern Namibia',
    conditionType: 'closed',
    severity: 'severe',
    direction: 'both',
    description: 'Road completely closed due to flash flooding. No vehicles can pass. NamWater has placed barriers. Use C27 as alternative.',
    author: { name: 'René Joubert', initials: 'RJ', color: 'bg-red-500' },
    timeAgo: '6 hours ago',
    daysOld: 0,
    replyCount: 0,
    status: 'active',
    replies: [],
  },
  {
    id: '6',
    road: 'C27 near Solitaire',
    roadKey: 'C27',
    location: 'Central Namib',
    conditionType: 'wildlife',
    severity: 'minor',
    direction: 'both',
    description: 'Large herd of oryx crossing the road regularly near Solitaire bakery turnoff. Drive carefully, especially at dawn and dusk.',
    author: { name: 'Katja Brandt', initials: 'KB', color: 'bg-green-600' },
    timeAgo: '4 days ago',
    daysOld: 4,
    replyCount: 3,
    status: 'active',
    replies: [
      {
        id: 'r6',
        author: { name: 'Tom Ellis', initials: 'TE', color: 'bg-slate-500' },
        content: 'Saw them this morning! At least 30 oryx. They were right on the road for about 10 minutes. Amazing sight.',
        timeAgo: '2 days ago',
      },
    ],
  },
  {
    id: '7',
    road: 'D707 Fish River',
    roadKey: 'D707',
    location: 'Southern Namibia',
    conditionType: 'construction',
    severity: 'moderate',
    direction: 'south',
    description: 'Bridge repairs underway. One-lane traffic over temporary bridge. Flagmen controlling traffic flow.',
    author: { name: 'You', initials: 'ME', color: 'bg-primary' },
    timeAgo: 'Just now',
    daysOld: 0,
    replyCount: 0,
    isPending: true,
    status: 'active',
    replies: [],
  },
  {
    id: '8',
    road: 'C35 Etosha eastern gate',
    roadKey: 'C35',
    location: 'Namutoni, Etosha',
    conditionType: 'flooding',
    severity: 'moderate',
    direction: 'west',
    description: 'Standing water on road between Von Lindequist Gate and Namutoni camp. 4x4 recommended but 2WD can pass slowly.',
    author: { name: 'Frieda Shikongo', initials: 'FS', color: 'bg-violet-500' },
    timeAgo: '12 days ago',
    daysOld: 12,
    replyCount: 4,
    isStale: true,
    status: 'needs_confirmation',
    confirmations: 0,
    replies: [
      {
        id: 'r7',
        author: { name: 'Mark van Wyk', initials: 'MV', color: 'bg-sky-500' },
        content: 'Update: water level has dropped significantly. All vehicles can now pass without issue.',
        timeAgo: '2 days ago',
        replies: [
          {
            id: 'r7a',
            author: { name: 'Frieda Shikongo', initials: 'FS', color: 'bg-violet-500' },
            content: '@Mark Thanks for the update! Good to know it\'s improving.',
            timeAgo: '1 day ago',
          },
        ],
      },
    ],
  },
  // Resolved posts (for Resolved tab + road history)
  {
    id: 'res-1',
    road: 'C38 near Okaukuejo',
    roadKey: 'C38',
    location: 'Etosha National Park',
    conditionType: 'flooding',
    severity: 'severe',
    direction: 'both',
    description: 'Earlier flooding event from March rains. Road was impassable for ~13 days then cleared by Parks Board.',
    author: { name: 'Lisa van der Berg', initials: 'LV', color: 'bg-pink-500' },
    timeAgo: 'Resolved 3 days ago',
    daysOld: 16,
    replyCount: 8,
    status: 'resolved',
    resolvedDaysAgo: 3,
    replies: [],
  },
  {
    id: 'res-2',
    road: 'B2 at Usakos',
    roadKey: 'B2',
    location: 'Erongo region',
    conditionType: 'accident',
    severity: 'moderate',
    direction: 'both',
    description: 'Tanker accident cleared. Road fully reopened.',
    author: { name: 'Peter Schultz', initials: 'PS', color: 'bg-indigo-500' },
    timeAgo: 'Resolved 6 days ago',
    daysOld: 9,
    replyCount: 4,
    status: 'resolved',
    resolvedDaysAgo: 6,
    replies: [],
  },
  {
    id: 'res-3',
    road: 'D826 Sossusvlei',
    roadKey: 'D826',
    location: 'Namib-Naukluft Park',
    conditionType: 'sand',
    severity: 'minor',
    direction: 'both',
    description: 'Sand drifts cleared by parks team. Road back to normal.',
    author: { name: 'Hans Becker', initials: 'HB', color: 'bg-amber-600' },
    timeAgo: 'Resolved 1 week ago',
    daysOld: 14,
    replyCount: 6,
    status: 'resolved',
    resolvedDaysAgo: 7,
    replies: [],
  },
  {
    id: 'res-4',
    road: 'C27 near Solitaire',
    roadKey: 'C27',
    location: 'Central Namib',
    conditionType: 'wildlife',
    severity: 'minor',
    direction: 'both',
    description: 'Oryx herd has moved on. No further wildlife sightings on the road.',
    author: { name: 'Katja Brandt', initials: 'KB', color: 'bg-green-600' },
    timeAgo: 'Resolved 3 days ago',
    daysOld: 7,
    replyCount: 2,
    status: 'resolved',
    resolvedDaysAgo: 3,
    replies: [],
  },
  // Archived posts (for All tab + road history)
  {
    id: 'arc-1',
    road: 'C38 near Okaukuejo',
    roadKey: 'C38',
    location: 'Etosha National Park',
    conditionType: 'flooding',
    severity: 'minor',
    direction: 'both',
    description: 'Brief flooding in January, cleared on its own within 2 days.',
    author: { name: 'Hans Becker', initials: 'HB', color: 'bg-amber-600' },
    timeAgo: '18 days ago',
    daysOld: 18,
    replyCount: 3,
    status: 'archived',
    replies: [],
  },
];

export const searchSuggestions = [
  'C34 near Okaukuejo',
  'B1 Windhoek',
  'Etosha entrance',
  'B2 Swakopmund',
  'D826 Sossusvlei',
  'C27 Solitaire',
];

export const popularRoutes = [
  'C38 Etosha Circuit',
  'B2 Windhoek to Swakopmund',
  'D826 Sossusvlei',
  'B1 Windhoek to Okahandja',
  'C34 Kamanjab to Palmwag',
];
