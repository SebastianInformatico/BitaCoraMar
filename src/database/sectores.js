import { runSql } from './db.js';

// CAPTURAS DE PESCA
export const registrarCaptura = async (captura) => {
  const { embarcacion_id, producto_id, cantidad, zona_pesca, coordenadas, fecha_salida, fecha_regreso, tripulacion, metodo_pesca, temperatura_agua, usuario_id } = captura;
  
  const result = await runSql(
    `INSERT INTO capturas_pesca (embarcacion_id, producto_id, cantidad, zona_pesca, coordenadas, fecha_salida, fecha_regreso, tripulacion, metodo_pesca, temperatura_agua, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [embarcacion_id, producto_id, cantidad, zona_pesca, coordenadas, fecha_salida, fecha_regreso, tripulacion, metodo_pesca, temperatura_agua, usuario_id]
  );
  
  return result.insertId;
};

export const obtenerCapturasPorUsuario = async (usuario_id, limite = 50) => {
  const result = await runSql(
    `SELECT c.*, p.nombre as producto_nombre, p.especie, e.nombre as embarcacion_nombre
     FROM capturas_pesca c
     JOIN productos p ON c.producto_id = p.id
     LEFT JOIN embarcaciones e ON c.embarcacion_id = e.id
     WHERE c.usuario_id = ?
     ORDER BY c.fecha_salida DESC
     LIMIT ?`,
    [usuario_id, limite]
  );
  return result.rows._array;
};

export const obtenerCapturasPorZona = async (zona_pesca) => {
  const result = await runSql(
    `SELECT c.*, p.nombre as producto_nombre, u.nombre as pescador_nombre
     FROM capturas_pesca c
     JOIN productos p ON c.producto_id = p.id
     JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.zona_pesca LIKE ?
     ORDER BY c.fecha_salida DESC
     LIMIT 20`,
    [`%${zona_pesca}%`]
  );
  return result.rows._array;
};

// PRODUCCIÓN ACUICULTURA
export const registrarProduccionAcuicultura = async (produccion) => {
  const { producto_id, centro_cultivo, coordenadas, cantidad_sembrada, fecha_siembra, fecha_cosecha_estimada, observaciones, usuario_id } = produccion;
  
  const result = await runSql(
    `INSERT INTO produccion_acuicultura (producto_id, centro_cultivo, coordenadas, cantidad_sembrada, fecha_siembra, fecha_cosecha_estimada, observaciones, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [producto_id, centro_cultivo, coordenadas, cantidad_sembrada, fecha_siembra, fecha_cosecha_estimada, observaciones, usuario_id]
  );
  
  return result.insertId;
};

export const actualizarCosecha = async (id, cantidad_cosechada, fecha_cosecha_real, mortalidad) => {
  await runSql(
    `UPDATE produccion_acuicultura 
     SET cantidad_cosechada = ?, fecha_cosecha_real = ?, mortalidad = ?
     WHERE id = ?`,
    [cantidad_cosechada, fecha_cosecha_real, mortalidad, id]
  );
};

export const obtenerProduccionPorUsuario = async (usuario_id) => {
  const result = await runSql(
    `SELECT a.*, p.nombre as producto_nombre, p.especie
     FROM produccion_acuicultura a
     JOIN productos p ON a.producto_id = p.id
     WHERE a.usuario_id = ?
     ORDER BY a.fecha_siembra DESC`,
    [usuario_id]
  );
  return result.rows._array;
};

export const obtenerCiclosActivos = async (usuario_id) => {
  const result = await runSql(
    `SELECT a.*, p.nombre as producto_nombre
     FROM produccion_acuicultura a
     JOIN productos p ON a.producto_id = p.id
     WHERE a.usuario_id = ? AND a.fecha_cosecha_real IS NULL
     ORDER BY a.fecha_cosecha_estimada ASC`,
    [usuario_id]
  );
  return result.rows._array;
};

// BITACORAS DE NAVEGACIÓN
export const registrarNavegacion = async (navegacion) => {
  const { embarcacion_id, puerto_origen, puerto_destino, fecha_salida, fecha_llegada, distancia_nm, combustible_usado, carga, tripulacion, condiciones_clima, incidentes, usuario_id } = navegacion;
  
  const result = await runSql(
    `INSERT INTO navegacion (embarcacion_id, puerto_origen, puerto_destino, fecha_salida, fecha_llegada, distancia_nm, combustible_usado, carga, tripulacion, condiciones_clima, incidentes, usuario_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [embarcacion_id, puerto_origen, puerto_destino, fecha_salida, fecha_llegada, distancia_nm, combustible_usado, carga, tripulacion, condiciones_clima, incidentes, usuario_id]
  );
  
  return result.insertId;
};

export const obtenerNavegacionesPorUsuario = async (usuario_id) => {
  const result = await runSql(
    `SELECT n.*, e.nombre as embarcacion_nombre, e.matricula
     FROM navegacion n
     JOIN embarcaciones e ON n.embarcacion_id = e.id
     WHERE n.usuario_id = ?
     ORDER BY n.fecha_salida DESC`,
    [usuario_id]
  );
  return result.rows._array;
};

export const obtenerViajesActivos = async (usuario_id) => {
  const result = await runSql(
    `SELECT n.*, e.nombre as embarcacion_nombre
     FROM navegacion n
     JOIN embarcaciones e ON n.embarcacion_id = e.id
     WHERE n.usuario_id = ? AND n.fecha_llegada IS NULL
     ORDER BY n.fecha_salida DESC`,
    [usuario_id]
  );
  return result.rows._array;
};