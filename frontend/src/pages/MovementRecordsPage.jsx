import { useMemo, useState } from "react";
import { Download, Info } from "lucide-react";
import { useMovements } from "../hooks/useMovements";
import { usePagination } from "../hooks/usePagination";
import { exportCsv } from "../utils/csv";
import { formatDateLong } from "../utils/format";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Notice from "../components/common/Notice";
import MovementFilters from "../components/movements/MovementFilters";
import MovementSummary from "../components/movements/MovementSummary";
import MovementTable from "../components/movements/MovementTable";
import MovementDetails from "../components/movements/MovementDetails";
import "./MovementRecordsPage.css";

const PAGE_SIZE = 8;

const CSV_COLUMNS = [
  { label: "Entry", value: (m) => m.id },
  { label: "Product", value: (m) => m.productName },
  { label: "SKU", value: (m) => m.sku },
  { label: "Movement", value: (m) => (m.type === "in" ? "Stock-in" : "Stock-out") },
  { label: "Units", value: (m) => (m.type === "in" ? `+${m.quantity}` : `-${m.quantity}`) },
  { label: "Before", value: (m) => m.balanceBefore ?? 0 },
  { label: "After", value: (m) => m.balanceAfter ?? 0 },
  { label: "Reason", value: (m) => m.reason || "—" },
  { label: "Date", value: (m) => m.date },
  { label: "Time", value: (m) => m.time || "—" },
  { label: "By", value: (m) => m.by || "Alex Lee" },
];

export default function MovementRecordsPage() {
  const { movements, loading, error } = useMovements();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedMovement, setSelectedMovement] = useState(null);
  const selectedDateLabel = dateFilter
    ? formatDateLong(new Date(`${dateFilter}T12:00:00`))
    : "";

  const filtered = useMemo(() => {
    return movements.filter((m) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.id.toLowerCase().includes(q) ||
        m.productName.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      if (dateFilter && m.dateKey !== dateFilter && m.date !== selectedDateLabel) return false;

      return true;
    });
  }, [movements, searchQuery, typeFilter, dateFilter, selectedDateLabel]);

  const pager = usePagination(filtered, PAGE_SIZE);

  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setDateFilter("");
    pager.setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    pager.setPage(1);
  };

  const handleTypeChange = (val) => {
    setTypeFilter(val);
    pager.setPage(1);
  };

  const handleDateChange = (val) => {
    setDateFilter(val);
    pager.setPage(1);
  };

  return (
    <div className="movement-records-page">
      <PageHeader
        eyebrow="05 / STOCK-IN & STOCK-OUT RECORDS"
        title="Movement records"
        subtitle="The story behind every unit. Search the ledger to trace what came in and what went out."
      >
        <Button
          icon={Download}
          onClick={() => exportCsv("movement-records.csv", CSV_COLUMNS, filtered)}
        >
          Export CSV
        </Button>
      </PageHeader>

      <MovementFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
        dateValue={dateFilter}
        onDateChange={handleDateChange}
        onClear={handleClearFilters}
      />

      <MovementSummary movements={filtered} />

      {loading ? (
        <Notice>Loading movement records…</Notice>
      ) : error ? (
        <Notice>Error loading movement records: {error}</Notice>
      ) : (
        <>
          <MovementTable
            movements={pager.pageItems}
            pager={pager}
            onSelectMovement={setSelectedMovement}
          />

          <div className="movement-records-notice">
            <Notice icon={Info}>
              Balance shows stock before → after each entry. Open an entry to view its reason and timestamp.
            </Notice>
          </div>
        </>
      )}

      {selectedMovement && (
        <MovementDetails
          movement={selectedMovement}
          onClose={() => setSelectedMovement(null)}
        />
      )}
    </div>
  );
}
