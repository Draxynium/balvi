import Link from "next/link";
import type { ArticleListItem } from "@/features/articles/model/types";

type Props = {
  blog: ArticleListItem;
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "persian",
    timeZone: "UTC",
  }).format(date);
}

export default function BlogCard({ blog }: Props) {
  const dateLabel = formatDate(blog.publishedAtUtc);

  return (
    <Link href={`/blogs/${blog.id}`} className="group flex flex-col">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-md">
        {blog.mainImage ? (
          <img
            data-navbar-dark
            src={blog.mainImage.url}
            alt={blog.title}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 pt-5">
        <span className="text-foreground/40 text-xs">{blog.author}</span>

        <h2 className="text-2xl leading-tight">{blog.title}</h2>

        <p className="text-foreground/50 text-sm leading-7">{blog.summary}</p>

        {dateLabel ? (
          <time
            dateTime={blog.publishedAtUtc}
            className="text-foreground/40 text-sm"
            dir="rtl"
          >
            {dateLabel}
          </time>
        ) : null}
      </div>
    </Link>
  );
}
