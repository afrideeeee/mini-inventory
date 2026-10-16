import { useCallback, useEffect, useMemo, useState } from "react";
import { ProductsContext } from "./ProductsContext";
import { productService } from "../services/productService";
import { getStockStatus } from "../utils/stockStatus";
import { useLastUpdated } from "../hooks/useLastUpdated";
import { useCategories } from "../hooks/useCategories";

export function ProductsProvider({ children }) {
  const { markUpdated } = useLastUpdated();
  const { refreshCategories } = useCategories();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    productService
      .getAll()
      .then((data) => {
        if (!active) return;
        setProducts(data);
        markUpdated();
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [markUpdated]);

  const addProduct = useCallback(async (data) => {
    const created = await productService.create(data);
    setProducts((prev) => [...prev, created]);
    await refreshCategories();
    markUpdated();
    return created;
  }, [markUpdated, refreshCategories]);

  const updateProduct = useCallback(async (id, data) => {
    const updated = await productService.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    await refreshCategories();
    markUpdated();
    return updated;
  }, [markUpdated, refreshCategories]);

  const deleteProduct = useCallback(async (id) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await refreshCategories();
    markUpdated();
  }, [markUpdated, refreshCategories]);

  const recordMovement = useCallback(async (movementData) => {
    const result = await productService.recordMovement(movementData);
    setProducts((prev) => prev.map((p) => (p.id === result.product.id
      ? { ...p, onHand: result.product.onHand }
      : p)));
    await refreshCategories();
    markUpdated();
    return result;
  }, [markUpdated, refreshCategories]);

  const stats = useMemo(() => {
    let totalUnits = 0;
    let totalValue = 0;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
      totalUnits += p.onHand;
      totalValue += p.onHand * (p.unitCost || 0);
      const status = getStockStatus(p.onHand, p.minLevel);
      if (status === "in-stock") inStockCount++;
      else if (status === "low-stock") lowStockCount++;
      else if (status === "out-of-stock") outOfStockCount++;
    }

    return {
      totalUnits,
      totalValue,
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
      addProduct,
      updateProduct,
      deleteProduct,
      recordMovement,
    }),
    [products, stats, loading, error, addProduct, updateProduct, deleteProduct, recordMovement]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}
