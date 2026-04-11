import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { CategoryPill } from "@/components/CategoryPill";
import { CATEGORIES } from "@/lib/constants";
import {
  PenSquare, TrendingUp, Sparkles, Sparkle,
  Flame, Lightbulb, Star, MessageCircle, Heart,
  BookOpen, Eye, ThumbsUp, Ghost, Loader, TrendingUpIcon,Cookie
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/lib/posts";
import { Post } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ── Tips data ──────────────────────────────────────────────
const TIPS = [
  { Icon: Ghost,         title: "Pick a Fun Nickname",           body: "Be ShadowThinker or MidnightOwl. Switch it up — nobody knows it's you." },
  { Icon: Flame,         title: "Trending = More Eyes",          body: "Posts with more likes rise to the top. Be real, be bold — people feel that." },
  { Icon: Eye,           title: "Confess Without Fear",          body: "The Confessions section exists for a reason. Nobody knows who you are." },
  { Icon: BookOpen,      title: "Academic Stress is Real",       body: "You're not alone. Post about it — someone out there is feeling the exact same." },
  { Icon: MessageCircle, title: "Comments Stay Anonymous",       body: "Even replies stay hidden. Your real identity never surfaces. Speak freely." },
  { Icon: ThumbsUp,      title: "Advice Actually Changes Lives", body: "People check Advice when they're lost. Your experience could change someone's day." },
];

// ── Post skeleton ──────────────────────────────────────────
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

// ── Divider label ──────────────────────────────────────────
function Label({ Icon, text }: { Icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="font-display text-sm font-semibold text-foreground tracking-tight">
        {text}
      </span>
      <div className="flex-1 h-px bg-border/30" />
    </div>
  );
}

const Index = () => {
  const { user } = useAuth();
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipSlide, setTipSlide] = useState(0);
  const [tab, setTab] = useState<"latest" | "trending">("latest");

  // Auto-rotate tips
  useEffect(() => {
    const t = setInterval(() => setTipSlide((s) => (s + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try { setPosts(await fetchPosts()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const TipIcon = TIPS[tipSlide].Icon;

  // Sort depending on active tab
  const sorted = tab === "trending"
    ? [...posts].sort((a, b) => b.likes - a.likes)
    : [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const topPost       = [...posts].sort((a, b) => b.likes - a.likes)[0];
  const trendingThree = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <Layout>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── CATEGORY PILLS ────────────────────────── */}
      <div className="border-b border-border/30 sticky top-16 z-40 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 max-w-[1200px]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <CategoryPill name="All" icon={Sparkle} slug="" active />
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.slug} name={cat.name} icon={cat.icon} slug={cat.slug} />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-[1200px]">
        {/* ── TWO COLUMN LAYOUT ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ── LEFT — main feed ─────────────────── */}
          <div>

            {/* Tab bar — Latest / Trending */}
            <div className="flex items-center border-b border-border/30 mb-5">
              {(["latest", "trending"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    tab === t
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                {t === "latest" ? <div className="flex items-center gap-1.5"><Cookie className="h-4 w-4 inline-block -mt-0.5"/>Latest</div> :<div className="flex items-center gap-1.5"><TrendingUpIcon className="h-4 w-4 inline-block -mt-0.5" />Trending</div>}
                </button>
              ))}

              {/* Write button — right aligned */}
              <div className="ml-auto">
                <Link to="/create">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 gap-1.5 glow-primary">
                    <PenSquare className="h-3.5 w-3.5" />
                    Post
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feed */}
            {loading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-20 rounded-xl border border-border/40 bg-card/50">
                <Ghost className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-foreground mb-1">No posts yet</p>
                <p className="text-sm text-muted-foreground mb-4">Be the first voice on campus.</p>
                <Link to="/create">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 gap-2">
                    <PenSquare className="h-3.5 w-3.5" /> Write Something
                  </Button>
                </Link>
              </div>
            ) : (
              // X-style: single column feed, full width, stacked
              <div className="flex flex-col gap-3">
                {sorted.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035 }}
                  >
                    <PostCard {...post} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────── */}
          <div className="hidden lg:flex flex-col gap-4 sticky top-36">

            {/* Top Chat of the Week */}
            {!loading && topPost && (
              <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-border/20">
                  <Label Icon={Star} text="Top Chat of the Week" />
                </div>
                <Link to={`/post/${topPost.id}`}>
                  <div className="p-4 hover:bg-card/80 transition-colors group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-foreground">
                          {topPost.nickname[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{topPost.nickname}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {topPost.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {topPost.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {topPost.comments}</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Trending posts */}
            {!loading && trendingThree.length > 0 && (
              <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-border/20">
                  <Label Icon={Flame} text="Trending This Week" />
                </div>
                <div className="divide-y divide-border/20">
                  {trendingThree.map((post, i) => (
                    <Link key={post.id} to={`/post/${post.id}`}>
                      <div className="p-4 hover:bg-card/80 transition-colors group flex items-start gap-3">
                        <span className="font-display text-lg font-bold text-border/50 leading-none mt-0.5 w-5 shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1 truncate">{post.nickname}</p>
                          <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                            {post.title}
                          </p>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {post.likes} likes
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-border/20">
                <Label Icon={Lightbulb} text="Tips For You" />
              </div>
              <div className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tipSlide}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-8 h-8 rounded-lg border border-border/40 bg-secondary/50 flex items-center justify-center shrink-0">
                      <TipIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-0.5">{TIPS[tipSlide].title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{TIPS[tipSlide].body}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex gap-1 mt-3 justify-end">
                  {TIPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTipSlide(i)}
                      className={`transition-all rounded-full ${
                        i === tipSlide ? "w-4 h-1 bg-foreground" : "w-1 h-1 bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Post CTA — only for guests */}
            {!user && (
              <div className="rounded-xl border border-border/40 bg-card/50 p-4 text-center">
                <Ghost className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold text-foreground mb-1">Got something to say?</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  No account needed. Just pick a nickname and post.
                </p>
                <Link to="/create" className="block">
                  <Button size="sm" className="w-full bg-gradient-to-r from-primary to-primary/80 gap-1.5 glow-primary">
                    <PenSquare className="h-3.5 w-3.5" /> Post Anonymously
                  </Button>
                </Link>
                <Link to="/signup" className="block mt-2">
                  <Button size="sm" variant="outline" className="w-full border-border/50 gap-1.5 text-xs">
                    <Sparkles className="h-3 w-3" /> Create Account
                  </Button>
                </Link>
              </div>
            )}

            {/* Categories quick links */}
            <div className="rounded-xl border border-border/40 bg-card/50 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-border/20">
                <Label Icon={TrendingUp} text="Categories" />
              </div>
              <div className="p-3 flex flex-col gap-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors group"
                  >
                    <cat.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;