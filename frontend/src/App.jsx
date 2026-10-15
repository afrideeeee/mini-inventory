import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ROUTES } from "./config/routes";
import { CategoriesProvider } from "./context/CategoriesProvider";
import { ProductsProvider } from "./context/ProductsProvider";
import { MovementsProvider } from "./context/MovementsProvider";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductFormPage from "./pages/ProductFormPage";
import CategoriesPage from "./pages/CategoriesPage";
import StockManagementPage from "./pages/StockManagementPage";
import MovementRecordsPage from "./pages/MovementRecordsPage";
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./components/auth/RequireAuth";
import LoginPage from "./pages/LoginPage";

function InventoryProviders() {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        <MovementsProvider>
          <Outlet />
        </MovementsProvider>
      </ProductsProvider>
    </CategoriesProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route element={<InventoryProviders />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.dashboard} element={<DashboardPage />} />
              <Route path={ROUTES.products} element={<ProductsPage />} />
              <Route path={ROUTES.productNew} element={<ProductFormPage />} />
              <Route path={ROUTES.productEdit} element={<ProductFormPage />} />
              <Route path={ROUTES.categories} element={<CategoriesPage />} />
              <Route path={ROUTES.stock} element={<StockManagementPage />} />
              <Route path={ROUTES.movements} element={<MovementRecordsPage />} />
              <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
