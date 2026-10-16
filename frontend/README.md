# Register frontend

This folder contains the Register inventory management single-page application. It is built with React, JavaScript, Vite, and React Router. The UI uses shared React context providers to keep authentication and inventory data synchronized between pages, while API services handle HTTP requests.

## Requirements and setup

- Node.js and npm
- The backend API running locally or at a configured URL

```bash
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`). The app expects the API at `http://localhost:5000/api` by default. To use another API address, set `VITE_API_URL` for Vite, for example:

```text
VITE_API_URL=https://your-api.example.com/api
```

The API must allow the frontend origin through its `CLIENT_ORIGIN` CORS setting. Admin account creation is a backend-only seed operation; this app has login but no registration page or route.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite's development server. |
| `npm run build` | Create the optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for review. |
| `npm run lint` | Run ESLint against the frontend source. |

## Pages and routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/login` | Login | Authenticates the single administrator. Supports persistent (`localStorage`) or session (`sessionStorage`) token storage. |
| `/` | Dashboard | Inventory totals/value, low-stock watch, seven-day stock flow, recent movements. |
| `/products` | Products | Search, category/stock-state filtering, product list, CSV export. CSV import is currently disabled. |
| `/products/new` | Add product | Create a catalog item and assign a category. |
| `/products/:id/edit` | Edit product | Select and edit a product's details. Editing does not change its stock balance. |
| `/categories` | Categories | Create, search, rename, export, and delete categories. Deletion is blocked when products are assigned. |
| `/stock` | Stock management | Record stock-in/stock-out and inspect current quantities. |
| `/movements` | Movement records | Search and filter movement history by type/date; inspect entries and export CSV. |

All routes except `/login` are wrapped with `RequireAuth`. After login the user is sent to the dashboard. An expired/invalid token is cleared when the `/auth/me` request fails.

## Frontend structure

```text
src/
├── components/    Page-specific and shared UI components
├── config/        Route, app, and navigation configuration
├── constants/     Stock states, movement reasons, units
├── context/       Auth, categories, products, movements, last-updated providers
├── hooks/         Context access, pagination, derived data hooks
├── pages/         Route-level page components
├── services/      Auth and inventory API clients
├── styles/        Global styles and design variables
└── utils/         Formatting, CSV export, stock status, chart data
```

`App.jsx` nests the inventory providers so category, product, and movement state is shared across authenticated pages. Mutations update the relevant client state after the API succeeds; product/category counts and dashboard metrics are derived from current provider data. Product category labels are resolved against current category state so renaming a category updates the product catalog without a reload. The category filter uses category IDs, so a rename does not invalidate an active filter.

## API integration

The service modules call the backend JSON API:

- `services/authService.js` handles login, current-user lookup, logout, and token storage.
- `services/categoryService.js` handles category CRUD.
- `services/productService.js` handles product CRUD and delegates stock movements.
- `services/movementService.js` handles movement history and creation, including display date/time formatting.

Authenticated API calls send `Authorization: Bearer <token>`. The API base URL is `VITE_API_URL` or `http://localhost:5000/api` when unset. MongoDB and secret configuration belongs to the backend; do not expose those secrets in Vite variables because `VITE_*` values are included in client builds.

## Inventory behavior

- Category IDs link products to categories; display names are derived from current category data.
- Product on-hand quantity changes only after a successful stock movement.
- Stock-out cannot exceed current on-hand quantity.
- Inventory value uses on-hand quantity multiplied by unit cost and is displayed in PKR.
- Movement rows preserve the product name and SKU saved when the movement occurred.
- Search/filtering and pagination are currently performed client-side using the fetched data.
- Dashboard summaries and the seven-day chart are derived client-side from products and movements.

## Production build

```bash
npm run lint
npm run build
npm run preview
```

The generated `dist/` directory is a static client build. Deploy it to a static web host and configure `VITE_API_URL` to the deployed API before building. Configure the API's `CLIENT_ORIGIN` to the deployed frontend origin.
