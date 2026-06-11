import Link from "next/link";
import type { TickerItem } from "@/lib/types";
import { TICKER_ITEMS } from "@/data/ticker";
import { ArrowDownIcon, ArrowUpIcon } from "./icons";

function Indicator({ kind }: { kind: TickerItem["kind"] }) {
  switch (kind) {
    case "price-up":
      return <ArrowUpIcon width={12} height={12} className="text-amber-500" />;
    case "price-down":
      return <ArrowDownIcon width={12} height={12} className="text-win" />;
    case "release":
      return <span className="text-accent">◆</span>;
    case "tip":
      return <span className="text-accent">★</span>;
    default:
      return <span className="text-muted">●</span>;
  }
}

function Item({ item }: { item: TickerItem }) {
  const inner = (
    <span className="inline-flex items-center gap-2">
      <Indicator kind={item.kind} />
      <span dir="rtl">{item.text}</span>
    </span>
  );
  if (item.href) {
    return (
      <Link href={item.href} className="transition-colors hover:text-accent">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function NewsTicker({ items = TICKER_ITEMS }: { items?: TickerItem[] }) {
  // משכפלים את הרשימה כדי ליצור לולאה רציפה (translateX -50%)
  const loop = [...items, ...items];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-md">
      <div className="ticker-mask flex overflow-hidden">
        <div
          dir="ltr"
          className="ticker-track flex shrink-0 animate-ticker items-center gap-7 whitespace-nowrap py-2 ps-7 mono text-[12px] text-foreground/85"
        >
          {loop.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-7">
              <Item item={item} />
              <span aria-hidden className="text-border">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
