import { Link } from "react-router-dom";

interface CategoryPillProps {
  name: string;
  emoji: string;
  slug: string;
  active?: boolean;
}

export function CategoryPill({ name, emoji, slug, active }: CategoryPillProps) {
  return (
    <Link
      to={`/category/${slug}`}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
        active
          ? "bg-primary/20 border-primary/40 text-foreground glow-primary"
          : "bg-secondary/50 border-border/30 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border/60"
      }`}
    >
      <span>{emoji}</span>
      <span>{name}</span>
    </Link>
  );
}
