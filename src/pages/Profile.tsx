import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Edit3, Save, X, Users, Heart, FileText,
  Loader, Pin, PinOff, Trash2, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { fetchProfile, updateBio, fetchProfilesByUids } from "@/lib/profile";
import { fetchUserPosts, pinPost, unpinPost, deletePost } from "@/lib/posts";
import { UserProfile, Post } from "@/lib/types";
import { toast } from "sonner";
import { Navigate, Link } from "react-router-dom";

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Bio editing state
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  // Followers/Following modal state
  // "followers" | "following" | null — controls which modal is open
  const [listModal, setListModal] = useState<"followers" | "following" | null>(null);
  const [modalUsers, setModalUsers] = useState<UserProfile[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  // Delete confirmation state
  // Stores the post id that is pending deletion
  // null means no deletion is pending
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Pin loading state — tracks which post is being pinned
  const [pinningPostId, setPinningPostId] = useState<string | null>(null);

  if (!authLoading && !user) return <Navigate to="/login" replace />;

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [profileData, postsData] = await Promise.all([
          fetchProfile(user.uid),
          fetchUserPosts(user.uid),
        ]);
        setProfile(profileData);
        setBioInput(profileData?.bio ?? "");

        // Sort posts — pinned post always comes first
        // then sort the rest by date descending
        const sorted = [...postsData].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(sorted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Opens the followers or following modal
  // Fetches the actual user profiles for those uids
  const handleOpenList = async (type: "followers" | "following") => {
    if (!profile) return;
    setListModal(type);
    setLoadingModal(true);

    // Pick the right uid array based on which modal we're opening
    const uids = type === "followers"
      ? profile.followers ?? []
      : profile.following ?? [];

    try {
      const users = await fetchProfilesByUids(uids);
      setModalUsers(users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoadingModal(false);
    }
  };

  // Pin or unpin a post
  const handlePin = async (postId: string, currentlyPinned: boolean) => {
    if (!user) return;
    setPinningPostId(postId);
    try {
      if (currentlyPinned) {
        // Unpin it
        await unpinPost(postId);
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, pinned: false } : p))
        );
        toast.success("Post unpinned");
      } else {
        // Pin this one — unpin everything else locally in state
        // then re-sort so pinned post floats to top
        await pinPost(postId, user.uid);
        setPosts((prev) => {
          const updated = prev.map((p) => ({
            ...p,
            pinned: p.id === postId,  // only this post is pinned
          }));
          // Re-sort: pinned first
          return updated.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
          });
        });
        toast.success("Post pinned to top of your profile!");
      }
    } catch {
      toast.error("Failed to update pin");
    } finally {
      setPinningPostId(null);
    }
  };

  // Delete a post — two step:
  // Step 1: user clicks delete → sets confirmDeleteId (shows confirmation UI)
  // Step 2: user confirms → actually deletes
  const handleDelete = async (postId: string) => {
    setDeletingPostId(postId);
    try {
      await deletePost(postId);
      // Remove from local state instantly — no need to refetch
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingPostId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleSaveBio = async () => {
    if (!user) return;
    setSavingBio(true);
    try {
      await updateBio(user.uid, bioInput);
      setProfile((prev) => prev ? { ...prev, bio: bioInput } : prev);
      setEditingBio(false);
      toast.success("Bio updated!");
    } catch {
      toast.error("Failed to update bio");
    } finally {
      setSavingBio(false);
    }
  };

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "?";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long", year: "numeric",
      })
    : "Recently";

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes ?? 0), 0);
  const pinnedPost = posts.find((p) => p.pinned);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── PROFILE HEADER ── */}
          <div className="rounded-2xl border border-border/40 bg-card/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">

              {/* Avatar — clicking it goes to own profile (already here) */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 text-3xl font-bold text-primary-foreground">
                {initials}
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      @{user?.displayName}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Member since {memberSince}
                    </p>
                  </div>
                </div>

                {/* Stats row — followers/following are now clickable buttons */}
                <div className="flex gap-6 mt-5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-display text-xl font-bold text-foreground leading-none">
                        {posts.length}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Posts</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-accent" />
                    <div>
                      <p className="font-display text-xl font-bold text-accent leading-none">
                        {totalLikes}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Total Likes</p>
                    </div>
                  </div>

                  {/* Followers — clickable, opens modal */}
                  <button
                    onClick={() => handleOpenList("followers")}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity group"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-display text-xl font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                        {profile?.followers?.length ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Followers</p>
                    </div>
                  </button>

                  {/* Following — clickable, opens modal */}
                  <button
                    onClick={() => handleOpenList("following")}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity group"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-display text-xl font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                        {profile?.following?.length ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Following</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bio section — unchanged */}
            <div className="mt-6 border-t border-border/30 pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">About</p>
                {!editingBio ? (
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 gap-1.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setEditingBio(true)}
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Bio
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-muted-foreground"
                      onClick={() => { setEditingBio(false); setBioInput(profile?.bio ?? ""); }}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" className="h-7 gap-1.5 bg-primary"
                      onClick={handleSaveBio} disabled={savingBio}>
                      {savingBio
                        ? <Loader className="h-3.5 w-3.5 animate-spin" />
                        : <Save className="h-3.5 w-3.5" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              {editingBio ? (
                <Textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell the community a little about yourself..."
                  className="bg-card/50 border-border/40 resize-none min-h-[100px] text-sm"
                  maxLength={300}
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile?.bio || (
                    <span className="italic opacity-60">
                      No bio yet — click Edit Bio to add one.
                    </span>
                  )}
                </p>
              )}
              {editingBio && (
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {bioInput.length}/300
                </p>
              )}
            </div>
          </div>

          {/* ── PINNED POST ── */}
          {/* Only shows if a pinned post exists */}
          {pinnedPost && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Pin className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-primary">Pinned Post</h2>
              </div>
              {/* Render the pinned post card with its action menu */}
              <PostCardWithActions
                post={pinnedPost}
                onPin={handlePin}
                onDelete={(id) => setConfirmDeleteId(id)}
                pinningPostId={pinningPostId}
              />
            </div>
          )}

          {/* ── ALL POSTS ── */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Your Posts
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({posts.length})
              </span>
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-border/30 bg-card/30">
              <p className="text-muted-foreground text-sm">
                You haven't posted anything yet.
              </p>
              <Link to="/create">
                <Button variant="outline" size="sm" className="mt-4 border-primary/30 text-primary">
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <PostCardWithActions
                  key={post.id}
                  post={post}
                  onPin={handlePin}
                  onDelete={(id) => setConfirmDeleteId(id)}
                  pinningPostId={pinningPostId}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── FOLLOWERS / FOLLOWING MODAL ── */}
      {/* AnimatePresence lets the modal animate out when closed */}
      <AnimatePresence>
        {listModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setListModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-2xl border border-border/40 w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-border/30">
                <h3 className="font-semibold text-foreground capitalize">
                  {listModal}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({listModal === "followers"
                      ? profile?.followers?.length ?? 0
                      : profile?.following?.length ?? 0})
                  </span>
                </h3>
                <button
                  onClick={() => setListModal(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-3 max-h-[400px] overflow-y-auto">
                {loadingModal ? (
                  <div className="flex justify-center py-10">
                    <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : modalUsers.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-10">
                    {listModal === "followers"
                      ? "No followers yet"
                      : "Not following anyone yet"}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {modalUsers.map((u) => (
                      // Each user in the list links to their author profile
                      <Link
                        key={u.uid}
                        to={`/user/${u.uid}`}
                        onClick={() => setListModal(null)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                      >
                        {/* Mini avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-foreground">
                            {u.displayName?.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            @{u.displayName}
                          </p>
                          {u.bio && (
                            <p className="text-xs text-muted-foreground truncate">
                              {u.bio}
                            </p>
                          )}
                        </div>
                        {/* Arrow hint */}
                        <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground rotate-180 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {/* Two step deletion — prevents accidental deletes */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-2xl border border-border/40 p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-4 w-4 text-red-400" />
                <h3 className="font-semibold text-foreground">Delete Post?</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                This will permanently delete the post and all its comments.
                This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={!!deletingPostId}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm font-medium hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingPostId
                    ? <Loader className="h-3.5 w-3.5 animate-spin" />
                    : "Delete"
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

// ── POST CARD WITH AUTHOR ACTIONS ──────────────────────────
// This is a separate component wrapping PostCard
// It adds the three-dot menu with pin/delete options
// Only shown on the owner's own profile page
// We keep it in the same file since it's only used here

type PostCardWithActionsProps = {
  post: Post;
  onPin: (postId: string, currentlyPinned: boolean) => void;
  onDelete: (postId: string) => void;
  pinningPostId: string | null;
};

function PostCardWithActions({
  post, onPin, onDelete, pinningPostId
}: PostCardWithActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative">
      {/* Pinned indicator badge */}
      {post.pinned && (
        <div className="absolute -top-2 left-4 z-10 flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary text-xs px-2 py-0.5 rounded-full">
          <Pin className="h-3 w-3" /> Pinned
        </div>
      )}

      {/* Three dot menu — positioned top right of card */}
      <div
        ref={menuRef}
        className="absolute top-3 right-3 z-10"
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
              className="absolute right-0 top-8 w-48 rounded-xl border border-border/40 bg-card shadow-xl z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* View post */}
              <Link
                to={`/post/${post.id}`}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                👁 View Post
              </Link>

              {/* Pin / Unpin */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(false);
                  onPin(post.id, !!post.pinned);
                }}
                disabled={pinningPostId === post.id}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-50"
              >
                {pinningPostId === post.id ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : post.pinned ? (
                  <><PinOff className="h-4 w-4" /> Unpin Post</>
                ) : (
                  <><Pin className="h-4 w-4" /> Pin to Profile</>
                )}
              </button>

              <div className="border-t border-border/30" />

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(post.id);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" /> Delete Post
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The actual post card */}
      <PostCard {...post} />
    </div>
  );
}

// Add these imports at the top with the others
import { useRef } from "react";
import { MoreVertical } from "lucide-react";

export default Profile;