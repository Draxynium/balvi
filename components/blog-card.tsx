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
    <div className="w-52 shrink-0 flex flex-col gap-2 select-none">
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
          className="absolute bottom-3 left-3 w-7 h-7 text-background"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col items-start gap-0.5">
        <h3 className="text-base font-medium leading-tight">
          {item.name}
        </h3>

        <p className="text-sm text-muted-foreground leading-tight">
          {item.description}
        </p>
      </div>
    </div>
  );
}