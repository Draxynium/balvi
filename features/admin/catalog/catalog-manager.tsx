"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Layers3,
  LoaderCircle,
  Palette,
  Pencil,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  Scissors,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import {
  brandAdminApi,
  colorAdminApi,
  liningAdminApi,
  materialAdminApi,
  sizeAdminApi,
  type CatalogAdminApi,
} from "@/features/admin/catalog/api";
import type {
  CatalogInput,
  CatalogItem,
  CatalogResource,
} from "@/features/admin/catalog/types";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { cn } from "@/lib/utils";

type FormMode = { type: "create" } | { type: "edit"; item: CatalogItem };

const resourceConfig = {
  brands: {
    singular: "برند",
    plural: "برندها",
    title: "مدیریت برندها",
    description:
      "برندهای قابل استفاده در کاتالوگ محصولات را ایجاد، ویرایش یا حذف کنید.",
    empty: "هنوز برندی ثبت نشده",
    placeholder: "مثلاً Balvi",
    api: brandAdminApi,
    icon: Tags,
  },
  colors: {
    singular: "رنگ",
    plural: "رنگ‌ها",
    title: "مدیریت رنگ‌ها",
    description: "نام و کد رنگ‌های قابل انتخاب برای محصولات را مدیریت کنید.",
    empty: "هنوز رنگی ثبت نشده",
    placeholder: "مثلاً سبز زیتونی",
    api: colorAdminApi,
    icon: Palette,
  },
  sizes: {
    singular: "سایز",
    plural: "سایزها",
    title: "مدیریت سایزها",
    description: "سایزهای قابل استفاده در تنوع محصولات را مدیریت کنید.",
    empty: "هنوز سایزی ثبت نشده",
    placeholder: "مثلاً ۴۲",
    api: sizeAdminApi,
    icon: Ruler,
  },
  materials: {
    singular: "جنس",
    plural: "جنس‌ها",
    title: "مدیریت جنس‌ها",
    description:
      "جنس‌های قابل انتخاب برای محصولات را ایجاد، ویرایش یا حذف کنید.",
    empty: "هنوز جنسی ثبت نشده",
    placeholder: "مثلاً چرم طبیعی گاوی",
    api: materialAdminApi,
    icon: Layers3,
  },
  linings: {
    singular: "آستر",
    plural: "آسترها",
    title: "مدیریت آسترها",
    description:
      "آسترهای قابل انتخاب برای محصولات را ایجاد، ویرایش یا حذف کنید.",
    empty: "هنوز آستری ثبت نشده",
    placeholder: "مثلاً چرم گوساله",
    api: liningAdminApi,
    icon: Scissors,
  },
} satisfies Record<
  CatalogResource,
  {
    singular: string;
    plural: string;
    title: string;
    description: string;
    empty: string;
    placeholder: string;
    api: CatalogAdminApi;
    icon: typeof Tags;
  }
>;

