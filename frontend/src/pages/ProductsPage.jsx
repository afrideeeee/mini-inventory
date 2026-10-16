import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Upload } from "lucide-react";
import { ROUTES } from "../config/routes";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { usePagination } from "../hooks/usePagination";
import { exportCsv } from "../utils/csv";
import { getStockStatus } from "../utils/stockStatus";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Notice from "../components/common/Notice";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ProductFilters from "../components/products/ProductFilters";
import ProductTable from "../components/products/ProductTable";
import "./ProductsPage.css";

const PAGE_SIZE = 8;

const CSV_COLUMNS = [
  { label: "SKU", value: (p) => p.sku },
  { label: "Product Name", value: (p) => p.name },
  { label: "Category", value: (p) => p.category },
  { label: "Unit Cost", value: (p) => p.unitCost },
  { label: "On Hand", value: (p) => p.onHand },
  { label: "Min Level", value: (p) => p.minLevel },
  { label: "Bin", value: (p) => p.bin },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, stats, loading, error, deleteProduct } = useProducts();
  const { categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockStateFilter, setStockStateFilter] = useState("all");
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.bin.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (categoryFilter !== "all" && p.category !== categoryFilter) {
        return false;
      }

      if (stockStateFilter !== "all") {
        const status = getStockStatus(p.onHand, p.minLevel);
        if (stockStateFilter === "in_stock" && status !== "in-stock") return false;
        if (stockStateFilter === "low_stock" && status !== "low-stock") return false;
        if (stockStateFilter === "out_of_stock" && status !== "out-of-stock") return false;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter, stockStateFilter]);

  const pager = usePagination(filtered, PAGE_SIZE);

  const handleEdit = (product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete product.");
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleExport = () => {
    exportCsv("products-catalog.csv", CSV_COLUMNS, filtered);
  };

  const isDeleteBlocked = deletingProduct && deletingProduct.onHand > 0;

  return (
    <div className="products-page">
      <PageHeader
        eyebrow="02 / THE PRODUCT CATALOG"
        title="Products"
        subtitle="Keep product details tidy and tied to the right category."
      >
        <div className="products-page-header-actions">
          <Button icon={Upload} onClick={() => alert("CSV import feature ready for file upload.")}>
            Import CSV
          </Button>
          <Button to={ROUTES.productNew} variant="strong" icon={Plus}>
            Add product
          </Button>
        </div>
      </PageHeader>

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          pager.setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => {
          setCategoryFilter(val);
          pager.setPage(1);
        }}
        categories={categories}
        stockStateFilter={stockStateFilter}
        onStockStateChange={(val) => {
          setStockStateFilter(val);
          pager.setPage(1);
        }}
        onExport={handleExport}
      />

      {loading ? (
        <Notice>Loading products…</Notice>
      ) : error ? (
        <Notice>Error loading products: {error}</Notice>
      ) : (
        <ProductTable
          products={pager.pageItems}
          pager={pager}
          totalUnits={stats.totalUnits}
          onEdit={handleEdit}
          onDelete={setDeletingProduct}
        />
      )}

      {deletingProduct && (
        <ConfirmDialog
          title={isDeleteBlocked ? "Can't delete product yet" : "Delete product"}
          message={
            deleteError ||
            (isDeleteBlocked
              ? `"${deletingProduct.name}" still has ${deletingProduct.onHand} units on hand. Stock them out before deleting the product record.`
              : `Delete "${deletingProduct.name}" (${deletingProduct.sku})? This cannot be undone.`)
          }
          confirmLabel="Delete"
          cancelLabel={isDeleteBlocked ? "Close" : "Cancel"}
          busy={deleteBusy}
          onConfirm={isDeleteBlocked ? null : handleConfirmDelete}
          onCancel={() => {
            setDeletingProduct(null);
            setDeleteError("");
          }}
        />
      )}
    </div>
  );
}
