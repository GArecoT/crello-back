import consts from "../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../composables/tipos.ts";

export default function (): RespostaInterna {
  const db = new Database(`${consts.db}.db`);
  const colunas = db.prepare(
    `
      SELECT * FROM colunas
      ORDER BY ordem;
      `,
  ).all();

  colunas.forEach((val, index) => {
    colunas[index].cards = db.prepare(
      `
      SELECT * FROM cards
      WHERE id_coluna = ${val.id};
      `,
    ).all();
  });
  db.close();
  return {
    status: true,
    msg: "Colunas listadas com sucesso!",
    data: colunas,
  };
}
