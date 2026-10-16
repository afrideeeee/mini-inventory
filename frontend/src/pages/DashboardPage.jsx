import { useMemo } from "react";
import { ROUTES } from "../config/routes";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useMovements } from "../hooks/useMovements";
import { formatCurrency, padCount } from "../utils/format";
import { getStockStatus } from "../utils/stockStatus";
import { buildStockFlowData } from "../utils/stockFlowData";

import PageHeader from "../components/common/PageHeader";
import ArrowLink from "../components/common/ArrowLink";
import SummaryCard from "../components/dashboard/SummaryCard";
import StockFlowChart from "../components/dashboard/StockFlowChart";
import ReorderWatch from "../components/dashboard/ReorderWatch";
import RecentMovements from "../components/dashboard/RecentMovements";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { products, stats: productStats } = useProducts();
  const { categories, stats: categoryStats } = useCategories();
  const { movements } = useMovements();

  // Low stock and out of stock items
  const reorderItems = useMemo(() => {
    return products.filter((p) => {
      const status = getStockStatus(p.onHand, p.minLevel);
      return status === "low-stock" || status === "out-of-stock";
    });
  }, [products]);

  const stockFlow = useMemo(() => buildStockFlowData(movements), [movements]);
  const netUnitsToday = stockFlow.todayIn - stockFlow.todayOut;

  const netDisplay = netUnitsToday >= 0 ? `+${netUnitsToday}` : String(netUnitsToday);
  const needsAttentionCount = productStats.lowStockCount + productStats.outOfStockCount;

  return (
    <>
      <PageHeader
        eyebrow="01 / THE BIG PICTURE"
        title="Everything, accounted for."
        subtitle="A clear view of your inventory. Every product, every unit, every movement."
      >
        <ArrowLink to={ROUTES.products}>View products</ArrowLink>
      </PageHeader>

      <div className="dashboard-metrics-grid" role="region" aria-label="Key inventory metrics">
        <SummaryCard
          label="Products on the books"
          value={padCount(products.length)}
          subtext={`Across ${categoryStats.categoryCount || categories.length} categories`}
        />
        <SummaryCard
          label="Units on hand"
          value={String(productStats.totalUnits)}
          subtext={`${netDisplay} net units today`}
        />
        <SummaryCard
          label="Inventory value"
          value={formatCurrency(productStats.totalValue)}
          subtext="At current unit cost / PKR"
        />
        <SummaryCard
          label="Needs attention"
          value={padCount(needsAttentionCount)}
          subtext={`${productStats.lowStockCount} low stock · ${productStats.outOfStockCount} out of stock`}
        />
      </div>

      <div className="dashboard-middle-grid">
        <StockFlowChart {...stockFlow} />
        <ReorderWatch items={reorderItems} />
      </div>

      <RecentMovements movements={movements} />
    </>
  );
}
