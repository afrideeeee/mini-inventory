# Register — Inventory Management

Register is a single-user inventory ledger for recording a product catalog and tracking stock changes. The frontend is a React single-page app; the backend is an Express API backed by MongoDB/Mongoose.

## What the app does

- Authenticates one administrator with email and password. There is no public registration flow.
- Organizes products into categories.
- Tracks product details, unit costs in PKR, minimum stock levels, and current quantities.
- Records stock-in and stock-out movements, including reason, date, balances, and the authenticated user.
- Shows inventory summaries, low-stock items, recent movements, and a seven-day stock-flow chart.
- Supports product/category search and filtering, client-side pagination, and CSV exports. CSV import is not implemented.

The dashboard summaries and chart are currently assembled in the frontend from data returned by the API; there is no separate dashboard API endpoint.

## Project layout

```text
.
├── backend/     Express API, MongoDB models, controllers, routes, admin seed script
├── frontend/    React/Vite application
└── README.md    Project overview and local setup
```

## Requirements

- Node.js and npm
- A MongoDB deployment reachable from the backend (MongoDB Atlas is supported)
- Atlas network access configured for the machine running the API

## Configuration

The backend loads configuration from `backend/.env`. Keep this file private; `.env` files are ignored by Git. Set these keys there:

| Key | Purpose |
| --- | --- |
| `MONGO_URI` or `MONGODB_URI` | MongoDB connection string; `MONGO_URI` is used by the current local setup. |
| `JWT_SECRET` | Secret used to sign and verify JWTs; backend startup requires at least 32 characters. |
| `ADMIN_EMAIL` | Email for the first administrator, used only by the seed command. |
| `ADMIN_PASSWORD` | Initial administrator password, used only by the seed command; must be at least 8 characters. |
| `ADMIN_NAME` | Optional display name for the seeded administrator; defaults to `Admin`. |
| `PORT` | Optional backend port; defaults to `5000`. |
| `CLIENT_ORIGIN` | Optional allowed frontend origin; defaults to `http://localhost:5173`. |

The frontend optionally reads `VITE_API_URL` from its Vite environment. If unset, it calls `http://localhost:5000/api`.

## Run locally

1. Configure `backend/.env` with the MongoDB connection, a strong JWT secret, and initial admin credentials.
2. Install and seed the backend:

   ```bash
   cd backend
   npm install
   npm run seed:admin
   ```

   The seed command creates the first user and refuses to create another if the users collection is non-empty. Run it once for an empty database.

3. Start the API in one terminal:

   ```bash
   cd backend
   npm run dev
   ```

   The API listens on port `5000` by default and connects to MongoDB before accepting requests.

4. Start the frontend in another terminal:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. Open the Vite URL (normally `http://localhost:5173`) and sign in using the seeded administrator credentials.

## Data and inventory rules

- A product references its category by MongoDB ObjectId.
- Category names and product SKUs are unique.
- Stock changes are made by creating movement records, not by editing a product.
- Stock-out quantities cannot exceed available stock; stock balances cannot be negative.
- Every movement stores product name/SKU and before/after balances as a historical snapshot.
- Categories with assigned products cannot be deleted. Products with stock on hand cannot be deleted.
- Inventory value is the sum of `onHand × unitCost`, displayed in PKR.
- Low stock is below the product's minimum level; out of stock is zero on hand.

## API overview

All API paths use the `/api` prefix. Login is public; inventory routes require `Authorization: Bearer <JWT>`.

| Method | Path | Purpose | Authentication |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in; returns a 12-hour JWT and user profile. | Public |
| `GET` | `/api/auth/me` | Get the current user profile. | JWT |
| `GET`, `POST` | `/api/categories` | List or create categories. | JWT |
| `GET`, `PUT`, `DELETE` | `/api/categories/:id` | Read, update, or delete a category. | JWT |
| `GET`, `POST` | `/api/products` | List or create products. | JWT |
| `GET`, `PUT`, `DELETE` | `/api/products/:id` | Read, update, or delete a product. | JWT |
| `GET`, `POST` | `/api/movements` | List movements or record stock-in/stock-out. | JWT |

## Useful commands

```bash
# Frontend
cd frontend && npm run lint
cd frontend && npm run build

# Backend
cd backend && npm run dev
cd backend && npm start
cd backend && npm run seed:admin
```

The backend package does not currently define an automated test suite.
