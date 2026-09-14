"use client";

import { ArrowUpRight } from "lucide-react";

export default function BlogCard({
  item,
}: {
  item: {
    name: string;
    description: string;
    image: string;
  };
}) {
  return (
    <div className="w-40 sm:w-48 md:w-52 shrink-0 flex flex-col gap-2 select-none">
      <div
        data-navbar="dark"
        className="relative w-full aspect-square rounded-md overflow-hidden border border-foreground/20 bg-card-foreground"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />

        <ArrowUpRight
          className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-background"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col items-start gap-0.5">
        <h3 className="text-sm sm:text-base font-medium leading-tight">
          {item.name}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
          {item.description}
        </p>
      </div>
    </div>
  );
}