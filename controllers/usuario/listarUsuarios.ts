import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";

export default function (): RespostaInterna {
  const db = new Database(`${consts.db}.db`);
  const usuarios = db.prepare(
    `
      SELECT id, nome, admin FROM usuarios
      `,
  ).all();

  return {
    status: true,
    msg: "Usuários listados com sucesso!",
    data: usuarios,
  };
}
