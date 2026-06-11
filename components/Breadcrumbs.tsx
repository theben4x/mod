import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="פירורי לחם" className="mono flex flex-wrap items-center gap-1.5 text-xs text-muted">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1.5">
            {item.href && !last ? (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span className={last ? "text-foreground" : ""}>{item.name}</span>
            )}
            {!last && <span className="text-border">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
