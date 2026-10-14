export function getStockStatus(onHand, minLevel) {
  if (onHand <= 0) return "out-of-stock";
  if (onHand < minLevel) return "low-stock";
  return "in-stock";
}

export function getStockStatusLabel(status) {
  switch (status) {
    case "out-of-stock":
      return "Out of stock";
    case "low-stock":
      return "Low stock";
    case "in-stock":
    default:
      return "In stock";
  }
}
