import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link , useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight,Lightbulb, Loader, EyeOff, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { signIn } from "../lib/auth";
const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "That email is already registered. Try signing in instead.",
  "auth/invalid-email": "That doesn't look like a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
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
    } catch (err: any) {
      const friendly = ERROR_MESSAGES[err.code] || err.message || "Something went wrong. Please try again.";
      setError(friendly);
    } finally {
      setLoading(false);
    }   
   }
  return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-8rem)]">
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
                onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword?
                 <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" onClick={()=>setShowPassword(true)} />
                
                :
                
                   <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" onClick={()=>setShowPassword(false)} />
                }
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
