import { Download } from "lucide-react";
import SearchInput from "../common/SearchInput";
import SelectInput from "../common/SelectInput";
import Button from "../common/Button";
import { STOCK_STATE_OPTIONS } from "../../constants/stockStates";
import "./ProductFilters.css";

export default function ProductFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories = [],
  stockStateFilter,
  onStockStateChange,
  onExport,
}) {
  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <div className="product-filters" role="search" aria-label="Product filters">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by product name or SKU…"
      />

      <SelectInput
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={categoryOptions}
        aria-label="Filter by category"
      />

      <SelectInput
        value={stockStateFilter}
        onChange={(e) => onStockStateChange(e.target.value)}
        options={STOCK_STATE_OPTIONS}
        aria-label="Filter by stock state"
      />

      <Button icon={Download} onClick={onExport}>
        Export
      </Button>
    </div>
  );
}
