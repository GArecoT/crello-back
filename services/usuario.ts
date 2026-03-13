import { Resposta, Usuario } from "../composables/tipos.ts";
import { verificaToken } from "../composables/verificaToken.ts";
import deletarUsuario from "../controllers/usuario/deletarUsuario.ts";
import pegarUsuario from "../controllers/usuario/pegarUsuario.ts";
import { salvarUsuario } from "../controllers/usuario/salvarUsuario.ts";

export default async function (
  method: string,
  headers: Headers,
  usuario: Usuario,
  query?: number | string,
): Promise<Response> {
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
  const resUsuarioLogado = pegarUsuario({ id: res.data.id_usuario });
  let usuarioLogado: Usuario;
  if (resUsuarioLogado.status) {
    usuarioLogado = {
      ...resUsuarioLogado.data,
      admin: typeof resUsuarioLogado.data.admin == "boolean"
        ? resUsuarioLogado.data.admin
        : resUsuarioLogado.data.admin && resUsuarioLogado.data.admin > 0
        ? true
        : false,
    };
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
    //verificar se é admin ou se está tentando editar a si mesmo
    if (!(query && query == usuarioLogado.id) && !usuarioLogado.admin) {
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

    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }
    const resSalvarUsuario = await salvarUsuario(usuario, query);

    if (resSalvarUsuario.status) {
      body = {
        info: { msg: resSalvarUsuario.msg, cdg_erro: 0 },
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
        info: { msg: resSalvarUsuario.msg, cdg_erro: 406 },
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

    console.log(!(query && query == usuarioLogado.id), !usuarioLogado.admin);
    if (!(query && query == usuarioLogado.id) && !usuarioLogado.admin) {
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

    if (typeof query == "string") {
      query = parseInt(query);
    } else if (typeof query != "number") {
      query = 0;
    }

    const resDeletar = deletarUsuario(query);

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
