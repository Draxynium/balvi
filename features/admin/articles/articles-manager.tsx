"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImagePlus,
  LoaderCircle,
  Newspaper,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { articleAdminApi } from "./api";
import { MarkdownEditor } from "./markdown-editor";
import type { Article, ArticleInput, PagedArticles } from "./types";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { resolveApiAssetUrl } from "@/lib/api/config";
import { cn } from "@/lib/utils";

type ImageDraft = {
  key: string;
  id?: string;
  file?: File;
  url: string;
  name: string;
};

type ArticleForm = {
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAtLocal: string;
  isActive: boolean;
  images: ImageDraft[];
  mainKey: string;
};

const emptyPage: PagedArticles = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

function toLocalDateTime(value = new Date().toISOString()) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function createEmptyForm(): ArticleForm {
  return {
    title: "",
    summary: "",
    content: "",
    author: "",
    publishedAtLocal: toLocalDateTime(),
    isActive: true,
    images: [],
    mainKey: "",
  };
}

function formFromArticle(article: Article): ArticleForm {
  const images = article.images.map((image) => ({
    key: image.id,
    id: image.id,
    url: resolveApiAssetUrl(image.url) ?? image.url,
    name: image.originalName,
  }));
  return {
    title: article.title,
    summary: article.summary,
    content: article.content,
    author: article.author,
    publishedAtLocal: toLocalDateTime(article.publishedAtUtc),
    isActive: article.isActive,
    images,
    mainKey: article.mainImage?.id ?? images[0]?.key ?? "",
  };
}

