import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Bell, Search, User, PenSquare, Menu, X, LogOut, ChevronDown, Home } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load unread notifications
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    const load = async () => {
      const count = await getUnreadCount(user.uid);
      setUnreadCount(count);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logOut();
    setProfileDropdownOpen(false);
    navigate("/");

    toast("You have been logged out", {
      duration: 3000,
      position: "top-center",
      className: "bg-red-700 item-start border-border text-foreground shadow-lg rounded-xl",
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "?";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "glass border-border/30 bg-background/95 backdrop-blur-xl"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex items-center justify-between h-16">

          {/* Logo + "Free Express" */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="font-display text-xl font-bold text-foreground">
                Free <span className="text-gradient">Express</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1.5">
            <NavLink to="/">
              {({ isActive }) => (
                <span
                  className={`px-4 py-2 rounded-lg text-sm transition-colors hover:bg-secondary flex items-center gap-1.5 ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </span>
              )}
            </NavLink>

            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`px-2 py-2 rounded-lg text-sm transition-colors hover:bg-secondary flex items-center gap-1.5 ${
                  location.pathname === `/category/${cat.slug}`
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <div className="inline-flex px-3 gap-1.5 justify-center items-center">
                  <cat.icon className="h-4 w-4 mb-0.5" /> {cat.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
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

            {/* Auth Section - Desktop */}
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
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
                  />
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
                        <p className="text-sm font-semibold text-foreground truncate">
                          @{user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-1.5 flex flex-col gap-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <User className="h-4 w-4" />
                          My Profile
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
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="border-border/50 text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/30 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <cat.icon className="h-4 w-4" /> {cat.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-border/30 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Signed in as <span className="text-foreground font-medium">@{user.displayName}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <User className="h-4 w-4" /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}