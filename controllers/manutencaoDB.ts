import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };
import hash from "../composables/hash.ts";

async function criaSenhaAdmin() {
  if (consts?.senha_padrao) {
    return await hash(consts.senha_padrao);
  } else {
    return await hash("password123");
  }
}

export default async function () {
  const db = new Database(`${consts.db}.db`);
  const senha = await criaSenhaAdmin();

  //Criar table usuarios
  db.exec(
    `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    nome TEXT UNIQUE, 
    senha VARCHAR(50), 
    admin BOOLEAN NOT NULL CHECK (admin IN (0, 1)));`,
  );

  try {
    db.exec(
      `
    INSERT INTO usuarios (id,nome,senha, admin) Values (0,'admin','${senha}', 1)
      `,
    );
  } catch {
    //já está cadastrado o admin
  }

  db.exec(
    `
      CREATE TABLE IF NOT EXISTS tokens(
      token VARCHAR(50) PRIMARY KEY NOT NULL,
      id_usuario INTEGER NOT NULL,
      expirar DATETIME DEFAULT CURRENT_TIMESTAMP);
      `,
  );

  db.close();
}
