import { Database } from "@db/sqlite";
import { Resposta } from "../composables/tipos.ts";
import { verificaToken } from "../composables/verificaToken.ts";
import consts from "../composables/consts.json" with { type: "json" };

export default function (
  method: string,
  headers: Headers,
): Response {
  let body: Resposta;

  if (method != "GET") {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  const token = headers.get("Authorization");
  const res = verificaToken(token);
  if (res.status === true) {
    const db = new Database(`${consts.db}.db`);
    const usuarios = db.prepare(
      `
      SELECT id, nome, admin FROM usuarios
      `,
    ).all();

    return new Response(JSON.stringify(usuarios), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  } else {
    body = {
      info: { msg: res.msg, cdg_erro: 401 },
      data: {},
    };
    return new Response(JSON.stringify(body), {
      status: 401,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
