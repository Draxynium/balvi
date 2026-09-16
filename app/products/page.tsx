import Link from "next/link";
import ProductsCategoryNav from "@/components/products/products-category-nav";
import ProductGrid from "@/components/products/product-grid";
import { getProducts } from "@/lib/products";

type ProductsPageProps = {
  searchParams: Promise<{
    gender?: string;
    category?: string;
  }>;
};

const BASE_PATH = "/products";

function makeHref({
  gender,
  category,
}: {
  gender?: string;
  category?: string;
}) {
  const sp = new URLSearchParams();
  if (gender) sp.set("gender", gender);
  if (category) sp.set("category", category);
  const qs = sp.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const gender = params.gender;
  const category = params.category;

  const products = await getProducts();

  const filteredProducts = products.filter((product) => {
    const matchesGender = !gender || product.gender === gender;
    const matchesCategory = !category || product.category === category;
    return matchesGender && matchesCategory;
  });

  const genderOptions: { value?: string; label: string }[] = [
    { value: undefined, label: "همه" },
    { value: "male", label: "مردانه" },
    { value: "female", label: "زنانه" },
  ];

  return (
    <main dir="rtl" className="flex w-full flex-col items-center">
      <ProductsCategoryNav />

      <div className="w-full pt-24" />

      <section className="flex w-full flex-col items-center">
        <div className="flex w-[95%] items-center justify-between gap-4 py-6">
          <span className="text-xs text-foreground/45">
            {filteredProducts.length} محصول
          </span>

          <div className="flex items-center gap-6 text-xs text-foreground/50">
            {/* Gender pills */}
            <div className="flex items-center gap-2">
              {genderOptions.map((opt) => {
                const isActive = (gender ?? undefined) === opt.value;

                return (
                  <Link
                    key={opt.label}
                    href={makeHref({ gender: opt.value, category })}
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

            <span className="h-4 w-px bg-foreground/15" />

            <button
              type="button"
              className="transition-colors hover:text-foreground"
            >
              فیلتر
            </button>

            <button
              type="button"
              className="transition-colors hover:text-foreground"
            >
              مرتب سازی
            </button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="flex min-h-[40vh] w-full items-center justify-center">
            <p className="text-sm text-foreground/40">
              محصولی در این دسته بندی پیدا نشد.
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