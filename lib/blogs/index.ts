import {
  blogRegistry
} from "./registry";

import {
  getBlogBySlug,
  getBlogsBySlugs
} from "./parser";


export {
  getBlogBySlug,
};


export function getBentoBlogs() {

  return getBlogsBySlugs(
    blogRegistry.bento
  );

}


export function getAllBlogs() {

  return getBlogsBySlugs(
    blogRegistry.blogs
  );

}