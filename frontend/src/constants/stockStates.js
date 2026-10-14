export const STOCK_STATES = {
  ALL: "all",
  IN_STOCK: "in_stock",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
};

export const STOCK_STATE_OPTIONS = [
  { value: STOCK_STATES.ALL, label: "All stock states" },
  { value: STOCK_STATES.IN_STOCK, label: "In stock" },
  { value: STOCK_STATES.LOW_STOCK, label: "Low stock" },
  { value: STOCK_STATES.OUT_OF_STOCK, label: "Out of stock" },
];
