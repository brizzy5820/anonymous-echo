import { Layout } from "@/components/layout/Layout";
import { CATEGORIES } from "@/lib/constants";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-2">
          Browse <span className="text-gradient">Categories</span>
        </h1>
        <p className="text-muted-foreground mb-8">Find posts that match your vibe.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/category/${cat.slug}`}>
                <div className="group p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/30 hover:glow-primary">
                  <cat.icon className="h-8 w-8 mb-3" />
                  <h2 className="font-display text-xl font-semibold mt-3 text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">{cat.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                    Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
