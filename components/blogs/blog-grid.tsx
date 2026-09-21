import { Blog } from "@/lib/blogs/types";
import BlogCard from "./blog-card";

type Props = {
  blogs: Blog[];
};

export default function BlogGrid({ blogs }: Props) {
  return (
    <section
      dir="rtl"
      className="
        w-full
        max-w-7xl
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-x-6
        gap-y-16
        pb-32
      "
    >
      {blogs.map((blog) => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </section>
  );
}