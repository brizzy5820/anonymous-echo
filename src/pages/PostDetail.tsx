import { Layout } from "@/components/layout/Layout";
import { CATEGORIES } from "@/lib/constants";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Heart, MessageCircle,
  Share2, Send, Loader, UserPlus, UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchPost, toggleLike, addComment, fetchComments } from "@/lib/posts";
import { fetchProfile, followUser, unfollowUser } from "@/lib/profile";
import { Post, Comment } from "@/lib/types";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notifications";
const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  // Comment state
  const [comment, setComment] = useState("");
  const [commentNickname, setCommentNickname] = useState(
    user?.displayName ?? ""
  );
  const [submittingComment, setSubmittingComment] = useState(false);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Load post
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoadingPost(true);
      try {
        const data = await fetchPost(id);
        if (data) {
          setPost(data);
          setLikeCount(data.likes);
          setLiked(user ? data.likedBy?.includes(user.uid) : false);
        }
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoadingPost(false);
      }
    };
    load();
  }, [id, user]);

  // Load comments
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoadingComments(true);
      try {
        const data = await fetchComments(id);
        setComments(data as Comment[]);
      } catch {
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    };
    load();
  }, [id]);

  // Check if following post author
  useEffect(() => {
    if (!user || !post?.uid || post.uid === user.uid) return;
    const check = async () => {
      const profile = await fetchProfile(user.uid);
      if (profile?.following?.includes(post.uid!)) {
        setIsFollowing(true);
      }
    };
    check();
  }, [user, post]);

  // Handle like
const handleLike = async () => {
  if (!user) { toast.error("Login to like posts"); return; }
  if (liking || !id) return;

  setLiked((prev) => !prev);
  setLikeCount((prev) => prev + (liked ? -1 : 1));
  setLiking(true);

  try {
    await toggleLike(id, user.uid, liked);

    // Send notification when liking (not unliking)
    // Only if post has an owner uid
    if (!liked && post?.uid) {
      await sendNotification({
        recipientUid: post.uid,
        senderNickname: user.displayName ?? "Someone",
        senderUid: user.uid,
        type: "like",
        message: `${user.displayName} liked your post "${post.title}"`,
        postId: id,
      });
    }
  } catch {
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? 1 : -1));
    toast.error("Failed to like post");
  } finally {
    setLiking(false);
  }
};


  // Handle comment submit
  const handleComment = async () => {
  if (!comment.trim()) return;
  if (!commentNickname.trim()) {
    toast.error("Please enter a nickname to comment");
    return;
  }
  if (!id) return;

  setSubmittingComment(true);
  try {
    await addComment(id, {
      nickname: commentNickname.trim(),
      content: comment.trim(),
      uid: user?.uid ?? null,
    });

    // Notify post owner
    if (post?.uid) {
      await sendNotification({
        recipientUid: post.uid,
        senderNickname: commentNickname.trim(),
        senderUid: user?.uid ?? null,
        type: "comment",
        message: `${commentNickname} commented on your post "${post.title}"`,
        postId: id,
      });
    }

    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        nickname: commentNickname.trim(),
        content: comment.trim(),
        uid: user?.uid ?? null,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
      },
    ]);
    setComment("");
    toast.success("Comment posted!");
  } catch {
    toast.error("Failed to post comment");
  } finally {
    setSubmittingComment(false);
  }
};

  // Handle follow / unfollow
  const handleFollow = async () => {
    if (!user) {
      toast.error("Login to follow users");
      return;
    }
    if (!post?.uid || post.uid === user.uid) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.uid, post.uid);
        setIsFollowing(false);
        toast.success("Unfollowed");
      } else {
        await followUser(user.uid, post.uid);
        setIsFollowing(true);
        toast.success("Following!");
      }
    } catch {
      toast.error("Failed to update follow");
    } finally {
      setFollowLoading(false);
    }
  };

  // Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const cat = post ? CATEGORIES.find((c) => c.slug === post.category) : null;

  if (loadingPost) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">Post not found</h1>
          <Link to="/" className="text-primary text-sm mt-4 inline-block">
            Back to feed
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── POST HEADER ── */}
          <div className="rounded-xl border border-border/40 bg-card/40 p-5 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                  <span className="text-sm font-bold text-foreground">
                    {post.nickname[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.nickname}</p>
                  <p className="text-xs text-muted-foreground">Posted anonymously</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cat && (
                  <Badge
                    variant="secondary"
                    className="bg-secondary/80 inline-flex gap-1.5 border-0"
                  >
                    <cat.icon className="w-3.5 h-3.5" /> {cat.name}
                  </Badge>
                )}

                {/* Follow button — only show if post has a uid and it's not the current user */}
                {post.uid && post.uid !== user?.uid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`gap-1.5 border-border/50 text-xs h-8 ${
                      isFollowing
                        ? "text-primary border-primary/40 bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {followLoading ? (
                      <Loader className="h-3 w-3 animate-spin" />
                    ) : isFollowing ? (
                      <><UserCheck className="h-3.5 w-3.5" /> Following</>
                    ) : (
                      <><UserPlus className="h-3.5 w-3.5" /> Follow</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── POST CONTENT ── */}
          <div className="rounded-xl border border-border/40 bg-card/40 p-5 mb-5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold mb-4 text-foreground">
              {post.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-base">
              {post.content}
            </p>
          </div>

          {/* ── ACTIONS ── */}
          <div className="rounded-xl border border-border/40 bg-card/40 px-5 py-3 mb-5">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={liking}
                className={`gap-2 transition-colors ${
                  liked ? "text-accent hover:text-accent" : "text-muted-foreground"
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    liked ? "fill-accent scale-110" : ""
                  }`}
                />
                {likeCount}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                {comments.length}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground ml-auto"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>

          {/* ── COMMENTS ── */}
          <div className="rounded-xl border border-border/40 bg-card/40 p-5 mb-5">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              Comments
              <span className="text-sm font-normal text-muted-foreground">
                ({comments.length})
              </span>
            </h2>

            {loadingComments ? (
              <div className="flex justify-center py-8">
                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No comments yet. Be the first to say something.
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {comments.map((c) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-background/40 border border-border/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-foreground">
                            {c.nickname[0]?.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {c.nickname}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {getTimeAgo(c.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                        {c.content}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── ADD COMMENT ── */}
          <div className="rounded-xl border border-border/40 bg-card/40 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Add a comment
            </h3>

            {/* Nickname input for guests */}
            {!user && (
              <Input
                placeholder="Your nickname..."
                value={commentNickname}
                onChange={(e) => setCommentNickname(e.target.value)}
                className="bg-background/60 border-border/50 mb-3 text-sm"
              />
            )}

            {/* Logged in — show locked nickname */}
            {user && (
              <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-foreground">
                    {user.displayName?.[0]?.toUpperCase()}
                  </span>
                </div>
                Commenting as{" "}
                <span className="text-foreground font-medium">
                  @{user.displayName}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Write something..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
                className="bg-background/60 border-border/50 text-sm"
                disabled={submittingComment}
              />
              <Button
                size="icon"
                className="shrink-0 bg-primary hover:bg-primary/90"
                onClick={handleComment}
                disabled={submittingComment || !comment.trim()}
              >
                {submittingComment ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to submit
            </p>
          </div>

        </motion.article>
      </div>
    </Layout>
  );
};

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default PostDetail;