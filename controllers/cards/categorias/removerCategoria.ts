import { Database } from "@db/sqlite";
import consts from "../../../composables/consts.json" with { type: "json" };

export default function (card_id: number, categoria_nome: string) {
  if (!card_id || card_id < 1) {
    return {
      status: false,
      msg: "Cartão não encontrado",
      data: {},
    };
  }

  if (!categoria_nome || categoria_nome.length < 1) {
    return {
      status: false,
      msg: "Categoria não encontrada",
      data: {},
    };
  }
  const db = new Database(`${consts.db}.db`);
  try {
    db.exec(
      `
        DELETE FROM categorias_cards
        WHERE id_card = ${card_id} AND nome_categoria = '${categoria_nome}';
      `,
    );
    db.close();
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
