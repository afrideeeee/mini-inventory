import { useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { ROUTES } from "../config/routes";
import { useProducts } from "../hooks/useProducts";
import { usePagination } from "../hooks/usePagination";
import { getStockStatus } from "../utils/stockStatus";
import { STOCK_STATES, STOCK_STATE_OPTIONS } from "../constants/stockStates";

import PageHeader from "../components/common/PageHeader";
import ArrowLink from "../components/common/ArrowLink";
import SearchInput from "../components/common/SearchInput";
import SelectInput from "../components/common/SelectInput";
import Notice from "../components/common/Notice";
import SplitLayout from "../components/layout/SplitLayout";
import StockTable from "../components/stock/StockTable";
import MovementForm from "../components/stock/MovementForm";
import "./StockManagementPage.css";

const PAGE_SIZE = 8;

export default function StockManagementPage() {
  const { products, stats, loading, error, recordMovement } = useProducts();

  const [query, setQuery] = useState("");
  const [stockStateFilter, setStockStateFilter] = useState(STOCK_STATES.ALL);
  const [selectedProductId, setSelectedProductId] = useState("prod-03"); // defaults to Ceramic mug like in reference

  // Filter products by search text and status
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.bin.toLowerCase().includes(q);

      if (!matchesQuery) return false;

      if (stockStateFilter === STOCK_STATES.ALL) return true;

      const status = getStockStatus(item.onHand, item.minLevel);
      if (stockStateFilter === STOCK_STATES.IN_STOCK) return status === "in-stock";
      if (stockStateFilter === STOCK_STATES.LOW_STOCK) return status === "low-stock";
      if (stockStateFilter === STOCK_STATES.OUT_OF_STOCK) return status === "out-of-stock";

      return true;
    });
  }, [products, query, stockStateFilter]);

  const pager = usePagination(filteredProducts, PAGE_SIZE);

  const handleSearch = (val) => {
    setQuery(val);
    pager.setPage(1);
  };

  const handleFilterChange = (e) => {
    setStockStateFilter(e.target.value);
    pager.setPage(1);
  };

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
  };

  const handleRecordMovement = async (movementData) => {
    await recordMovement(movementData);
  };

  return (
    <>
      <PageHeader
        eyebrow="04 / COUNT IT IN. COUNT IT OUT."
        title="Stock management"
        subtitle="Know what's on the shelf. Record a movement to keep every quantity accurate."
      >
        <ArrowLink to={ROUTES.movements}>Movement records</ArrowLink>
      </PageHeader>

      <div className="stock-stats-box" role="region" aria-label="Inventory summary">
        <div className="stock-stat">
          <span className="stock-stat__val">{stats.totalUnits}</span>
          <span className="stock-stat__lbl">units on hand</span>
        </div>
        <div className="stock-stat">
          <span className="stock-stat__val">{stats.inStockCount}</span>
          <span className="stock-stat__lbl">products in stock</span>
        </div>
        <div className="stock-stat">
          <span className="stock-stat__val">{stats.lowStockCount}</span>
          <span className="stock-stat__lbl">below minimum</span>
        </div>
        <div className="stock-stat">
          <span className="stock-stat__val">{stats.outOfStockCount}</span>
          <span className="stock-stat__lbl">out of stock</span>
        </div>
      </div>

      <SplitLayout
        side={
          <MovementForm
            products={products}
            selectedProductId={selectedProductId}
            onProductChange={handleProductSelect}
            onSubmit={handleRecordMovement}
          />
        }
      >
        <div className="stock-filter-row">
          <SearchInput
            value={query}
            onChange={handleSearch}
            placeholder="Search name or SKU…"
          />
          <SelectInput
            value={stockStateFilter}
            onChange={handleFilterChange}
            options={STOCK_STATE_OPTIONS}
            aria-label="Filter by stock state"
          />
        </div>

        {loading ? (
          <Notice>Loading stock ledger…</Notice>
        ) : error ? (
          <Notice>Couldn't load stock data: {error}</Notice>
        ) : (
          <>
            <StockTable
              products={pager.pageItems}
              selectedProductId={selectedProductId}
              onSelectProduct={handleProductSelect}
              pager={pager}
            />
            <Notice icon={TriangleAlert}>
              Low stock means on-hand quantity is below the product's minimum level.
            </Notice>
          </>
        )}
      </SplitLayout>
    </>
  );
}
