import { runSql } from "./db";

export const createRegistro = async (registro) => {
  const {
    proveedor,
    kilos,
    calibre,
    fecha_siembra,
    fecha_listo,
    proceso,
    linea_sector,
    observacion,
    usuario_id,
  } = registro;

  const result = await runSql(
    `INSERT INTO registros
      (proveedor, kilos, calibre, fecha_siembra, fecha_listo, proceso, linea_sector, observacion, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ,
    [
      proveedor,
      kilos,
      calibre,
      fecha_siembra,
      fecha_listo,
      proceso,
      linea_sector,
      observacion || "",
      usuario_id,
    ]
  );
  return result.insertId;
};

export const updateRegistro = async (registro) => {
  const {
    id,
    proveedor,
    kilos,
    calibre,
    fecha_siembra,
    fecha_listo,
    proceso,
    linea_sector,
    observacion,
  } = registro;

  await runSql(
    `UPDATE registros
      SET proveedor = ?, kilos = ?, calibre = ?, fecha_siembra = ?, fecha_listo = ?, proceso = ?, linea_sector = ?, observacion = ?
      WHERE id = ?`,
    [
      proveedor,
      kilos,
      calibre,
      fecha_siembra,
      fecha_listo,
      proceso,
      linea_sector,
      observacion || "",
      id,
    ]
  );
};

export const deleteRegistro = async (id) => {
  await runSql("DELETE FROM registros WHERE id = ?", [id]);
};

export const listRegistrosByUsuario = async (usuarioId) => {
  const result = await runSql(
    "SELECT * FROM registros WHERE usuario_id = ? ORDER BY id DESC",
    [usuarioId]
  );
  return result.rows._array || [];
};

export const sumKilosByUsuario = async (usuarioId) => {
  const result = await runSql(
    "SELECT SUM(kilos) as total_kilos FROM registros WHERE usuario_id = ?",
    [usuarioId]
  );
  return result.rows.length > 0 ? result.rows.item(0).total_kilos || 0 : 0;
};
