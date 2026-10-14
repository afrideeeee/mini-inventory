export default function TextInput({ invalid, className = "", ...props }) {
  const classes = ["input", invalid && "input--invalid", className].filter(Boolean).join(" ");
  return <input type="text" className={classes} aria-invalid={invalid || undefined} {...props} />;
}
