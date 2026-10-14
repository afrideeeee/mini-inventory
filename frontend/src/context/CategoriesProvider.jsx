import { useCallback, useEffect, useMemo, useState } from "react";
import { CategoriesContext } from "./CategoriesContext";
import { categoryService } from "../services/categoryService";

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    categoryService
      .getAll()
      .then((data) => active && setCategories(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Actions throw on validation errors so the calling form can show them.
  const addCategory = useCallback(async (input) => {
    const created = await categoryService.create(input);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCategory = useCallback(async (id, input) => {
    const updated = await categoryService.update(id, input);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await categoryService.remove(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const stats = useMemo(
    () => ({
      categoryCount: categories.length,
      assignedProducts: categories.reduce((sum, c) => sum + c.productCount, 0),
      totalUnits: categories.reduce((sum, c) => sum + c.units, 0),
      inventoryValue: categories.reduce((sum, c) => sum + c.value, 0),
      unassignedProducts: 0, // becomes real once products exist
    }),
    [categories]
  );

  const value = useMemo(
    () => ({
      categories,
      stats,
      loading,
      error,
      addCategory,
      updateCategory,
      deleteCategory,
    }),
    [categories, stats, loading, error, addCategory, updateCategory, deleteCategory]
  );

  return (
    <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
  );
}
