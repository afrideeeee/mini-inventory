import {
  LayoutDashboard,
  Package,
  Folder,
  Layers,
  ArrowLeftRight,
} from "lucide-react";
import { ROUTES } from "./routes";

export const navigationItems = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Products", path: ROUTES.products, icon: Package },
  { label: "Categories", path: ROUTES.categories, icon: Folder },
  { label: "Stock management", path: ROUTES.stock, icon: Layers },
  { label: "Movement records", path: ROUTES.movements, icon: ArrowLeftRight },
];
