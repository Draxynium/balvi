import Link from "next/link";
import ProductsCategoryNav from "@/components/products/products-category-nav";
import ProductGrid from "@/components/products/product-grid";
import { getCatalogProducts } from "@/features/catalog/server/catalog-service";

type ProductsPageProps = {
  searchParams: Promise<{
    gender?: string;
    category?: string;
    sort?: string;
    search?: string;
  }>;
};

const BASE_PATH = "/products";

function makeHref({
  gender,
  category,
  sort,
  search,
}: {
  gender?: string;
  category?: string;
  sort?: string;
  search?: string;
}) {
  const sp = new URLSearchParams();
  if (gender) sp.set("gender", gender);
  if (category) sp.set("category", category);
  if (sort) sp.set("sort", sort);
  if (search) sp.set("search", search);
  const qs = sp.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const gender = params.gender;
  const category = params.category;
  const sort = params.sort;
  let unavailable = false;
  let products: Awaited<ReturnType<typeof getCatalogProducts>>;

  try {
    products = await getCatalogProducts({
      gender,
      category,
      sort,
      search: params.search,
    });
  } catch {
    unavailable = true;
    products = {
      items: [],
      page: 1,
      pageSize: 100,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  const genderOptions: { value?: string; label: string }[] = [
    { value: undefined, label: "همه" },
    { value: "male", label: "مردانه" },
    { value: "female", label: "زنانه" },
  ];

  return (
    <main
      dir="rtl"
      className="flex w-full min-w-0 flex-col items-center overflow-x-clip"
    >
      <ProductsCategoryNav />

      <div className="w-full pt-24" />

      <section className="flex w-full min-w-0 flex-col items-center">
        <div className="flex w-full min-w-0 flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-4 md:py-6">
          <div className="text-foreground/50 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3 text-xs sm:gap-x-6">
            <div className="flex shrink-0 items-center gap-2">
              {genderOptions.map((opt) => {
                const isActive = (gender ?? undefined) === opt.value;

                return (
                  <Link
                    key={opt.label}
                    href={makeHref({
                      gender: opt.value,
                      category,
                      sort,
                      search: params.search,
                    })}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/20 text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </div>

            <span className="bg-foreground/15 hidden h-4 w-px sm:block" />

            {[
              { value: undefined, label: "جدیدترین" },
              { value: "cheapest", label: "ارزان‌ترین" },
              { value: "expensive", label: "گران‌ترین" },
            ].map((option) => (
              <Link
                key={option.label}
                href={makeHref({
                  gender,
                  category,
                  sort: option.value,
                  search: params.search,
                })}
                className={
                  (sort ?? undefined) === option.value
                    ? "text-foreground shrink-0"
                    : "hover:text-foreground shrink-0 transition-colors"
                }
              >
                {option.label}
              </Link>
            ))}
          </div>

          <span className="text-foreground/45 shrink-0 self-end text-xs md:self-auto">
            {products.totalCount.toLocaleString("fa-IR")} محصول
          </span>
        </div>

        {products.items.length > 0 ? (
          <ProductGrid products={products.items} />
        ) : (
          <div className="flex min-h-[40vh] w-full items-center justify-center">
            <p className="text-foreground/40 text-sm">
              {unavailable
                ? "در حال حاضر ارتباط با فروشگاه برقرار نیست."
                : "محصولی در این دسته‌بندی پیدا نشد."}
            </p>
          </div>
        )}
      </section>
      <style>
        {`
          .main-navbar {
            border: none !important;
            backdrop-filter: unset !important;
            background: none !important;
          }
        `}
      </style>
    </main>
  );
}
