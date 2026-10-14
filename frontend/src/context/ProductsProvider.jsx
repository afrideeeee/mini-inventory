import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductsContext } from "./ProductsContext";
import { productService } from "../services/productService";
import { getStockStatus } from "../utils/stockStatus";

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    productService
      .getAll()
      .then((data) => active && setProducts(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const recordMovement = useCallback(async (movementData) => {
    const { product, movement } = await productService.recordMovement(movementData);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    return { product, movement };
  }, []);

  const stats = useMemo(() => {
    let totalUnits = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
      totalUnits += p.onHand;
      const status = getStockStatus(p.onHand, p.minLevel);
      if (status === "in-stock") inStockCount++;
      else if (status === "low-stock") lowStockCount++;
      else if (status === "out-of-stock") outOfStockCount++;
    }

    return {
      totalUnits,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalProducts: products.length,
    };
  }, [products]);

  const value = useMemo(
    () => ({
      products,
      stats,
      loading,
      error,
      recordMovement,
    }),
    [products, stats, loading, error, recordMovement]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}
