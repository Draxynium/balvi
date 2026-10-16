"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";

type ArticleContentProps = {
  content: string;
};

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <article dir="rtl" className="text-foreground w-full max-w-3xl min-w-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          h1: ({ children, id }) => (
            <h1
              id={id}
              className="mt-16 mb-8 scroll-mt-32 text-4xl font-medium tracking-tight md:text-5xl"
            >
              {children}
            </h1>
          ),

          h2: ({ children, id }) => (
            <h2
              id={id}
              className="mt-16 mb-6 scroll-mt-32 text-3xl font-medium tracking-tight md:text-4xl"
            >
              {children}
            </h2>
          ),

          h3: ({ children, id }) => (
            <h3
              id={id}
              className="mt-12 mb-4 scroll-mt-32 text-2xl font-medium tracking-tight"
            >
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="text-foreground/70 mb-6 text-lg leading-9 md:text-xl md:leading-10">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-foreground/80">{children}</em>
          ),

          a: ({ href, children }) => {
            const internal = href?.startsWith("/");

            return (
              <a
                href={href}
                target={internal ? undefined : "_blank"}
                rel={internal ? undefined : "noopener noreferrer"}
                className="text-primary decoration-primary/30 hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
              >
                {children}
              </a>
            );
          },

          ul: ({ children }) => (
            <ul className="text-foreground/70 marker:text-primary mb-8 space-y-3 pr-6 text-lg leading-9 md:text-xl">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="text-foreground/70 marker:text-primary mb-8 space-y-3 pr-6 text-lg leading-9 md:text-xl">
              {children}
            </ol>
          ),

          li: ({ children }) => <li className="pr-2">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="border-primary text-foreground/80 my-10 border-r-2 pr-6 text-xl leading-9 md:text-2xl">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="border-foreground/10 my-14" />,

          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") {
              return null;
            }

            return (
              <figure className="my-12 w-full">
                <div className="bg-foreground/5 relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={alt ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>

                {alt && (
                  <figcaption className="text-foreground/40 mt-3 text-center text-sm">
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
                  src={typeof src === "string" ? src : undefined}
                  controls
                  playsInline
                  className="h-auto w-full"
                  {...props}
                />
              </div>
            </figure>
          ),

          table: ({ children }) => (
            <div className="border-foreground/10 my-10 w-full overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[500px] border-collapse text-right text-base">
                {children}
              </table>
            </div>
          ),

          th: ({ children }) => (
            <th className="border-foreground/10 bg-foreground/[0.03] border-b px-5 py-4 font-medium">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-foreground/10 text-foreground/70 border-b px-5 py-4">
              {children}
            </td>
          ),

          pre: ({ children }) => (
            <pre className="my-8 overflow-x-auto">{children}</pre>
          ),

          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");

            if (isBlock) {
              return (
                <code className="bg-foreground/[0.04] block overflow-x-auto rounded-xl p-5 text-sm leading-7">
                  {children}
                </code>
              );
            }

            return (
              <code className="bg-foreground/[0.06] rounded-md px-1.5 py-0.5 text-[0.9em]">
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
