import ItemsCarousel from "@/components/items-carousel";
import ItemCard from "@/components/item-card";

export default function Items() {
    <section className="relative flex justify-center flex-col items-center w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
        <ItemsCarousel>
            {Array.from({ length: 13 }).map((_, i) => (
                <ItemCard
                    key={i}
                    item={{
                    name: "بوت مشکی",
                    colors: ["#1f1f1f", "#301b1b"],
                    beforePrice: 2500000,
                    price: 2000000,
                    image: "/images/boot.png",
                    }}
                />
            ))}
        </ItemsCarousel>
    </section>
}