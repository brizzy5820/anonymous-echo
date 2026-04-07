import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { CategoryPill } from "@/components/CategoryPill";
import { CATEGORIES } from "@/lib/constants";
import {
  PenSquare, TrendingUp, Sparkles, Sparkle,
  ChevronLeft, ChevronRight, Flame, Lightbulb,
  Star, Zap, MessageCircle, Heart, BookOpen,
  Eye, ThumbsUp, Angry, Shield, Ghost, Lock,
  Users, Bell, Search, Hash, Radio, Mic, Loader,Send, Share2, Camera, Repeat, PenTool, Smile, Globe, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchPosts } from "@/lib/posts";
import { Post } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ── Scattered icon wallpaper ───────────────────────────────
// Fixed positions, low opacity — creates a WhatsApp-style
// icon texture on the hero without any color/gradient
const BG_ICONS = [
  { Icon: MessageCircle, x: "6%", y: "10%", size: 26, rot: -15 },
  { Icon: Heart, x: "20%", y: "4%", size: 18, rot: 12 },
  { Icon: Ghost, x: "36%", y: "16%", size: 22, rot: -8 },
  { Icon: Lock, x: "53%", y: "7%", size: 16, rot: 20 },
  { Icon: BookOpen, x: "68%", y: "13%", size: 20, rot: -5 },
  { Icon: Eye, x: "83%", y: "5%", size: 18, rot: 10 },
  { Icon: Flame, x: "91%", y: "20%", size: 24, rot: -12 },
  { Icon: Shield, x: "4%", y: "38%", size: 16, rot: 8 },
  { Icon: ThumbsUp, x: "13%", y: "53%", size: 20, rot: -18 },
  { Icon: Users, x: "27%", y: "43%", size: 18, rot: 15 },
  { Icon: Mic, x: "44%", y: "58%", size: 16, rot: -6 },
  { Icon: Bell, x: "59%", y: "46%", size: 20, rot: 22 },
  { Icon: Hash, x: "74%", y: "53%", size: 18, rot: -14 },
  { Icon: Radio, x: "87%", y: "40%", size: 22, rot: 5 },
  { Icon: Angry, x: "2%", y: "70%", size: 18, rot: -10 },
  { Icon: Search, x: "17%", y: "78%", size: 16, rot: 16 },
  { Icon: MessageCircle, x: "34%", y: "73%", size: 24, rot: -20 },
  { Icon: Heart, x: "49%", y: "80%", size: 18, rot: 8 },
  { Icon: Ghost, x: "64%", y: "68%", size: 20, rot: -4 },
  { Icon: Lock, x: "79%", y: "76%", size: 16, rot: 12 },
  { Icon: Sparkle, x: "92%", y: "63%", size: 18, rot: -16 },
  { Icon: Zap, x: "9%", y: "90%", size: 16, rot: 6 },
  { Icon: BookOpen, x: "47%", y: "90%", size: 18, rot: -8 },
  { Icon: Shield, x: "77%", y: "88%", size: 16, rot: 14 },

  { Icon: Share2, x: "72%", y: "45%", size: 20, rot: 12 },   
  { Icon: Send, x: "85%", y: "75%", size: 18, rot: -10 },    
  { Icon: Hash, x: "15%", y: "25%", size: 22, rot: 8 },      
  { Icon: Bell, x: "60%", y: "82%", size: 16, rot: -15 },    
  { Icon: Camera, x: "30%", y: "70%", size: 19, rot: 14 },   
  { Icon: Star, x: "94%", y: "40%", size: 24, rot: 5 },      
  { Icon: Repeat, x: "2%", y: "65%", size: 16, rot: -20 },   
  { Icon: PenTool, x: "50%", y: "35%", size: 18, rot: 15 },  
  { Icon: Smile, x: "78%", y: "28%", size: 22, rot: -8 },    
  { Icon: Globe, x: "40%", y: "5%", size: 17, rot: 10 },     
  { Icon: TrendingUp, x: "65%", y: "60%", size: 20, rot: 6 }, 
  { Icon: Bookmark, x: "12%", y: "80%", size: 18, rot: -12 }  
];

function ScatteredIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {BG_ICONS.map(({ Icon, x, y, size, rot }, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: x, top: y, opacity: 0.2, transform: `rotate(${rot}deg)` }}
        >
          <Icon size={size} strokeWidth={1.4} className="text-foreground" />
        </div>
      ))}
    </div>
  );
}

