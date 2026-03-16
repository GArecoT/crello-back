import { Database } from "@db/sqlite";
import consts from "../../composables/consts.json" with { type: "json" };
import { Coluna, RespostaInterna } from "../../composables/tipos.ts";

export default function (coluna: Coluna, campo = "id"): RespostaInterna {
  const db = new Database(`${consts.db}.db`);

  if (campo == "id" || campo == "nome" || campo == "ordem") {
    const colunas = db.prepare(
      `
      SELECT * FROM colunas WHERE ${campo} = '${coluna[campo]}';
      `,
    ).all();

    if (colunas.length > 0) {
      colunas[0].cards = db.prepare(
        `
        SELECT * FROM cards
        WHERE id_coluna = ${colunas[0].id};
        `,
      ).all();
      db.close();
      return {
        status: true,
        msg: "Coluna encontrada!",
        data: colunas[0],
      };
    } else {
      db.close();
      return { status: false, msg: "Coluna não encontrada!", data: {} };
    }
  } else {
    db.close();
    return { status: false, msg: "Coluna não encontrada!", data: {} };
  }
}
