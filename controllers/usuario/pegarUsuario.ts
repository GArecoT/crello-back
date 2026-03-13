import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };
import { RespostaInterna, Usuario } from "../../composables/tipos.ts";

export default function (usuario: Usuario, campo = "id"): RespostaInterna {
  const db = new Database(`${consts.db}.db`);

  if (campo == "id" || campo == "nome" || campo == "admin") {
    const usuarios = db.prepare(
      `
	SELECT * FROM usuarios WHERE ${campo} = '${usuario[campo]}';
  `,
    ).all();

    db.close();

    if (usuarios.length > 0) {
      return {
        status: true,
        msg: "Usuário encontrado!",
        data: usuarios[0],
      };
    } else {
      return { status: false, msg: "Usuário não encontrado!", data: {} };
    }
  } else {
    return { status: false, msg: "Usuário não encontrado!", data: {} };
  }
}
