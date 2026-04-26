export type ConditionType = 'flooding' | 'construction' | 'accident' | 'closed' | 'potholes' | 'wildlife' | 'sand' | 'other';
export type Severity = 'severe' | 'moderate' | 'minor';
export type Direction = 'north' | 'south' | 'east' | 'west' | 'both' | 'na';

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
  location: string;
  conditionType: ConditionType;
  severity: Severity;
  direction: Direction;
  description: string;
  author: Author;
  timeAgo: string;
  replyCount: number;
  isPending?: boolean;
  isStale?: boolean;
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
  {
    id: '1',
    road: 'C38 near Okaukuejo',
    location: 'Etosha National Park',
    conditionType: 'flooding',
    severity: 'severe',
    direction: 'both',
    description: 'Heavy rains between Okaukuejo and Halali. Road completely washed away at the riverbed crossing. 4x4 vehicles stuck, recovery team called. Avoid this section entirely.',
    author: { name: 'Gerd Byron', initials: 'GB', color: 'bg-blue-500' },
    timeAgo: '2 days ago',
    replyCount: 5,
    isStale: false,
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
    location: 'Windhoek to Swakopmund',
    conditionType: 'construction',
    severity: 'moderate',
    direction: 'east',
    description: 'Road work delays of approximately 20 minutes. Single lane traffic with stop-go control. Expected to continue until end of March.',
    author: { name: 'Anna Mueller', initials: 'AM', color: 'bg-teal-500' },
    timeAgo: '5 hours ago',
    replyCount: 2,
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
    location: 'Namib-Naukluft Park',
    conditionType: 'sand',
    severity: 'minor',
    direction: 'both',
    description: 'Sand drifts across the road near the Sesriem canyon turnoff. All vehicles can pass but reduce speed. Beautiful driving conditions otherwise.',
    author: { name: 'Hans Becker', initials: 'HB', color: 'bg-amber-600' },
    timeAgo: '1 week ago',
    replyCount: 8,
    isStale: true,
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
    location: 'Central Namibia',
    conditionType: 'potholes',
    severity: 'moderate',
    direction: 'north',
    description: 'Multiple potholes on the northbound lane between Brakwater and Okahandja. Particularly bad near the Elephant Junction turnoff.',
    author: { name: 'David Nghimtina', initials: 'DN', color: 'bg-cyan-600' },
    timeAgo: '3 days ago',
    replyCount: 1,
    replies: [],
  },
  {
    id: '5',
    road: 'D3901 Sesriem',
    location: 'Southern Namibia',
    conditionType: 'closed',
    severity: 'severe',
    direction: 'both',
    description: 'Road completely closed due to flash flooding. No vehicles can pass. NamWater has placed barriers. Use C27 as alternative.',
    author: { name: 'René Joubert', initials: 'RJ', color: 'bg-red-500' },
    timeAgo: '6 hours ago',
    replyCount: 0,
    replies: [],
  },
  {
    id: '6',
    road: 'C27 near Solitaire',
    location: 'Central Namib',
    conditionType: 'wildlife',
    severity: 'minor',
    direction: 'both',
    description: 'Large herd of oryx crossing the road regularly near Solitaire bakery turnoff. Drive carefully, especially at dawn and dusk.',
    author: { name: 'Katja Brandt', initials: 'KB', color: 'bg-green-600' },
    timeAgo: '4 days ago',
    replyCount: 3,
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
    location: 'Southern Namibia',
    conditionType: 'construction',
    severity: 'moderate',
    direction: 'south',
    description: 'Bridge repairs underway. One-lane traffic over temporary bridge. Flagmen controlling traffic flow.',
    author: { name: 'You', initials: 'ME', color: 'bg-primary' },
    timeAgo: 'Just now',
    replyCount: 0,
    isPending: true,
    replies: [],
  },
  {
    id: '8',
    road: 'C35 Etosha eastern gate',
    location: 'Namutoni, Etosha',
    conditionType: 'flooding',
    severity: 'moderate',
    direction: 'west',
    description: 'Standing water on road between Von Lindequist Gate and Namutoni camp. 4x4 recommended but 2WD can pass slowly.',
    author: { name: 'Frieda Shikongo', initials: 'FS', color: 'bg-violet-500' },
    timeAgo: '8 days ago',
    replyCount: 4,
    isStale: true,
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
