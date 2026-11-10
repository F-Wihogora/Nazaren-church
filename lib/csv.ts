/** Build a CSV string and trigger a browser download (client-side). */
export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (value: string) => {
    const cell = value ?? "";
    if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
    return cell;
  };
  const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
