import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UserPlus, UserCheck, ArrowLeft, FileText, Heart, Users, Loader ,X} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { fetchProfile, fetchProfilesByUids, followUser, unfollowUser } from "@/lib/profile";
import { fetchUserPosts } from "@/lib/posts";
import { UserProfile, Post } from "@/lib/types";
import { toast } from "sonner";
import { sendNotification } from "@/lib/notifications";


const AuthorProfile = () => {
  const { uid } = useParams<{ uid: string }>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
    // Followers/Following modal state
    // "followers" | "following" | null — controls which modal is open
    const [listModal, setListModal] = useState<"followers" | "following" | null>(null);
    const [modalUsers, setModalUsers] = useState<UserProfile[]>([]);
    const [loadingModal, setLoadingModal] = useState(false);
          // ← add
  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      setLoading(true);
      try {
        const [profileData, postsData] = await Promise.all([
          fetchProfile(uid),
          fetchUserPosts(uid),
        ]);
        setProfile(profileData);
        setPosts(postsData);
         console.log("uid from URL:", uid)           // ← add
      console.log("profileData:", profileData)    // ← add
      console.log("posts:", postsData)   
        // Check if current user is following this author
        if (user) {
          const myProfile = await fetchProfile(user.uid);
          setIsFollowing(myProfile?.following?.includes(uid) ?? false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid, user]);
    
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
  const handleFollow = async () => {
    if (!user) {
      toast.error("Login to follow users");
      return;
    }
    if (!uid || uid === user.uid) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(user.uid, uid);
        setIsFollowing(false);
        setProfile((prev) =>
          prev
            ? { ...prev, followers: prev.followers.filter((f) => f !== user.uid) }
            : prev
        );
        toast.success("Unfollowed");
      } else {
        await followUser(user.uid, uid);
        setIsFollowing(true);
        setProfile((prev) =>
          prev
            ? { ...prev, followers: [...prev.followers, user.uid] }
            : prev
        );
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
    }
  };

  const totalLikes = posts.reduce((sum, p) => sum + (p.likes ?? 0), 0);
  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : "??";

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">User not found</h1>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* ── PROFILE HEADER ── */}
          <div className="rounded-2xl border border-border/40 bg-card/50 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">

              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 text-2xl font-bold text-primary-foreground">
                {initials}
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">
                      @{(profile.displayName)}
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Anonymous voice on Free Express
                    </p>
                  </div>

                  {/* Follow button — hide if viewing own profile */}
                  {user?.uid !== uid && (
                    <Button
                      onClick={handleFollow}
                      disabled={followLoading}
                      size="sm"
                      className={`gap-2 ${
                        isFollowing
                          ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50"
                          : "bg-gradient-to-r from-primary to-primary/80"
                      }`}
                    >
                      {followLoading ? (
                        <Loader className="h-3.5 w-3.5 animate-spin" />
                      ) : isFollowing ? (
                        <><UserCheck className="h-3.5 w-3.5" /> Following</>
                      ) : (
                        <><UserPlus className="h-3.5 w-3.5" /> Follow</>
                      )}
                    </Button>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-bold text-foreground leading-none">{posts.length}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-accent" />
                    <div>
                      <p className="font-bold text-accent leading-none">{totalLikes}</p>
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

            {/* Bio */}
            {profile.bio && (
              <div className="mt-5 pt-5 border-t border-border/30">
                <p>About</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
          
          {/* ── AUTHOR POSTS ── */}
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            Posts by @{profile?.displayName}
            <span className="text-sm font-normal text-muted-foreground">
              ({posts.length})
            </span>
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-border/30 bg-card/30">
              <p className="text-muted-foreground text-sm">
                No posts from this user yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
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
                        to={u.uid === user?.uid ? "/profile" : `/user/${u.uid}`}
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
    </Layout>
  );
};

export default AuthorProfile;