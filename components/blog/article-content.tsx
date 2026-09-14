"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useMemo } from "react";

type ArticleContentProps = {
  content: string;
};

export default function ArticleContent({
  content,
}: ArticleContentProps) {
  const headings = useMemo(
    () => extractHeadings(content),
    [content]
  );

  let headingIndex = 0;

  return (
    <article
      dir="rtl"
      className="min-w-0 w-full max-w-3xl text-foreground"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          h1: ({ children, id }) => (
            <h1
              id={id}
              className="mb-8 mt-16 scroll-mt-32 text-4xl font-medium tracking-tight md:text-5xl"
            >
              {children}
            </h1>
          ),

          h2: ({ children, id }) => (
            <h2
              id={id}
              className="mb-6 mt-16 scroll-mt-32 text-3xl font-medium tracking-tight md:text-4xl"
            >
              {children}
            </h2>
          ),

          h3: ({ children, id }) => (
            <h3
              id={id}
              className="mb-4 mt-12 scroll-mt-32 text-2xl font-medium tracking-tight"
            >
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-6 text-lg leading-9 text-foreground/70 md:text-xl md:leading-10">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-foreground/80">
              {children}
            </em>
          ),

          a: ({ href, children }) => {
            const internal =
              href?.startsWith("/");

            return (
              <a
                href={href}
                target={
                  internal ? undefined : "_blank"
                }
                rel={
                  internal
                    ? undefined
                    : "noopener noreferrer"
                }
                className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
              >
                {children}
              </a>
            );
          },

          ul: ({ children }) => (
            <ul className="mb-8 space-y-3 pr-6 text-lg leading-9 text-foreground/70 marker:text-primary md:text-xl">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="mb-8 space-y-3 pr-6 text-lg leading-9 text-foreground/70 marker:text-primary md:text-xl">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pr-2">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-10 border-r-2 border-primary pr-6 text-xl leading-9 text-foreground/80 md:text-2xl">
              {children}
            </blockquote>
          ),

          hr: () => (
            <hr className="my-14 border-foreground/10" />
          ),

          img: ({ src, alt }) => {
            if (
              !src ||
              typeof src !== "string"
            ) {
              return null;
            }

            return (
              <figure className="my-12 w-full">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-foreground/5">
                  <Image
                    src={src}
                    alt={alt ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>

                {alt && (
                  <figcaption className="mt-3 text-center text-sm text-foreground/40">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },

          video: ({ src, ...props }) => (
            <figure className="my-12 w-full">
              <div className="overflow-hidden rounded-2xl bg-black">
                <video
                  src={
                    typeof src === "string"
                      ? src
                      : undefined
                  }
                  controls
                  playsInline
                  className="h-auto w-full"
                  {...props}
                />
              </div>
            </figure>
          ),

          table: ({ children }) => (
            <div className="my-10 w-full overflow-x-auto rounded-xl border border-foreground/10">
              <table className="w-full min-w-[500px] border-collapse text-right text-base">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border-b border-foreground/10 bg-foreground/[0.03] px-5 py-4 font-medium">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-foreground/10 px-5 py-4 text-foreground/70">
              {children}
            </td>
          ),

          pre: ({ children }) => (
            <pre className="my-8 overflow-x-auto">
              {children}
            </pre>
          ),

          code: ({
            children,
            className,
          }) => {
            const isBlock =
              className?.includes(
                "language-"
              );

            if (isBlock) {
              return (
                <code className="block overflow-x-auto rounded-xl bg-foreground/[0.04] p-5 text-sm leading-7">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 text-[0.9em]">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

function extractHeadings(
  content: string
) {
  const lines = content.split("\n");

  const headings: {
    id: string;
    text: string;
    level: number;
  }[] = [];

  const usedIds = new Map<string, number>();

  for (const line of lines) {
    const match = line.match(
      /^(#{2,3})\s+(.+)$/
    );

    if (!match) continue;

    const level = match[1].length;

    const text = match[2]
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(
        /\[(.*?)\]\(.*?\)/g,
        "$1"
      )
      .trim();

    const baseId = slugify(text);

    const count =
      usedIds.get(baseId) ?? 0;

    usedIds.set(baseId, count + 1);

    const id =
      count === 0
        ? baseId
        : `${baseId}-${count + 1}`;

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FF\w\s-]/g, "")
    .replace(/\s+/g, "-");
}