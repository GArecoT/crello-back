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

    db.close();

    if (colunas.length > 0) {
      return {
        status: true,
        msg: "Coluna encontrada!",
        data: colunas[0],
      };
    } else {
      return { status: false, msg: "Coluna não encontrada!", data: {} };
    }
  } else {
    return { status: false, msg: "Coluna não encontrada!", data: {} };
  }
}