// ── Hero slides ────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: "top",
    badge: "Top Chat of the Week",
    BadgeIcon: Star,
    title: "Speak Freely.",
    accent: "Stay Unknown.",
    sub: "Share your thoughts, confessions, and campus stories — no account needed. Pick a nickname and let it out.",
    cta: "Start Writing",
    CtaIcon: PenSquare,
    ctaLink: "/create",
    stats: [
      { val: "18K+", label: "Voices" },
      { val: "94K+", label: "Readers" },
      { val: "Zero", label: "Real Names" },
    ],
  },
  {
    id: "trending",
    badge: "Trending This Week",
    BadgeIcon: Flame,
    title: "What's Hot",
    accent: "Right Now.",
    sub: "The most liked, most felt posts on campus. Real talk from real students — completely unfiltered.",
    cta: "See What's Trending",
    CtaIcon: TrendingUp,
    ctaLink: "/category/campus-gist",
    stats: [
      { val: "2.4K", label: "Posts Today" },
      { val: "340", label: "Comments" },
      { val: "12K", label: "Likes" },
    ],
  },
  {
    id: "anonymous",
    badge: "Your Privacy, Always",
    BadgeIcon: Lock,
    title: "Anonymous.",
    accent: "But Heard.",
    sub: "No real name. No email. No drama. Just your words — sent into the world exactly as you meant them.",
    cta: "Explore Categories",
    CtaIcon: Sparkles,
    ctaLink: "/categories",
    stats: [
      { val: "100%", label: "Anonymous" },
      { val: "6",    label: "Categories" },
      { val: "Free", label: "Always" },
    ],
  },
];

// ── Tips ───────────────────────────────────────────────────
const TIPS = [
  { Icon: Ghost,         title: "Pick a Fun Nickname",           body: "Be ShadowThinker or MidnightOwl. Switch it up — nobody knows it's you." },
  { Icon: Flame,         title: "Trending = More Eyes",          body: "Posts with more likes rise to the top. Be real, be bold — people feel that." },
  { Icon: Eye,           title: "Confess Without Fear",          body: "The Confessions section exists for a reason. Nobody knows who you are. Let it out." },
  { Icon: BookOpen,      title: "Academic Stress is Real",       body: "You're not alone. Post about it — someone out there is feeling the exact same." },
  { Icon: MessageCircle, title: "Comments Stay Anonymous",       body: "Even replies stay hidden. Your real identity never surfaces. Speak freely." },
  { Icon: ThumbsUp,      title: "Advice Actually Changes Lives", body: "People check Advice when they're lost. Your experience could change someone's day." },
];

// ── Skeleton ───────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="rounded-xl border border-border/40 bg-card/50 p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary/60" />
          <div className="h-3 bg-secondary/60 rounded w-24" />
        </div>
        <div className="h-5 bg-secondary/60 rounded-full w-20" />
      </div>
      <div className="h-5 bg-secondary/60 rounded w-3/4" />
      <div className="h-3 bg-secondary/60 rounded w-full" />
      <div className="h-3 bg-secondary/60 rounded w-2/3" />
      <div className="flex gap-4 pt-1">
        <div className="h-3 bg-secondary/60 rounded w-10" />
        <div className="h-3 bg-secondary/60 rounded w-10" />
      </div>
    </div>
  );
}

// ── Section divider label ──────────────────────────────────
function SectionLabel({ Icon, label }: { Icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="font-display text-base font-semibold text-foreground tracking-tight whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/40" />
    </div>
  );
}

