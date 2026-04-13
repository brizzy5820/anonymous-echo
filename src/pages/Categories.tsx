import { Layout } from "@/components/layout/Layout";
import { CATEGORIES } from "@/lib/constants";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader, Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { CategoryPill } from "@/components/CategoryPill";
// Stores post count per category slug
type CategoryCounts = Record<string, number>;

const Categories = () => {
  const [counts, setCounts] = useState<CategoryCounts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        // Fire all count queries simultaneously — one per category
        // getCountFromServer is efficient — it doesn't download the actual documents
        // it just returns the number of matching documents from Firestore
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            const q = query(
              collection(db, "posts"),
              where("category", "==", cat.slug)
            );
            const snapshot = await getCountFromServer(q);
            return { slug: cat.slug, count: snapshot.data().count };
          })
        );

        // Convert array to object keyed by slug for easy lookup
        // { "confessions": 12, "relationships": 8, ... }
        const countMap: CategoryCounts = {};
        results.forEach(({ slug, count }) => {
          countMap[slug] = count;
        });
        setCounts(countMap);
      } catch (err) {
        console.error("Failed to fetch category counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Layout>
        <style>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
           {/* ── CATEGORY PILLS ────────────────────────── */}
            <div className="border-b border-border/30 sticky top-16 z-40 bg-background/90 backdrop-blur-md">
              <div className="container mx-auto px-4 py-3 max-w-[1200px]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <CategoryPill name="All" icon={Sparkle} slug=""  />
                  {CATEGORIES.map((cat) => (
                    <CategoryPill key={cat.slug} name={cat.name} icon={cat.icon} slug={cat.slug} />
                  ))}
                </div>
              </div>
            </div>
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
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
                <div className="group p-6 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 transition-all duration-300 hover:border-primary/30 hover:glow-primary h-full flex flex-col">

                  {/* Icon + name */}
                  <div className="inline-flex items-center gap-3 mb-2">
                    <cat.icon className="w-5 h-5" />
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {cat.name}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">
                    {cat.description}
                  </p>

                  {/* Footer — post count + explore link */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20">
                    {/* Live post count */}
                    <span className="text-xs text-muted-foreground">
                      {loading ? (
                        <span className="flex items-center gap-1">
                          <Loader className="h-3 w-3 animate-spin" />
                          loading...
                        </span>
                      ) : (
                        <>
                          {counts[cat.slug] ?? 0}{" "}
                          {(counts[cat.slug] ?? 0) === 1 ? "post" : "posts"}
                        </>
                      )}
                    </span>

                    {/* Explore arrow */}
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                      Explore{" "}
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
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