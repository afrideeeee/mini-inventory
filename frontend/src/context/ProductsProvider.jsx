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

  const addProduct = useCallback(async (data) => {
    const created = await productService.create(data);
    setProducts((prev) => [...prev, created]);
    return created;
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    const updated = await productService.update(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const recordMovement = useCallback(async (movementData) => {
    const { product, movement } = await productService.recordMovement(movementData);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    return { product, movement };
  }, []);

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
