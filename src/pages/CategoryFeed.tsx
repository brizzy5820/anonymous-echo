import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { CATEGORIES } from "@/lib/constants";
import { fetchPosts } from "@/lib/posts";
import { Post } from "@/lib/types";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 ,Sparkle} from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryPill } from "@/components/CategoryPill";
const CategoryFeed = () => {
  const { slug } = useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const categoryPosts = await fetchPosts(slug);
        setPosts(categoryPosts);
      } catch (error) {
        console.error("Failed to fetch category posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [slug]);

  if (!cat) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center ">
          <h1 className="font-display text-2xl font-bold">
            Category not found
          </h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
        {/* ── CATEGORY PILLS ────────────────────────── */}
            <div className="border-b border-border/30 sticky top-16 z-40 bg-background/90 backdrop-blur-md">
              <div className="container mx-auto px-4 py-3 max-w-[1200px]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <CategoryPill name="All" icon={Sparkle} slug="" active />
                  {CATEGORIES.map((cat) => (
                    <CategoryPill key={cat.slug} name={cat.name} icon={cat.icon} slug={cat.slug} />
                  ))}
                </div>
              </div>
            </div>
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
        <div className="mb-8">
          <div className="inline-flex items-center gap-3">
            <cat.icon className="w-5 h-5 mt-2" />
            <h1 className="font-display text-3xl font-bold mt-2 text-foreground">
              {cat.name}
            </h1>
          </div>
          <p className="text-muted-foreground">{cat.description}</p>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading posts...
          </div>
        ) : posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No posts in this category yet. Be the first!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryFeed;
