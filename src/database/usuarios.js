import { runSql } from './db.js';

// FUNCIONES BÁSICAS DE USUARIO
export const crearUsuario = async (usuario) => {
  const { nombre, email, password, sector, licencia, ubicacion, telefono, pregunta, respuesta } = usuario;
  
  const existing = await runSql("SELECT id FROM usuarios WHERE email = ?", [email]);
  if (existing.rows.length > 0) {
    throw new Error("El email ya está registrado.");
  }
  
  const result = await runSql(
    `INSERT INTO usuarios (nombre, email, password, sector, licencia, ubicacion, telefono, pregunta, respuesta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, email, password, sector || 'pesca', licencia, ubicacion, telefono, pregunta, respuesta]
  );
  
  return result.insertId;
};

export const loginUsuario = async (email, password) => {
  const result = await runSql(
    "SELECT id, nombre, email, sector, ubicacion FROM usuarios WHERE email = ? AND password = ? AND activo = 1",
    [email, password]
  );
  return result.rows.length > 0 ? result.rows.item(0) : null;
};

export const getUsuarioByEmail = async (email) => {
  const result = await runSql("SELECT * FROM usuarios WHERE email = ?", [email]);
  return result.rows.length > 0 ? result.rows.item(0) : null;
};

export const recoverPassword = async (email, pregunta, respuesta) => {
  const result = await runSql(
    "SELECT password FROM usuarios WHERE email = ? AND pregunta = ? AND respuesta = ?",
    [email, pregunta, respuesta]
  );
  return result.rows.length > 0 ? result.rows.item(0).password : null;
};

export const getUsuarioById = async (id) => {
  const result = await runSql("SELECT * FROM usuarios WHERE id = ?", [id]);
  return result.rows.length > 0 ? result.rows.item(0) : null;
};

export const actualizarUsuario = async (id, datos) => {
  const campos = Object.keys(datos).map(campo => `${campo} = ?`).join(', ');
  const valores = Object.values(datos);
  valores.push(id);
  
  await runSql(
    `UPDATE usuarios SET ${campos} WHERE id = ?`,
    valores
  );
};

// FUNCIONES ESPECÍFICAS DE LA PLATAFORMA MARÍTIMA
export const obtenerUsuariosPorSector = async (sector) => {
  const result = await runSql(
    `SELECT id, nombre, email, sector, ubicacion, telefono 
     FROM usuarios 
     WHERE sector = ? AND activo = 1
     ORDER BY nombre`,
    [sector]
  );
  return result.rows._array;
};

export const buscarUsuarios = async (termino, sector = null) => {
  let query = `
    SELECT id, nombre, email, sector, ubicacion, telefono
    FROM usuarios 
    WHERE activo = 1 AND (nombre LIKE ? OR ubicacion LIKE ?)
  `;
  const params = [`%${termino}%`, `%${termino}%`];
  
  if (sector) {
    query += ` AND sector = ?`;
    params.push(sector);
  }
  
  query += ` ORDER BY nombre LIMIT 20`;
  
  const result = await runSql(query, params);
  return result.rows._array;
};

export const obtenerPerfilCompleto = async (id) => {
  const usuario = await getUsuarioById(id);
  if (!usuario) return null;
  
  // Obtener estadísticas según sector
  let estadisticas = {};
  
  if (usuario.sector === 'pesca') {
    const capturas = await runSql(
      `SELECT COUNT(*) as total_salidas, SUM(cantidad) as total_capturado
       FROM capturas_pesca 
       WHERE usuario_id = ?`,
      [id]
    );
    estadisticas.capturas = capturas.rows._array[0];
  }
  
  if (usuario.sector === 'acuicultura') {
    const produccion = await runSql(
      `SELECT COUNT(*) as ciclos_totales, 
              SUM(cantidad_sembrada) as total_sembrado,
              SUM(cantidad_cosechada) as total_cosechado
       FROM produccion_acuicultura 
       WHERE usuario_id = ?`,
      [id]
    );
    estadisticas.produccion = produccion.rows._array[0];
  }
  
  if (usuario.sector === 'navegacion') {
    const viajes = await runSql(
      `SELECT COUNT(*) as total_viajes, SUM(distancia_nm) as distancia_total
       FROM navegacion 
       WHERE usuario_id = ?`,
      [id]
    );
    estadisticas.navegacion = viajes.rows._array[0];
  }
  
  // Estadísticas del marketplace
  const comercio = await runSql(
    `SELECT 
       (SELECT COUNT(*) FROM marketplace WHERE vendedor_id = ? AND activa = 1) as ofertas_activas,
       (SELECT COUNT(*) FROM transacciones t 
        JOIN marketplace m ON t.marketplace_id = m.id 
        WHERE m.vendedor_id = ?) as ventas_realizadas,
       (SELECT COUNT(*) FROM transacciones WHERE comprador_id = ?) as compras_realizadas`,
    [id, id, id]
  );
  estadisticas.comercio = comercio.rows._array[0];
  
  return {
    ...usuario,
    estadisticas
  };
};

// Compatibilidad con funciones existentes
export const createUsuario = crearUsuario;
