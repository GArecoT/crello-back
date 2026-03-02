import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };

export default function (token: string, id_usuario) {
  const db = new Database(`${consts.db}.db`);

  const expirar = Date.now() + consts.expiracao_token;

  db.exec(
    `
    INSERT INTO tokens (token, expirar, id_usuario) Values ('${token}', '${expirar}', '${id_usuario}')
      `,
  );

  db.close();
}
