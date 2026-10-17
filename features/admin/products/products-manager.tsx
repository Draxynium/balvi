"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Box,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  LoaderCircle,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { categoryAdminApi } from "@/features/admin/categories/api";
import type { AdminCategory } from "@/features/admin/categories/types";
import { productAdminApi } from "@/features/admin/products/api";
import type {
  PagedProducts,
  Product,
  ProductReference,
  ProductVariantInput,
} from "@/features/admin/products/types";
import { getAdminApiErrorMessage } from "@/features/admin/shared/api";
import { formatProductPrice } from "@/features/catalog/lib/format";
import type { ProductImage } from "@/features/catalog/model/types";
import { resolveApiAssetUrl } from "@/lib/api/config";
import { cn } from "@/lib/utils";

type References = {
  brands: ProductReference[];
  categories: ProductReference[];
  colors: ProductReference[];
  sizes: ProductReference[];
  materials: ProductReference[];
  linings: ProductReference[];
};

type ProductForm = {
  name: string;
  description: string;
  priceInRials: number;
  brandId: string;
  categoryId: string;
  materialId: string;
  liningId: string;
  isMan: boolean;
  variants: ProductVariantInput[];
  images: ProductImage[];
  mainImageId: string;
  newFiles: File[];
  mainNewFileIndex: number | null;
};

const emptyPage: PagedProducts = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

const emptyReferences: References = {
  brands: [],
  categories: [],
  colors: [],
  sizes: [],
  materials: [],
  linings: [],
};

function flattenCategories(categories: AdminCategory[]): ProductReference[] {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name },
    ...flattenCategories(category.children ?? []),
  ]);
}

function emptyForm(references: References): ProductForm {
  return {
    name: "",
    description: "",
    priceInRials: 0,
    brandId: references.brands[0]?.id ?? "",
    categoryId: references.categories[0]?.id ?? "",
    materialId: references.materials[0]?.id ?? "",
    liningId: references.linings[0]?.id ?? "",
    isMan: true,
    variants:
      references.colors[0] && references.sizes[0]
        ? [
            {
              colorId: references.colors[0].id,
              sizeId: references.sizes[0].id,
              stockQuantity: 0,
            },
          ]
        : [],
    images: [],
    mainImageId: "",
    newFiles: [],
    mainNewFileIndex: null,
  };
}

function formFromProduct(product: Product): ProductForm {
  return {
    name: product.name,
    description: product.description ?? "",
    priceInRials: product.priceInRials,
    brandId: product.brand.id,
    categoryId: product.category.id,
    materialId: product.material?.id ?? "",
    liningId: product.lining?.id ?? "",
    isMan: product.isMan,
    variants: product.variants.map(({ colorId, sizeId, stockQuantity }) => ({
      colorId,
      sizeId,
      stockQuantity,
    })),
    images: product.images,
    mainImageId: product.mainImage?.id ?? product.images[0]?.id ?? "",
    newFiles: [],
    mainNewFileIndex: null,
  };
}

type NewImagePreviewsProps = {
  files: File[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
};

function NewImagePreview({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const reader = new FileReader();
    const showPreview = () => {
      setPreviewUrl(typeof reader.result === "string" ? reader.result : "");
    };

    reader.addEventListener("load", showPreview);
    reader.readAsDataURL(file);

    return () => {
      reader.removeEventListener("load", showPreview);
      reader.abort();
    };
  }, [file]);

  return (
    <div
      role="img"
      aria-label={`پیش‌نمایش ${file.name}`}
      className="aspect-[4/3] bg-[#f2efe8] bg-cover bg-center"
      style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}
    />
  );
}

