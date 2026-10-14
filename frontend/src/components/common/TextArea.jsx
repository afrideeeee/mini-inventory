export default function TextArea({ invalid, className = "", ...props }) {
  const classes = ["input", "input--area", invalid && "input--invalid", className]
    .filter(Boolean)
    .join(" ");
  return <textarea className={classes} aria-invalid={invalid || undefined} {...props} />;
}
