import { Link } from "react-router-dom";

// variant: "outline" (default) | "strong". Pass `to` to render as a router link.
export default function Button({
  variant = "outline",
  icon: Icon,
  to,
  block = false,
  type = "button",
  children,
  ...rest
}) {
  const className = [
    "btn",
    variant === "strong" && "btn--strong",
    block && "btn--block",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon && <Icon size={18} strokeWidth={1.75} aria-hidden="true" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={className} {...rest}>
      {content}
    </button>
  );
}
