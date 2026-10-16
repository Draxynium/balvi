import { notFound } from "next/navigation";
import { ProductDetails } from "@/features/catalog/components/product-details";
import { getCatalogProduct } from "@/features/catalog/server/catalog-service";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product: Awaited<ReturnType<typeof getCatalogProduct>>;

  try {
    product = await getCatalogProduct(id);
  } catch {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center px-6"
        dir="rtl"
      >
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-medium">دریافت محصول ممکن نشد</h1>
          <p className="text-muted-foreground mt-3 text-sm leading-7">
            ارتباط با فروشگاه برقرار نیست. لطفاً کمی بعد دوباره تلاش کنید.
          </p>
        </div>
      </main>
    );
  }

  if (!product) notFound();
  return <ProductDetails product={product} />;
}
