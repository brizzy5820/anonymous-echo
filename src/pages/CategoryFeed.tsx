import { Layout } from "@/components/layout/Layout";
import { PostCard } from "@/components/PostCard";
import { CATEGORIES, MOCK_POSTS } from "@/lib/constants";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CategoryFeed = () => {
  const { slug } = useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const posts = MOCK_POSTS.filter((p) => p.category === slug);

  if (!cat) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold">
            Category not found
          </h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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

        {posts.length > 0 ? (
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
