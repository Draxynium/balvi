"use client";

import GithubSlugger from "github-slugger";
import { useEffect, useMemo, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type ArticleTocProps = {
  content: string;
};

export default function ArticleToc({ content }: ArticleTocProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings.length) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside dir="rtl" className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-32">
        <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/45">
          <span className="h-1 w-1 rounded-full bg-primary" />
          در این مقاله
        </div>

        <nav className="relative">
          {/* right-side rail */}
          <div className="absolute inset-y-0 right-0 w-px bg-foreground/10" />

          <ul className="flex flex-col gap-0.5">
            {headings.map((heading) => {
              const active = activeId === heading.id;
              const isSub = heading.level === 3;

              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setActiveId(heading.id)}
                    className={[
                      "group relative block rounded-l-md py-2 pl-3 transition-colors duration-200",
                      isSub ? "pr-7 text-[13px] leading-5" : "pr-4 text-sm leading-6",
                      active
                        ? "bg-foreground/[0.04] text-foreground"
                        : isSub
                        ? "text-foreground/45 hover:bg-foreground/[0.03] hover:text-foreground/80"
                        : "text-foreground/70 hover:bg-foreground/[0.03] hover:text-foreground",
                    ].join(" ")}
                  >
                    {/* active bar on the right rail */}
                    <span
                      className={[
                        "absolute right-0 top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all duration-200",
                        active
                          ? "h-[60%] bg-primary"
                          : "h-0 bg-transparent group-hover:h-[30%] group-hover:bg-foreground/20",
                      ].join(" ")}
                    />

                    <span className={active ? "font-medium" : ""}>
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.replace(/^[\uFEFF\u200B-\u200D]+/, "");
    const match = line.match(/^\s*(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2]
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();

    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}