import { FindWorkers } from "@/components/employer/FindWorkers";
import { TRADE_ORDER } from "@/lib/data/trades";
import type { TradeId } from "@/lib/types";

export default async function WorkersPage({ searchParams }: PageProps<"/employer/workers">) {
  const sp = await searchParams;
  const trade = TRADE_ORDER.includes(sp.trade as TradeId) ? (sp.trade as TradeId) : undefined;
  return <FindWorkers initialTrade={trade} />;
}
