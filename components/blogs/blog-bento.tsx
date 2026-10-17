import Link from "next/link";
import type { ArticleListItem } from "@/features/articles/model/types";

type Props = {
  blogs: ArticleListItem[];
};

export default function BlogBento({ blogs }: Props) {
  const mainBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 3);

  return (
    <section dir="rtl" className="w-full max-w-7xl pt-32 pb-24">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {mainBlog && (
          <Link
            href={`/blogs/${mainBlog.id}`}
            className="group relative min-h-[520px] overflow-hidden rounded-md md:col-span-2"
          >
            {mainBlog.mainImage && (
              <img
                data-navbar-dark
                src={mainBlog.mainImage.url}
                alt={mainBlog.title}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-8">
              <span className="text-sm text-white/70">{mainBlog.author}</span>
              <h2 className="mt-3 text-3xl font-medium text-white">
                {mainBlog.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/80">
                {mainBlog.summary}
              </p>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-5">
          {sideBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="group relative flex-1 overflow-hidden rounded-md"
            >
              {blog.mainImage && (
                <img
                  data-navbar-dark
                  src={blog.mainImage.url}
                  alt={blog.title}
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-5">
                <span className="text-xs text-white/70">{blog.author}</span>
                <h3 className="mt-2 text-xl text-white">{blog.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
