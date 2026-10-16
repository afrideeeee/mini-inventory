import Button from "../common/Button";
import Modal from "../common/Modal";
import "./LedgerGuide.css";

export default function LedgerGuide({ onClose }) {
  return (
    <Modal
      title="Ledger guide"
      className="ledger-guide-modal"
      onClose={onClose}
      footer={<Button onClick={onClose}>Close guide</Button>}
    >
      <div className="ledger-guide">
        <p className="eyebrow">HOW TO KEEP YOUR REGISTER ACCURATE</p>

        <section className="ledger-guide__section">
          <h3>How it fits together</h3>
          <p>
            Categories group your products. Products hold the details. Stock management records
            what comes in and goes out. Movement records keep the history. The dashboard summarizes it all.
          </p>
        </section>

        <section className="ledger-guide__section">
          <h3>Getting started</h3>
          <ol>
            <li><strong>Create categories.</strong> Group products by what they are, like Stationery or Drinkware.</li>
            <li><strong>Add products.</strong> Give each one a name, a unique SKU, a category, a unit cost in PKR, and a minimum stock level.</li>
            <li><strong>Record stock.</strong> Use stock-in to bring units onto the shelf.</li>
            <li><strong>Watch the dashboard.</strong> Low and out-of-stock items appear in Reorder watch.</li>
          </ol>
        </section>

        <section className="ledger-guide__section">
          <h3>Page by page</h3>
          <div className="ledger-guide__pages">
            <article>
              <h4>Dashboard</h4>
              <p>See products, units, inventory value, and items needing attention. The stock-flow chart uses real movement totals for the latest seven days, followed by reorder items and recent entries.</p>
            </article>
            <article>
              <h4>Products</h4>
              <p>Manage the catalog. Search by name or SKU; filter by category or stock state. Use the edit and delete actions on a product. Export the current filtered list to CSV.</p>
            </article>
            <article>
              <h4>Categories</h4>
              <p>Add, rename, or delete categories. Each category shows its product and unit counts. Search to find a category. A category with assigned products cannot be deleted.</p>
            </article>
            <article>
              <h4>Stock management</h4>
              <p>See on-hand quantities and minimum levels. Record a stock-in or stock-out by selecting a product, entering a whole-number quantity, date, and reason. The balance preview shows the expected result before saving.</p>
            </article>
            <article>
              <h4>Movement records</h4>
              <p>Review the stock-in and stock-out history. Search by entry, product, or SKU; filter by movement type or one specific date; export the filtered records to CSV. Open an entry to see its reason and timestamp.</p>
            </article>
          </div>
        </section>

        <section className="ledger-guide__section">
          <h3>Stock states</h3>
          <ul>
            <li><strong>In stock:</strong> on hand is at or above the minimum.</li>
            <li><strong>Low stock:</strong> on hand is below the minimum and greater than zero.</li>
            <li><strong>Out of stock:</strong> on hand is zero.</li>
          </ul>
        </section>

        <section className="ledger-guide__section">
          <h3>Good to know</h3>
          <ul>
            <li>Quantities change only through Stock management. Editing product details does not alter stock or movement history.</li>
            <li>A stock-out cannot exceed the available quantity.</li>
            <li>Every saved movement is added to Movement records.</li>
            <li>Category names and product SKUs must be unique.</li>
            <li>Products with units on hand must be stocked out before they can be deleted.</li>
            <li>Inventory value is on-hand units multiplied by unit cost.</li>
          </ul>
        </section>

        <section className="ledger-guide__section">
          <h3>Tips</h3>
          <ul>
            <li>Search by SKU to find a product quickly.</li>
            <li>Use Clear filters on Movement records to reset the search and filters.</li>
            <li>Export a CSV copy before making large catalog changes.</li>
          </ul>
        </section>
      </div>
    </Modal>
  );
}
