import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

const buildCsvSection = (title, headers, rows) => {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) => row.join(","));
  return [title, headerLine, ...dataLines, ""].join("\n");
};

export const exportReportToCSV = async (summary, registros, ventas, gastos) => {
  const resumen = [
    "Resumen",
    `Kilos totales,${summary.kilosTotales}`,
    `Total ventas,${summary.totalVentas}`,
    `Total gastos,${summary.totalGastos}`,
    `Resultado,${summary.resultado}`,
    "",
  ].join("\n");

  const registrosSection = buildCsvSection(
    "Registros",
    [
      "Proveedor",
      "Kilos",
      "Calibre",
      "Fecha siembra",
      "Fecha listo",
      "Proceso",
      "Linea/sector",
      "Observacion",
    ],
    registros.map((item) => [
      item.proveedor,
      item.kilos,
      item.calibre,
      item.fecha_siembra,
      item.fecha_listo,
      item.proceso,
      item.linea_sector,
      item.observacion || "",
    ])
  );

  const ventasSection = buildCsvSection(
    "Ventas",
    ["Comprador", "Kilos", "Precio kilo", "Total", "Pagado", "Fecha"],
    ventas.map((item) => [
      item.comprador,
      item.kilos,
      item.precio_kilo,
      item.total,
      item.pagado ? "Pagado" : "Pendiente",
      item.fecha,
    ])
  );

  const gastosSection = buildCsvSection(
    "Gastos",
    ["Categoria", "Monto", "Fecha", "Nota"],
    gastos.map((item) => [
      item.categoria,
      item.monto,
      item.fecha,
      item.nota || "",
    ])
  );

  const csvContent = [resumen, registrosSection, ventasSection, gastosSection].join(
    "\n"
  );

  const filename = `bitacoramar_${Date.now()}.csv`;
  const fileUri = FileSystem.documentDirectory + filename;

  await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }

  return fileUri;
};

const buildHtmlTable = (title, headers, rows) => {
  const headerHtml = headers.map((h) => `<th>${h}</th>`).join("");
  const rowHtml = rows
    .map(
      (row) =>
        `<tr>${row.map((col) => `<td>${col}</td>`).join("")}</tr>`
    )
    .join("");

  return `
    <h3>${title}</h3>
    <table>
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${rowHtml}</tbody>
    </table>
  `;
};

export const exportReportToPDF = async (summary, registros, ventas, gastos) => {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #1b4f72; }
          h2 { color: #2677b8; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          th, td { border: 1px solid #b7d7ef; padding: 6px; font-size: 12px; }
          th { background: #e6f4ff; }
        </style>
      </head>
      <body>
        <h2>Reporte BitaCoraMar</h2>
        <p>Kilos totales: ${summary.kilosTotales}</p>
        <p>Total ventas: ${summary.totalVentas}</p>
        <p>Total gastos: ${summary.totalGastos}</p>
        <p>Resultado: ${summary.resultado}</p>
        ${buildHtmlTable(
          "Registros",
          [
            "Proveedor",
            "Kilos",
            "Calibre",
            "Fecha siembra",
            "Fecha listo",
            "Proceso",
            "Linea/sector",
            "Observacion",
          ],
          registros.map((item) => [
            item.proveedor,
            item.kilos,
            item.calibre,
            item.fecha_siembra,
            item.fecha_listo,
            item.proceso,
            item.linea_sector,
            item.observacion || "",
          ])
        )}
        ${buildHtmlTable(
          "Ventas",
          ["Comprador", "Kilos", "Precio kilo", "Total", "Pagado", "Fecha"],
          ventas.map((item) => [
            item.comprador,
            item.kilos,
            item.precio_kilo,
            item.total,
            item.pagado ? "Pagado" : "Pendiente",
            item.fecha,
          ])
        )}
        ${buildHtmlTable(
          "Gastos",
          ["Categoria", "Monto", "Fecha", "Nota"],
          gastos.map((item) => [
            item.categoria,
            item.monto,
            item.fecha,
            item.nota || "",
          ])
        )}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }

  return uri;
};
