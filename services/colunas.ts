import { Resposta } from "../composables/tipos.ts";
import { verificaToken } from "../composables/verificaToken.ts";
import listarColunas from "../controllers/coluna/listarColunas.ts";

export default function (
  method: string,
  headers: Headers,
  _object: object,
  _query: number,
): Response {
  const methods = ["GET"];
  let body: Resposta;

  if (!methods.includes(method)) {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: headers,
    });
  }

  const token = headers.get("Authorization");
  const res = verificaToken(token);

  if (res.status !== true) {
    body = {
      info: { msg: res.msg, cdg_erro: 401 },
      data: {},
    };
    return new Response(JSON.stringify(body), {
      status: 401,
      headers: headers,
    });
  }

  if (method == "GET") {
    const resColunas = listarColunas();
    body = {
      info: { msg: resColunas.msg, cdg_erro: 0 },
      data: resColunas.data,
    };
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: headers,
    });
  } else {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: headers,
    });
  }
}
