const escapeCell = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function toCsv(columns, rows) {
  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCell(c.value(row))).join(",")
  );
  return [header, ...lines].join("\n");
}

// columns: [{ label: "Name", value: (row) => row.name }]
export function exportCsv(filename, columns, rows) {
  const blob = new Blob([toCsv(columns, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
