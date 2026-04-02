import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link , useNavigate} from "react-router-dom";
import { motion , AnimatePresence} from "framer-motion";
import { Mail, Lock, ArrowRight,Lightbulb, Loader, EyeOff, Eye , AlertCircle,X} from "lucide-react";
import { useState, useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { signIn } from "../lib/auth";
// Error Messages
const ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That doesn't look like a valid email.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Try again.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
   useEffect(() => {
     if (!error) return;
     const timer = setTimeout(() => setError(""), 5000);
     return () => clearTimeout(timer);
   }, [error]);

   const handleSubmit= async(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        await signIn(email, password)    // await signIn(email, password);
      navigate("/");
    } catch (error: unknown) {
      const firebaseError = error instanceof FirebaseError ? error : null;
      const friendly = (firebaseError?.code ? ERROR_MESSAGES[firebaseError.code] : undefined) || firebaseError?.message || "Something went wrong. Please try again.";
      setError(friendly);
    } finally {
      setLoading(false);
    }   
   }
  return (
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <AnimatePresence>
  {error && (
    <motion.div
      key="error-toast"
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -60 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <div className="relative flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/80 backdrop-blur-md px-4 py-3 shadow-xl">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary-foreground">UE</span>
            </div>
            <h1 className="font-display text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to access your profile & notifications</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                required
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-card/50 border-border/40"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-card/50 border-border/40"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-primary to-primary/80 glow-primary gap-2 font-display">
              {
                loading?(
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
                ):(
                 <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                 </>
                )
              }
              
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
            <p className="text-center text-sm text-muted-foreground  mt-3">
            Back to
            <Link to="/" className="text-primary px-1 hover:underline font-medium">
            Home
            </Link>
          </p>
          <div className="mt-6 p-4 rounded-xl bg-card/30 border border-border/30 text-center">
            <p className="text-xs text-muted-foreground flex  ">
              <Lightbulb className="w-5 h-5 text-yellow-500"/> You can still post anonymously without an account — just pick a nickname!
            </p>
          </div>
        </motion.div>
      </div>
 
  );
};

export default Login;
