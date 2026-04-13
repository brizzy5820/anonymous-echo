import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PenSquare, Sparkles, Lock, Eye, MessageCircle,
  Heart, Ghost, Flame, BookOpen, ThumbsUp, Angry,
  Shield, Users, Bell, Hash, Mic, Search, Zap,
  ArrowRight, Radio, Globe, Send, Share2, Bookmark,
  Star, TrendingUp, PenTool, Smile, Camera, Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

// ── Background icon wallpaper ─────────────────────────────
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
  { Icon: Sparkles,      x: "92%", y: "63%", size: 18, rot: -16 },
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

// Features list
const FEATURES = [
  { Icon: Ghost,         title: "Truly Anonymous",      body: "No real name. No email required. Just a nickname you choose. Your identity is yours." },
  { Icon: Lock,          title: "Secured Identity",     body: "Only your UserID or nickname is visible. Your details are encrypted and never shared." },
  { Icon: MessageCircle, title: "Real Conversations",   body: "Comment, reply, and engage — all anonymously. Say what you actually think." },
  { Icon: Flame,         title: "Trending Posts",       body: "See what's hot on campus right now. The best content rises to the top naturally." },
  { Icon: Bell,          title: "Smart Notifications",  body: "Get notified when someone likes or replies to your post. Stay in the loop." },
  { Icon: Shield,        title: "Safe Community",       body: "Report harmful content. Our admin team reviews everything to keep the space clean." },
];

// Categories preview
const CATS = [
  { Icon: Eye,           label: "Confessions" },
  { Icon: Heart,         label: "Relationships" },
  { Icon: BookOpen,      label: "Academic Stress" },
  { Icon: Flame,         label: "Campus Gist" },
  { Icon: Angry,         label: "Rants" },
  { Icon: ThumbsUp,      label: "Advice" },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── NAV ──────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">
            Free<span className="text-gradient">Express</span>
          </span>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/">
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 gap-1.5">
                  Go to Feed <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80">
                    Sign up free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden">

        {/* Icon wallpaper */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {BG_ICONS.map(({ Icon, x, y, size, rot }, i) => (
            <div key={i} className="absolute" style={{ left: x, top: y, opacity: 0.055, transform: `rotate(${rot}deg)` }}>
              <Icon size={size} strokeWidth={1.3} className="text-foreground" />
            </div>
          ))}
        </div>

        {/* Subtle centre bloom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.03) 0%, transparent 100%)" }}
        />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-card/40 text-muted-foreground text-xs font-semibold mb-6 backdrop-blur-sm">
              <Ghost className="h-3 w-3" />
              Anonymous · Unfiltered · Free
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-[1.05] tracking-tight mb-5">
              Say what you
              <br />
              <span className="text-gradient">actually think.</span>
            </h1>

            {/* Sub */}
            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto">
              An anonymous campus blogging platform. No real name needed.
              Just pick a nickname and speak your truth.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
              <Link to="/">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display text-base h-12 px-6">
                  <PenSquare className="h-4 w-4" />
                  Start Posting Free
                </Button>
              </Link>
              <Link to="/home">
                <Button size="lg" variant="outline" className="border-border/50 gap-2 font-display text-base h-12 px-6">
                  <Eye className="h-4 w-4" />
                  Browse Posts
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {[
                { val: "18K+", label: "Voices" },
                { val: "94K+", label: "Readers" },
                { val: "Zero", label: "Real Names" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{val}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/40">
          <div className="w-px h-10 bg-border/30" />
          <span className="text-[10px] uppercase tracking-widest">scroll</span>
        </div>
      </section>

      {/* ── CATEGORIES STRIP ─────────────────────── */}
      <section className="border-y border-border/30 bg-card/20 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">
            6 Categories
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATS.map(({ Icon, label }) => (
              <Link to="/" key={label}>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-200 group">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                    {label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">How it works</p>
          <h2 className="font-display text-3xl font-bold text-foreground">Three steps. That's it.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", Icon: Ghost,    title: "Pick a nickname",    body: "Choose any nickname. No email, no real name, no profile photo. Completely up to you." },
            { step: "02", Icon: PenSquare, title: "Write your post",   body: "Pick a category, write your post, hit publish. Done. It goes live instantly." },
            { step: "03", Icon: MessageCircle, title: "Get responses", body: "Others read, like, comment — all anonymously. Real conversations, zero identity." },
          ].map(({ step, Icon, title, body }) => (
            <div key={step} className="rounded-xl border border-border/40 bg-card/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 rounded-lg border border-border/50 bg-secondary/50 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-display text-3xl font-bold text-border/40 leading-none">{step}</span>
              </div>
              <p className="font-semibold text-foreground mb-1.5">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────── */}
      <section className="py-12 border-t border-border/30 max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Features</p>
          <h2 className="font-display text-3xl font-bold text-foreground">Built for honest expression.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border/40 bg-card/50 p-5 flex gap-4">
              <div className="w-8 h-8 rounded-lg border border-border/40 bg-secondary/50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="py-20 border-t border-border/30">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Ghost className="h-10 w-10 text-muted-foreground mx-auto mb-5 opacity-30" />
          <h2 className="font-display text-4xl font-bold text-foreground mb-3">
            Ready to speak freely?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            No sign-up required to read. No real name required to post.
            Your identity is always yours.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display">
                <PenSquare className="h-4 w-4" />
                Post Anonymously
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-border/50 gap-2">
                <Sparkles className="h-4 w-4" />
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-border/30 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-sm font-bold text-muted-foreground">
            Free<span className="text-foreground">Express</span>
          </span>
          <p className="text-xs text-muted-foreground">
            Anonymous. Always. © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}