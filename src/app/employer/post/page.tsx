import { PostWork } from "@/components/employer/PostWork";
import { TRADE_ORDER } from "@/lib/data/trades";
import type { TradeId } from "@/lib/types";

export default async function PostPage({ searchParams }: PageProps<"/employer/post">) {
  const sp = await searchParams;
  const trade = TRADE_ORDER.includes(sp.trade as TradeId) ? (sp.trade as TradeId) : undefined;
  return <PostWork initialTrade={trade} />;
}
