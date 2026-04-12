import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Bell, Search, User, PenSquare, Menu, X, LogOut, ChevronDown, Home, LayoutGrid, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { toast } from "sonner";
import { logOut } from "@/lib/auth";
import { getUnreadCount } from "@/lib/notifications";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    const load = async () => {
      const count = await getUnreadCount(user.uid);
      setUnreadCount(count);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logOut();
    setProfileDropdownOpen(false);
    navigate("/");
    toast("You have been logged out", {
      duration: 3000,
      position: "top-center",
      className: "bg-red-700 item-start border-border text-foreground shadow-lg rounded-xl",
      action: { label: "✕", onClick: () => toast.dismiss() },
    });
  };

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "?";

  return (
    <>
      {/* ── NAVBAR ──────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "glass border-border/30 bg-background/95 backdrop-blur-xl"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5">
                <span className="font-display text-xl font-bold text-foreground">
                  Free <span className="text-gradient">Express</span>
                </span>
              </Link>
            </div>

            {/* ── Desktop Navigation ─────────────── */}
            <div className="hidden lg:flex items-center gap-1.5">

              {/* Home */}
              <NavLink to="/">
                {({ isActive }) => (
                  <span className={`px-4 py-2 rounded-lg text-sm transition-colors hover:bg-secondary flex items-center gap-1.5 cursor-pointer ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}>
                    <Home className="w-4 h-4" />
                    Home
                  </span>
                )}
              </NavLink>

              {/* Categories dropdown */}
              <div ref={categoriesRef} className="relative">
                <button
                  onClick={() => setCategoriesDropdownOpen((o) => !o)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors hover:bg-secondary flex items-center gap-1.5 ${
                    categoriesDropdownOpen ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Categories
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {categoriesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-12 w-56 rounded-xl border border-border/40 bg-card shadow-xl shadow-black/20 overflow-hidden z-50"
                    >
                      <div className="px-3 py-2 border-b border-border/20">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          Browse Categories
                        </p>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            to={`/category/${cat.slug}`}
                            onClick={() => setCategoriesDropdownOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                              location.pathname === `/category/${cat.slug}`
                                ? "bg-secondary text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            <cat.icon className="h-4 w-4 shrink-0" />
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile link — desktop */}
              {user && (
                <NavLink to="/profile">
                  {({ isActive }) => (
                    <span className={`px-4 py-2 rounded-lg text-sm transition-colors hover:bg-secondary flex items-center gap-1.5 cursor-pointer ${
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                    }`}>
                      <User className="w-4 h-4" />
                      Profile
                    </span>
                  )}
                </NavLink>
              )}
            </div>

            {/* ── Right Side Actions ──────────────── */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Search className="h-5 w-5" />
              </Button>

              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link to="/create" className="hidden sm:block">
                <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 glow-primary gap-2">
                  <PenSquare className="h-4 w-4" />
                  Post
                </Button>
              </Link>

              {/* Auth — desktop */}
              {user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {initials}
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.displayName}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-52 rounded-xl border border-border/40 bg-card shadow-xl shadow-black/20 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-border/30">
                          <p className="text-sm font-semibold text-foreground truncate">@{user.displayName}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-1.5 flex flex-col gap-0.5">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <User className="h-4 w-4" /> My Profile
                          </Link>
                          <Link
                            to="/notifications"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Bell className="h-4 w-4" />
                            Notifications
                            {unreadCount > 0 && (
                              <span className="ml-auto text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold">
                                {unreadCount}
                              </span>
                            )}
                          </Link>
                        </div>
                        <div className="p-1.5 border-t border-border/30">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="h-4 w-4" /> Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="border-border/50 text-muted-foreground hover:text-foreground">
                    <User className="h-4 w-4 mr-1" /> Login
                  </Button>
                </Link>
              )}

              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE SIDE DRAWER ──────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop — clicking it closes the drawer */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer — slides in from the right */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-72 z-[70] bg-card border-l border-border/40 flex flex-col lg:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/30 shrink-0">
                <span className="font-display text-base font-bold text-foreground">
                  Free <span className="text-gradient">Express</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer body — scrollable */}
              <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">

                {/* Home */}
                <Link
                  to="/home"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    location.pathname === "/home"
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Home className="h-4 w-4 shrink-0" /> Home
                </Link>

                {/* Post button */}
                <Link to="/create" className="mt-1 mb-2">
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 justify-start">
                    <PenSquare className="h-4 w-4" /> Post Anonymously
                  </Button>
                </Link>

                {/* Categories section */}
                <div className="px-3 py-1.5 mt-1">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Categories
                  </p>
                </div>

                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      location.pathname === `/category/${cat.slug}`
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <cat.icon className="h-4 w-4 shrink-0" />
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Drawer footer — auth section */}
              <div className="border-t border-border/30 px-3 py-4 shrink-0">
                {user ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          @{user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <User className="h-4 w-4 shrink-0" /> My Profile
                    </Link>

                    <Link
                      to="/notifications"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Bell className="h-4 w-4 shrink-0" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4 shrink-0" /> Log Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login">
                      <Button variant="outline" className="w-full border-border/50 gap-2 justify-start">
                        <User className="h-4 w-4" /> Log In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/80 gap-2 justify-start">
                        <Sparkles className="h-4 w-4" /> Sign Up Free
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}