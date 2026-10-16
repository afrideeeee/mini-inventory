import { useState, useId } from "react";
import { ArrowDownLeft, ArrowUpRight, Check } from "lucide-react";
import Panel from "../common/Panel";
import Tabs from "../common/Tabs";
import FormField from "../common/FormField";
import TextInput from "../common/TextInput";
import SelectInput from "../common/SelectInput";
import Button from "../common/Button";
import BalancePreview from "./BalancePreview";
import { STOCK_IN_REASONS, STOCK_OUT_REASONS } from "../../constants/stockReasons";
import "./MovementForm.css";

function todayInputValue() {
  const today = new Date();
  const localOffset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - localOffset).toISOString().slice(0, 10);
}

const TABS = [
  { id: "in", label: "Stock-in", icon: ArrowDownLeft },
  { id: "out", label: "Stock-out", icon: ArrowUpRight },
];

export default function MovementForm({
  products = [],
  selectedProductId,
  onProductChange,
  onSubmit,
}) {
  const formBaseId = useId();
  const [type, setType] = useState("in");
  const [localProductId, setLocalProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(todayInputValue);
  const [reason, setReason] = useState(STOCK_IN_REASONS[0].value);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeProductId =
    selectedProductId || localProductId || products[0]?.id || "";

  // When switching type (in/out), update default reason
  const handleTypeChange = (newType) => {
    setType(newType);
    setError("");
    setSuccess("");
    setReason(newType === "in" ? STOCK_IN_REASONS[0].value : STOCK_OUT_REASONS[0].value);
  };

  const handleProductSelect = (e) => {
    const val = e.target.value;
    setLocalProductId(val);
    setError("");
    setSuccess("");
    onProductChange?.(val);
  };

  const currentProduct =
    products.find((p) => p.id === activeProductId) || products[0];
  const currentStock = currentProduct?.onHand ?? 0;
  const numQty = Number(quantity);

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} / ${p.sku}`,
  }));

  const reasonOptions = type === "in" ? STOCK_IN_REASONS : STOCK_OUT_REASONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!activeProductId) {
      setError("Please select a product.");
      return;
    }
    if (!Number.isSafeInteger(numQty) || numQty <= 0) {
      setError("Quantity must be a positive whole number.");
      return;
    }
    if (type === "out" && numQty > currentStock) {
      setError(
        `Stock-out cannot exceed available stock (${currentStock} units).`
      );
      return;
    }
    if (!reason.trim()) {
      setError("Please specify a reason for this movement.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        productId: activeProductId,
        type,
        quantity: numQty,
        date,
        reason: reason.trim(),
      });
      setSuccess(`Movement recorded successfully for ${currentProduct.name}.`);
      setQuantity("");
    } catch (err) {
      setError(err.message || "Failed to record movement.");
    } finally {
      setSubmitting(false);
    }
  };

  const isBlocked = type === "out" && numQty > currentStock;

  return (
    <Panel title="Record a movement" label="NEW ENTRY">
      <form className="movement-form" onSubmit={handleSubmit} noValidate>
        <Tabs tabs={TABS} activeTab={type} onChange={handleTypeChange} />

        <FormField
          id={`${formBaseId}-product`}
          label="Product"
          required
        >
          <SelectInput
            id={`${formBaseId}-product`}
            value={activeProductId}
            onChange={handleProductSelect}
            options={productOptions}
            disabled={products.length === 0}
          >
            <option value="">{products.length ? "Select a product" : "No products available"}</option>
            {productOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </SelectInput>
        </FormField>

        <div className="movement-form__row">
          <FormField
            id={`${formBaseId}-qty`}
            label="Quantity"
            required
            error={error}
          >
            <TextInput
              id={`${formBaseId}-qty`}
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="24"
              invalid={Boolean(error) || isBlocked}
            />
          </FormField>

          <FormField id={`${formBaseId}-date`} label="Date" required>
            <TextInput
              id={`${formBaseId}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
        </div>

        <FormField
          id={`${formBaseId}-reason`}
          label="Reason"
          required
        >
          <SelectInput
            id={`${formBaseId}-reason`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={reasonOptions}
          />
        </FormField>

        <BalancePreview
          currentStock={currentStock}
          quantity={numQty}
          type={type}
        />

        {success && (
          <div className="movement-form__success">
            <Check size={16} />
            <span>{success}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="strong"
          block
          icon={type === "in" ? Check : ArrowUpRight}
          disabled={submitting || isBlocked || !activeProductId || !Number.isSafeInteger(numQty) || numQty <= 0}
        >
          {type === "in" ? "Record stock-in" : "Record stock-out"}
        </Button>

        <div className="movement-form__hints">
          <p>Stock-out quantities cannot exceed available stock.</p>
          <p>Every entry is saved to movement records.</p>
        </div>
      </form>
    </Panel>
  );
}
