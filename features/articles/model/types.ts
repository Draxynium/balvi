export type ArticleImage = {
  id: string;
  originalName: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
};

export type ArticleListItem = {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishedAtUtc: string;
  isActive: boolean;
  mainImage: ArticleImage | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
};

export type Article = Omit<ArticleListItem, "mainImage"> & {
  content: string;
  images: ArticleImage[];
  mainImage: ArticleImage | null;
};

export type PagedArticles = {
  items: ArticleListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
