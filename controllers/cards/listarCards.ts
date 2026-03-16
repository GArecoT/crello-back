import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";

export default function (id_coluna: number): RespostaInterna {
  if (!id_coluna || id_coluna < 1) {
    return {
      status: true,
      msg: "Coluna inválida",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  const cards = db.prepare(
    `
    SELECT id, nome FROM cards
    WHERE id_coluna = ${id_coluna};
    `,
  ).all();

  db.close();
  return {
    status: true,
    msg: "Cartões encontrados com sucesso",
    data: cards,
  };
}
