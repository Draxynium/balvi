import Image from "next/image";
import Link from "next/link";

import { Blog } from "@/lib/blogs/types";

type Props = {
  blogs: Blog[];
};

export default function BlogBento({ blogs }: Props) {
  const mainBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 3);

  return (
    <section dir="rtl" className="w-full max-w-7xl pt-32 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {mainBlog && (
          <Link
            href={`/blogs/${mainBlog.slug}`}
            className="group relative overflow-hidden rounded-md md:col-span-2 min-h-[520px]"
          >
            <Image
              src={mainBlog.cover}
              alt={mainBlog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 to-transparent">
              <span className="text-sm text-white/70">{mainBlog.category}</span>
              <h2 className="mt-3 text-3xl font-medium text-white">{mainBlog.title}</h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/80">
                {mainBlog.description}
              </p>
            </div>
          </Link>
        )}

        <div className="flex flex-col gap-5">
          {sideBlogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group relative flex-1 overflow-hidden rounded-md"
            >
              <Image
                src={blog.cover}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/50 to-transparent">
                <span className="text-xs text-white/70">{blog.category}</span>
                <h3 className="mt-2 text-xl text-white">{blog.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}