import { Resposta, Usuario } from "../../composables/tipos.ts";
import { verificaToken } from "../../composables/verificaToken.ts";
import adicionarUsuario from "../../controllers/cards/usuarios/adicionarUsuario.ts";
import removerUsuario from "../../controllers/cards/usuarios/removerUsuario.ts";
import listarUsuarios from "../../controllers/cards/usuarios/listarUsuarios.ts";

export default function (
  method: string,
  headers: Headers,
  usuario: Usuario,
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
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
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
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
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
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const resGet = listarUsuarios(query as number);
    body = {
      info: { msg: resGet.msg, cdg_erro: resGet.status ? 0 : 404 },
      data: resGet.data,
    };
    return new Response(JSON.stringify(body), {
      status: resGet.status ? 200 : 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
  if (method == "POST") {
    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }
    const resSalvar = adicionarUsuario(
      query as number,
      usuario.id as number,
    );

    if (resSalvar.status) {
      body = {
        info: { msg: resSalvar.msg, cdg_erro: 0 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    } else {
      body = {
        info: { msg: resSalvar.msg, cdg_erro: 406 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 406,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }
  }
  if (method == "DELETE") {
    if (query === null || query === undefined) {
      body = {
        info: { msg: "Sem id do cartão", cdg_erro: 666 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }

    const resDeletar = removerUsuario(
      query as number,
      usuario.id as number,
    );

    if (resDeletar.status) {
      body = {
        info: { msg: resDeletar.msg, cdg_erro: 0 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    } else {
      body = {
        info: { msg: resDeletar.msg, cdg_erro: 406 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 406,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }
  } else {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
