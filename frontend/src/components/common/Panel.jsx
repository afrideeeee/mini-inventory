// Bordered card with a serif title and a small label on the right.
export default function Panel({ title, label, children }) {
  return (
    <section className="panel">
      <header className="panel__head">
        <h2 className="panel__title">{title}</h2>
        {label && <span className="panel__label">{label}</span>}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  );
}
