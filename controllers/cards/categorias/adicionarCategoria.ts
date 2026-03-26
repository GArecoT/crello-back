import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../../composables/tipos.ts";
import consts from "../../../composables/consts.json" with { type: "json" };
import removeCache from "../../cache/removeCache.ts";

export default function (
  id_card: number,
  nome_categoria: string,
): RespostaInterna {
  try {
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

    const cards = db.prepare(
      `
    SELECT id from cards WHERE id = ${id_card};
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
    SELECT nome from categorias WHERE nome = '${nome_categoria}';
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
      SELECT nome_categoria from categorias_cards WHERE id_card = ${id_card} AND nome_categoria = '${nome_categoria}';
      `,
    ).all();

    if (categorias_cards.length > 0) {
      return {
        status: false,
        msg: "Categoria já adicionada a esse card",
        data: {},
      };
    } else {
      db.prepare(
        `
        INSERT INTO categorias_cards (nome_categoria, id_card) 
        Values (:nome_categoria,:id_card);       `,
      ).run({ nome_categoria: nome_categoria, id_card: id_card });

      removeCache("listarColunas");
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
