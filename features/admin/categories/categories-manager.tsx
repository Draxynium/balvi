"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Folder,
  FolderOpen,
  FolderTree,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  categoryAdminApi,
  getAdminApiErrorMessage,
} from "@/features/admin/categories/api";
import type {
  AdminCategory,
  CategoryInput,
} from "@/features/admin/categories/types";
import { cn } from "@/lib/utils";

type FlatCategory = AdminCategory & { depth: number; parentName: string | null };
type FormMode = { type: "create" } | { type: "edit"; category: AdminCategory };

function flattenCategories(
  categories: AdminCategory[],
  depth = 0,
  parentName: string | null = null,
): FlatCategory[] {
  return categories.flatMap((category) => [
    { ...category, depth, parentName },
    ...flattenCategories(category.children ?? [], depth + 1, category.name),
  ]);
}

function collectDescendantIds(category: AdminCategory) {
  const ids = new Set<string>([category.id]);
  const visit = (nodes: AdminCategory[]) => {
    for (const node of nodes) {
      ids.add(node.id);
      visit(node.children ?? []);
    }
  };
  visit(category.children ?? []);
  return ids;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const visibleCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fa");
    if (!normalized) return flatCategories;
    return flatCategories.filter(
      (category) =>
        category.name.toLocaleLowerCase("fa").includes(normalized) ||
        category.parentName?.toLocaleLowerCase("fa").includes(normalized),
    );
  }, [flatCategories, query]);

  const loadCategories = useCallback(async (background = false) => {
    if (background) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const result = await categoryAdminApi.list();
      setCategories(result);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    categoryAdminApi
      .list()
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const openCreate = () => {
    setName("");
    setParentId("");
    setError("");
    setFormMode({ type: "create" });
  };

  const openEdit = (category: AdminCategory) => {
    setName(category.name);
    setParentId(category.parentId ?? "");
    setError("");
    setFormMode({ type: "edit", category });
  };

  const parentOptions = useMemo(() => {
    if (formMode?.type !== "edit") return flatCategories;
    const excluded = collectDescendantIds(formMode.category);
    return flatCategories.filter((category) => !excluded.has(category.id));
  }, [flatCategories, formMode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("نام دسته‌بندی باید حداقل ۲ کاراکتر باشد.");
      return;
    }

    const input: CategoryInput = {
      name: trimmedName,
      parentId: parentId || null,
    };

    setSubmitting(true);
    setError("");
    try {
      if (formMode?.type === "edit") {
        await categoryAdminApi.update(formMode.category.id, input);
        setNotice("دسته‌بندی با موفقیت ویرایش شد.");
      } else {
        await categoryAdminApi.create(input);
        setNotice("دسته‌بندی جدید ساخته شد.");
      }
      setFormMode(null);
      await loadCategories(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await categoryAdminApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      setNotice("دسته‌بندی حذف شد.");
      await loadCategories(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#b17b42]">
            <FolderTree className="size-4" />
            کاتالوگ فروشگاه
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">مدیریت دسته‌بندی‌ها</h1>
          <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
            دسته‌ها و زیر‌دسته‌های محصولات را ایجاد، ویرایش یا حذف کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#173f37] px-5 text-sm font-semibold text-white shadow-lg shadow-[#173f37]/10 transition hover:bg-[#214f45]"
        >
          <Plus className="size-5" />
          دسته‌بندی جدید
        </button>
      </div>

      {notice && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-700/15 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="size-5 shrink-0" />
          {notice}
        </div>
      )}

      {error && !formMode && !deleteTarget && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0" />
            {error}
          </span>
          <button type="button" onClick={() => setError("")} aria-label="بستن پیام">
            <X className="size-4" />
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[#173f37]/10 bg-white shadow-xl shadow-[#173f37]/5">
        <div className="flex flex-col gap-4 border-b border-[#173f37]/8 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#173f37]/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی دسته‌بندی…"
              className="h-11 w-full rounded-xl border border-[#173f37]/10 bg-[#f8f6f1] pr-11 pl-4 text-sm outline-none transition focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
            />
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-[#173f37]/45">
              {flatCategories.length.toLocaleString("fa-IR")} دسته‌بندی
            </span>
            <button
              type="button"
              onClick={() => void loadCategories(true)}
              disabled={refreshing}
              className="grid size-11 place-items-center rounded-xl border border-[#173f37]/10 transition hover:bg-[#f3f0e9] disabled:opacity-50"
              aria-label="به‌روزرسانی فهرست"
            >
              <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid min-h-80 place-items-center">
            <div className="flex items-center gap-3 text-sm text-[#173f37]/55">
              <LoaderCircle className="size-5 animate-spin" />
              در حال دریافت دسته‌بندی‌ها…
            </div>
          </div>
        ) : visibleCategories.length === 0 ? (
          <div className="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f3f0e9] text-[#173f37]/45">
                <FolderOpen className="size-8" />
              </div>
              <p className="mt-4 font-semibold">
                {query ? "نتیجه‌ای پیدا نشد" : "هنوز دسته‌بندی‌ای ساخته نشده"}
              </p>
              <p className="mt-2 text-sm text-[#173f37]/45">
                {query ? "عبارت جست‌وجو را تغییر دهید." : "اولین دسته‌بندی فروشگاه را ایجاد کنید."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-right">
              <thead>
                <tr className="border-b border-[#173f37]/8 bg-[#faf9f6] text-xs text-[#173f37]/45">
                  <th className="px-6 py-4 font-medium">نام دسته‌بندی</th>
                  <th className="px-6 py-4 font-medium">دسته‌ی والد</th>
                  <th className="px-6 py-4 font-medium">زیر‌دسته‌ها</th>
                  <th className="px-6 py-4 font-medium">تاریخ ایجاد</th>
                  <th className="px-6 py-4 text-left font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {visibleCategories.map((category) => (
                  <tr key={category.id} className="border-b border-[#173f37]/7 last:border-0 hover:bg-[#faf9f6]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3" style={{ paddingRight: `${Math.min(category.depth, 4) * 20}px` }}>
                        {category.depth > 0 && <ChevronLeft className="size-4 text-[#173f37]/25" />}
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#d7a66c]/18 text-[#9b6835]">
                          <Folder className="size-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{category.name}</p>
                          <p className="mt-1 font-mono text-[10px] text-[#173f37]/30" dir="ltr">
                            {category.id.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#173f37]/55">{category.parentName ?? "ریشه"}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#173f37]/7 px-2.5 py-1 text-xs font-medium">
                        {(category.children?.length ?? 0).toLocaleString("fa-IR")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#173f37]/50">{formatDate(category.createdAtUtc)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="grid size-10 place-items-center rounded-xl border border-[#173f37]/10 text-[#173f37]/65 transition hover:border-[#d7a66c]/40 hover:bg-[#d7a66c]/10 hover:text-[#8a5c2f]"
                          aria-label={`ویرایش ${category.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setDeleteTarget(category);
                          }}
                          className="grid size-10 place-items-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          aria-label={`حذف ${category.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {formMode && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <button type="button" aria-label="بستن فرم" className="absolute inset-0 bg-[#102e28]/55 backdrop-blur-sm" onClick={() => !submitting && setFormMode(null)} />
          <section role="dialog" aria-modal="true" className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <button type="button" onClick={() => setFormMode(null)} disabled={submitting} className="absolute left-5 top-5 grid size-9 place-items-center rounded-xl bg-[#f3f0e9] disabled:opacity-50" aria-label="بستن">
              <X className="size-4" />
            </button>
            <div className="mb-7">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#d7a66c]/20 text-[#9b6835]">
                {formMode.type === "create" ? <Plus className="size-6" /> : <Pencil className="size-5" />}
              </div>
              <h2 className="text-2xl font-bold">{formMode.type === "create" ? "دسته‌بندی جدید" : "ویرایش دسته‌بندی"}</h2>
              <p className="mt-2 text-sm text-[#173f37]/50">نام و جایگاه دسته‌بندی را مشخص کنید.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">نام دسته‌بندی</span>
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  disabled={submitting}
                  className="h-13 w-full rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] px-4 outline-none transition focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
                  placeholder="مثلاً کفش مردانه"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">دسته‌ی والد</span>
                <select
                  value={parentId}
                  onChange={(event) => setParentId(event.target.value)}
                  disabled={submitting}
                  className="h-13 w-full rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] px-4 outline-none transition focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
                >
                  <option value="">بدون والد (دسته‌ی اصلی)</option>
                  {parentOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {"— ".repeat(category.depth)}{category.name}
                    </option>
                  ))}
                </select>
              </label>
              {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setFormMode(null)} disabled={submitting} className="h-12 flex-1 rounded-xl border border-[#173f37]/12 font-medium disabled:opacity-50">انصراف</button>
                <button type="submit" disabled={submitting} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#173f37] font-semibold text-white disabled:opacity-50">
                  {submitting && <LoaderCircle className="size-4 animate-spin" />}
                  {formMode.type === "create" ? "ایجاد دسته" : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <button type="button" aria-label="بستن تأیید حذف" className="absolute inset-0 bg-[#102e28]/55 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)} />
          <section role="alertdialog" aria-modal="true" className="relative w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="size-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold">حذف «{deleteTarget.name}»؟</h2>
            <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
              این عملیات قابل بازگشت نیست. دسته‌های دارای زیرمجموعه یا محصول ممکن است توسط سرور قابل حذف نباشند.
            </p>
            <div className="mt-7 flex gap-3">
              <button type="button" onClick={() => setDeleteTarget(null)} disabled={deleting} className="h-12 flex-1 rounded-xl border border-[#173f37]/12 font-medium disabled:opacity-50">انصراف</button>
              <button type="button" onClick={() => void handleDelete()} disabled={deleting} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 font-semibold text-white disabled:opacity-50">
                {deleting && <LoaderCircle className="size-4 animate-spin" />}
                حذف دسته‌بندی
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
