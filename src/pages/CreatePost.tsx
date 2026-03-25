import { Layout } from "@/components/layout/Layout";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ArrowLeft, Send, Shuffle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const randomNicknames = ["ShadowThinker", "MidnightOwl", "GhostWriter", "SilentVoice", "UnknownSoul", "PhantomPen"];

const CreatePost = () => {
  const [nickname, setNickname] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const generateNickname = () => {
    const name = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
    setNickname(`${name}_${Math.floor(Math.random() * 999)}`);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !selectedCategory || !title || !content) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Post published anonymously! 🎭");
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">
            Create a <span className="text-gradient">Post</span>
          </h1>
          <p className="text-muted-foreground mb-8">Your identity stays hidden. Express yourself freely.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nickname */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your Nickname</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Pick a nickname..."
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-card/50 border-border/40"
                />
                <Button type="button" variant="outline" size="icon" onClick={generateNickname} className="shrink-0 border-border/40">
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`p-3 rounded-xl text-left transition-all border flex gap-3 items-center ${
                      selectedCategory === cat.slug
                        ? "bg-primary/15 border-primary/40 glow-primary"
                        : "bg-card/50 border-border/30 hover:border-border/60"
                    }`}
                  >
                    <span className="text-xl"><cat.icon className="w-4 h-4"/></span>
                    <p className="text-sm font-medium mt-1 text-foreground">{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                placeholder="Give your post a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-card/50 border-border/40"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What's on your mind?</label>
              <Textarea
                placeholder="Write your thoughts here... Be as real as you want."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-card/50 border-border/40 min-h-[160px]"
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display">
              <Send className="h-4 w-4" />
              Publish Anonymously
            </Button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreatePost;
