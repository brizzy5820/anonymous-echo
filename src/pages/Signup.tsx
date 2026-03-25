import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Lightbulb,
  X,
  AlertCircle,
  Loader,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useEffect } from "react";
import { signUp } from "../lib/auth";
import WelcomeModal from "@/components/WelcomeModal";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "That email is already registered. Try signing in instead.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/network-request-failed": "Network error. Check your connection and try again."
};

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signUp(email, password, username);

      // Show welcome modal instead of instant redirect
      setShowWelcome(true);

    } catch (err: any) {
      const friendly =
        ERROR_MESSAGES[err.code] ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">

      {/* ERROR TOAST */}
      <AnimatePresence>
        {error && (
          <motion.div
            key="error-toast"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="relative flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/80 backdrop-blur-md px-4 py-3 shadow-xl shadow-red-900/30 overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-red-500/60"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <p className="flex-1 text-sm text-red-200">{error}</p>
              <button onClick={() => setError("")}>
                <X className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-primary-foreground">UE</span>
          </div>

          <h1 className="text-3xl font-bold">
            Join the <span className="text-gradient">Unknown</span>
          </h1>

          <p className="text-muted-foreground mt-2">
            Create an account for a persistent identity
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" /> Creating...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      </motion.div>

      {/* ✅ WELCOME MODAL */}
      <WelcomeModal
        open={showWelcome}
        username={username}
        onContinue={() => navigate("/")}
      />
    </div>
  );
};

export default Signup;