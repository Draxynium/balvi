import BlogBento from "@/components/blogs/blog-bento";
import BlogGrid from "@/components/blogs/blog-grid";
import { getPublishedArticles } from "@/features/articles/server/article-service";

export default async function BlogsPage() {
  const result = await getPublishedArticles(1, 100);
  const featured = result.items.slice(0, 3);

  return (
    <main dir="rtl" className="flex w-full flex-col items-center px-6">
      {result.items.length === 0 ? (
        <section className="grid min-h-screen place-items-center text-center">
          <div>
            <h1 className="text-4xl font-medium">مقالات بالوی</h1>
            <p className="text-muted-foreground mt-4">
              هنوز مقاله‌ای برای نمایش منتشر نشده است.
            </p>
          </div>
        </section>
      ) : (
        <>
          <BlogBento blogs={featured} />
          <section className="flex w-full max-w-7xl flex-col gap-10">
            <div className="border-foreground/10 flex items-end justify-between border-b pb-6">
              <div>
                <p className="text-primary text-sm">یادداشت‌های بالوی</p>
                <h1 className="mt-2 text-3xl font-medium">همه مقالات</h1>
              </div>
              <span className="text-muted-foreground text-sm">
                {result.totalCount.toLocaleString("fa-IR")} مقاله
              </span>
            </div>
            <BlogGrid blogs={result.items} />
          </section>
        </>
      )}
    </main>
  );
}
