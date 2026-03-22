import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { CategoryPill } from "@/components/CategoryPill";
import { CATEGORIES, MOCK_POSTS } from "@/lib/constants";
import { PenSquare, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 py-16 sm:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Anonymous & Unfiltered
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4">
              Speak Freely.{" "}
              <span className="text-gradient">Stay Unknown.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Share your thoughts, confessions, and campus stories — no account needed. Just pick a nickname and let it out.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/create">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display">
                  <PenSquare className="h-4 w-4" />
                  Start Writing
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="border-border/50 gap-2 font-display">
                  <TrendingUp className="h-4 w-4" />
                  Explore
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <CategoryPill name="All" emoji="✨" slug="" active />
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.slug} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Trending Now
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_POSTS.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
