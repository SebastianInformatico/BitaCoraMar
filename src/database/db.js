import { openDatabaseAsync } from "expo-sqlite";

let dbPromise = null;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("bitacoramar.db");
  }
  return dbPromise;
};

export const runSql = async (sql, params = []) => {
  const db = await getDb();
  const stmt = await db.prepareAsync(sql);
  try {
    const result = await stmt.executeAsync(params);
    const rowsArray = await result.getAllAsync();
    return {
      rows: {
        _array: rowsArray,
        length: rowsArray.length,
        item: (index) => rowsArray[index],
      },
      insertId: result.lastInsertRowId ?? null,
      rowsAffected: result.changes ?? 0,
    };
  } finally {
    await stmt.finalizeAsync();
  }
};

export const initDb = async () => {
  // Tabla usuarios expandida para múltiples sectores marítimos
  await runSql(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      sector TEXT NOT NULL,
      licencia TEXT,
      ubicacion TEXT,
      telefono TEXT,
      pregunta TEXT NOT NULL,
      respuesta TEXT NOT NULL,
      fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
      activo INTEGER DEFAULT 1
    );`
  );

  // Registro de embarcaciones
  await runSql(
    `CREATE TABLE IF NOT EXISTS embarcaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      matricula TEXT UNIQUE,
      tipo TEXT NOT NULL,
      capacidad REAL,
      eslora REAL,
      motor TEXT,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

  // Catálogo de productos marítimos
  await runSql(
    `CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      categoria TEXT NOT NULL,
      especie TEXT,
      unidad TEXT DEFAULT 'kg',
      sector TEXT NOT NULL
    );`
  );

  // Registros de pesca
  await runSql(
    `CREATE TABLE IF NOT EXISTS capturas_pesca (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      embarcacion_id INTEGER,
      producto_id INTEGER NOT NULL,
      cantidad REAL NOT NULL,
      zona_pesca TEXT,
      coordenadas TEXT,
      fecha_salida TEXT NOT NULL,
      fecha_regreso TEXT,
      tripulacion TEXT,
      metodo_pesca TEXT,
      temperatura_agua REAL,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (embarcacion_id) REFERENCES embarcaciones(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

  // Registros de acuicultura
  await runSql(
    `CREATE TABLE IF NOT EXISTS produccion_acuicultura (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_id INTEGER NOT NULL,
      centro_cultivo TEXT NOT NULL,
      coordenadas TEXT,
      cantidad_sembrada REAL,
      fecha_siembra TEXT NOT NULL,
      fecha_cosecha_estimada TEXT,
      fecha_cosecha_real TEXT,
      cantidad_cosechada REAL,
      mortalidad REAL DEFAULT 0,
      observaciones TEXT,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (producto_id) REFERENCES productos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

  // Bitácoras de navegación
  await runSql(
    `CREATE TABLE IF NOT EXISTS navegacion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      embarcacion_id INTEGER NOT NULL,
      puerto_origen TEXT NOT NULL,
      puerto_destino TEXT NOT NULL,
      fecha_salida TEXT NOT NULL,
      fecha_llegada TEXT,
      distancia_nm REAL,
      combustible_usado REAL,
      carga TEXT,
      tripulacion TEXT,
      condiciones_clima TEXT,
      incidentes TEXT,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (embarcacion_id) REFERENCES embarcaciones(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

  // Marketplace de productos
  await runSql(
    `CREATE TABLE IF NOT EXISTS marketplace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendedor_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      tipo TEXT DEFAULT 'oferta',
      cantidad_disponible REAL NOT NULL,
      precio_unitario REAL NOT NULL,
      calidad TEXT,
      fecha_disponible TEXT,
      ubicacion TEXT,
      activa INTEGER DEFAULT 1,
      fecha_publicacion TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );`
  );

  // Transacciones comerciales
  await runSql(
    `CREATE TABLE IF NOT EXISTS transacciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marketplace_id INTEGER NOT NULL,
      comprador_id INTEGER NOT NULL,
      cantidad REAL NOT NULL,
      precio_total REAL NOT NULL,
      fecha_transaccion TEXT DEFAULT CURRENT_TIMESTAMP,
      fecha_entrega TEXT,
      estado TEXT DEFAULT 'pendiente',
      metodo_pago TEXT,
      calificacion INTEGER,
      FOREIGN KEY (marketplace_id) REFERENCES marketplace(id),
      FOREIGN KEY (comprador_id) REFERENCES usuarios(id)
    );`
  );

  // Mantener tablas existentes para compatibilidad
  await runSql(
    `CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      monto REAL NOT NULL,
      fecha TEXT NOT NULL,
      nota TEXT,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comprador TEXT NOT NULL,
      kilos REAL NOT NULL,
      precio_kilo REAL NOT NULL,
      total REAL NOT NULL,
      pagado INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

  // Poblar con productos comunes de la industria marítima
  await seedProducts();
};

// Poblar productos comunes de la industria marítima chilena  
const seedProducts = async () => {
  const productos = [
    // Pesca
    { nombre: 'Merluza', categoria: 'pescado', especie: 'Merluccius gayi', sector: 'pesca' },
    { nombre: 'Jurel', categoria: 'pescado', especie: 'Trachurus murphyi', sector: 'pesca' },
    { nombre: 'Anchoveta', categoria: 'pescado', especie: 'Engraulis ringens', sector: 'pesca' },
    { nombre: 'Sardina', categoria: 'pescado', especie: 'Sardinops sagax', sector: 'pesca' },
    { nombre: 'Congrio', categoria: 'pescado', especie: 'Genypterus chilensis', sector: 'pesca' },
    
    // Mariscos
    { nombre: 'Chorito', categoria: 'mariscos', especie: 'Mytilus chilensis', sector: 'acuicultura' },
    { nombre: 'Ostra', categoria: 'mariscos', especie: 'Crassostrea gigas', sector: 'acuicultura' },
    { nombre: 'Cholga', categoria: 'mariscos', especie: 'Aulacomya atra', sector: 'pesca' },
    { nombre: 'Navajuela', categoria: 'mariscos', especie: 'Ensis macha', sector: 'pesca' },
    { nombre: 'Loco', categoria: 'mariscos', especie: 'Concholepas concholepas', sector: 'pesca' },
    
    // Acuicultura
    { nombre: 'Salmón Atlántico', categoria: 'pescado', especie: 'Salmo salar', sector: 'acuicultura' },
    { nombre: 'Trucha', categoria: 'pescado', especie: 'Oncorhynchus mykiss', sector: 'acuicultura' },
    { nombre: 'Salmón Coho', categoria: 'pescado', especie: 'Oncorhynchus kisutch', sector: 'acuicultura' },
    
    // Algas
    { nombre: 'Pelillo', categoria: 'algas', especie: 'Gracilaria chilensis', sector: 'acuicultura' },
    { nombre: 'Huiro', categoria: 'algas', especie: 'Macrocystis pyrifera', sector: 'pesca' },
    { nombre: 'Cochayuyo', categoria: 'algas', especie: 'Durvillaea antarctica', sector: 'pesca' }
  ];

  for (const producto of productos) {
    try {
      await runSql(
        `INSERT OR IGNORE INTO productos (nombre, categoria, especie, sector) 
         VALUES (?, ?, ?, ?)`,
        [producto.nombre, producto.categoria, producto.especie, producto.sector]
      );
    } catch (error) {
      // Producto ya existe, continuar
    }
  }
};
};
