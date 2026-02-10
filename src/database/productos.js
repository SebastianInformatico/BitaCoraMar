import { runSql } from './db.js';

// PRODUCTOS
export const obtenerTodosLosProductos = async () => {
  const result = await runSql(
    `SELECT * FROM productos ORDER BY categoria, nombre`,
    []
  );
  return result.rows._array;
};

export const obtenerProductosPorSector = async (sector) => {
  const result = await runSql(
    `SELECT * FROM productos WHERE sector = ? ORDER BY categoria, nombre`,
    [sector]
  );
  return result.rows._array;
};

export const obtenerProductosPorCategoria = async (categoria) => {
  const result = await runSql(
    `SELECT * FROM productos WHERE categoria = ? ORDER BY nombre`,
    [categoria]
  );
  return result.rows._array;
};

export const buscarProductos = async (termino) => {
  const result = await runSql(
    `SELECT * FROM productos 
     WHERE nombre LIKE ? OR especie LIKE ?
     ORDER BY nombre`,
    [`%${termino}%`, `%${termino}%`]
  );
  return result.rows._array;
};

// TRAZABILIDAD
export const obtenerTrazabilidadProducto = async (producto_id) => {
  // Obtener capturas de pesca
  const capturas = await runSql(
    `SELECT 'captura' as tipo, c.*, u.nombre as operador, e.nombre as embarcacion
     FROM capturas_pesca c
     JOIN usuarios u ON c.usuario_id = u.id
     LEFT JOIN embarcaciones e ON c.embarcacion_id = e.id
     WHERE c.producto_id = ?
     ORDER BY c.fecha_salida DESC`,
    [producto_id]
  );

  // Obtener producción de acuicultura  
  const produccion = await runSql(
    `SELECT 'acuicultura' as tipo, a.*, u.nombre as operador
     FROM produccion_acuicultura a
     JOIN usuarios u ON a.usuario_id = u.id
     WHERE a.producto_id = ?
     ORDER BY a.fecha_siembra DESC`,
    [producto_id]
  );

  // Obtener ofertas de marketplace
  const ofertas = await runSql(
    `SELECT 'marketplace' as tipo, m.*, u.nombre as vendedor
     FROM marketplace m
     JOIN usuarios u ON m.vendedor_id = u.id
     WHERE m.producto_id = ?
     ORDER BY m.fecha_publicacion DESC`,
    [producto_id]
  );

  // Obtener transacciones
  const transacciones = await runSql(
    `SELECT 'venta' as tipo, t.*, 
            u_vendedor.nombre as vendedor,
            u_comprador.nombre as comprador
     FROM transacciones t
     JOIN marketplace m ON t.marketplace_id = m.id
     JOIN usuarios u_vendedor ON m.vendedor_id = u_vendedor.id
     JOIN usuarios u_comprador ON t.comprador_id = u_comprador.id
     WHERE m.producto_id = ?
     ORDER BY t.fecha_transaccion DESC`,
    [producto_id]
  );

  return {
    capturas: capturas.rows._array,
    produccion: produccion.rows._array,
    ofertas: ofertas.rows._array,
    transacciones: transacciones.rows._array
  };
};

// ESTADÍSTICAS
export const obtenerEstadisticasProduccion = async (usuario_id, fechaInicio, fechaFin) => {
  // Estadísticas de capturas
  const capturas = await runSql(
    `SELECT p.nombre, p.categoria, SUM(c.cantidad) as total_capturado
     FROM capturas_pesca c
     JOIN productos p ON c.producto_id = p.id
     WHERE c.usuario_id = ? AND c.fecha_salida BETWEEN ? AND ?
     GROUP BY p.id
     ORDER BY total_capturado DESC`,
    [usuario_id, fechaInicio, fechaFin]
  );

  // Estadísticas de acuicultura
  const acuicultura = await runSql(
    `SELECT p.nombre, p.categoria, 
            SUM(a.cantidad_sembrada) as total_sembrado,
            SUM(a.cantidad_cosechada) as total_cosechado,
            AVG(a.mortalidad) as mortalidad_promedio
     FROM produccion_acuicultura a
     JOIN productos p ON a.producto_id = p.id
     WHERE a.usuario_id = ? AND a.fecha_siembra BETWEEN ? AND ?
     GROUP BY p.id
     ORDER BY total_sembrado DESC`,
    [usuario_id, fechaInicio, fechaFin]
  );

  return {
    capturas: capturas.rows._array,
    acuicultura: acuicultura.rows._array
  };
};

export const obtenerPreciosPromedio = async (producto_id, dias = 30) => {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - dias);
  
  const result = await runSql(
    `SELECT AVG(m.precio_unitario) as precio_promedio,
            MIN(m.precio_unitario) as precio_minimo,
            MAX(m.precio_unitario) as precio_maximo,
            COUNT(*) as total_ofertas
     FROM marketplace m
     WHERE m.producto_id = ? 
     AND m.fecha_publicacion >= ?
     AND m.activa = 1`,
    [producto_id, fechaInicio.toISOString()]
  );
  
  return result.rows._array[0];
};

export const obtenerZonasMasProductivas = async (producto_id, limite = 10) => {
  const result = await runSql(
    `SELECT zona_pesca, SUM(cantidad) as total_capturado, COUNT(*) as num_capturas
     FROM capturas_pesca
     WHERE producto_id = ? AND zona_pesca IS NOT NULL
     GROUP BY zona_pesca
     ORDER BY total_capturado DESC
     LIMIT ?`,
    [producto_id, limite]
  );
  
  return result.rows._array;
};