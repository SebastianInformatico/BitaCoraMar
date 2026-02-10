import { runSql } from "./db";

export const createUsuario = async ({ nombre, email, password, pregunta, respuesta }) => {
  const existing = await runSql("SELECT id FROM usuarios WHERE email = ?", [email]);
  if (existing.rows.length > 0) {
    throw new Error("El email ya esta registrado.");
  }

  const result = await runSql(
    "INSERT INTO usuarios (nombre, email, password, pregunta, respuesta) VALUES (?, ?, ?, ?, ?)",
    [nombre, email, password, pregunta, respuesta]
  );
  return result.insertId;
};

export const loginUsuario = async (email, password) => {
  const result = await runSql(
    "SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?",
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
  const result = await runSql("SELECT id, nombre, email FROM usuarios WHERE id = ?", [id]);
  return result.rows.length > 0 ? result.rows.item(0) : null;
};
