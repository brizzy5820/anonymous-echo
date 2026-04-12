import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
interface CategoryPillProps {
  name: string;
 icon: LucideIcon;
  slug: string;
  active?: boolean;
}

export function CategoryPill({ name, icon:Icon, slug, active }: CategoryPillProps) {
    const { pathname } = useLocation();
    const pillRef= useRef<HTMLAnchorElement>(null);
     const isActive = active !== undefined
    ? active  // if parent explicitly passes active, respect it
    : slug === ""
      ? !pathname.startsWith("/category")
      : pathname === `/category/${slug}`;

  const href = slug === "" ? "/" : `/category/${slug}`;
  useEffect(()=>{
    if(isActive && pillRef.current){
      pillRef.current.scrollIntoView({
        behavior: 'smooth',
        block:'nearest',
        inline:'center',
      })
    }
  },[isActive]);
  return (
    <Link
    ref={pillRef}
      to={href}
      className={`inline-flex items-center gap-1.5  max-w-[1200px] px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
        active || location.pathname === `/category/${slug}`
          ? "bg-primary/20 border-primary/40 text-foreground glow-primary"
          : "bg-secondary/50 border-border/30 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border/60"
      }`}
    >
      <span><Icon className="h-4 w-4" /></span>
      <span>{name}</span>
    </Link>
  );
}
