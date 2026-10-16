import FormField from "../common/FormField";
import TextInput from "../common/TextInput";
import TextArea from "../common/TextArea";
import SelectInput from "../common/SelectInput";
import { UNITS_OF_MEASURE } from "../../constants/unitsOfMeasure";

export default function ProductDetailsFields({
  name,
  onNameChange,
  sku,
  onSkuChange,
  categoryId,
  onCategoryChange,
  categories = [],
  unitOfMeasure,
  onUnitOfMeasureChange,
  description,
  onDescriptionChange,
  errors = {},
}) {
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="product-form-section">
      <div className="product-form-section__head">
        <h2 className="product-form-section__title">01 — Product details</h2>
        <span className="product-form-section__badge">★ Required</span>
      </div>

      <div className="product-form-section__body">
        <div className="product-form-grid">
          <FormField id="prod-name" label="Product name" required error={errors.name}>
            <TextInput
              id="prod-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Linen notebook"
              invalid={Boolean(errors.name)}
            />
          </FormField>

          <FormField id="prod-sku" label="SKU" required error={errors.sku}>
            <TextInput
              id="prod-sku"
              value={sku}
              onChange={(e) => onSkuChange(e.target.value)}
              placeholder="e.g. NT-001"
              invalid={Boolean(errors.sku)}
            />
          </FormField>
        </div>

        <div className="product-form-grid">
          <FormField id="prod-cat" label="Category" required error={errors.category}>
            <SelectInput
              id="prod-cat"
              value={categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              options={categoryOptions}
              disabled={categories.length === 0}
              aria-label="Select a category"
            >
              <option value="">Select a category</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectInput>
          </FormField>

          <FormField id="prod-uom" label="Unit of measure" required>
            <SelectInput
              id="prod-uom"
              value={unitOfMeasure}
              onChange={(e) => onUnitOfMeasureChange(e.target.value)}
              options={UNITS_OF_MEASURE}
            />
          </FormField>
        </div>

        <FormField id="prod-desc" label="Description" optional>
          <TextArea
            id="prod-desc"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Detailed description of materials, dimensions, or features."
          />
        </FormField>
      </div>
    </div>
  );
}