const Index = () => {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);
  const [tipSlide, setTipSlide]   = useState(0);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const topPost       = [...posts].sort((a, b) => b.likes - a.likes)[0];
  const trendingPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  // Auto-rotate hero
  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  }, []);

  // Auto-rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipSlide((s) => (s + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Fetch posts
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try { setPosts(await fetchPosts()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const slide    = HERO_SLIDES[heroSlide];
  const TipIcon  = TIPS[tipSlide].Icon;
  const authorRoute = (uid?: string | null) => {
    if (!uid) return "#";
    return uid === user?.uid ? "/profile" : `/user/${uid}`;
  };

  const goNext = () => {
    setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    if (heroTimer.current) clearInterval(heroTimer.current);
  };
  const goPrev = () => {
    setHeroSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    if (heroTimer.current) clearInterval(heroTimer.current);
  };

  return (
    <Layout>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ══════════════════════════════════════════
          HERO — clean bg, scattered icons, slides
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-border/30 min-h-[500px] sm:min-h-[540px] flex flex-col justify-center bg-background">
        <ScatteredIcons />

        {/* Very faint radial centre bloom — depth without color */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(255,255,255,0.025) 0%, transparent 100%)" }}
        />

        <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10">
          <div className="max-w-xl mx-auto text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
              >
                {/* Badge — clean border, no fill color */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-card/50 text-muted-foreground text-xs font-semibold mb-6 backdrop-blur-sm">
                  <slide.BadgeIcon className="h-3 w-3" />
                  {slide.badge}
                </div>

                <h1 className="font-display text-4xl sm:text-6xl font-bold mb-3 leading-tight tracking-tight">
                  <span className="text-foreground">{slide.title}</span>{" "}
                  <span className="text-gradient">{slide.accent}</span>
                </h1>

                <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed">
                  {slide.sub}
                </p>

                <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
                  <Link to={slide.ctaLink}>
                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display">
                      <slide.CtaIcon className="h-4 w-4" />
                      {slide.cta}
                    </Button>
                  </Link>
                  <Link to="/categories">
                    <Button size="lg" variant="outline" className="border-border/50 gap-2 font-display">
                      <TrendingUp className="h-4 w-4" />
                      Explore
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-10 flex-wrap">
                  {slide.stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="font-display text-2xl font-bold text-foreground">{s.val}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide nav */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          <button
            onClick={goPrev}
            className="w-7 h-7 rounded-full border border-border/50 bg-card/60 hover:bg-card flex items-center justify-center transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setHeroSlide(i); if (heroTimer.current) clearInterval(heroTimer.current); }}
              className={`transition-all rounded-full ${
                i === heroSlide ? "w-6 h-1.5 bg-foreground" : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
          <button
            onClick={goNext}
            className="w-7 h-7 rounded-full border border-border/50 bg-card/60 hover:bg-card flex items-center justify-center transition-all"
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORY PILLS
      ══════════════════════════════════════════ */}
      <section className="border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <CategoryPill name="All" icon={Sparkle} slug="" active />
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.slug} name={cat.name} icon={cat.icon} slug={cat.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TOP CHAT OF THE WEEK
      ══════════════════════════════════════════ */}
      {!loading && topPost && (
        <section className="container mx-auto px-4 pt-8 max-w-[1200px]">
          <SectionLabel Icon={Star} label="Top Chat of the Week" />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Link to={`/post/${topPost.id}`}>
              {/* Same bg/border as every PostCard */}
              <div className="group rounded-xl border border-amber-400/40 bg-card/70 shadow-[0_0_0_1px_rgba(251,191,36,0.12),0_10px_30px_-18px_rgba(251,191,36,0.75)] hover:bg-card/90 p-5 transition-all duration-300 hover:border-amber-300/60">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground border border-border/40 px-2 py-0.5 rounded-full mb-3">
                      <Star className="h-3 w-3" /> Top Chat
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 mb-3 w-fit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (topPost.uid) navigate(authorRoute(topPost.uid));
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-foreground">{topPost.nickname[0]?.toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{topPost.nickname}</span>
                    </button>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {topPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{topPost.content}</p>
                  </div>
                  {/* Stats block — right side */}
                  <div className="shrink-0 flex flex-col items-end gap-3 border-l border-border/30 pl-5">
                    <div className="text-right">
                      <p className="font-display text-2xl font-bold text-foreground">{topPost.likes}</p>
                      <p className="text-xs text-muted-foreground">likes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-foreground">{topPost.comments}</p>
                      <p className="text-xs text-muted-foreground">comments</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          TIPS CAROUSEL
      ══════════════════════════════════════════ */}
      <section className="container border border-border/40 mx-auto px-4 pt-8 max-w-[1200px]">
        <SectionLabel Icon={Lightbulb} label="Useful Tips For You" />
        {/* Same card style as PostCard */}
        <div className="rounded-xl border border-border/40 bg-gradient-to-br from-secondary/80 to-transparent p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={tipSlide}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-lg border border-border/50 bg-secondary/50 flex items-center justify-center shrink-0">
                <TipIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm mb-1">{TIPS[tipSlide].title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{TIPS[tipSlide].body}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-1.5 mt-4 justify-end">
            {TIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTipSlide(i)}
                className={`transition-all rounded-full ${
                  i === tipSlide ? "w-5 h-1.5 bg-foreground" : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRENDING THIS WEEK
      ══════════════════════════════════════════ */}
      {!loading && trendingPosts.length > 0 && (
        <section className="container mx-auto px-4 pt-8 max-w-[1200px]">
          <SectionLabel Icon={Flame} label="Trending This Week" />
          {/* Same 3-col grid, same card style as main feed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trendingPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/post/${post.id}`}>
                  <div className="group rounded-xl border border-primary/35 bg-card/60 shadow-[0_8px_24px_-18px_rgba(99,102,241,0.8)] hover:bg-card/85 p-5 transition-all duration-300 hover:border-primary/60 h-full flex flex-col">
                    <button
                      type="button"
                      className="flex items-center gap-2 mb-3 w-fit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (post.uid) navigate(authorRoute(post.uid));
                      }}
                    >
                      <span className="font-display text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-foreground">{post.nickname[0]?.toUpperCase()}</span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate hover:text-primary transition-colors">{post.nickname}</span>
                    </button>
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed flex-1">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/20">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {post.comments}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          MAIN FEED — uniform 3-col block grid
      ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-8 max-w-[1200px]">
        <SectionLabel Icon={TrendingUp} label="Latest Posts" />

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-border/40 bg-card/50">
            <Ghost className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-foreground mb-1">No posts yet</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first voice on campus.</p>
            <Link to="/create">
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 gap-2">
                <PenSquare className="h-3.5 w-3.5" /> Create First Post
              </Button>
            </Link>
          </div>
        ) : (
          // Every card — same width, same style, uniform 3-col block
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.045 }}
              >
                <PostCard {...post} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA — same card style
      ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-12 max-w-[1200px]">
        <div className="rounded-xl border border-border/40 bg-card/50 p-8 text-center">
          <Ghost className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Got something to say?</h3>
          <p className="text-muted-foreground text-sm mb-5 max-w-sm mx-auto leading-relaxed">
            No sign-up stress. Just pick a nickname and post. Your identity stays yours — always.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/create">
              <Button className="bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display">
                <PenSquare className="h-4 w-4" /> Post Anonymously
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-border/50 gap-2">
                <Sparkles className="h-4 w-4" /> Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
