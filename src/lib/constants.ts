import  {Angry, Heart, ThumbsUp,Flame, BookOpen, Eye, HomeIcon} from 'lucide-react'
import { LucideIcon } from 'lucide-react';

type CATEGORY = {
  name: string;
  icon: LucideIcon;
  slug: string;
  description: string;
};
export const CATEGORIES: CATEGORY[] = [
  { name: "Confessions", icon: Eye, slug: "confessions", description: "Let it all out. No judgment." },
  { name: "Relationships", icon: Heart, slug: "relationships", description: "Love, heartbreak, and everything in between." },
  { name: "Academic Stress", icon: BookOpen, slug: "academic-stress", description: "The struggle is real. Share yours." },
  { name: "Campus Gist", icon: Flame, slug: "campus-gist", description: "What's happening around campus?" },
  { name: "Rants", icon: Angry, slug: "rants", description: "Sometimes you just need to vent." },
  { name: "Advice", icon: ThumbsUp, slug: "advice", description: "Ask for help or share your wisdom." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const MOCK_POSTS = [
  {
    id: "1",
    nickname: "ShadowWriter",
    category: "confessions",
    title: "I've been pretending to understand calculus all semester",
    content: "Everyone in my class thinks I'm some math genius because I sit in the front row and nod a lot. The truth? I haven't understood a single lecture since week 2. I just copy notes from the person next to me and pray before every test. This Friday is the final and I'm genuinely terrified.",
    likes: 142,
    comments: 38,
    createdAt: "2026-03-22T10:30:00Z",
  },
  {
    id: "2",
    nickname: "Anonymous_404",
    category: "relationships",
    title: "She smiled at me in the library today",
    content: "I know it sounds silly but she actually looked at me and smiled. We've been studying on the same floor for weeks and today she finally noticed me. I wanted to say hi but I froze. Should I try again tomorrow? What would you say?",
    likes: 89,
    comments: 52,
    createdAt: "2026-03-22T09:15:00Z",
  },
  {
    id: "3",
    nickname: "BurnedOut_Student",
    category: "academic-stress",
    title: "3 assignments, 2 tests, 1 breakdown",
    content: "I haven't slept properly in 4 days. My eyes are burning, my coffee has coffee in it, and I just accidentally submitted my philosophy essay to my chemistry professor. If anyone needs me, I'll be in the library basement questioning my life choices.",
    likes: 231,
    comments: 67,
    createdAt: "2026-03-21T23:45:00Z",
  },
  {
    id: "4",
    nickname: "CampusGhost",
    category: "campus-gist",
    title: "The cafeteria food actually slapped today",
    content: "I don't know who's cooking today but that jollof rice hit different. Like actually seasoned properly. If you're reading this, mystery chef, you're doing God's work. Everyone go to Block C cafeteria before they run out.",
    likes: 178,
    comments: 43,
    createdAt: "2026-03-22T12:00:00Z",
  },
  {
    id: "5",
    nickname: "FedUp_FR",
    category: "rants",
    title: "Why do group projects exist?",
    content: "Please explain to me why I'm doing a 'group' project completely alone. 4 members. 0 responses in the group chat. The deadline is in 3 hours. I've accepted my fate as the one who carries. But I will NEVER forget. Names are being noted. 📝",
    likes: 305,
    comments: 91,
    createdAt: "2026-03-21T18:20:00Z",
  },
  {
    id: "6",
    nickname: "WiseOwl",
    category: "advice",
    title: "Stop comparing your GPA to others",
    content: "Seriously. I spent 2 years feeling worthless because my friends had higher GPAs. Then I graduated and realized nobody at my job has ever asked about it. Focus on learning skills, building connections, and finding what makes YOU excited. The number doesn't define you.",
    likes: 412,
    comments: 76,
    createdAt: "2026-03-20T14:10:00Z",
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: "1", type: "like" as const, message: "ShadowWriter liked your post", read: false, createdAt: "2026-03-22T11:00:00Z" },
  { id: "2", type: "comment" as const, message: 'Anonymous_404 commented: "Same here lol"', read: false, createdAt: "2026-03-22T10:45:00Z" },
  { id: "3", type: "trending" as const, message: "Your post is trending in Rants! 🔥", read: true, createdAt: "2026-03-21T20:00:00Z" },
  { id: "4", type: "like" as const, message: "CampusGhost and 12 others liked your post", read: true, createdAt: "2026-03-21T15:30:00Z" },
];
