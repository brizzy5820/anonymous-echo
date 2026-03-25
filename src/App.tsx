import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user);
        // Optional redirect after login
        // navigate("/");
      } else {
        console.log("No user");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:slug" element={<CategoryFeed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />
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
        <AppRoutes /> {/* ✅ FIXED */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;