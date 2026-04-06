import { Layout } from "@/components/layout/Layout";
import { Heart, MessageCircle, TrendingUp, UserPlus, Check, Loader, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchNotifications, markAsRead, markAllAsRead } from "@/lib/notifications";
import { Notification } from "@/lib/types";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  trending: TrendingUp,
  follow: UserPlus,
};

const colorMap = {
  like: "text-red-400",
  comment: "text-blue-400",
  trending: "text-orange-400",
  follow: "text-primary",
};

const bgMap = {
  like: "bg-red-500/10",
  comment: "bg-blue-500/10",
  trending: "bg-orange-500/10",
  follow: "bg-primary/10",
};

const Notifications = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  // Redirect if not logged in
  if (!authLoading && !user) return <Navigate to="/login" replace />;

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications(user.uid);
        setNotifications(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    setMarkingAll(true);
    try {
      await markAllAsRead(user.uid);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
      <div className="container mx-auto px-4 py-8 max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Notifi<span className="text-gradient">cations</span>
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} unread
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2 hover:text-foreground"
              onClick={handleMarkAllRead}
              disabled={markingAll}
            >
              {markingAll
                ? <Loader className="h-4 w-4 animate-spin" />
                : <Check className="h-4 w-4" />
              }
              Mark all read
            </Button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 rounded-2xl border border-border/30 bg-card/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No notifications yet</p>
            <p className="text-sm text-muted-foreground">
              When someone likes, comments, or follows you — it'll show up here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {notifications.map((notif, i) => {
                const Icon = iconMap[notif.type] ?? Bell;
                const iconColor = colorMap[notif.type] ?? "text-primary";
                const iconBg = bgMap[notif.type] ?? "bg-primary/10";

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                      notif.read
                        ? "bg-card/30 border-border/20 hover:bg-card/50"
                        : "bg-primary/5 border-primary/20 hover:bg-primary/8"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      notif.read ? "bg-secondary/60" : iconBg
                    }`}>
                      <Icon className={`h-4 w-4 ${notif.read ? "text-muted-foreground" : iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${
                        notif.read ? "text-muted-foreground" : "text-foreground font-medium"
                      }`}>
                        {notif.message}
                      </p>

                      {/* Link to the post if applicable */}
                      {notif.postId && (
                        <Link
                          to={`/post/${notif.postId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-primary hover:underline mt-0.5 inline-block"
                        >
                          View post →
                        </Link>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        {getTimeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
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

export default Notifications;