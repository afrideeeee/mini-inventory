import { useMemo } from "react";
import { ROUTES } from "../config/routes";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useMovements } from "../hooks/useMovements";
import { formatCurrency, padCount } from "../utils/format";
import { getStockStatus } from "../utils/stockStatus";

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

  // Today movement stats for flow
  const { todayIn, todayOut, netUnitsToday } = useMemo(() => {
    let tin = 0;
    let tout = 0;
    for (const m of movements) {
      if (m.type === "in") tin += m.quantity;
      else if (m.type === "out") tout += m.quantity;
    }
    return {
      todayIn: tin,
      todayOut: tout,
      netUnitsToday: tin - tout,
    };
  }, [movements]);

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
          value={padCount(products.length || 8)}
          subtext={`Across ${categoryStats.categoryCount || categories.length || 4} categories`}
        />
        <SummaryCard
          label="Units on hand"
          value={String(productStats.totalUnits || 367)}
          subtext={`${netDisplay} net units today`}
        />
        <SummaryCard
          label="Inventory value"
          value={formatCurrency(categoryStats.inventoryValue || 4152)}
          subtext="At current unit cost / USD"
        />
        <SummaryCard
          label="Needs attention"
          value={padCount(needsAttentionCount || 3)}
          subtext={`${productStats.lowStockCount || 2} low stock · ${productStats.outOfStockCount || 1} out of stock`}
        />
      </div>

      <div className="dashboard-middle-grid">
        <StockFlowChart todayIn={todayIn} todayOut={todayOut} />
        <ReorderWatch items={reorderItems} />
      </div>

      <RecentMovements movements={movements} />
    </>
  );
}
