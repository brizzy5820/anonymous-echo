import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type WelcomeModalProps = {
  open: boolean;
  username: string;
  onContinue: () => void;
};
const WelcomeModal = ({ open, username, onContinue }: WelcomeModalProps) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onContinue();
    }, 4000);

    return () => clearTimeout(timer);
  }, [open, onContinue]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-2">
              Welcome, <span className="text-gradient">{username}</span> 🎉
            </h2>

            <p className="text-muted-foreground mb-6">
              Your account has been created successfully.
            </p>

            <Button onClick={onContinue} className="w-full gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-xs mt-3 text-muted-foreground">
              Redirecting automatically...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;