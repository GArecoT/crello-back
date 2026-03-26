import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };

export default function (token: string, id_usuario: number) {
  const db = new Database(`${consts.db}.db`);

  const expirar = Date.now() + consts.expiracao_token;

  db.prepare(
    `
    INSERT INTO tokens (token, expirar, id_usuario) Values (:token, :expirar, :id_usuario)
      `,
  ).run({token: token, expirar: expirar, id_usuario: id_usuario});

  db.close()
}
