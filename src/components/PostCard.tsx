import { Link , useNavigate} from "react-router-dom";
import { Heart, MessageCircle, Clock, MoreVertical, UserPlus, UserCheck, Flag, Loader,Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { toggleLike, reportPost , deletePost} from "@/lib/posts";
import { followUser, unfollowUser, fetchProfile } from "@/lib/profile";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notifications";
interface PostCardProps {
  id: string;
  nickname: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  likedBy?: string[];
  uid?: string | null;
}

export function PostCard({
  id, nickname, category, title,
  content, likes, comments, createdAt,
  likedBy = [], uid = null,
}: PostCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cat = CATEGORIES.find((c) => c.slug === category);
  const timeAgo = getTimeAgo(createdAt);

  const hasLiked = user ? likedBy.includes(user.uid) : false;
  const [liked, setLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [liking, setLiking] = useState(false);


  // Three dot menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Check follow status
  useEffect(() => {
    if (!user || !uid || uid === user.uid) return;
    const check = async () => {
      const profile = await fetchProfile(user.uid);
      setIsFollowing(profile?.following?.includes(uid) ?? false);
    };
    check();
  }, [user, uid]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Login to like posts"); return; }
    if (liking) return;
    setLiked((prev) => !prev);
    setLikeCount((prev) => prev + (liked ? -1 : 1));
    setLiking(true);
    try {
      await toggleLike(id, user.uid, liked);
    } catch {
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (liked ? 1 : -1));
      toast.error("Failed to like post");
    } finally {
      setLiking(false);
    }
  };

 const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  if (!user) { toast.error("Login to follow users"); return; }
  if (!uid || uid === user.uid) return;

  setFollowLoading(true);
  try {
    if (isFollowing) {
      await unfollowUser(user.uid, uid);
      setIsFollowing(false);
      toast.success("Unfollowed");
    } else {
      await followUser(user.uid, uid);
      setIsFollowing(true);

      // Notify the person being followed
      await sendNotification({
        recipientUid: uid,
        senderNickname: user.displayName ?? "Someone",
        senderUid: user.uid,
        type: "follow",
        message: `${user.displayName} started following you`,
      });

      toast.success("Now following!");
    }
  } catch {
    toast.error("Failed to update follow");
  } finally {
    setFollowLoading(false);
    setMenuOpen(false);
  }
};

  const handleReport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!reportReason.trim()) {
      toast.error("Please select a reason");
      return;
    }
    
    setReporting(true);
    try {
      await reportPost(id, {
        reason: reportReason,
        reportedBy: user?.uid ?? null,
        nickname: user?.displayName ?? "guest",
      });
      toast.success("Post reported. We'll review it shortly.");
      setReportOpen(false);
      setReportReason("");
    } catch {
      toast.error("Failed to report post");
    } finally {
      setReporting(false);
    }
  };

   const handleDeletePost = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.uid !== uid) return;

    setDeleting(true);
    try {
      await deletePost(id);
      toast.success("Post deleted");
      setDeleted(true);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  if (deleted) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/post/${id}`}>
          <article className="group rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 p-5 transition-all duration-300 hover:border-primary/30 hover:glow-primary">
            {/* ── HEADER ── */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Clickable avatar + name → author profile */}
                <button
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // prevent outer link

                    navigate(
                      uid
                        ? uid === user?.uid
                          ? "/profile"
                          : `/user/${uid}`
                        : "none",
                    );
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">
                      {nickname[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {nickname}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {cat && (
                  <Badge
                    variant="secondary"
                    className="text-xs inline-flex items-center gap-1 bg-secondary/80 border-0"
                  >
                    <cat.icon className="w-3.5 h-3.5" /> {cat.name}
                  </Badge>
                )}

                {/* ── THREE DOT MENU ── */}
                <div
                  ref={menuRef}
                  className="relative"
                  onClick={(e) => e.preventDefault()}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpen((o) => !o);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-8 w-48 rounded-xl border border-border/40 bg-card shadow-xl shadow-black/20 z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Follow option — only for posts with uid that isn't current user */}
                        {uid && uid !== user?.uid && (
                          <button
                            onClick={handleFollow}
                            disabled={followLoading}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          >
                            {followLoading ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : isFollowing ? (
                              <>
                                <UserCheck className="h-4 w-4 text-primary" />{" "}
                                Unfollow
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-4 w-4" /> Follow @
                                {nickname}
                              </>
                            )}
                          </button>
                        )}

                        {/* View profile */}
                        {uid && uid !== user?.uid && (
                          <Link
                            to={uid
                               ? `/user/${uid}`
                              : "#"}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          >
                            👤 View Profile
                          </Link>
                        )}
                          {/* View post */}
                        <Link
                          to={`/post/${id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                        >
                        <Eye className="w-4 h-4"/> View Post
                        </Link>

                        {/* Delete option for own post */}
                        {uid && uid === user?.uid && (
                          <button
                            onClick={handleDeletePost}
                            disabled={deleting}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-60"
                          >
                            {deleting ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete Post
                          </button>
                        )}

                        <div className="border-t border-border/30" />

                        {/* Report */}
                      {user?.uid!==uid&&(
                          <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMenuOpen(false);
                            setReportOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Flag className="h-4 w-4" /> Report Post
                        </button>
                      )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── CONTENT ── */}
            <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
              {content}
            </p>

            {/* ── FOOTER ── */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-accent/10 ${
                  liked ? "text-accent" : "hover:text-accent"
                }`}
              >
                <Heart
                  className={`h-3.5 w-3.5 transition-all ${
                    liked ? "fill-accent text-accent scale-110" : ""
                  }`}
                />
                {likeCount}
              </button>

              <span className="flex items-center gap-1.5 text-xs">
                <MessageCircle className="h-3.5 w-3.5" /> {comments}
              </span>

              <span className="flex items-center gap-1 text-xs ml-auto">
                <Clock className="h-3.5 w-3.5" /> {timeAgo}
              </span>
            </div>
          </article>
        </Link>
      </motion.div>

      {/* ── REPORT MODAL ── */}
      <AnimatePresence>
        {reportOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setReportOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-2xl border border-border/40 p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1">
                <Flag className="h-4 w-4 text-red-400" />
                <h3 className="font-semibold text-foreground">Report Post</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Select a reason for reporting this post. Our admin team will
                review it.
              </p>

              <div className="space-y-2 mb-5">
                {[
                  "Harassment or bullying",
                  "False information",
                  "Inappropriate content",
                  "Spam",
                  "Hate speech",
                  "Other",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setReportReason(reason)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${
                      reportReason === reason
                        ? "bg-red-500/10 border-red-500/40 text-red-300"
                        : "border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground bg-background/40"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setReportOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  disabled={reporting || !reportReason}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {reporting ? (
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}