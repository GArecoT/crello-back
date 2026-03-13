import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";

export default function (): RespostaInterna {
  const db = new Database(`${consts.db}.db`);
  const colunas = db.prepare(
    `
      SELECT * FROM colunas
      `,
  ).all();

  db.close();
  return {
    status: true,
    msg: "Colunas listadas com sucesso!",
    data: colunas,
  };
}
