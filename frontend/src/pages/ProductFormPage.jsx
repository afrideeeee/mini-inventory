import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { ROUTES } from "../config/routes";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SplitLayout from "../components/layout/SplitLayout";
import ProductForm from "../components/products/ProductForm";
import ProductSnapshot from "../components/products/ProductSnapshot";
import ProductLedgerNote from "../components/products/ProductLedgerNote";
import "./ProductFormPage.css";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  const isEdit = Boolean(id);
  const currentProduct = isEdit ? products.find((p) => p.id === id) : null;

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);

  const handleSubmit = async (formData) => {
    if (isEdit && currentProduct) {
      await updateProduct(currentProduct.id, formData);
      navigate(ROUTES.products);
    } else {
      await addProduct(formData);
      navigate(ROUTES.products);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.products);
  };

  const handleConfirmDelete = async () => {
    if (!currentProduct) return;
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await deleteProduct(currentProduct.id);
      navigate(ROUTES.products);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete product.");
    } finally {
      setDeleteBusy(false);
    }
  };

  const isDeleteBlocked = currentProduct && currentProduct.onHand > 0;
  const selectedEditProductId = currentProduct?.id || products[0]?.id || "";

  const handleEditMode = () => {
    if (selectedEditProductId) {
      navigate(`/products/${selectedEditProductId}/edit`);
    }
  };

  return (
    <div className="product-form-page">
      <PageHeader
        eyebrow={`02 / PRODUCTS / ${currentProduct?.sku || "NEW"}`}
        title={isEdit ? "Edit product" : "Add a product"}
        subtitle="A place for every detail. Update the product without changing its stock history."
      >
        <Button to={ROUTES.products} icon={ArrowLeft}>
          Back to products
        </Button>
      </PageHeader>

      <div className="product-form-tabs" role="tablist">
        <Link
          to={ROUTES.productNew}
          className={`product-form-tab ${!isEdit ? "product-form-tab--active" : ""}`}
        >
          <Plus size={16} />
          <span>Add product</span>
        </Link>
        {isEdit ? (
          <div className="product-form-tab product-form-tab--active">
            <Pencil size={16} />
            <span>Edit product</span>
          </div>
        ) : (
          <button
            type="button"
            className="product-form-tab"
            onClick={handleEditMode}
            disabled={!selectedEditProductId}
          >
            <Pencil size={16} />
            <span>Edit product</span>
          </button>
        )}
      </div>

      {isEdit && (
        <div className="product-form-edit-picker">
          <label htmlFor="edit-product-select">Product to edit</label>
          <select
            id="edit-product-select"
            value={selectedEditProductId}
            onChange={(event) => navigate(`/products/${event.target.value}/edit`)}
            disabled={productsLoading || products.length === 0}
          >
            {products.length === 0 && <option value="">No products available</option>}
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>
      )}

      <SplitLayout
        side={
          <>
            <ProductSnapshot
              product={
                currentProduct || {
                  name: "New product",
                  sku: "PROD-NEW",
                  onHand: 0,
                  unitCost: 0,
                  createdAt: "Not yet saved",
                  createdBy: "",
                }
              }
            />
            <ProductLedgerNote
              isEdit={isEdit}
              onDelete={() => setDeleting(true)}
            />
          </>
        }
      >
        {isEdit && productsLoading ? (
          <p role="status">Loading product…</p>
        ) : isEdit && !currentProduct ? (
          <p role="alert">Product not found.</p>
        ) : categoriesLoading ? (
          <p role="status">Loading categories…</p>
        ) : (
        <ProductForm
          key={currentProduct?.id || "new"}
          product={currentProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
        )}
      </SplitLayout>

      {deleting && (
        <ConfirmDialog
          title={isDeleteBlocked ? "Can't delete product yet" : "Delete product"}
          message={
            deleteError ||
            (isDeleteBlocked
              ? `"${currentProduct.name}" still has ${currentProduct.onHand} units on hand. Stock them out before deleting the product record.`
              : `Delete "${currentProduct.name}" (${currentProduct.sku})? This cannot be undone.`)
          }
          confirmLabel="Delete"
          cancelLabel={isDeleteBlocked ? "Close" : "Cancel"}
          busy={deleteBusy}
          onConfirm={isDeleteBlocked ? null : handleConfirmDelete}
          onCancel={() => {
            setDeleting(false);
            setDeleteError("");
          }}
        />
      )}
    </div>
  );
}
