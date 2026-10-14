import { Info } from "lucide-react";

export default function CategoryNote() {
  return (
    <aside className="note-box">
      <h3 className="note-box__title">
        <Info size={17} strokeWidth={1.75} aria-hidden="true" />A note on categories
      </h3>
      <p>
        Use the pencil to rename or edit. Products keep their assignment when a category is
        renamed.
      </p>
      <hr className="note-box__rule" />
      <p>Before deleting, move its products to another category.</p>
    </aside>
  );
}
