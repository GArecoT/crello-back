import headers from "../composables/headers.ts";
import { Card, Resposta } from "../composables/tipos.ts";
import { verificaToken } from "../composables/verificaToken.ts";
import deletarCard from "../controllers/cards/deletarCard.ts";
import pegarCard from "../controllers/cards/pegarCard.ts";
import salvarCard from "../controllers/cards/salvarCard.ts";

export default function (
  method: string,
  reqHeaders: Headers,
  card: Card,
  query?: number | string,
): Response {
  const methods = ["GET", "POST", "DELETE"];
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

  if (method == "GET") {
    if (query === null || query === undefined) {
      body = {
        info: { msg: "Sem id do card", cdg_erro: 666 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: headers,
      });
    }

    const resCard = pegarCard({ id: query as number });
    body = {
      info: { msg: resCard.msg, cdg_erro: resCard.status ? 0 : 404 },
      data: resCard.data,
    };
    return new Response(JSON.stringify(body), {
      status: resCard.status ? 200 : 404,
      headers: headers,
    });
  }
  if (method == "POST") {
    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }
    const resSalvarCard = salvarCard(card, query);

    if (resSalvarCard.status) {
      body = {
        info: { msg: resSalvarCard.msg, cdg_erro: 0 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: headers,
      });
    } else {
      body = {
        info: { msg: resSalvarCard.msg, cdg_erro: 406 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 406,
        headers: headers,
      });
    }
  }
  if (method == "DELETE") {
    if (query === null || query === undefined) {
      body = {
        info: { msg: "Sem id do usuário", cdg_erro: 666 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: headers,
      });
    }

    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }

    const resDeletar = deletarCard(query);

    if (resDeletar.status) {
      body = {
        info: { msg: resDeletar.msg, cdg_erro: 0 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: headers,
      });
    } else {
      body = {
        info: { msg: resDeletar.msg, cdg_erro: 406 },
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
