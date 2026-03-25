import { Layout } from "@/components/layout/Layout";
import { MOCK_POSTS, CATEGORIES } from "@/lib/constants";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

const mockComments = [
  { id: "1", nickname: "NightOwl", content: "This is so relatable 😭", likes: 12, createdAt: "2h ago" },
  { id: "2", nickname: "Silent_Reader", content: "You're not alone in this. Hang in there!", likes: 8, createdAt: "1h ago" },
  { id: "3", nickname: "RandomStranger", content: "Bruh I felt this in my soul 💀", likes: 23, createdAt: "45m ago" },
];

const PostDetail = () => {
  const { id } = useParams();
  const post = MOCK_POSTS.find((p) => p.id === id);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Post not found</h1>
        </div>
      </Layout>
    );
  }

  const cat = CATEGORIES.find((c) => c.slug === post.category);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Post header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">{post.nickname[0]}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{post.nickname}</p>
                <p className="text-xs text-muted-foreground">Posted anonymously</p>
              </div>
            </div>
            {cat && (
              <Badge variant="secondary" className="bg-secondary/80 flex gap-2c border-0">
              <cat.icon className="w-4 h-4"/> {cat.name}
              </Badge>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-4 text-foreground">{post.title}</h1>
          <p className="text-muted-foreground leading-relaxed mb-6 text-base">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 py-4 border-y border-border/30 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={`gap-2 ${liked ? "text-accent" : "text-muted-foreground"}`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-accent" : ""}`} />
              {post.likes + (liked ? 1 : 0)}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground ml-auto">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>

          {/* Comments */}
          <div className="space-y-4 mb-6">
            <h2 className="font-display text-lg font-semibold">Comments</h2>
            {mockComments.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-card/50 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-[10px] font-bold text-secondary-foreground">{c.nickname[0]}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{c.nickname}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{c.createdAt}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.content}</p>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment anonymously..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-card/50 border-border/40"
            />
            <Button size="icon" className="shrink-0 bg-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.article>
      </div>
    </Layout>
  );
};

export default PostDetail;
