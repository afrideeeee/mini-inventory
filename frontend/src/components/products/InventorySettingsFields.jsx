import FormField from "../common/FormField";
import TextInput from "../common/TextInput";

export default function InventorySettingsFields({
  unitCost,
  onUnitCostChange,
  minLevel,
  onMinLevelChange,
  bin,
  onBinChange,
  errors = {},
}) {
  return (
    <div className="product-form-section">
      <div className="product-form-section__head">
        <h2 className="product-form-section__title">02 — Inventory settings</h2>
      </div>

      <div className="product-form-section__body">
        <div className="product-form-grid product-form-grid--3">
          <FormField
            id="prod-cost"
            label="Unit cost (USD)"
            required
            hint="Used for inventory valuation."
            error={errors.unitCost}
          >
            <TextInput
              id="prod-cost"
              type="number"
              step="0.01"
              min="0"
              value={unitCost}
              onChange={(e) => onUnitCostChange(e.target.value)}
              placeholder="12.00"
              invalid={Boolean(errors.unitCost)}
            />
          </FormField>

          <FormField
            id="prod-min"
            label="Minimum stock"
            required
            hint={minLevel ? `Alert when stock falls below ${minLevel}.` : "Alert threshold."}
            error={errors.minLevel}
          >
            <TextInput
              id="prod-min"
              type="number"
              min="0"
              value={minLevel}
              onChange={(e) => onMinLevelChange(e.target.value)}
              placeholder="30"
              invalid={Boolean(errors.minLevel)}
            />
          </FormField>

          <FormField
            id="prod-bin"
            label="Bin location"
            hint="Main warehouse."
          >
            <TextInput
              id="prod-bin"
              value={bin}
              onChange={(e) => onBinChange(e.target.value)}
              placeholder="A-01"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
