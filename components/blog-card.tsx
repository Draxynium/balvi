"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BlogCard({
  item,
}: {
  item: {
    name: string;
    description: string;
    image: string;
    href?: string;
  };
}) {
  const card = (
    <div className="flex w-40 shrink-0 flex-col gap-2 select-none sm:w-48 md:w-52">
      <div
        data-navbar-dark
        className="border-foreground/20 bg-card-foreground relative aspect-square w-full overflow-hidden rounded-md border"
      >
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        <ArrowUpRight
          className="text-background absolute bottom-2 left-2 h-5 w-5 sm:bottom-3 sm:left-3 sm:h-6 sm:w-6 md:h-7 md:w-7"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col items-start gap-0.5">
        <h3 className="text-sm leading-tight font-medium sm:text-base">
          {item.name}
        </h3>

        <p className="text-muted-foreground text-xs leading-tight sm:text-sm">
          {item.description}
        </p>
      </div>
    </div>
  );

  return item.href ? <Link href={item.href}>{card}</Link> : card;
}
