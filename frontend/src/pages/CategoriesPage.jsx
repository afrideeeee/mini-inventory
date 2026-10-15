import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { usePagination } from "../hooks/usePagination";
import { exportCsv } from "../utils/csv";
import { formatCurrency, formatNumber, padCount, pluralise } from "../utils/format";

import PageHeader from "../components/common/PageHeader";
import StatsBar from "../components/common/StatsBar";
import SearchInput from "../components/common/SearchInput";
import Button from "../components/common/Button";
import Notice from "../components/common/Notice";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SplitLayout from "../components/layout/SplitLayout";
import CategoryTable from "../components/categories/CategoryTable";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryNote from "../components/categories/CategoryNote";

const PAGE_SIZE = 8;

const CSV_COLUMNS = [
  { label: "Code", value: (c) => c.code },
  { label: "Name", value: (c) => c.name },
  { label: "Description", value: (c) => c.description },
  { label: "Products", value: (c) => c.productCount },
  { label: "Units", value: (c) => c.units },
];

export default function CategoriesPage() {
  const { categories, stats, loading, error, addCategory, updateCategory, deleteCategory } =
    useCategories();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // category being edited, or null
  const [deleting, setDeleting] = useState(null); // category awaiting delete confirmation
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q)
    );
  }, [categories, query]);

  const pager = usePagination(filtered, PAGE_SIZE);

  const statItems = [
    { value: padCount(stats.categoryCount), label: "Categories" },
    { value: padCount(stats.assignedProducts), label: "Assigned products" },
    { value: formatNumber(stats.totalUnits), label: "Total units" },
    { value: formatCurrency(stats.inventoryValue), label: "Inventory value" },
  ];

  const handleSearch = (value) => {
    setQuery(value);
    pager.setPage(1);
  };

  const handleSubmit = async (input) => {
    if (editing) {
      await updateCategory(editing.id, input);
      setEditing(null);
    } else {
      await addCategory(input);
    }
  };

  const closeDelete = () => {
    setDeleting(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await deleteCategory(deleting.id);
      if (editing?.id === deleting.id) setEditing(null);
      setDeleting(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const blocked = deleting && deleting.productCount > 0;

  return (
    <>
      <PageHeader
        eyebrow="03 / A place for everything"
        title="Categories"
        subtitle="Bring order to the catalog. Group products by what they are, not where they sit."
      >
        <Button
          icon={Download}
          onClick={() => exportCsv("categories.csv", CSV_COLUMNS, categories)}
        >
          Export categories
        </Button>
      </PageHeader>

      <StatsBar items={statItems} />

      <SplitLayout
        side={
          <>
            <CategoryForm
              key={editing?.id ?? "new"}
              category={editing}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(null)}
            />
            <CategoryNote />
          </>
        }
      >
        <SearchInput value={query} onChange={handleSearch} placeholder="Search categories…" />

        {loading ? (
          <Notice>Loading categories…</Notice>
        ) : error ? (
          <Notice>Couldn't load categories: {error}</Notice>
        ) : (
          <>
            <CategoryTable
              rows={pager.pageItems}
              pager={pager}
              editingId={editing?.id}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
            <Notice>
              {stats.unassignedProducts === 0
                ? `All ${stats.assignedProducts} ${pluralise(stats.assignedProducts, "product")} ${
                    stats.assignedProducts === 1 ? "has" : "have"
                  } a category. No unassigned products.`
                : `${stats.unassignedProducts} ${pluralise(
                    stats.unassignedProducts,
                    "product"
                  )} without a category.`}
            </Notice>
          </>
        )}
      </SplitLayout>

      {deleting && (
        <ConfirmDialog
          title={blocked ? "Can't delete yet" : "Delete category"}
          message={
            deleteError ||
            (blocked
              ? `"${deleting.name}" still has ${deleting.productCount} ${pluralise(
                  deleting.productCount,
                  "product"
                )}. Move them to another category before deleting it.`
              : `Delete "${deleting.name}"? This can't be undone.`)
          }
          confirmLabel="Delete"
          cancelLabel={blocked ? "Close" : "Cancel"}
          busy={deleteBusy}
          onConfirm={blocked ? null : confirmDelete}
          onCancel={closeDelete}
        />
      )}
    </>
  );
}
