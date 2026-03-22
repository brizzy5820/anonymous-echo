import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, PenSquare, Bell, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid3X3, label: "Categories", path: "/categories" },
  { icon: PenSquare, label: "Post", path: "/create" },
  { icon: Bell, label: "Alerts", path: "/notifications" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/30 sm:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isCreate = item.path === "/create";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                isCreate
                  ? "text-primary-foreground"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {isCreate ? (
                <div className="w-10 h-10 -mt-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              ) : (
                <item.icon className="h-5 w-5" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
