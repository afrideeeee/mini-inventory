import "./MovementSummary.css";

export default function MovementSummary({ movements = [] }) {
  const total = movements.length;
  let unitsIn = 0;
  let unitsOut = 0;

  for (const m of movements) {
    if (m.type === "in") unitsIn += m.quantity;
    else if (m.type === "out") unitsOut += m.quantity;
  }

  const netChange = unitsIn - unitsOut;
  const netDisplay = netChange >= 0 ? `+${netChange}` : String(netChange);

  return (
    <div className="movement-summary" role="region" aria-label="Movement statistics">
      <div className="movement-summary__eyebrow">
        Filtered records / {total}
      </div>
      <div className="movement-summary__stat">
        <span className="movement-summary__val">{unitsIn}</span>
        <span className="movement-summary__lbl">Units in</span>
      </div>
      <div className="movement-summary__stat">
        <span className="movement-summary__val">{unitsOut}</span>
        <span className="movement-summary__lbl">Units out</span>
      </div>
      <div className="movement-summary__stat">
        <span className="movement-summary__val">{netDisplay}</span>
        <span className="movement-summary__lbl">Net change</span>
      </div>
    </div>
  );
}
