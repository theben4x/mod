import { NextResponse } from "next/server";
import { getPrices } from "@/lib/prices/provider";

// GET /api/price?ids=rtx-4090,rtx-5090
// מחזיר מפת מחירים { id: PriceQuote }. נופל אוטומטית למחירי seed.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (ids.length === 0) {
    return NextResponse.json(
      { error: "missing 'ids' query param" },
      { status: 400 },
    );
  }

  const prices = await getPrices(ids);
  return NextResponse.json(prices, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
