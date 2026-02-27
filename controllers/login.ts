import { Database } from "@db/sqlite";
import consts from "../composables/consts.json" with { type: "json" };
import hash from "../composables/hash.ts";
import { Login, RespostaInterna } from "../composables/tipos.ts";

export default async function (login: Login): Promise<RespostaInterna> {
  const db = new Database(`${consts.db}.db`);

  const usuarios = db.prepare(
    `
	SELECT * FROM usuarios WHERE nome = '${login.login}';
  `,
  ).all();

  db.close();

  if (usuarios.length > 0) {
    const senhaHash = await hash(login.senha);
    if (usuarios[0]?.senha === senhaHash) {
      return { status: true, msg: "Login feito com sucesso!", data: {} };
    } else {
      return { status: false, msg: "Senha Errada!", data: {} };
    }
  } else {
    return { status: false, msg: "Usuário não encontrado!", data: {} };
  }
}
