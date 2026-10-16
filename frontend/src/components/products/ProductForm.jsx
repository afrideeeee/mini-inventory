import { useState } from "react";
import { Check } from "lucide-react";
import ProductDetailsFields from "./ProductDetailsFields";
import InventorySettingsFields from "./InventorySettingsFields";
import Button from "../common/Button";
import "./ProductForm.css";

export default function ProductForm({
  product,
  categories = [],
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [unitOfMeasure, setUnitOfMeasure] = useState(
    product?.unitOfMeasure || "Piece (pc)"
  );
  const [description, setDescription] = useState(product?.description || "");
  const [unitCost, setUnitCost] = useState(
    product?.unitCost !== undefined ? String(product.unitCost) : ""
  );
  const [minLevel, setMinLevel] = useState(
    product?.minLevel !== undefined ? String(product.minLevel) : "0"
  );
  const [bin, setBin] = useState(product?.bin || "");

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!sku.trim()) newErrors.sku = "SKU is required.";
    if (!categoryId) newErrors.category = "Please select a category.";
    if (unitCost === "" || isNaN(Number(unitCost)) || Number(unitCost) < 0) {
      newErrors.unitCost = "Please enter a valid unit cost.";
    }
    if (minLevel === "" || isNaN(Number(minLevel)) || Number(minLevel) < 0) {
      newErrors.minLevel = "Please enter a valid minimum stock level.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGeneralError("Please fix the highlighted errors before saving.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        categoryId,
        unitOfMeasure,
        description: description.trim(),
        unitCost: Number(unitCost),
        minLevel: Number(minLevel),
        bin: bin.trim(),
      });
    } catch (err) {
      setGeneralError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const isComplete = name.trim() && sku.trim() && categoryId && unitCost !== "" && minLevel !== "";

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <ProductDetailsFields
        name={name}
        onNameChange={setName}
        sku={sku}
        onSkuChange={setSku}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        unitOfMeasure={unitOfMeasure}
        onUnitOfMeasureChange={setUnitOfMeasure}
        description={description}
        onDescriptionChange={setDescription}
        errors={errors}
      />

      <InventorySettingsFields
        unitCost={unitCost}
        onUnitCostChange={setUnitCost}
        minLevel={minLevel}
        onMinLevelChange={setMinLevel}
        bin={bin}
        onBinChange={setBin}
        errors={errors}
      />

      <div className="product-form-actions-row">
        <span
          className={`product-form-status ${
            generalError ? "product-form-status--error" : ""
          }`}
        >
          {generalError || (isComplete ? "All required fields are complete." : "Fill in all required fields.")}
        </span>

        <div className="product-form-buttons">
          <Button onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="strong"
            icon={Check}
            disabled={saving}
          >
            {saving ? "Saving…" : isEdit ? "Save product" : "Create product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
