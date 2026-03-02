import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };

export default async function (token: string) {
  const db = new Database(`${consts.db}.db`);

  const expirar = Date.now() + consts.expiracao_token;

  db.exec(
    `
    INSERT INTO tokens (token, expirar) Values ('${token}', '${expirar}')
      `,
  );

  db.close();
}
