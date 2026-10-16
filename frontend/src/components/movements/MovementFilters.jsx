import SearchInput from "../common/SearchInput";
import SelectInput from "../common/SelectInput";
import DateFilterInput from "../common/DateFilterInput";
import Button from "../common/Button";
import "./MovementFilters.css";

const MOVEMENT_TYPE_OPTIONS = [
  { value: "all", label: "All movements" },
  { value: "in", label: "Stock-in only" },
  { value: "out", label: "Stock-out only" },
];

export default function MovementFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  dateValue,
  onDateChange,
  onClear,
}) {
  return (
    <div className="movement-filters" role="search" aria-label="Movement filters">
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search entry, product or SKU…"
      />

      <SelectInput
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        options={MOVEMENT_TYPE_OPTIONS}
        aria-label="Filter by movement type"
      />

      <DateFilterInput
        value={dateValue}
        onChange={onDateChange}
      />

      <Button onClick={onClear}>Clear filters</Button>
    </div>
  );
}
