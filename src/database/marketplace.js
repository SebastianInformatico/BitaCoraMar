import { runSql } from './db.js';

// MARKETPLACE
export const crearOferta = async (oferta) => {
  const { vendedor_id, producto_id, tipo, cantidad_disponible, precio_unitario, calidad, fecha_disponible, ubicacion } = oferta;
  
  const result = await runSql(
    `INSERT INTO marketplace (vendedor_id, producto_id, tipo, cantidad_disponible, precio_unitario, calidad, fecha_disponible, ubicacion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [vendedor_id, producto_id, tipo, cantidad_disponible, precio_unitario, calidad, fecha_disponible, ubicacion]
  );
  
  return result.insertId;
};

export const obtenerOfertas = async (filtros = {}) => {
  let query = `
    SELECT m.*, p.nombre as producto_nombre, p.categoria, p.especie,
           u.nombre as vendedor_nombre, u.ubicacion as vendedor_ubicacion
    FROM marketplace m
    JOIN productos p ON m.producto_id = p.id  
    JOIN usuarios u ON m.vendedor_id = u.id
    WHERE m.activa = 1
  `;
  
  const params = [];
  
  if (filtros.categoria) {
    query += ` AND p.categoria = ?`;
    params.push(filtros.categoria);
  }
  
  if (filtros.sector) {
    query += ` AND p.sector = ?`;
    params.push(filtros.sector);
  }
  
  if (filtros.ubicacion) {
    query += ` AND (u.ubicacion LIKE ? OR m.ubicacion LIKE ?)`;
    params.push(`%${filtros.ubicacion}%`, `%${filtros.ubicacion}%`);
  }
  
  if (filtros.tipo) {
    query += ` AND m.tipo = ?`;
    params.push(filtros.tipo);
  }
  
  query += ` ORDER BY m.fecha_publicacion DESC`;
  
  const result = await runSql(query, params);
  return result.rows._array;
};

export const obtenerOfertasPorVendedor = async (vendedor_id) => {
  const result = await runSql(
    `SELECT m.*, p.nombre as producto_nombre, p.categoria
     FROM marketplace m
     JOIN productos p ON m.producto_id = p.id  
     WHERE m.vendedor_id = ?
     ORDER BY m.fecha_publicacion DESC`,
    [vendedor_id]
  );
  return result.rows._array;
};

export const actualizarOferta = async (id, datos) => {
  const campos = Object.keys(datos).map(campo => `${campo} = ?`).join(', ');
  const valores = Object.values(datos);
  valores.push(id);
  
  await runSql(
    `UPDATE marketplace SET ${campos} WHERE id = ?`,
    valores
  );
};

export const desactivarOferta = async (id) => {
  await runSql(`UPDATE marketplace SET activa = 0 WHERE id = ?`, [id]);
};

// TRANSACCIONES
export const crearTransaccion = async (transaccion) => {
  const { marketplace_id, comprador_id, cantidad, precio_total, fecha_entrega, metodo_pago } = transaccion;
  
  const result = await runSql(
    `INSERT INTO transacciones (marketplace_id, comprador_id, cantidad, precio_total, fecha_entrega, metodo_pago)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [marketplace_id, comprador_id, cantidad, precio_total, fecha_entrega, metodo_pago]
  );
  
  return result.insertId;
};

export const obtenerTransaccionesPorUsuario = async (usuario_id) => {
  const result = await runSql(
    `SELECT t.*, m.tipo, p.nombre as producto_nombre,
            CASE 
              WHEN m.vendedor_id = ? THEN 'vendedor'
              ELSE 'comprador'
            END as rol,
            CASE 
              WHEN m.vendedor_id = ? THEN u_comprador.nombre
              ELSE u_vendedor.nombre  
            END as contraparte_nombre
     FROM transacciones t
     JOIN marketplace m ON t.marketplace_id = m.id
     JOIN productos p ON m.producto_id = p.id
     JOIN usuarios u_vendedor ON m.vendedor_id = u_vendedor.id
     JOIN usuarios u_comprador ON t.comprador_id = u_comprador.id
     WHERE m.vendedor_id = ? OR t.comprador_id = ?
     ORDER BY t.fecha_transaccion DESC`,
    [usuario_id, usuario_id, usuario_id, usuario_id]
  );
  return result.rows._array;
};

export const actualizarEstadoTransaccion = async (id, estado) => {
  await runSql(
    `UPDATE transacciones SET estado = ? WHERE id = ?`,
    [estado, id]
  );
};

export const calificarTransaccion = async (id, calificacion) => {
  await runSql(
    `UPDATE transacciones SET calificacion = ? WHERE id = ?`,
    [calificacion, id]
  );
};