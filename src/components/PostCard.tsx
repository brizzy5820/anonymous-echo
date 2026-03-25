import { Link } from "react-router-dom";
import { Heart, MessageCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/constants";
import { motion } from "framer-motion";

interface PostCardProps {
  id: string;
  nickname: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export function PostCard({ id, nickname, category, title, content, likes, comments, createdAt }: PostCardProps) {
  const cat = CATEGORIES.find((c) => c.slug === category);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/post/${id}`}>
        <article className="group rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 p-5 transition-all duration-300 hover:border-primary/30 hover:glow-primary">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                <span className="text-xs font-bold text-foreground">{nickname[0]?.toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{nickname}</span>
            </div>
            {cat && (
              <Badge variant="secondary" className="text-xs inline-flex items-center gap-1 bg-secondary/80 text-secondary-foreground border-0">
              <cat.icon className="w-4 h-4"/> {cat.name}
              </Badge>
            )}
          </div>

          {/* Content */}
          <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{content}</p>

          {/* Footer */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs hover:text-accent transition-colors">
              <Heart className="h-3.5 w-3.5" /> {likes}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <MessageCircle className="h-3.5 w-3.5" /> {comments}
            </span>
            <span className="flex items-center gap-1 text-xs ml-auto">
              <Clock className="h-3.5 w-3.5" /> {timeAgo}
            </span>
          </div>
        </article>
      </Link>
    </motion.div>
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
