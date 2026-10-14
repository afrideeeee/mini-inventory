import Modal from "./Modal";
import Button from "./Button";

// Pass onConfirm={null} for an informational dialog with only a close button.
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel}>{cancelLabel}</Button>
          {onConfirm && (
            <Button variant="strong" onClick={onConfirm} disabled={busy}>
              {busy ? "Working…" : confirmLabel}
            </Button>
          )}
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  );
}
