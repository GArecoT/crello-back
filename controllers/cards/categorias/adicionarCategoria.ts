import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../../composables/tipos.ts";
import consts from "../../../composables/consts.json" with { type: "json" };

export default function (
  card_id: number,
  categoria_nome: string,
): RespostaInterna {
  try {
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

    const cards = db.prepare(
      `
    SELECT id from cards WHERE id = ${card_id};
    `,
    ).all();
    if (cards.length < 1) {
      db.close();
      return {
        status: false,
        msg: "Id card inválido",
        data: {},
      };
    }

    const categorias = db.prepare(
      `
    SELECT nome from categorias WHERE nome = '${categoria_nome}';
    `,
    ).all();
    if (categorias.length < 1) {
      db.close();
      return {
        status: false,
        msg: "Nome da categoria inválido",
        data: {},
      };
    }

    const categorias_cards = db.prepare(
      `
      SELECT nome_categoria from categorias_cards WHERE id_card = ${card_id} AND nome_categoria = '${categoria_nome}';
      `,
    ).all();

    if (categorias_cards.length > 0) {
      return {
        status: false,
        msg: "Categoria já adicionada a esse card",
        data: {},
      };
    } else {
      db.exec(
        `
        INSERT INTO categorias_cards (nome_categoria, id_card) 
        Values ('${categoria_nome}',${card_id});       `,
      );
      return {
        status: true,
        msg: "Categoria adicionada com sucesso",
        data: {},
      };
    }
  } catch (e) {
    return {
      status: false,
      msg: JSON.stringify(e, Object.getOwnPropertyNames(e)),
      data: {},
    };
  }
}
