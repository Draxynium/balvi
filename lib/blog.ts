import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";

export type BlogFrontmatter = {
  title: string;
  date: string;
  description?: string;
  category?: string;
  tags?: string[];
  cover?: string;
  author?: string;
};

export type BlogArticle = {
  id: string;
  content: string;
  frontmatter: BlogFrontmatter;
  readingTime: number;
};

const blogsDirectory = path.join(process.cwd(), "content/blogs");

export function getArticle(id: string): BlogArticle {
  const filePath = path.join(blogsDirectory, `${id}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  const words = content
    .replace(/[#>*_`[\]()!-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const readingTime = Math.max(1, Math.ceil(words / 200));

  return {
    id,
    content,
    frontmatter: {
      title: data.title ?? "بدون عنوان",
      date: data.date ?? "",
      description: data.description,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover,
      author: data.author,
    },
    readingTime,
  };
}

export function getAllArticles(): BlogArticle[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(blogsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const id = file.replace(/\.md$/, "");
      return getArticle(id);
    });
}