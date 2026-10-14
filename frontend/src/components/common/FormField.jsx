// Label (with required star / optional tag), the control, a hint and an error.
export default function FormField({ id, label, required, optional, hint, error, children }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> ★</span>}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
