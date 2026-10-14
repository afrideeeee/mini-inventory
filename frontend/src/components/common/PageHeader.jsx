export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="page-header__action">{children}</div>}
    </div>
  );
}
