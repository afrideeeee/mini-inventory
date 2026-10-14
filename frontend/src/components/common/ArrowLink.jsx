import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function ArrowLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`btn ${className}`}>
      <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
      <span>{children}</span>
    </Link>
  );
}
