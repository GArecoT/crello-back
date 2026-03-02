import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };
import { RespostaInterna } from "../composables/tipos.ts";

export function verificaToken(token: string | null): RespostaInterna {
  const db = new Database(`${consts.db}.db`);

  if (token == null || token?.length === 0) {
    return {
      status: false,
      msg: "Token Vazio",
      data: {},
    };
  }

  if (token.includes("Bearer ")) {
    token = token.replace("Bearer ", "");
  }

  const tokens = db.prepare(
    `
	SELECT * FROM tokens WHERE token = '${token}' and expirar >= ${Date.now()};
  `,
  ).all();

  db.close();

  if (tokens?.length > 0) {
    return {
      status: true,
      msg: "Token válido!",
      data: tokens[0],
    };
  } else {
    return { status: false, msg: "Token expirado/inválido", data: {} };
  }
}
