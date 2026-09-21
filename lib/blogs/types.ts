export type BlogFrontmatter = {
  title: string;
  date: string;
  category: string;
  description: string;
  author: string;
  cover: string;
  views?: number;
};


export type Blog = BlogFrontmatter & {
  slug: string;
  content: string;
};