import { Link } from "react-router-dom";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { ROUTES } from "../../config/routes";
import "./ProductLedgerNote.css";

export default function ProductLedgerNote({ isEdit, onDelete }) {
  return (
    <div className="product-ledger-aside">
      <div className="product-ledger-note">
        <h3 className="product-ledger-note__title">Stock stays in the ledger.</h3>
        <p className="product-ledger-note__body">
          To change quantities, record a stock-in or stock-out. Existing movement records stay intact.
        </p>
        <Link to={ROUTES.stock} className="product-ledger-note__link">
          <span>Open Stock management</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {isEdit && (
        <button
          type="button"
          className="product-ledger-delete-btn"
          onClick={onDelete}
        >
          <Trash2 size={15} />
          <span>Delete this product</span>
        </button>
      )}
    </div>
  );
}
