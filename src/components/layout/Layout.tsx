import { Navbar } from "./Navbar";
import { MobileBottomNav } from "./MobileBottomNav";
import {
  MessageCircle, Heart, BookOpen, Eye, ThumbsUp,
  Angry, Shield, Ghost, Lock, Users, Bell, Hash,
  Mic, Search, Zap, Radio, Globe, Send, Share2,
  Bookmark, Star, TrendingUp, PenTool, Smile,
  Camera, Repeat, Flame, Sparkle,
} from "lucide-react";

// Fixed positions — same pattern across every page
const BG_ICONS = [
  { Icon: MessageCircle, x: "6%",  y: "10%", size: 26, rot: -15 },
  { Icon: Heart,         x: "20%", y: "4%",  size: 18, rot: 12  },
  { Icon: Ghost,         x: "36%", y: "16%", size: 22, rot: -8  },
  { Icon: Lock,          x: "53%", y: "7%",  size: 16, rot: 20  },
  { Icon: BookOpen,      x: "68%", y: "13%", size: 20, rot: -5  },
  { Icon: Eye,           x: "83%", y: "5%",  size: 18, rot: 10  },
  { Icon: Flame,         x: "91%", y: "20%", size: 24, rot: -12 },
  { Icon: Shield,        x: "4%",  y: "38%", size: 16, rot: 8   },
  { Icon: ThumbsUp,      x: "13%", y: "53%", size: 20, rot: -18 },
  { Icon: Users,         x: "27%", y: "43%", size: 18, rot: 15  },
  { Icon: Mic,           x: "44%", y: "58%", size: 16, rot: -6  },
  { Icon: Bell,          x: "59%", y: "46%", size: 20, rot: 22  },
  { Icon: Hash,          x: "74%", y: "53%", size: 18, rot: -14 },
  { Icon: Radio,         x: "87%", y: "40%", size: 22, rot: 5   },
  { Icon: Angry,         x: "2%",  y: "70%", size: 18, rot: -10 },
  { Icon: Search,        x: "17%", y: "78%", size: 16, rot: 16  },
  { Icon: MessageCircle, x: "34%", y: "73%", size: 24, rot: -20 },
  { Icon: Heart,         x: "49%", y: "80%", size: 18, rot: 8   },
  { Icon: Ghost,         x: "64%", y: "68%", size: 20, rot: -4  },
  { Icon: Lock,          x: "79%", y: "76%", size: 16, rot: 12  },
  { Icon: Sparkle,       x: "92%", y: "63%", size: 18, rot: -16 },
  { Icon: Zap,           x: "9%",  y: "90%", size: 16, rot: 6   },
  { Icon: BookOpen,      x: "47%", y: "90%", size: 18, rot: -8  },
  { Icon: Shield,        x: "77%", y: "88%", size: 16, rot: 14  },
  { Icon: Share2,        x: "72%", y: "45%", size: 20, rot: 12  },
  { Icon: Send,          x: "85%", y: "75%", size: 18, rot: -10 },
  { Icon: Hash,          x: "15%", y: "25%", size: 22, rot: 8   },
  { Icon: Camera,        x: "30%", y: "70%", size: 19, rot: 14  },
  { Icon: Star,          x: "94%", y: "40%", size: 24, rot: 5   },
  { Icon: Repeat,        x: "2%",  y: "55%", size: 16, rot: -20 },
  { Icon: PenTool,       x: "50%", y: "35%", size: 18, rot: 15  },
  { Icon: Smile,         x: "78%", y: "28%", size: 22, rot: -8  },
  { Icon: Globe,         x: "40%", y: "5%",  size: 17, rot: 10  },
  { Icon: TrendingUp,    x: "65%", y: "60%", size: 20, rot: 6   },
  { Icon: Bookmark,      x: "12%", y: "80%", size: 18, rot: -12 },
  { Icon: Radio,         x: "87%", y: "40%", size: 22, rot: 5   },
  { Icon: Angry,         x: "2%",  y: "70%", size: 18, rot: -10 },
  { Icon: Search,        x: "17%", y: "78%", size: 16, rot: 16  },
  { Icon: MessageCircle, x: "34%", y: "73%", size: 24, rot: -20 },
  { Icon: Heart,         x: "49%", y: "80%", size: 18, rot: 8   },
  { Icon: Ghost,         x: "64%", y: "68%", size: 20, rot: -4  },
  { Icon: Lock,          x: "79%", y: "76%", size: 16, rot: 12  },
  { Icon: Sparkle,       x: "92%", y: "63%", size: 18, rot: -16 },
  { Icon: Zap,           x: "9%",  y: "90%", size: 16, rot: 6   },
  { Icon: BookOpen,      x: "47%", y: "90%", size: 18, rot: -8  },
  { Icon: Shield,        x: "77%", y: "88%", size: 16, rot: 14  },
  { Icon: Share2,        x: "72%", y: "45%", size: 20, rot: 12  },
  { Icon: Send,          x: "85%", y: "75%", size: 18, rot: -10 },
  { Icon: Hash,          x: "15%", y: "25%", size: 22, rot: 8   },
  { Icon: Camera,        x: "30%", y: "70%", size: 19, rot: 14  },
  { Icon: Star,          x: "94%", y: "40%", size: 24, rot: 5   },
  { Icon: Repeat,        x: "2%",  y: "55%", size: 16, rot: -20 },
  { Icon: PenTool,       x: "50%", y: "35%", size: 18, rot: 15  },
  { Icon: Smile,         x: "78%", y: "28%", size: 22, rot: -8  },
  { Icon: Globe,         x: "40%", y: "5%",  size: 17, rot: 10  },
  { Icon: TrendingUp,    x: "65%", y: "60%", size: 20, rot: 6   },
  { Icon: Bookmark,      x: "12%", y: "80%", size: 18, rot: -12 },
  { Icon: Radio,         x: "87%", y: "40%", size: 22, rot: 5   },
  { Icon: Angry,         x: "2%",  y: "70%", size: 18, rot: -10 },
  { Icon: Search,        x: "17%", y: "78%", size: 16, rot: 16  },
  { Icon: MessageCircle, x: "34%", y: "73%", size: 24, rot: -20 },
  { Icon: Heart,         x: "49%", y: "80%", size: 18, rot: 8   },
  { Icon: Ghost,         x: "64%", y: "68%", size: 20, rot: -4  },
  { Icon: Lock,          x: "79%", y: "76%", size: 16, rot: 12  },
  { Icon: Sparkle,       x: "92%", y: "63%", size: 18, rot: -16 },
  { Icon: Zap,           x: "9%",  y: "90%", size: 16, rot: 6   },
  { Icon: BookOpen,      x: "47%", y: "90%", size: 18, rot: -8  },
  { Icon: Shield,        x: "77%", y: "88%", size: 16, rot: 14  },
  { Icon: Share2,        x: "72%", y: "45%", size: 20, rot: 12  },
  { Icon: Send,          x: "85%", y: "75%", size: 18, rot: -10 },
  { Icon: Hash,          x: "15%", y: "25%", size: 22, rot: 8   },
  { Icon: Camera,        x: "30%", y: "70%", size: 19, rot: 14  },
  { Icon: Star,          x: "94%", y: "40%", size: 24, rot: 5   },
  { Icon: Repeat,        x: "2%",  y: "55%", size: 16, rot: -20 },
  { Icon: PenTool,       x: "50%", y: "35%", size: 18, rot: 15  },
  { Icon: Smile,         x: "78%", y: "28%", size: 22, rot: -8  },
  { Icon: Globe,         x: "40%", y: "5%",  size: 17, rot: 10  },
  { Icon: TrendingUp,    x: "65%", y: "60%", size: 20, rot: 6   },
  { Icon: Bookmark,      x: "12%", y: "80%", size: 18, rot: -12 },
  { Icon: Radio,         x: "87%", y: "40%", size: 22, rot: 5   },
  { Icon: Angry,         x: "2%",  y: "70%", size: 18, rot: -10 },
  { Icon: Search,        x: "17%", y: "78%", size: 16, rot: 16  },
  { Icon: MessageCircle, x: "34%", y: "73%", size: 24, rot: -20 },
  { Icon: Heart,         x: "49%", y: "80%", size: 18, rot: 8   },
  { Icon: Ghost,         x: "64%", y: "68%", size: 20, rot: -4  },
  { Icon: Lock,          x: "79%", y: "76%", size: 16, rot: 12  },
  { Icon: Sparkle,       x: "92%", y: "63%", size: 18, rot: -16 },
  { Icon: Zap,           x: "9%",  y: "90%", size: 16, rot: 6   },
  { Icon: BookOpen,      x: "47%", y: "90%", size: 18, rot: -8  },
  { Icon: Shield,        x: "77%", y: "88%", size: 16, rot: 14  },
  { Icon: Share2,        x: "72%", y: "45%", size: 20, rot: 12  },
  { Icon: Send,          x: "85%", y: "75%", size: 18, rot: -10 },
  { Icon: Hash,          x: "15%", y: "25%", size: 22, rot: 8   },
  { Icon: Camera,        x: "30%", y: "70%", size: 19, rot: 14  },
  { Icon: Star,          x: "94%", y: "40%", size: 24, rot: 5   },
  { Icon: Repeat,        x: "2%",  y: "55%", size: 16, rot: -20 },
  { Icon: PenTool,       x: "50%", y: "35%", size: 18, rot: 15  },
  { Icon: Smile,         x: "78%", y: "28%", size: 22, rot: -8  },
  { Icon: Globe,         x: "40%", y: "5%",  size: 17, rot: 10  },
  { Icon: TrendingUp,    x: "65%", y: "60%", size: 20, rot: 6   },
  { Icon: Bookmark,      x: "12%", y: "80%", size: 18, rot: -12 },
  { Icon: Radio,         x: "87%", y: "40%", size: 22, rot: 5   },
  { Icon: Angry,         x: "2%",  y: "70%", size: 18, rot: -10 },
  { Icon: Search,        x: "17%", y: "78%", size: 16, rot: 16  },
  { Icon: MessageCircle, x: "34%", y: "73%", size: 24, rot: -20 },
  { Icon: Heart,         x: "49%", y: "80%", size: 18, rot: 8   },
  { Icon: Ghost,         x: "64%", y: "68%", size: 20, rot: -4  },
  { Icon: Lock,          x: "79%", y: "76%", size: 16, rot: 12  },
  { Icon: Sparkle,       x: "92%", y: "63%", size: 18, rot: -16 },
  { Icon: Zap,           x: "9%",  y: "90%", size: 16, rot: 6   },
  { Icon: BookOpen,      x: "47%", y: "90%", size: 18, rot: -8  },
  { Icon: Shield,        x: "77%", y: "88%", size: 16, rot: 14  },
  { Icon: Share2,        x: "72%", y: "45%", size: 20, rot: 12  },
  { Icon: Send,          x: "85%", y: "75%", size: 18, rot: -10 },
  { Icon: Hash,          x: "15%", y: "25%", size: 22, rot: 8   },
  { Icon: Camera,        x: "30%", y: "70%", size: 19, rot: 14  },
  { Icon: Star,          x: "94%", y: "40%", size: 24, rot: 5   },
  { Icon: Repeat,        x: "2%",  y: "55%", size: 16, rot: -20 },
  { Icon: PenTool,       x: "50%", y: "35%", size: 18, rot: 15  },
  { Icon: Smile,         x: "78%", y: "28%", size: 22, rot: -8  },
  { Icon: Globe,         x: "40%", y: "5%",  size: 17, rot: 10  },
  { Icon: TrendingUp,    x: "65%", y: "60%", size: 20, rot: 6   },
  { Icon: Bookmark,      x: "12%", y: "80%", size: 18, rot: -12 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative">

      {/* ── Global scattered icon background ──
          position: fixed so it stays behind everything
          even as the user scrolls
          pointer-events: none so it never blocks clicks
          z-index: 0 so navbar and content sit above it   */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
        {BG_ICONS.map(({ Icon, x, y, size, rot }, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: x,
              top: y,
              opacity: 0.04,              // very dim — just texture
              transform: `rotate(${rot}deg)`,
            }}
          >
            <Icon size={size} strokeWidth={1.3} className="text-foreground" />
          </div>
        ))}
      </div>

      {/* All page content sits above the background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pb-20 sm:pb-0">{children}</main>
        <MobileBottomNav />
      </div>

    </div>
  );
}