function NewImagePreviews({
  files,
  selectedIndex,
  onSelect,
  onRemove,
}: NewImagePreviewsProps) {
  if (!files.length) return null;

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file, index) => {
        const isSelected = selectedIndex === index;

        return (
          <div
            key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
            className={cn(
              "overflow-hidden rounded-2xl border bg-white transition",
              isSelected
                ? "border-[#173f37] ring-2 ring-[#173f37]/15"
                : "border-[#173f37]/15",
            )}
          >
            <NewImagePreview file={file} />
            <div className="space-y-2 p-3">
              <div className="flex items-center gap-2">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-medium">
                  <input
                    type="radio"
                    name="main-image"
                    checked={isSelected}
                    onChange={() => onSelect(index)}
                  />
                  <span className="truncate">
                    {isSelected ? "عکس اصلی" : "انتخاب به‌عنوان عکس اصلی"}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                  aria-label={`حذف تصویر ${file.name}`}
                >
                  <X className="size-4" />
                </button>
              </div>
              <p
                className="truncate text-xs text-[#173f37]/65"
                title={file.name}
              >
                {file.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProductsManager() {
  const [result, setResult] = useState(emptyPage);
  const [references, setReferences] = useState(emptyReferences);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState<"" | "man" | "woman">("");
  const [sort, setSort] = useState<"Newest" | "Cheapest" | "MostExpensive">(
    "Newest",
  );
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<ProductForm | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(
    async (background = false) => {
      if (background) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        setResult(
          await productAdminApi.list({
            search,
            categoryId: categoryFilter,
            isMan: genderFilter === "" ? undefined : genderFilter === "man",
            sort,
            page,
            pageSize: 20,
          }),
        );
      } catch (reason) {
        setError(getAdminApiErrorMessage(reason, "محصول"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [categoryFilter, genderFilter, page, search, sort],
  );

  useEffect(() => {
    let active = true;
    productAdminApi
      .list({
        search,
        categoryId: categoryFilter,
        isMan: genderFilter === "" ? undefined : genderFilter === "man",
        sort,
        page,
        pageSize: 20,
      })
      .then((products) => {
        if (active) setResult(products);
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "محصول"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [categoryFilter, genderFilter, page, search, sort]);

  useEffect(() => {
    let active = true;
    Promise.all([productAdminApi.references(), categoryAdminApi.list()])
      .then(([[brands, colors, sizes, materials, linings], categories]) => {
        if (!active) return;
        setReferences({
          brands,
          colors,
          sizes,
          materials,
          linings,
          categories: flattenCategories(categories),
        });
      })
      .catch((reason: unknown) => {
        if (active) setError(getAdminApiErrorMessage(reason, "اطلاعات محصول"));
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

  const missingReferences = useMemo(
    () =>
      !references.brands.length ||
      !references.categories.length ||
      !references.colors.length ||
      !references.sizes.length ||
      !references.materials.length ||
      !references.linings.length,
    [references],
  );

  const openCreate = () => {
    setError("");
    setEditingId("new");
    setForm(emptyForm(references));
  };

  const openEdit = async (id: string) => {
    setEditingId(id);
    setForm(null);
    setFormLoading(true);
    setError("");
    try {
      setForm(formFromProduct(await productAdminApi.get(id)));
    } catch (reason) {
      setEditingId(null);
      setError(getAdminApiErrorMessage(reason, "محصول"));
    } finally {
      setFormLoading(false);
    }
  };

  const updateVariant = (
    index: number,
    key: keyof ProductVariantInput,
    value: string | number,
  ) => {
    setForm((current) =>
      current
        ? {
            ...current,
            variants: current.variants.map((variant, variantIndex) =>
              variantIndex === index ? { ...variant, [key]: value } : variant,
            ),
          }
        : current,
    );
  };

  const addVariant = () => {
    if (!references.colors[0] || !references.sizes[0]) return;
    setForm((current) =>
      current
        ? {
            ...current,
            variants: [
              ...current.variants,
              {
                colorId: references.colors[0].id,
                sizeId: references.sizes[0].id,
                stockQuantity: 0,
              },
            ],
          }
        : current,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !editingId) return;

    if (
      !form.name.trim() ||
      form.priceInRials <= 0 ||
      !form.brandId ||
      !form.categoryId ||
      !form.materialId ||
      !form.liningId ||
      !form.variants.length
    ) {
      setError("همه فیلدهای ضروری و حداقل یک تنوع محصول را تکمیل کنید.");
      return;
    }
    const variantKeys = form.variants.map(
      (variant) => `${variant.colorId}:${variant.sizeId}`,
    );
    if (new Set(variantKeys).size !== variantKeys.length) {
      setError("ترکیب رنگ و سایز در تنوع‌های محصول نباید تکراری باشد.");
      return;
    }
    if (
      form.variants.some(
        (variant) =>
          !Number.isInteger(variant.stockQuantity) || variant.stockQuantity < 0,
      )
    ) {
      setError("موجودی هر تنوع باید یک عدد صحیح صفر یا بیشتر باشد.");
      return;
    }
    if (!form.images.length && !form.newFiles.length) {
      setError("حداقل یک تصویر برای محصول انتخاب کنید.");
      return;
    }
    if (form.images.length + form.newFiles.length > 20) {
      setError("هر محصول حداکثر می‌تواند ۲۰ تصویر داشته باشد.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const uploaded = form.newFiles.length
        ? await productAdminApi.uploadImages(form.newFiles)
        : [];
      const imageIds = [
        ...form.images.map((image) => image.id),
        ...uploaded.map((image) => image.id),
      ];
      const selectedUploadedImage =
        form.mainNewFileIndex === null
          ? undefined
          : uploaded[form.mainNewFileIndex];
      const mainImageId =
        selectedUploadedImage?.id ??
        (imageIds.includes(form.mainImageId) ? form.mainImageId : imageIds[0]);
      const input = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        priceInRials: form.priceInRials,
        brandId: form.brandId,
        categoryId: form.categoryId,
        materialId: form.materialId,
        liningId: form.liningId,
        isMan: form.isMan,
        variants: form.variants,
        imageIds,
        mainImageId,
      };

      if (editingId === "new") {
        await productAdminApi.create(input);
        setNotice("محصول جدید با موفقیت ایجاد شد.");
      } else {
        await productAdminApi.update(editingId, input);
        setNotice("محصول با موفقیت ویرایش شد.");
      }
      setEditingId(null);
      setForm(null);
      await loadProducts(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "محصول"));
    } finally {
      setSubmitting(false);
    }
  };

  const removeProduct = async (id: string, name: string) => {
    if (!window.confirm(`محصول «${name}» حذف شود؟`)) return;
    setError("");
    try {
      await productAdminApi.remove(id);
      setNotice("محصول حذف شد.");
      await loadProducts(true);
    } catch (reason) {
      setError(getAdminApiErrorMessage(reason, "محصول"));
    }
  };

  const closeForm = () => {
    if (submitting) return;
    setEditingId(null);
    setForm(null);
    setError("");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#b17b42]">
            <Box className="size-4" />
            کاتالوگ فروشگاه
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">مدیریت محصولات</h1>
          <p className="mt-3 text-sm leading-7 text-[#173f37]/55">
            محصولات، تصاویر، موجودی رنگ و سایز و ویژگی‌های آن‌ها را مدیریت کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={missingReferences}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#173f37] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          title={
            missingReferences
              ? "ابتدا برند، دسته، رنگ، سایز، جنس و آستر بسازید"
              : undefined
          }
        >
          <PackagePlus className="size-5" />
          محصول جدید
        </button>
      </div>

      {notice && (
        <div className="mb-5 rounded-2xl border border-emerald-700/15 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}
      {error && !editingId && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="size-5 shrink-0" />
          {error}
        </div>
      )}
      {missingReferences && !loading && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
          برای ایجاد محصول ابتدا حداقل یک برند، دسته‌بندی، رنگ، سایز، جنس و آستر
          ثبت کنید.
        </div>
      )}

      <section className="overflow-hidden rounded-[2rem] border border-[#173f37]/10 bg-white shadow-xl shadow-[#173f37]/5">
        <div className="grid gap-3 border-b border-[#173f37]/8 p-4 md:grid-cols-[minmax(220px,1fr)_180px_150px_170px_auto] md:p-6">
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setSearch(query);
            }}
          >
            <Search className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#173f37]/35" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جست‌وجوی محصول و سپس Enter…"
              className="h-11 w-full rounded-xl border border-[#173f37]/10 bg-[#f8f6f1] pr-11 pl-4 text-sm outline-none focus:border-[#d7a66c]"
            />
          </form>
          <select
            value={categoryFilter}
            onChange={(event) => {
              setPage(1);
              setCategoryFilter(event.target.value);
            }}
            className="admin-input"
          >
            <option value="">همه دسته‌ها</option>
            {references.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={genderFilter}
            onChange={(event) => {
              setPage(1);
              setGenderFilter(event.target.value as typeof genderFilter);
            }}
            className="admin-input"
          >
            <option value="">همه گروه‌ها</option>
            <option value="man">مردانه</option>
            <option value="woman">زنانه</option>
          </select>
          <select
            value={sort}
            onChange={(event) => {
              setPage(1);
              setSort(event.target.value as typeof sort);
            }}
            className="admin-input"
          >
            <option value="Newest">جدیدترین</option>
            <option value="Cheapest">ارزان‌ترین</option>
            <option value="MostExpensive">گران‌ترین</option>
          </select>
          <button
            type="button"
            onClick={() => void loadProducts(true)}
            disabled={refreshing}
            className="grid size-12 place-items-center rounded-xl border border-[#173f37]/10"
            aria-label={`به‌روزرسانی فهرست ${result.totalCount.toLocaleString("fa-IR")} محصول`}
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          </button>
        </div>

        {loading ? (
          <div className="grid min-h-80 place-items-center text-sm text-[#173f37]/55">
            <span className="flex items-center gap-3">
              <LoaderCircle className="size-5 animate-spin" /> در حال دریافت
              محصولات…
            </span>
          </div>
        ) : result.items.length === 0 ? (
          <div className="grid min-h-80 place-items-center p-8 text-center text-[#173f37]/55">
            محصولی پیدا نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-right">
              <thead>
                <tr className="border-b border-[#173f37]/8 bg-[#faf9f6] text-xs text-[#173f37]/45">
                  <th className="px-6 py-4 font-medium">محصول</th>
                  <th className="px-6 py-4 font-medium">دسته / برند</th>
                  <th className="px-6 py-4 font-medium">قیمت</th>
                  <th className="px-6 py-4 font-medium">موجودی</th>
                  <th className="px-6 py-4 text-left font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#173f37]/7 last:border-0 hover:bg-[#faf9f6]"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="mt-1 text-xs text-[#173f37]/45">
                        {product.isMan ? "مردانه" : "زنانه"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.category.name} / {product.brand.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatProductPrice(product.priceInRials)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.totalStockQuantity.toLocaleString("fa-IR")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void openEdit(product.id)}
                          className="grid size-10 place-items-center rounded-xl border border-[#173f37]/10"
                          aria-label={`ویرایش ${product.name}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void removeProduct(product.id, product.name)
                          }
                          className="grid size-10 place-items-center rounded-xl border border-red-200 text-red-600"
                          aria-label={`حذف ${product.name}`}
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

        {result.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#173f37]/8 px-6 py-4">
            <button
              type="button"
              disabled={!result.hasPreviousPage}
              onClick={() => setPage((value) => value - 1)}
              className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-35"
            >
              <ChevronRight className="size-4" /> قبلی
            </button>
            <span className="text-xs text-[#173f37]/50">
              صفحه {result.page.toLocaleString("fa-IR")} از{" "}
              {result.totalPages.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              disabled={!result.hasNextPage}
              onClick={() => setPage((value) => value + 1)}
              className="flex items-center gap-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-35"
            >
              بعدی <ChevronLeft className="size-4" />
            </button>
          </div>
        )}
      </section>

      {editingId && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#102e28]/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            className="mx-auto my-4 w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingId === "new" ? "محصول جدید" : "ویرایش محصول"}
                </h2>
                <p className="mt-2 text-sm text-[#173f37]/50">
                  اطلاعات، تنوع‌ها و تصاویر محصول را تکمیل کنید.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={submitting}
                className="grid size-10 place-items-center rounded-xl bg-[#f3f0e9]"
                aria-label="بستن"
              >
                <X className="size-4" />
              </button>
            </div>

            {formLoading || !form ? (
              <div className="grid min-h-72 place-items-center">
                <LoaderCircle className="size-7 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="نام محصول">
                    <input
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      maxLength={200}
                      className="admin-input"
                    />
                  </Field>
                  <Field label="قیمت (ریال)">
                    <input
                      type="number"
                      min={1}
                      value={form.priceInRials || ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          priceInRials: Number(event.target.value),
                        })
                      }
                      className="admin-input"
                      dir="ltr"
                    />
                  </Field>
                  <Field label="موجودی کل محصول (عدد)">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={form.variants.reduce(
                        (total, variant) => total + variant.stockQuantity,
                        0,
                      )}
                      onChange={(event) =>
                        updateVariant(
                          0,
                          "stockQuantity",
                          Number(event.target.value),
                        )
                      }
                      readOnly={form.variants.length !== 1}
                      className="admin-input read-only:cursor-default read-only:opacity-70"
                      title={
                        form.variants.length === 1
                          ? "موجودی اولیه محصول"
                          : "جمع موجودی همه تنوع‌های رنگ و سایز"
                      }
                    />
                    <span className="mt-1.5 block text-[11px] text-[#173f37]/45">
                      {form.variants.length === 1
                        ? "با افزودن تنوع بیشتر، موجودی هر رنگ و سایز را جداگانه وارد کنید."
                        : "این مقدار از جمع موجودی تنوع‌های پایین محاسبه می‌شود."}
                    </span>
                  </Field>
                  <SelectField
                    label="برند"
                    value={form.brandId}
                    options={references.brands}
                    onChange={(value) => setForm({ ...form, brandId: value })}
                  />
                  <SelectField
                    label="دسته‌بندی"
                    value={form.categoryId}
                    options={references.categories}
                    onChange={(value) =>
                      setForm({ ...form, categoryId: value })
                    }
                  />
                  <SelectField
                    label="جنس"
                    value={form.materialId}
                    options={references.materials}
                    onChange={(value) =>
                      setForm({ ...form, materialId: value })
                    }
                  />
                  <SelectField
                    label="آستر"
                    value={form.liningId}
                    options={references.linings}
                    onChange={(value) => setForm({ ...form, liningId: value })}
                  />
                  <Field label="گروه محصول">
                    <select
                      value={form.isMan ? "man" : "woman"}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          isMan: event.target.value === "man",
                        })
                      }
                      className="admin-input"
                    >
                      <option value="man">مردانه</option>
                      <option value="woman">زنانه</option>
                    </select>
                  </Field>
                  <Field label="توضیحات" className="sm:col-span-2">
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        setForm({ ...form, description: event.target.value })
                      }
                      maxLength={5000}
                      rows={4}
                      className="admin-input h-auto py-3"
                    />
                  </Field>
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">تنوع‌ها و موجودی</h3>
                      <p className="mt-1 text-xs text-[#173f37]/45">
                        موجودی کل:{" "}
                        {form.variants
                          .reduce(
                            (total, variant) => total + variant.stockQuantity,
                            0,
                          )
                          .toLocaleString("fa-IR")}{" "}
                        عدد
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="flex items-center gap-1 rounded-xl border px-3 py-2 text-xs"
                    >
                      <Plus className="size-4" /> افزودن تنوع
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-2xl bg-[#f8f6f1] p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                      >
                        <label className="text-xs text-[#173f37]/55">
                          رنگ
                          <select
                            value={variant.colorId}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "colorId",
                                event.target.value,
                              )
                            }
                            className="admin-input mt-1"
                          >
                            {references.colors.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs text-[#173f37]/55">
                          سایز
                          <select
                            value={variant.sizeId}
                            onChange={(event) =>
                              updateVariant(index, "sizeId", event.target.value)
                            }
                            className="admin-input mt-1"
                          >
                            {references.sizes.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold text-[#173f37]/70">
                          موجودی این تنوع
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={variant.stockQuantity}
                            onChange={(event) =>
                              updateVariant(
                                index,
                                "stockQuantity",
                                Number(event.target.value),
                              )
                            }
                            className="admin-input mt-1"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              variants: form.variants.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            })
                          }
                          className="grid size-12 place-items-center self-end rounded-xl text-red-600"
                          aria-label="حذف تنوع"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <h3 className="font-bold">تصاویر</h3>
                    <p className="mt-1 text-sm text-[#173f37]/65">
                      همه تصاویر را بررسی کنید و یکی را به‌عنوان عکس اصلی انتخاب
                      کنید.
                    </p>
                  </div>
                  {form.images.length > 0 && (
                    <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {form.images.map((image) => (
                        <div
                          key={image.id}
                          className={cn(
                            "overflow-hidden rounded-2xl border bg-white transition",
                            form.mainImageId === image.id &&
                              form.mainNewFileIndex === null
                              ? "border-[#173f37] ring-2 ring-[#173f37]/15"
                              : "border-[#173f37]/15",
                          )}
                        >
                          <div
                            role="img"
                            aria-label={`پیش‌نمایش ${image.originalName}`}
                            className="aspect-[4/3] bg-[#f2efe8] bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${resolveApiAssetUrl(image.url) ?? ""})`,
                            }}
                          />
                          <div className="space-y-2 p-3">
                            <div className="flex items-center gap-2">
                              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-medium">
                                <input
                                  type="radio"
                                  name="main-image"
                                  checked={
                                    form.mainImageId === image.id &&
                                    form.mainNewFileIndex === null
                                  }
                                  onChange={() =>
                                    setForm({
                                      ...form,
                                      mainImageId: image.id,
                                      mainNewFileIndex: null,
                                    })
                                  }
                                />
                                <span className="truncate">
                                  {form.mainImageId === image.id &&
                                  form.mainNewFileIndex === null
                                    ? "عکس اصلی"
                                    : "انتخاب به‌عنوان عکس اصلی"}
                                </span>
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const remainingImages = form.images.filter(
                                    (item) => item.id !== image.id,
                                  );
                                  const removedMainImage =
                                    form.mainImageId === image.id &&
                                    form.mainNewFileIndex === null;

                                  setForm({
                                    ...form,
                                    images: remainingImages,
                                    mainImageId: removedMainImage
                                      ? (remainingImages[0]?.id ?? "")
                                      : form.mainImageId,
                                    mainNewFileIndex:
                                      removedMainImage &&
                                      !remainingImages.length &&
                                      form.newFiles.length
                                        ? 0
                                        : form.mainNewFileIndex,
                                  });
                                }}
                                className="grid size-8 shrink-0 place-items-center rounded-lg text-red-600 hover:bg-red-50"
                                aria-label={`حذف تصویر ${image.originalName}`}
                              >
                                <X className="size-4" />
                              </button>
                            </div>
                            <p
                              className="truncate text-xs text-[#173f37]/65"
                              title={image.originalName}
                            >
                              {image.originalName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <NewImagePreviews
                    files={form.newFiles}
                    selectedIndex={form.mainNewFileIndex}
                    onSelect={(index) =>
                      setForm({
                        ...form,
                        mainImageId: "",
                        mainNewFileIndex: index,
                      })
                    }
                    onRemove={(index) => {
                      const remainingFiles = form.newFiles.filter(
                        (_, fileIndex) => fileIndex !== index,
                      );
                      let mainNewFileIndex = form.mainNewFileIndex;

                      if (mainNewFileIndex === index) {
                        mainNewFileIndex = remainingFiles.length ? 0 : null;
                      } else if (
                        mainNewFileIndex !== null &&
                        mainNewFileIndex > index
                      ) {
                        mainNewFileIndex -= 1;
                      }

                      setForm({
                        ...form,
                        newFiles: remainingFiles,
                        mainNewFileIndex,
                        mainImageId:
                          mainNewFileIndex === null && !form.mainImageId
                            ? (form.images[0]?.id ?? "")
                            : form.mainImageId,
                      });
                    }}
                  />
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#173f37]/25 bg-[#f8f6f1] px-4 py-7 text-sm">
                    <ImagePlus className="size-5" />
                    {form.newFiles.length
                      ? `${form.newFiles.length.toLocaleString("fa-IR")} تصویر جدید انتخاب شد`
                      : "انتخاب تصاویر JPEG، PNG یا WebP"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="sr-only"
                      onChange={(event) => {
                        const newFiles = Array.from(event.target.files ?? []);
                        setForm({
                          ...form,
                          newFiles,
                          mainNewFileIndex:
                            !form.mainImageId && newFiles.length ? 0 : null,
                        });
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="h-12 flex-1 rounded-xl border font-medium disabled:opacity-50"
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
                    ذخیره محصول
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ProductReference[];
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input"
      >
        <option value="">انتخاب کنید</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </Field>
  );
}
