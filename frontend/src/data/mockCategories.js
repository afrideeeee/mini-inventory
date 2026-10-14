// Mock data until the API exists.
// productCount / units / value are denormalised here for now; once products
// exist they should be derived from them on the backend.
export const mockCategories = [
  {
    id: "cat-01",
    code: "CAT-01",
    name: "Stationery",
    description: "Notebooks, paper & writing essentials",
    skus: ["NT-001", "PC-007"],
    productCount: 2,
    units: 213,
    value: 1200,
  },
  {
    id: "cat-02",
    code: "CAT-02",
    name: "Desk tools",
    description: "Objects for an orderly workspace",
    skus: ["PN-002", "OR-005"],
    productCount: 2,
    units: 106,
    value: 1500,
  },
  {
    id: "cat-03",
    code: "CAT-03",
    name: "Drinkware",
    description: "Mugs, bottles & everyday vessels",
    skus: ["MG-003", "BT-006"],
    productCount: 2,
    units: 18,
    value: 600,
  },
  {
    id: "cat-04",
    code: "CAT-04",
    name: "Carry goods",
    description: "Totes, pouches & daily companions",
    skus: ["TT-004", "PH-008"],
    productCount: 2,
    units: 30,
    value: 852,
  },
];
