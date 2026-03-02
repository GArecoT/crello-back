import { Resposta, Usuario } from "../composables/tipos.ts";
import { verificaToken } from "../composables/verificaToken.ts";
import pegarUsuario from "../controllers/pegarUsuario.ts";

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
        info: { msg: "Sem id do usuário", cdg_erro: 666 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const resUsuarios = pegarUsuario({ id: query as number });
    body = {
      info: { msg: resUsuarios.msg, cdg_erro: resUsuarios.status ? 0 : 404 },
      data: resUsuarios.data,
    };
    return new Response(JSON.stringify(body), {
      status: resUsuarios.status ? 200 : 404,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
  if (method == "POST") {
    const chaves: (keyof Usuario)[] = ["nome", "senha"];

    //verificar se é admin
    const admin = pegarUsuario(res.data).data.admin || 0;

    if (admin < 0) {
      body = {
        info: { msg: "Não autorizado!", cdg_erro: 401 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 401,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }

    const resCampos = chaves.every((chave) => {
      if (
        usuario[chave] === null || usuario[chave] === undefined ||
        typeof usuario[chave] != "string" ||
        usuario[chave]?.length === 0
      ) {
        body = {
          info: { msg: `Campo ${chave} inválido ou vazio`, cdg_erro: 400 },
          data: {},
        };
        return false;
      } else return true;
    });

    if (resCampos === false) {
      return new Response(JSON.stringify(body), {
        status: 400,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }
  }
  if (method == "DELETE") {
    const admin = pegarUsuario(res.data).data.admin || 0;

    if (admin < 0) {
      body = {
        info: { msg: "Não autorizado!", cdg_erro: 401 },
        data: {},
      };
      return new Response(JSON.stringify(body), {
        status: 401,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    }
    body = { info: { msg: "Deletando kk", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
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
