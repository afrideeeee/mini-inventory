export const mockFlowData = [
  { date: "08 Oct", inQty: 50, outQty: 25 },
  { date: "09 Oct", inQty: 60, outQty: 45 },
  { date: "10 Oct", inQty: 30, outQty: 25 },
  { date: "11 Oct", inQty: 68, outQty: 50 },
  { date: "12 Oct", inQty: 45, outQty: 25 },
  { date: "13 Oct", inQty: 90, outQty: 36 },
];

export const dashboardService = {
  async getFlowData() {
    return mockFlowData.map((d) => ({ ...d }));
  },
};
