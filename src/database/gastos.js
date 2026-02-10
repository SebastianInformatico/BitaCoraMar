import { runSql } from "./db";

export const createGasto = async (gasto) => {
  const { categoria, monto, fecha, nota, usuario_id } = gasto;
  const result = await runSql(
    "INSERT INTO gastos (categoria, monto, fecha, nota, usuario_id) VALUES (?, ?, ?, ?, ?)",
    [categoria, monto, fecha, nota || "", usuario_id]
  );
  return result.insertId;
};

export const updateGasto = async (gasto) => {
  const { id, categoria, monto, fecha, nota } = gasto;
  await runSql(
    "UPDATE gastos SET categoria = ?, monto = ?, fecha = ?, nota = ? WHERE id = ?",
    [categoria, monto, fecha, nota || "", id]
  );
};

export const deleteGasto = async (id) => {
  await runSql("DELETE FROM gastos WHERE id = ?", [id]);
};

export const listGastosByUsuario = async (usuarioId) => {
  const result = await runSql(
    "SELECT * FROM gastos WHERE usuario_id = ? ORDER BY id DESC",
    [usuarioId]
  );
  return result.rows._array || [];
};

export const sumGastosByUsuario = async (usuarioId) => {
  const result = await runSql(
    "SELECT SUM(monto) as total_gastos FROM gastos WHERE usuario_id = ?",
    [usuarioId]
  );
  return result.rows.length > 0 ? result.rows.item(0).total_gastos || 0 : 0;
};
