import { appConfig } from "../config/appConfig";

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMovementDateKey(movement) {
  const storedDate = movement.dateKey || movement.date || "";
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(storedDate);
  if (match) return match[1];

  const createdAt = new Date(movement.createdAt);
  return Number.isNaN(createdAt.getTime()) ? "" : toDateKey(createdAt);
}

function shortDate(date) {
  return new Intl.DateTimeFormat(appConfig.locale, {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function buildStockFlowData(movements, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return {
      dateKey: toDateKey(date),
      date: shortDate(date),
      inQty: 0,
      outQty: 0,
    };
  });
  const byDate = new Map(days.map((day) => [day.dateKey, day]));

  for (const movement of movements) {
    const day = byDate.get(getMovementDateKey(movement));
    if (!day) continue;
    if (movement.type === "in") day.inQty += Number(movement.quantity) || 0;
    else if (movement.type === "out") day.outQty += Number(movement.quantity) || 0;
  }

  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  const startLabel = start.getFullYear() === today.getFullYear()
    ? shortDate(start)
    : new Intl.DateTimeFormat(appConfig.locale, { day: "2-digit", month: "short", year: "numeric" }).format(start);
  const endLabel = new Intl.DateTimeFormat(appConfig.locale, { day: "2-digit", month: "short", year: "numeric" }).format(today);
  const dateRange = `${startLabel} – ${endLabel}`;
  const todayFlow = byDate.get(toDateKey(today));

  return {
    flowData: days,
    dateRange,
    todayIn: todayFlow.inQty,
    todayOut: todayFlow.outQty,
  };
}
