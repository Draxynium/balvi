"use client";

export default function ItemCard({
  item,
}: {
  item: {
    name: string;
    colors: string[];
    beforePrice: number;
    price: number;
    image: string;
  };
}) {
  const discount = Math.round(
    ((item.beforePrice - item.price) / item.beforePrice) * 100
  );

  return (
    <div className="w-32 sm:w-40 md:w-48 lg:w-52 flex flex-col gap-1.5 sm:gap-2 shrink-0 snap-start select-none">
      {/* ---------- IMAGE ---------- */}
      <div
        data-navbar-dark
        className="relative w-full aspect-square rounded-md bg-card-foreground overflow-hidden"
      >
        <img
          src={item.image}
          alt={item.name}
          className="relative z-20 w-full h-full object-cover"
        />
        <img
          src="/images/pattern.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-10 w-full h-full object-cover"
        />
      </div>

      {/* ---------- NAME + COLORS ---------- */}
      <div className="flex flex-col items-start gap-1 sm:gap-2 w-full">
        <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight line-clamp-1">
          {item.name}
        </h3>

        <div className="flex items-center gap-1 text-[10px] sm:text-xs md:text-sm">
          <p className="text-muted-foreground">رنگ‌ها:</p>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {item.colors.map((color, index) => (
              <div
                key={index}
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-md ring-1 ring-foreground/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <hr className="border-foreground/10" />

      {/* ---------- PRICE ---------- */}
      <div className="flex flex-col items-end gap-1 sm:gap-2 w-full">
        <div className="flex flex-row-reverse items-center gap-1.5 sm:gap-2">
          <p className="text-[10px] sm:text-[11px] md:text-sm text-muted-foreground line-through whitespace-nowrap">
            {item.beforePrice.toLocaleString("fa-IR")}
          </p>
          <p className="bg-destructive text-white text-[9px] sm:text-[10px] md:text-xs rounded-md px-1.5 sm:px-2 py-0.5 flex items-center justify-center whitespace-nowrap">
            {discount}%
          </p>
        </div>

        <p className="font-bold text-[11px] sm:text-xs md:text-base whitespace-nowrap">
          {item.price.toLocaleString("fa-IR")}{" "}
          <span className="font-normal text-muted-foreground">تومان</span>
        </p>
      </div>
    </div>
  );
}