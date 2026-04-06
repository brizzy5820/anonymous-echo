import { Layout } from "@/components/layout/Layout";
import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ArrowLeft, Send, Shuffle, User, Lock, Loader, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/lib/posts";

const randomNicknames = [
  "ShadowThinker", "MidnightOwl", "GhostWriter",
  "SilentVoice", "UnknownSoul", "PhantomPen",
  "CrypticMind", "EchoVoice", "NightWhisper"
];

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.displayName ?? "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNickname = () => {
    const name = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
    setNickname(`${name}_${Math.floor(Math.random() * 999)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write something before posting");
      return;
    }

    setLoading(true);
    try {
      await createPost({
        nickname: nickname.trim(),
        category: selectedCategory,
        title: title.trim() || "",  // title is optional — fallback to Untitled
        content: content.trim(),
        uid: user?.uid ?? null,
      });
      toast.success("Post published anonymously! 🎭");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-[1200px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-1">
            Create a <span className="text-gradient">Post</span>
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Your identity stays hidden. Express yourself freely.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-2 flex flex-col gap-5">

                {/* NICKNAME SECTION */}
                <div className="rounded-xl border border-border/40 bg-card/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 rounded-full bg-primary" />
                    <label className="text-sm font-semibold text-foreground">
                      Your Nickname
                    </label>
                    {user && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-1">
                        <Lock className="h-3 w-3" />
                        Auto-filled
                      </span>
                    )}
                  </div>

                  {user ? (
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-3 pl-10 pr-4 py-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-foreground text-sm">
                        <span className="font-medium">@{user.displayName}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          Linked to your account
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                      
                        placeholder="Pick a nickname..."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="bg-background/60 border-gray-600 focus:border-primary/50 transition-colors"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={generateNickname}
                        className="shrink-0 border-border/50 hover:border-primary/40 hover:bg-primary/5"
                        title="Generate random nickname"
                        disabled={loading}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {user
                      ? "Your account nickname will be shown on this post."
                      : "This nickname is the only thing others will see. No real name, ever."}
                  </p>
                </div>

                {/* TITLE SECTION */}
                <div className="rounded-xl border border-border/40 bg-card/40 p-5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-primary/60" />
                      <label className="text-sm font-semibold text-foreground">
                        Title
                      </label>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border/30">
                      Optional
                    </span>
                  </div>
                  <Input
                    placeholder="Give your post a catchy title... (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background/60 border-gray-600 focus:border-primary/50 transition-colors h-11"
                    disabled={loading}
                    maxLength={120}
                  />
                  <div className="flex items-center justify-between">
                  
                    <span className="text-xs text-muted-foreground">
                      {title.length}/120
                    </span>
                  </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="rounded-xl border border-border/40 bg-card/40 p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 rounded-full bg-primary" />
                    <label className="text-sm font-semibold text-foreground">
                      What's on your mind?
                    </label>
                    <span className="text-xs text-red-400 ml-1">Required</span>
                  </div>
                  <Textarea
                    placeholder="Write your thoughts here... Be as real as you want. No judgment."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-background/60 border-gray-600 focus:border-primary/50 transition-colors min-h-[200px] resize-none text-sm leading-relaxed"
                    disabled={loading}
                    maxLength={2000}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Max 2000 characters
                    </p>
                    <span className={`text-xs transition-colors ${
                      content.length > 1800
                        ? "text-red-400"
                        : content.length > 1400
                        ? "text-yellow-400"
                        : "text-muted-foreground"
                    }`}>
                      {content.length}/2000
                    </span>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display text-base h-12"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Anonymously
                    </>
                  )}
                </Button>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="flex flex-col gap-5">

                {/* CATEGORY SECTION */}
                <div className="rounded-xl border border-border/40 bg-card/40 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 rounded-full bg-primary" />
                    <label className="text-sm font-semibold text-foreground">
                      Category
                    </label>
                    <span className="text-xs text-red-400 ml-1">Required</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        disabled={loading}
                        className={`p-3 rounded-xl text-left transition-all border flex gap-3 items-center group ${
                          selectedCategory === cat.slug
                            ? "bg-primary/10 border-primary/50 glow-primary"
                            : "bg-background/40 border-border/30 hover:border-border/60 hover:bg-card/80"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          selectedCategory === cat.slug
                            ? "bg-primary/20"
                            : "bg-secondary/50 group-hover:bg-secondary"
                        }`}>
                          <cat.icon className="w-3.5 h-3.5" />
                        </div>
                        <p className={`text-sm font-medium transition-colors ${
                          selectedCategory === cat.slug
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}>
                          {cat.name}
                        </p>
                        {selectedCategory === cat.slug && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TIPS CARD */}
                <div className="rounded-xl border border-border/30 bg-card/20 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Posting Tips</p>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "Punchy titles get more clicks",
                      "Be honest — this is a no-judgment zone",
                      "Right category = right audience",
                      "Your real identity is never stored",
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary mt-0.5 shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* GUEST SIGNUP PROMPT */}
                {!user && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Want a consistent identity?
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Create a free account to keep your nickname consistent across all posts and track your likes.
                    </p>
                    <Link to="/signup">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Create Free Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreatePost;