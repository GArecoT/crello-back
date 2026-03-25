import consts from "../../../composables/consts.json" with { type: "json" };
import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../../composables/tipos.ts";
import removeCache from "../../cache/removeCache.ts";

export default function (id_card: number): RespostaInterna {
  if (!id_card || id_card < 1) {
    return {
      status: false,
      msg: "Card inválido",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  const categorias = db.prepare(
    `
    SELECT nome_categoria FROM categorias_cards
    WHERE id_card = ${id_card};
    `,
  ).all();

  const categoriasArray: any[] = [];

  categorias.forEach((val) => {
    categoriasArray.push(val.nome_categoria);
  });

  db.close();
  removeCache("listarColunas");
  return {
    status: true,
    msg: "Categorias do cartão encontrados com sucesso",
    data: categoriasArray,
  };
}
