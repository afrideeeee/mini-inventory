// items: [{ value: "04", label: "Categories" }]
export default function StatsBar({ items }) {
  return (
    <dl className="stats-bar">
      {items.map(({ value, label }) => (
        <div className="stat" key={label}>
          <dd className="stat__value">{value}</dd>
          <dt className="stat__label">{label}</dt>
        </div>
      ))}
    </dl>
  );
}
