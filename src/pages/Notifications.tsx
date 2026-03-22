import { Layout } from "@/components/layout/Layout";
import { MOCK_NOTIFICATIONS } from "@/lib/constants";
import { Heart, MessageCircle, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  trending: TrendingUp,
};

const Notifications = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold">
            Notifi<span className="text-gradient">cations</span>
          </h1>
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
            <Check className="h-4 w-4" /> Mark all read
          </Button>
        </div>

        <div className="space-y-2">
          {MOCK_NOTIFICATIONS.map((notif, i) => {
            const Icon = iconMap[notif.type];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  notif.read
                    ? "bg-card/30 border-border/20"
                    : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  notif.read ? "bg-secondary" : "bg-primary/20"
                }`}>
                  <Icon className={`h-4 w-4 ${notif.read ? "text-muted-foreground" : "text-primary"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