function releaseLocalImages(images: ImageDraft[]) {
  images.forEach((image) => {
    if (image.file) URL.revokeObjectURL(image.url);
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function ArticlesManager() {
  const [result, setResult] = useState(emptyPage);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<ArticleForm | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const activeFilter = status === "all" ? undefined : status === "active";

  const loadArticles = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setResult(
          await articleAdminApi.list({
            search,
            isActive: activeFilter,
            page,
            pageSize: 20,
          }),
        );
      } catch (reason) {
        setError(getAdminApiErrorMessage(reason, "مقاله"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeFilter, page, search],
  );

  useEffect(() => {
    let active = true;
    articleAdminApi
      .list({ search, isActive: activeFilter, page, pageSize: 20 })
      .then((articles) => {
        if (active) setResult(articles);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "مقاله"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeFilter, page, search]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const closeForm = () => {
    if (submitting) return;
    if (form) releaseLocalImages(form.images);
    setEditingId(null);
    setForm(null);
    setFormError("");
  };

  const openCreate = () => {
    if (form) releaseLocalImages(form.images);
    setEditingId("new");
    setForm(createEmptyForm());
    setFormError("");
  };

  const openEdit = async (id: string) => {
    if (form) releaseLocalImages(form.images);
    setEditingId(id);
    setForm(null);
    setFormLoading(true);
    setFormError("");
    try {
      setForm(formFromArticle(await articleAdminApi.get(id)));
    } catch (reason) {
      setEditingId(null);
      setError(getAdminApiErrorMessage(reason, "مقاله"));
    } finally {
      setFormLoading(false);
    }
  };

  const addImages = (files: FileList | null) => {
    if (!files || !form) return;
    const nextImages = Array.from(files).map((file) => ({
      key: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    if (!nextImages.length) return;
    setForm({
      ...form,
      images: [...form.images, ...nextImages],
      mainKey: form.mainKey || nextImages[0].key,
    });
  };

  const removeImage = (key: string) => {
    if (!form) return;
    const removed = form.images.find((image) => image.key === key);
    if (removed?.file) URL.revokeObjectURL(removed.url);
    const images = form.images.filter((image) => image.key !== key);
    setForm({
      ...form,
      images,
      mainKey: form.mainKey === key ? (images[0]?.key ?? "") : form.mainKey,
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !editingId) return;
    setFormError("");

    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setFormError("عنوان، خلاصه و متن مقاله الزامی است.");
      return;
    }
    if (!form.author.trim()) {
      setFormError("نام نویسنده را وارد کنید.");
      return;
    }
    if (!form.images.length || !form.mainKey) {
      setFormError("حداقل یک تصویر اضافه و تصویر اصلی را انتخاب کنید.");
      return;
    }

    const publishedAt = new Date(form.publishedAtLocal);
    if (Number.isNaN(publishedAt.getTime())) {
      setFormError("تاریخ انتشار معتبر نیست.");
      return;
    }

    setSubmitting(true);
    try {
      const newDrafts = form.images.filter(
        (image): image is ImageDraft & { file: File } => Boolean(image.file),
      );
      const uploaded = newDrafts.length
        ? await articleAdminApi.uploadImages(
            newDrafts.map((image) => image.file),
          )
        : [];
      const uploadedByKey = new Map(
        newDrafts.map((image, index) => [image.key, uploaded[index]?.id]),
      );
      const ids = form.images.map(
        (image) => image.id ?? uploadedByKey.get(image.key) ?? "",
      );
      const mainIndex = form.images.findIndex(
        (image) => image.key === form.mainKey,
      );
      if (ids.some((id) => !id) || mainIndex < 0) {
        throw new Error("Image upload did not return all identifiers.");
      }

      const input: ArticleInput = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        author: form.author.trim(),
        publishedAtUtc: publishedAt.toISOString(),
        isActive: form.isActive,
        imageIds: ids,
        mainImageId: ids[mainIndex],
      };

      if (editingId === "new") await articleAdminApi.create(input);
      else await articleAdminApi.update(editingId, input);

      releaseLocalImages(form.images);
      setEditingId(null);
      setForm(null);
      setNotice(editingId === "new" ? "مقاله ایجاد شد." : "مقاله ویرایش شد.");
      await loadArticles(true);
    } catch (reason) {
      setFormError(getAdminApiErrorMessage(reason, "مقاله"));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string, title: string) => {
    if (!window.confirm(`مقاله «${title}» حذف شود؟`)) return;
    setDeletingId(id);
    setError("");
    try {
      await articleAdminApi.remove(id);
      setNotice("مقاله حذف شد.");
      if (result.items.length === 1 && page > 1) setPage(page - 1);
      else await loadArticles(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "مقاله"));
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#173f37]">مدیریت مقالات</h1>
          <p className="mt-1 text-sm text-[#173f37]/60">
            ایجاد، ویرایش و انتشار مطالب وبلاگ
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#173f37] px-5 py-3 text-sm font-bold text-white hover:bg-[#22594e]"
        >
          <Plus className="size-4" /> مقاله جدید
        </button>
      </div>

      {notice ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-4" /> {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[#173f37]/10 bg-white p-4 shadow-sm">
        <form
          className="flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setSearch(query.trim());
          }}
        >
          <label className="relative min-w-64 flex-1">
            <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#173f37]/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی عنوان، نویسنده یا خلاصه"
              className="h-11 w-full rounded-xl border border-[#173f37]/15 pr-10 pl-3 outline-none focus:border-[#173f37]"
            />
          </label>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as typeof status);
              setPage(1);
            }}
            className="h-11 rounded-xl border border-[#173f37]/15 bg-white px-4 outline-none"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
          <button className="h-11 rounded-xl bg-[#173f37] px-5 text-sm font-bold text-white">
            جست‌وجو
          </button>
          <button
            type="button"
            onClick={() => loadArticles(true)}
            disabled={refreshing}
            className="grid size-11 place-items-center rounded-xl border border-[#173f37]/15 hover:bg-[#173f37]/5 disabled:opacity-50"
            aria-label="به‌روزرسانی"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#173f37]/10 bg-white shadow-sm">
        {loading ? (
          <div className="grid min-h-72 place-items-center">
            <LoaderCircle className="size-8 animate-spin text-[#173f37]" />
          </div>
        ) : result.items.length ? (
          <div className="divide-y divide-[#173f37]/10">
            {result.items.map((article) => (
              <article
                key={article.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#f2efe8] sm:w-36">
                  {article.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        resolveApiAssetUrl(article.mainImage.url) ??
                        article.mainImage.url
                      }
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[#173f37]/30">
                      <Newspaper className="size-8" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-black text-[#173f37]">
                      {article.title}
                    </h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold",
                        article.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {article.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-[#173f37]/60">
                    {article.summary}
                  </p>
                  <p className="mt-2 text-xs text-[#173f37]/50">
                    {article.author} · {formatDate(article.publishedAtUtc)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {article.isActive ? (
                    <a
                      href={`/blogs/${article.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="grid size-10 place-items-center rounded-xl border border-[#173f37]/15 hover:bg-[#173f37]/5"
                      aria-label="مشاهده مقاله"
                    >
                      <Eye className="size-4" />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openEdit(article.id)}
                    className="grid size-10 place-items-center rounded-xl border border-[#173f37]/15 hover:bg-[#173f37]/5"
                    aria-label="ویرایش مقاله"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(article.id, article.title)}
                    disabled={deletingId === article.id}
                    className="grid size-10 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    aria-label="حذف مقاله"
                  >
                    {deletingId === article.id ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center px-4 text-center text-[#173f37]/55">
            <div>
              <Newspaper className="mx-auto mb-3 size-10 opacity-40" />
              <p>مقاله‌ای با این مشخصات پیدا نشد.</p>
            </div>
          </div>
        )}
      </div>

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((value) => value - 1)}
            disabled={!result.hasPreviousPage}
            className="grid size-10 place-items-center rounded-xl border disabled:opacity-35"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="text-sm text-[#173f37]/70">
            صفحه {result.page} از {result.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => value + 1)}
            disabled={!result.hasNextPage}
            className="grid size-10 place-items-center rounded-xl border disabled:opacity-35"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      ) : null}

      {editingId ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-4 max-w-6xl overflow-hidden rounded-3xl bg-[#f8f6f0] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-black text-[#173f37]">
                  {editingId === "new" ? "ایجاد مقاله" : "ویرایش مقاله"}
                </h2>
                <p className="text-xs text-[#173f37]/55">
                  اطلاعات، متن و تصاویر مقاله را تکمیل کنید.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="grid size-10 place-items-center rounded-xl hover:bg-black/5"
                aria-label="بستن"
              >
                <X className="size-5" />
              </button>
            </div>

            {formLoading || !form ? (
              <div className="grid min-h-96 place-items-center">
                <LoaderCircle className="size-8 animate-spin text-[#173f37]" />
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6 p-5 sm:p-7">
                {formError ? (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertTriangle className="size-4" /> {formError}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-bold">عنوان مقاله</span>
                    <input
                      value={form.title}
                      onChange={(event) =>
                        setForm({ ...form, title: event.target.value })
                      }
                      maxLength={250}
                      required
                      className="h-12 w-full rounded-xl border border-[#173f37]/15 bg-white px-4 outline-none focus:border-[#173f37]"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-bold">خلاصه</span>
                    <textarea
                      value={form.summary}
                      onChange={(event) =>
                        setForm({ ...form, summary: event.target.value })
                      }
                      maxLength={1000}
                      rows={3}
                      required
                      className="w-full resize-y rounded-xl border border-[#173f37]/15 bg-white p-4 outline-none focus:border-[#173f37]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-bold">نویسنده</span>
                    <input
                      value={form.author}
                      onChange={(event) =>
                        setForm({ ...form, author: event.target.value })
                      }
                      maxLength={150}
                      required
                      className="h-12 w-full rounded-xl border border-[#173f37]/15 bg-white px-4 outline-none focus:border-[#173f37]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-bold">تاریخ انتشار</span>
                    <input
                      type="datetime-local"
                      value={form.publishedAtLocal}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          publishedAtLocal: event.target.value,
                        })
                      }
                      required
                      className="h-12 w-full rounded-xl border border-[#173f37]/15 bg-white px-4 outline-none focus:border-[#173f37]"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-black">تصاویر مقاله</h3>
                      <p className="text-xs text-[#173f37]/55">
                        تصویر اصلی را از میان فایل‌ها انتخاب کنید.
                      </p>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#173f37]/20 bg-white px-4 py-2.5 text-sm font-bold hover:bg-[#173f37]/5">
                      <ImagePlus className="size-4" /> افزودن تصویر
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={(event) => {
                          addImages(event.target.files);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {form.images.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {form.images.map((image) => (
                        <div
                          key={image.key}
                          className={cn(
                            "overflow-hidden rounded-2xl border bg-white",
                            form.mainKey === image.key
                              ? "border-[#173f37] ring-2 ring-[#173f37]/15"
                              : "border-[#173f37]/15",
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={image.name}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="space-y-2 p-3">
                            <div className="flex items-center gap-2">
                              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-xs font-bold">
                                <input
                                  type="radio"
                                  name="article-main-image"
                                  checked={form.mainKey === image.key}
                                  onChange={() =>
                                    setForm({ ...form, mainKey: image.key })
                                  }
                                />
                                تصویر اصلی
                              </label>
                              <button
                                type="button"
                                onClick={() => removeImage(image.key)}
                                className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                                aria-label={`حذف ${image.name}`}
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                            <p
                              className="truncate text-xs text-[#173f37]/55"
                              title={image.name}
                            >
                              {image.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#173f37]/20 bg-white p-8 text-center text-sm text-[#173f37]/50">
                      هنوز تصویری اضافه نشده است.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-bold">متن مقاله</span>
                  <MarkdownEditor
                    value={form.content}
                    onChange={(content) => setForm({ ...form, content })}
                    disabled={submitting}
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#173f37]/10 bg-white p-4">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm({ ...form, isActive: event.target.checked })
                    }
                    className="size-5 accent-[#173f37]"
                  />
                  <span>
                    <strong className="block text-sm">مقاله فعال باشد</strong>
                    <small className="text-[#173f37]/55">
                      فقط مقالات فعال در سایت و صفحه اصلی نمایش داده می‌شوند.
                    </small>
                  </span>
                </label>

                <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="rounded-xl border border-[#173f37]/15 bg-white px-5 py-3 text-sm font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-[#173f37] px-6 py-3 text-sm font-bold text-white disabled:opacity-55"
                  >
                    {submitting ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    ذخیره مقاله
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
