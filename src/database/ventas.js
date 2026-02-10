import { runSql } from "./db";

export const createVenta = async (venta) => {
  const { comprador, kilos, precio_kilo, pagado, fecha, usuario_id } = venta;
  const total = Number(kilos) * Number(precio_kilo);
  const result = await runSql(
    "INSERT INTO ventas (comprador, kilos, precio_kilo, total, pagado, fecha, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [comprador, kilos, precio_kilo, total, pagado ? 1 : 0, fecha, usuario_id]
  );
  return result.insertId;
};

export const updateVenta = async (venta) => {
  const { id, comprador, kilos, precio_kilo, pagado, fecha } = venta;
  const total = Number(kilos) * Number(precio_kilo);
  await runSql(
    "UPDATE ventas SET comprador = ?, kilos = ?, precio_kilo = ?, total = ?, pagado = ?, fecha = ? WHERE id = ?",
    [comprador, kilos, precio_kilo, total, pagado ? 1 : 0, fecha, id]
  );
};

export const deleteVenta = async (id) => {
  await runSql("DELETE FROM ventas WHERE id = ?", [id]);
};

export const listVentasByUsuario = async (usuarioId) => {
  const result = await runSql(
    "SELECT * FROM ventas WHERE usuario_id = ? ORDER BY id DESC",
    [usuarioId]
  );
  return result.rows._array || [];
};

export const sumVentasByUsuario = async (usuarioId) => {
  const result = await runSql(
    "SELECT SUM(total) as total_ventas FROM ventas WHERE usuario_id = ?",
    [usuarioId]
  );
  return result.rows.length > 0 ? result.rows.item(0).total_ventas || 0 : 0;
};
