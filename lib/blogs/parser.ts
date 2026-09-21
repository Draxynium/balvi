import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Blog } from "./types";


const blogsDirectory = path.join(
  process.cwd(),
  "content/blogs"
);


export function getBlogBySlug(
  slug: string
): Blog | null {

  const filePath = path.join(
    blogsDirectory,
    `${slug}.md`
  );


  if (!fs.existsSync(filePath)) {
    return null;
  }


  const fileContent =
    fs.readFileSync(
      filePath,
      "utf8"
    );


  const {
    data,
    content,
  } = matter(fileContent);


  return {
    slug,

    title: data.title,
    date: data.date,
    category: data.category,
    description: data.description,
    author: data.author,
    cover: data.cover,

    content,
  };
}



export function getBlogsBySlugs(
  slugs: string[]
) {

  return slugs
    .map((slug)=>getBlogBySlug(slug))
    .filter(Boolean) as Blog[];
}