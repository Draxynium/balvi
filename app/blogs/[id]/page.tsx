import { notFound } from "next/navigation";
import ArticleContent from "@/components/blog/article-content";
import ArticleToc from "@/components/blog/article-toc";
import { getAllArticles, getArticle } from "@/lib/blog";

type BlogPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    id: article.id,
  }));
}

export default async function BlogPage({
  params,
}: BlogPageProps) {
  const { id } = await params;

  const article = getArticle(id);

  if (!article) {
    notFound();
  }

  const {
    title,
    date,
    description,
    category,
    tags,
    cover,
    author,
  } = article.frontmatter;

  return (
    <main
      dir="rtl"
      className="relative flex w-full flex-col items-center"
    >
      <header className="flex w-full max-w-7xl flex-col items-center px-6 pb-12 pt-36 md:pb-16 md:pt-44">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          {category && (
            <div className="mb-6 rounded-md border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary">
              {category}
            </div>
          )}

          <h1 className="max-w-3xl text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {description && (
            <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/50 md:text-lg">
              {description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-foreground/40">
            {author && (
              <>
                <span>{author}</span>
                <span>•</span>
              </>
            )}

            <time dateTime={date}>
              {formatDate(date)}
            </time>

            <span>•</span>

            <span>
              {article.readingTime} دقیقه مطالعه
            </span>
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {cover && (
        <div className="flex w-full max-w-4xl justify-center px-6">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl bg-foreground/5">
            <img
              src={cover}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <section className="flex w-full max-w-7xl justify-center px-6 pb-32 pt-20 md:pt-24">
        <div className="flex w-full max-w-6xl items-stretch justify-between gap-16">
          <ArticleContent content={article.content} />
          <ArticleToc content={article.content} />
        </div>
      </section>
    </main>
  );
}

function formatDate(date: string) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}