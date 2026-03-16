import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";

export default function (): RespostaInterna {
  const db = new Database(`${consts.db}.db`);
  const categorias = db.prepare(
    `
    SELECT * FROM categorias;
    `,
  ).all();

  db.close();
  return {
    status: true,
    msg: "Categorias encontrados com sucesso",
    data: categorias,
  };
}
