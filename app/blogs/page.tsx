import BlogBento from "@/components/blogs/blog-bento";
import BlogGrid from "@/components/blogs/blog-grid";
import BlogSort from "@/components/blogs/blog-sort";

import { getAllBlogs, getBentoBlogs } from "@/lib/blogs";

type Props = {
  searchParams: Promise<{
    sort?: string;
  }>;
};

export default async function BlogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = params.sort ?? "newest";

  const bentoBlogs = getBentoBlogs();
  let blogs = getAllBlogs();

  if (sort === "popular") {
    blogs = [...blogs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
  }

  if (sort === "newest") {
    blogs = [...blogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return (
    <main dir="rtl" className="flex w-full flex-col items-center">
      <BlogBento blogs={bentoBlogs} />

      <section className="flex w-full max-w-7xl flex-col gap-10">
        <BlogSort sort={sort} />
        <BlogGrid blogs={blogs} />
      </section>
    </main>
  );
}