import type { ArticleListItem } from "@/features/articles/model/types";
import BlogCard from "./blog-card";

type Props = {
  blogs: ArticleListItem[];
};

export default function BlogGrid({ blogs }: Props) {
  return (
    <section
      dir="rtl"
      className="grid w-full max-w-7xl grid-cols-1 gap-x-6 gap-y-16 pb-32 md:grid-cols-2 xl:grid-cols-3"
    >
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </section>
  );
}
