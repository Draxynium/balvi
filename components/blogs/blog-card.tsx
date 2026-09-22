import Image from "next/image";
import Link from "next/link";

import { Blog } from "@/lib/blogs/types";

type Props = {
  blog: Blog;
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
  const dateLabel = formatDate(blog.date);

  return (
    <Link href={`/blogs/${blog.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
        {blog.cover ? (
          <Image
            data-navbar-dark
            src={blog.cover}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-3 pt-5">
        <span className="text-xs text-foreground/40">{blog.category}</span>

        <h2 className="text-2xl leading-tight">{blog.title}</h2>

        <p className="text-sm leading-7 text-foreground/50">
          {blog.description}
        </p>

        {dateLabel ? (
          <time
            dateTime={blog.date}
            className="text-sm text-foreground/40"
            dir="rtl"
          >
            {dateLabel}
          </time>
        ) : null}
      </div>
    </Link>
  );
}