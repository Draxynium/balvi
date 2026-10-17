import type {
  Article,
  ArticleListItem,
  PagedArticles,
} from "@/features/articles/model/types";
import type { UploadedImage } from "@/features/admin/products/types";

export type { Article, ArticleListItem, PagedArticles, UploadedImage };

export type ArticleInput = {
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAtUtc: string;
  isActive: boolean;
  imageIds: string[];
  mainImageId: string;
};
