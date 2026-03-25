import { Database } from "@db/sqlite";
import { RespostaInterna } from "../../../composables/tipos.ts";
import consts from "../../../composables/consts.json" with { type: "json" };
import removeCache from "../../cache/removeCache.ts";

export default function (
  id_card: number,
  id_usuario: number,
): RespostaInterna {
  try {
    if (!id_card || id_card < 1) {
      return {
        status: false,
        msg: "Cartão não encontrado",
        data: {},
      };
    }

    if (!id_usuario || id_usuario < 1) {
      return {
        status: false,
        msg: "Usuario não encontrada",
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

    const usuarios = db.prepare(
      `
    SELECT id, nome, admin from usuarios WHERE id = '${id_usuario}';
    `,
    ).all();
    if (usuarios.length < 1) {
      db.close();
      return {
        status: false,
        msg: "Id do usuario inválido",
        data: {},
      };
    }

    const usuarios_cards = db.prepare(
      `
      SELECT id_usuario from usuarios_cards WHERE id_card = ${id_card} AND id_usuario = '${id_usuario}';
      `,
    ).all();

    if (usuarios_cards.length > 0) {
      return {
        status: false,
        msg: "Usuario já adicionado a esse card",
        data: {},
      };
    } else {
      db.exec(
        `
        INSERT INTO usuarios_cards (id_usuario, id_card) 
        Values (${id_usuario},${id_card});       `,
      );
      removeCache("listarColunas");
      return {
        status: true,
        msg: "Usuário adicionado com sucesso",
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
