import { Database } from "@db/sqlite";
import consts from "../../../composables/consts.json" with { type: "json" };
import removeCache from "../../cache/removeCache.ts";

export default function (id_card: number, nome_categoria: string) {
  if (!id_card || id_card < 1) {
    return {
      status: false,
      msg: "Cartão não encontrado",
      data: {},
    };
  }

  if (!nome_categoria || nome_categoria.length < 1) {
    return {
      status: false,
      msg: "Categoria não encontrada",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  try {
    db.prepare(
      `
        DELETE FROM categorias_cards
        WHERE id_card = :id_card AND nome_categoria = :nome_categoria;
      `,
    ).run({ id_card: id_card, nome_categoria: nome_categoria });
    db.close();
    removeCache("listarColunas");
    return {
      status: true,
      msg: "Categoria removida com sucesso!",
      data: {},
    };
  } catch (e) {
    db.close();
    return {
      status: false,
      msg: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      data: {},
    };
  }
}
