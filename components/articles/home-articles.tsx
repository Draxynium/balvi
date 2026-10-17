"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import BlogCard from "@/components/blog-card";
import ItemsCarousel from "@/components/items-carousel";
import { articleApi } from "@/features/articles/api/article-api";
import type { ArticleListItem } from "@/features/articles/model/types";

export function HomeArticles() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    articleApi
      .list(1, 8)
      .then((result) => {
        if (active) setArticles(result.items);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-muted-foreground grid min-h-52 place-items-center">
        <LoaderCircle className="animate-spin" size={26} />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <p className="text-muted-foreground py-16 text-center text-sm">
        هنوز مقاله‌ای منتشر نشده است.
      </p>
    );
  }

  return (
    <>
      <ItemsCarousel>
        {articles.map((article) => (
          <BlogCard
            key={article.id}
            item={{
              name: article.title,
              description: article.summary,
              image: article.mainImage?.url || "/images/blog.png",
              href: `/blogs/${article.id}`,
            }}
          />
        ))}
      </ItemsCarousel>
      <Link href="/blogs" className="mt-8 text-sm underline underline-offset-4">
        مشاهده همه مقالات
      </Link>
    </>
  );
}
