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
  await runSql(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      pregunta TEXT NOT NULL,
      respuesta TEXT NOT NULL
    );`
  );

  await runSql(
    `CREATE TABLE IF NOT EXISTS registros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proveedor TEXT NOT NULL,
      kilos REAL NOT NULL,
      calibre TEXT NOT NULL,
      fecha_siembra TEXT NOT NULL,
      fecha_listo TEXT NOT NULL,
      proceso TEXT NOT NULL,
      linea_sector TEXT NOT NULL,
      observacion TEXT,
      usuario_id INTEGER NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );`
  );

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
};
