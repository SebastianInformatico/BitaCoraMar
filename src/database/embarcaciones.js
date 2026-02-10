import { runSql } from './db.js';

// EMBARCACIONES
export const crearEmbarcacion = async (embarcacion) => {
  const { nombre, matricula, tipo, capacidad, eslora, motor, usuario_id } = embarcacion;
  
  const result = await runSql(
    `INSERT INTO embarcaciones (nombre, matricula, tipo, capacidad, eslora, motor, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, matricula, tipo, capacidad, eslora, motor, usuario_id]
  );
  
  return result.insertId;
};

export const obtenerEmbarcacionesPorUsuario = async (usuario_id) => {
  const result = await runSql(
    `SELECT * FROM embarcaciones WHERE usuario_id = ? ORDER BY nombre`,
    [usuario_id]
  );
  return result.rows._array;
};

export const obtenerEmbarcacionPorId = async (id) => {
  const result = await runSql(
    `SELECT * FROM embarcaciones WHERE id = ?`,
    [id]
  );
  return result.rows._array[0] || null;
};

export const actualizarEmbarcacion = async (id, datos) => {
  const campos = Object.keys(datos).map(campo => `${campo} = ?`).join(', ');
  const valores = Object.values(datos);
  valores.push(id);
  
  await runSql(
    `UPDATE embarcaciones SET ${campos} WHERE id = ?`,
    valores
  );
};

export const eliminarEmbarcacion = async (id) => {
  await runSql(`DELETE FROM embarcaciones WHERE id = ?`, [id]);
};