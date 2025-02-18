export interface Event {
  id: number;
  title: string;
  date: string;
  description?: string;
  color?: string;
  timezone?: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "New Year 2026",
    date: "2026-01-01T00:00:00+08:00",
    description: "Countdown to 2026!",
    color: "from-blue-500 to-purple-600 bg-gradient-to-br",
    timezone: "Asia/Singapore"
  },
  {
    id: 2,
    title: "Summer Break",
    date: "2025-06-01T00:00:00+08:00",
    description: "Time for summer vacation!",
    color: "from-orange-400 to-pink-500 bg-gradient-to-br",
    timezone: "Asia/Singapore"
  },
  {
    id: 3,
    title: "Christmas 2025",
    date: "2025-12-25T00:00:00+08:00",
    description: "Ho ho ho!",
    color: "from-red-500 to-green-500 bg-gradient-to-br",
    timezone: "Asia/Singapore"
  }
];
