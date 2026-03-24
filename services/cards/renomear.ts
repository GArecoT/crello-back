import headers from "../../composables/headers.ts";
import { Card, Resposta } from "../../composables/tipos.ts";
import { verificaToken } from "../../composables/verificaToken.ts";
import renomear from "../../controllers/cards/renomear.ts";

export default function (
  method: string,
  reqHeaders: Headers,
  card: Card,
  query?: number | string,
): Response {
  const methods = ["POST"];
  let body: Resposta = {
    info: { msg: "BAD REQUEST", cdg_erro: 400 },
    data: {},
  };

  if (!methods.includes(method)) {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: headers,
    });
  }

  const token = reqHeaders.get("Authorization");
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

  if (method == "POST") {
    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }
    const resRenomear = renomear(query, card.nome as string);

    if (resRenomear.status) {
      body = {
        info: { msg: resRenomear.msg, cdg_erro: 0 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: headers,
      });
    } else {
      body = {
        info: { msg: resRenomear.msg, cdg_erro: 406 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 406,
        headers: headers,
      });
    }
  } else {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: headers,
    });
  }
}
