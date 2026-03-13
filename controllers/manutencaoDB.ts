import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };
import { salvarUsuario } from "./usuario/salvarUsuario.ts";

export default async function () {
  const db = new Database(`${consts.db}.db`);

  //Criar table usuarios
  db.exec(
    `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    nome TEXT UNIQUE, 
    senha VARCHAR(50), 
    admin BOOLEAN NOT NULL CHECK (admin IN (0, 1)));`,
  );

  const res = await salvarUsuario({
    nome: "admin2",
    senha: consts.senha_padrao,
    admin: true,
  });
  if (!res.status) {
    console.log(res.msg);
    db.close();
    return;
  }

  db.exec(
    `
      CREATE TABLE IF NOT EXISTS tokens(
      token VARCHAR(50) PRIMARY KEY NOT NULL,
      id_usuario INTEGER NOT NULL,
      expirar DATETIME DEFAULT CURRENT_TIMESTAMP);
      `,
  );

  db.exec(
    `CREATE TABLE IF NOT EXISTS colunas (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    nome TEXT UNIQUE, 
    ordem INTEGER NOT NULL);
    `,
  );

  db.close();
}
