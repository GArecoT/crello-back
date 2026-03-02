import criarToken from "../../composables/criarToken.ts";
import { Login, Resposta } from "../../composables/tipos.ts";
import fnLogin from "../../controllers/login.ts";
import salvaToken from "../../controllers/salvaToken.ts";

export default async function (
  login: Login,
  method: string,
): Promise<Response> {
  let body: Resposta;

  if (method != "POST") {
    body = { info: { msg: "BAD REQUEST", cdg_erro: 400 }, data: {} };
    return new Response(JSON.stringify(body), {
      status: 400,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  if (!(login?.login?.length > 0) || !(login?.senha?.length > 0)) {
    body = { info: { msg: "Falta dados para login", cdg_erro: 666 }, data: {} };
    return new Response(
      JSON.stringify(body),
      {
        status: 400,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      },
    );
  }

  const retLogin = await fnLogin(login);
  if (retLogin.status) {
    const token = await criarToken(login);
    salvaToken(token);
    body = {
      info: { msg: retLogin.msg, cdg_erro: 0 },
      data: { chave: token },
    };
  } else {
    body = {
      info: { msg: retLogin.msg, cdg_erro: 666 },
      data: {},
    };
  }

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}
