// Main column (children) plus a side column.
export default function SplitLayout({ side, children }) {
  return (
    <div className="split">
      <div className="split__main">{children}</div>
      <aside className="split__side">{side}</aside>
    </div>
  );
}
