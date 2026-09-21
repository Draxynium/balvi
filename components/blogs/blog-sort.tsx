"use client";

import Link from "next/link";


type Props = {
  sort:string;
};


export default function BlogSort({
  sort,
}:Props){

  return (
    <div
      dir="rtl"
      className="
      flex
      w-full
      max-w-7xl
      items-center
      justify-center
      gap-10
      border-b
      border-foreground/10
      pb-6
      "
    >

      <Link
        href="/blogs?sort=newest"
        className={`
        text-sm
        transition-colors
        ${
          sort==="newest"
          ?"text-foreground"
          :"text-foreground/40"
        }
        `}
      >
        جدیدترین
      </Link>


      <Link
        href="/blogs?sort=popular"
        className={`
        text-sm
        transition-colors
        ${
          sort==="popular"
          ?"text-foreground"
          :"text-foreground/40"
        }
        `}
      >
        پربازدیدترین
      </Link>


    </div>
  );
}