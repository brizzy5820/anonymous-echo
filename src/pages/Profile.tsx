import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { MOCK_POSTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const userPosts = MOCK_POSTS.slice(0, 3);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="rounded-xl border border-border/40 bg-card/50 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">S</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">ShadowWriter</h1>
                    <p className="text-sm text-muted-foreground">Member since March 2026</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border/40 gap-2">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="font-display text-xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-xl font-bold text-accent">342</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-xl font-bold text-foreground">87</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User posts */}
          <h2 className="font-display text-xl font-semibold mb-4 text-foreground">Your Posts</h2>
          <div className="grid gap-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
