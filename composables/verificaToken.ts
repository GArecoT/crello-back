import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };
import { RespostaInterna } from "../composables/tipos.ts";

export function verificaToken(token: string): RespostaInterna {
  const db = new Database(`${consts.db}.db`);

  const tokens = db.prepare(
    `
	SELECT * FROM tokens WHERE token = '${token}';
  `,
  ).all();

  db.close();

  if (tokens.length > 0) {
    if (tokens[0].expirar >= Date.now()) {
      return {
        status: true,
        msg: "Login feito com sucesso!",
        data: token[0],
      };
    } else {
      const db = new Database(`${consts.db}.db`);

      db.exec(
        `
        DELETE FROM tokens WHERE token = '${token}';
        `,
      );

      db.close();
      return { status: false, msg: "Usuário não validado!", data: {} };
    }
  } else {
    return { status: false, msg: "Usuário não validado!", data: {} };
  }
}
