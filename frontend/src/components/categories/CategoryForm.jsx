import { useState } from "react";
import { Plus } from "lucide-react";
import Panel from "../common/Panel";
import FormField from "../common/FormField";
import TextInput from "../common/TextInput";
import TextArea from "../common/TextArea";
import Button from "../common/Button";

// Add mode by default; pass `category` to edit it. The parent should give this
// component a `key` so it resets when switching between categories.
export default function CategoryForm({ category, onSubmit, onCancel }) {
  const isEdit = Boolean(category);
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({ name, description });
      if (!isEdit) {
        setName("");
        setDescription("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title={isEdit ? "Edit category" : "Add a category"} label={isEdit ? "Edit" : "New"}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <p className="form__intro">
          {isEdit
            ? "Rename this category or change its description. Its products stay assigned."
            : "Create a new home for products. Names must be unique."}
        </p>

        <FormField id="category-name" label="Category name" required error={error}>
          <TextInput
            id="category-name"
            value={name}
            invalid={Boolean(error)}
            placeholder="e.g. Home accessories"
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>

        <FormField id="category-description" label="Description" optional>
          <TextArea
            id="category-description"
            value={description}
            placeholder="What belongs in this category?"
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <div className="form__actions">
          <Button type="submit" variant="strong" block icon={isEdit ? undefined : Plus} disabled={saving}>
            {isEdit ? "Save changes" : "Create category"}
          </Button>
          {isEdit && (
            <Button block onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Panel>
  );
}