export function CatalogManager({ resource }: { resource: CatalogResource }) {
  const config = resourceConfig[resource];
  const isColor = resource === "colors";
  const ResourceIcon = config.icon;
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("#173f37");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fa");
    if (!normalized) return items;
    return items.filter(
      (item) =>
        item.name.toLocaleLowerCase("fa").includes(normalized) ||
        item.hexCode?.toLowerCase().includes(normalized),
    );
  }, [items, query]);

  const loadItems = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setItems(await config.api.list());
      } catch (reason) {
        setError(getAdminApiErrorMessage(reason, config.singular));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [config],
  );

  useEffect(() => {
    let active = true;

    config.api
      .list()
      .then((result) => {
        if (active) setItems(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, config.singular));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [config]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const openCreate = () => {
    setName("");
    setHexCode("#173f37");
    setError("");
    setFormMode({ type: "create" });
  };

  const openEdit = (item: CatalogItem) => {
    setName(item.name);
    setHexCode(item.hexCode ?? "#173f37");
    setError("");
    setFormMode({ type: "edit", item });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const normalizedHex = hexCode.trim().toUpperCase();

    if (trimmedName.length < 2) {
      setError(`نام ${config.singular} باید حداقل ۲ کاراکتر باشد.`);
      return;
    }
    if (isColor && !/^#[0-9A-F]{6}$/.test(normalizedHex)) {
      setError("کد رنگ باید با فرمت HEX مانند #173F37 وارد شود.");
      return;
    }

    const input: CatalogInput = {
      name: trimmedName,
      ...(isColor ? { hexCode: normalizedHex } : {}),
    };

    setSubmitting(true);
    setError("");
    try {
      if (formMode?.type === "edit") {
        await config.api.update(formMode.item.id, input);
        setNotice(`${config.singular} با موفقیت ویرایش شد.`);
      } else {
        await config.api.create(input);
        setNotice(`${config.singular} جدید ساخته شد.`);
      }
      setFormMode(null);
      await loadItems(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, config.singular));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    try {
      await config.api.remove(deleteTarget.id);
      setDeleteTarget(null);
      setNotice(`${config.singular} حذف شد.`);
      await loadItems(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, config.singular));
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
            <ResourceIcon className="size-4" />
            کاتالوگ فروشگاه
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{config.title}</h1>
          <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
            {config.description}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#173f37] px-5 text-sm font-semibold text-white shadow-lg shadow-[#173f37]/10 transition hover:bg-[#214f45]"
        >
          <Plus className="size-5" />
          {config.singular} جدید
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
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="بستن پیام"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[#173f37]/10 bg-white shadow-xl shadow-[#173f37]/5">
        <div className="flex flex-col gap-4 border-b border-[#173f37]/8 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#173f37]/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`جست‌وجوی ${config.singular}…`}
              className="h-11 w-full rounded-xl border border-[#173f37]/10 bg-[#f8f6f1] pr-11 pl-4 text-sm transition outline-none focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
            />
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-[#173f37]/45">
              {items.length.toLocaleString("fa-IR")} {config.singular}
            </span>
            <button
              type="button"
              onClick={() => void loadItems(true)}
              disabled={refreshing}
              className="grid size-11 place-items-center rounded-xl border border-[#173f37]/10 transition hover:bg-[#f3f0e9] disabled:opacity-50"
              aria-label="به‌روزرسانی فهرست"
            >
              <RefreshCw
                className={cn("size-4", refreshing && "animate-spin")}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid min-h-80 place-items-center">
            <div className="flex items-center gap-3 text-sm text-[#173f37]/55">
              <LoaderCircle className="size-5 animate-spin" />
              در حال دریافت {config.plural}…
            </div>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="grid min-h-80 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f3f0e9] text-[#173f37]/45">
                <ResourceIcon className="size-8" />
              </div>
              <p className="mt-4 font-semibold">
                {query ? "نتیجه‌ای پیدا نشد" : config.empty}
              </p>
              <p className="mt-2 text-sm text-[#173f37]/45">
                {query
                  ? "عبارت جست‌وجو را تغییر دهید."
                  : `اولین ${config.singular} را ایجاد کنید.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-right">
              <thead>
                <tr className="border-b border-[#173f37]/8 bg-[#faf9f6] text-xs text-[#173f37]/45">
                  <th className="px-6 py-4 font-medium">
                    نام {config.singular}
                  </th>
                  {isColor && <th className="px-6 py-4 font-medium">کد رنگ</th>}
                  <th className="px-6 py-4 font-medium">شناسه</th>
                  <th className="px-6 py-4 text-left font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#173f37]/7 last:border-0 hover:bg-[#faf9f6]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#173f37]/8 bg-[#d7a66c]/18 text-[#9b6835]"
                          style={
                            isColor
                              ? { backgroundColor: item.hexCode }
                              : undefined
                          }
                        >
                          {!isColor && <Tags className="size-5" />}
                        </span>
                        <span className="text-sm font-semibold">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    {isColor && (
                      <td
                        className="px-6 py-4 font-mono text-xs text-[#173f37]/55"
                        dir="ltr"
                      >
                        {item.hexCode}
                      </td>
                    )}
                    <td
                      className="px-6 py-4 font-mono text-[11px] text-[#173f37]/35"
                      dir="ltr"
                    >
                      {item.id.slice(0, 8)}…
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="grid size-10 place-items-center rounded-xl border border-[#173f37]/10 text-[#173f37]/65 transition hover:border-[#d7a66c]/40 hover:bg-[#d7a66c]/10 hover:text-[#8a5c2f]"
                          aria-label={`ویرایش ${item.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setDeleteTarget(item);
                          }}
                          className="grid size-10 place-items-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          aria-label={`حذف ${item.name}`}
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
          <button
            type="button"
            aria-label="بستن فرم"
            className="absolute inset-0 bg-[#102e28]/55 backdrop-blur-sm"
            onClick={() => !submitting && setFormMode(null)}
          />
          <section
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setFormMode(null)}
              disabled={submitting}
              className="absolute top-5 left-5 grid size-9 place-items-center rounded-xl bg-[#f3f0e9] disabled:opacity-50"
              aria-label="بستن"
            >
              <X className="size-4" />
            </button>
            <div className="mb-7">
              <div className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#d7a66c]/20 text-[#9b6835]">
                {formMode.type === "create" ? (
                  <Plus className="size-6" />
                ) : (
                  <Pencil className="size-5" />
                )}
              </div>
              <h2 className="text-2xl font-bold">
                {formMode.type === "create"
                  ? `${config.singular} جدید`
                  : `ویرایش ${config.singular}`}
              </h2>
              <p className="mt-2 text-sm text-[#173f37]/50">
                اطلاعات {config.singular} را وارد و ذخیره کنید.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  نام {config.singular}
                </span>
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={resource === "sizes" ? 50 : isColor ? 100 : 150}
                  disabled={submitting}
                  className="h-13 w-full rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] px-4 transition outline-none focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
                  placeholder={config.placeholder}
                />
              </label>

              {isColor && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">کد HEX</span>
                  <span className="flex gap-3" dir="ltr">
                    <input
                      type="color"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(hexCode) ? hexCode : "#173f37"
                      }
                      onChange={(event) =>
                        setHexCode(event.target.value.toUpperCase())
                      }
                      disabled={submitting}
                      className="h-13 w-16 cursor-pointer rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] p-1.5 disabled:cursor-not-allowed"
                      aria-label="انتخاب رنگ"
                    />
                    <input
                      value={hexCode}
                      onChange={(event) => setHexCode(event.target.value)}
                      maxLength={7}
                      disabled={submitting}
                      className="h-13 min-w-0 flex-1 rounded-2xl border border-[#173f37]/12 bg-[#f8f6f1] px-4 font-mono uppercase transition outline-none focus:border-[#d7a66c] focus:ring-4 focus:ring-[#d7a66c]/10"
                      placeholder="#173F37"
                    />
                  </span>
                </label>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFormMode(null)}
                  disabled={submitting}
                  className="h-12 flex-1 rounded-xl border border-[#173f37]/12 font-medium disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#173f37] font-semibold text-white disabled:opacity-50"
                >
                  {submitting && (
                    <LoaderCircle className="size-4 animate-spin" />
                  )}
                  {formMode.type === "create"
                    ? `ایجاد ${config.singular}`
                    : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <button
            type="button"
            aria-label="بستن تأیید حذف"
            className="absolute inset-0 bg-[#102e28]/55 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <section
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="size-7" />
            </div>
            <h2 className="mt-5 text-xl font-bold">
              حذف «{deleteTarget.name}»؟
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
              این عملیات قابل بازگشت نیست. اگر این {config.singular} در محصولی
              استفاده شده باشد، ممکن است سرور اجازه حذف ندهد.
            </p>
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="h-12 flex-1 rounded-xl border border-[#173f37]/12 font-medium disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 font-semibold text-white disabled:opacity-50"
              >
                {deleting && <LoaderCircle className="size-4 animate-spin" />}
                حذف {config.singular}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
