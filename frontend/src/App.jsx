import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./config/routes";
import { CategoriesProvider } from "./context/CategoriesProvider";
import { ProductsProvider } from "./context/ProductsProvider";
import { MovementsProvider } from "./context/MovementsProvider";
import AppLayout from "./components/layout/AppLayout";
import CategoriesPage from "./pages/CategoriesPage";
import StockManagementPage from "./pages/StockManagementPage";

export default function App() {
  return (
    <CategoriesProvider>
      <ProductsProvider>
        <MovementsProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.stock} element={<StockManagementPage />} />
              <Route path={ROUTES.categories} element={<CategoriesPage />} />
              <Route path="*" element={<Navigate to={ROUTES.stock} replace />} />
            </Route>
          </Routes>
        </MovementsProvider>
      </ProductsProvider>
    </CategoriesProvider>
  );
}
