"use client";

export default function ItemCard({item}: {item: {name: string, colors: string[], beforePrice: number, price: number, image: string}}) {
  return(
    <div className="w-52 flex flex-col gap-2 shrink-0 snap-start select-none">
      <div data-navbar="dark" className="w-full rounded-md relative aspect-square bg-card-foreground overflow-hidden">
        <img src={item.image} alt={item.name} className="z-99 w-full h-full object-cover relative" />
        <img src="/images/pattern.png" alt="Pattern" className="absolute inset-0 w-full h-full object-cover z-90" />
      </div>
      <div className="flex gap-2 flex-col items-start w-full">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <div className="flex gap-1">
          <p>رنگ ها:</p>
          {item.colors.map((color, index) => (
            <div key={index} className="w-4 h-4 rounded-full" style={{backgroundColor: color}} />
          ))}
        </div>
      </div>
      <hr/>
      <div className="flex gap-2 flex-col items-end w-full">
        <div className="flex gap-2 flex-row-reverse">
          <p className="text-muted-foreground line-through">{item.beforePrice.toLocaleString('fa-IR')}</p>
          <p className="bg-destructive rounded-full px-2 text-white flex items-center justify-center">{Math.round(((item.beforePrice - item.price) / item.beforePrice) * 100)}%</p>
        </div>
        <p className="font-bold">{item.price.toLocaleString('fa-IR')} تومان</p>
      </div>
    </div>
  )
}