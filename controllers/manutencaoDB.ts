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

  db.exec(
    "CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT UNIQUE, senha VARCHAR(50));",
  );

  try {
    db.exec(
      `
    INSERT INTO usuarios (id,nome,senha) Values (0,'admin','${senha}')
      `,
    );
  } catch {
    //já está cadastrado o admin
  }
  // console.log(version);

  db.close();
}
