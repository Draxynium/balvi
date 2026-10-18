import { notFound } from "next/navigation";
import ArticleContent from "@/components/blog/article-content";
import ArticleToc from "@/components/blog/article-toc";
import { getPublishedArticle } from "@/features/articles/server/article-service";

export default async function BlogPage({ params }: PageProps<"/blogs/[id]">) {
  const { id } = await params;
  const article = await getPublishedArticle(id);
  if (!article) notFound();

  const readingTime = Math.max(
    1,
    Math.ceil(article.content.split(/\s+/).filter(Boolean).length / 220),
  );

  return (
    <main dir="rtl" className="relative flex w-full flex-col items-center">
      <header className="flex w-full max-w-7xl flex-col items-center px-6 pt-36 pb-12 md:pt-44 md:pb-16">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-3xl text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="text-foreground/50 mt-6 max-w-2xl text-base leading-8 md:text-lg">
            {article.summary}
          </p>
          <div className="text-foreground/40 mt-7 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span>{article.author}</span>
            <span>•</span>
            <time dateTime={article.publishedAtUtc}>
              {formatDate(article.publishedAtUtc)}
            </time>
            <span>•</span>
            <span>{readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
          </div>
        </div>
      </header>

      {article.mainImage && (
        <div className="flex w-full max-w-3xl justify-center px-6">
          <div className="bg-foreground/5 relative h-56 w-full overflow-hidden rounded-2xl sm:h-64 md:h-72 lg:h-80">
            <img
              src={article.mainImage.url}
              alt={article.title}
              className="size-full object-cover"
            />
          </div>
        </div>
      )}

      <section className="flex w-full max-w-7xl justify-center px-6 pt-20 pb-32 md:pt-24">
        <div className="flex w-full max-w-6xl items-stretch justify-between gap-16">
          <ArticleContent content={article.content} />
          <ArticleToc content={article.content} />
        </div>
      </section>

      {article.images.length > 1 && (
        <section className="w-full max-w-6xl px-6 pb-32">
          <h2 className="mb-6 text-2xl font-medium">تصاویر مقاله</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {article.images
              .filter((image) => !image.isMain)
              .map((image) => (
                <div
                  key={image.id}
                  className="bg-muted aspect-[4/3] overflow-hidden rounded-2xl"
                >
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="size-full object-cover"
                  />
                </div>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}
