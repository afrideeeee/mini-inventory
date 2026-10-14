// A small note line under a table. Icon is optional.
export default function Notice({ icon: Icon, children }) {
  return (
    <p className="notice">
      {Icon && <Icon size={16} aria-hidden="true" />}
      <span>{children}</span>
    </p>
  );
}
