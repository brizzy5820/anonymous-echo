import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes,useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Categories from "./pages/Categories";
import CategoryFeed from "./pages/CategoryFeed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { ReactNode, useEffect, useState } from "react";

const queryClient = new QueryClient();

type AuthGateProps = {
  isLoading: boolean;
  isAuthenticated: boolean;
  children: ReactNode;
};

const ProtectedRoute = ({ isLoading, isAuthenticated, children }: AuthGateProps) => {
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const GuestOnlyRoute = ({ isLoading, isAuthenticated, children }: AuthGateProps) => {
  const location = useLocation() // import this from react-router-dom
  if (isLoading) return null;
  // Don't redirect if we're on signup — let the page handle its own redirect
  if (isAuthenticated && location.pathname !== "/signup") return <Navigate to="/" replace />;
  return <>{children}</>;
};
const AppRoutes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<CategoryFeed />} />
      <Route
        path="/login"
        element={
          <GuestOnlyRoute isLoading={isLoadingAuth} isAuthenticated={isAuthenticated}>
            <Login />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnlyRoute isLoading={isLoadingAuth} isAuthenticated={isAuthenticated}>
            <Signup />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isLoading={isLoadingAuth} isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute isLoading={isLoadingAuth} isAuthenticated={isAuthenticated}>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
